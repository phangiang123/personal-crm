"use server";

import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";

export async function getDashboardData() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const in7 = endOfDay(addDays(now, 7));
  const in30 = endOfDay(addDays(now, 30));
  const threeMonthsAgo = subMonths(now, 3);
  const sixMonthsAgo = subMonths(now, 6);

  const contactCard = {
    include: { groups: { include: { group: true } } },
    orderBy: [
      { priority: "asc" },
      { nextContactDate: "asc" },
    ] satisfies Prisma.ContactOrderByWithRelationInput[],
  };

  const [
    overdue,
    dueToday,
    due7,
    due30,
    totalContacts,
    groups,
    notContacted3Months,
    notContacted6Months,
    pendingFollowUps,
  ] = await Promise.all([
    db.contact.findMany({ where: { nextContactDate: { lt: todayStart } }, ...contactCard }),
    db.contact.findMany({
      where: { nextContactDate: { gte: todayStart, lte: todayEnd } },
      ...contactCard,
    }),
    db.contact.findMany({
      where: { nextContactDate: { gt: todayEnd, lte: in7 } },
      ...contactCard,
    }),
    db.contact.findMany({
      where: { nextContactDate: { gt: in7, lte: in30 } },
      ...contactCard,
    }),
    db.contact.count(),
    db.group.findMany({
      include: { _count: { select: { contacts: true } } },
      orderBy: { name: "asc" },
    }),
    db.contact.count({
      where: {
        OR: [
          { lastContactDate: null },
          { lastContactDate: { lt: threeMonthsAgo } },
        ],
      },
    }),
    db.contact.count({
      where: {
        OR: [
          { lastContactDate: null },
          { lastContactDate: { lt: sixMonthsAgo } },
        ],
      },
    }),
    db.interaction.findMany({
      where: { followUpDone: false, followUpDate: { lte: todayEnd } },
      include: { contact: true },
      orderBy: { followUpDate: "asc" },
    }),
  ]);

  const priorityAOverdue = overdue.filter((c) => c.priority === "A");
  const priorityBOverdue = overdue.filter((c) => c.priority === "B");

  return {
    overdue,
    dueToday,
    due7,
    due30,
    stats: {
      totalContacts,
      byGroup: groups.map((g) => ({ name: g.name, count: g._count.contacts })),
      notContacted3Months,
      notContacted6Months,
      overdueCount: overdue.length,
    },
    priorityList: {
      priorityAOverdue,
      priorityBOverdue,
      pendingFollowUps,
    },
  };
}

export type CalendarDay = {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  contacts: { id: string; fullName: string; priority: string }[];
};

export async function getMonthCalendarData(monthParam?: string) {
  const base = monthParam ? new Date(`${monthParam}-01T00:00:00`) : new Date();
  const monthStart = startOfMonth(base);
  const monthEnd = endOfMonth(base);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const contacts = await db.contact.findMany({
    where: { nextContactDate: { gte: gridStart, lte: gridEnd } },
    select: { id: true, fullName: true, priority: true, nextContactDate: true },
    orderBy: { priority: "asc" },
  });

  const byDay = new Map<string, { id: string; fullName: string; priority: string }[]>();
  for (const c of contacts) {
    if (!c.nextContactDate) continue;
    const key = format(c.nextContactDate, "yyyy-MM-dd");
    const list = byDay.get(key) ?? [];
    list.push({ id: c.id, fullName: c.fullName, priority: c.priority });
    byDay.set(key, list);
  }

  const allDays = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const days: CalendarDay[] = allDays.map((date) => ({
    date,
    inCurrentMonth: isSameMonth(date, monthStart),
    isToday: isToday(date),
    contacts: byDay.get(format(date, "yyyy-MM-dd")) ?? [],
  }));

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return {
    monthLabel: format(monthStart, "MM/yyyy"),
    monthKey: format(monthStart, "yyyy-MM"),
    prevMonthKey: format(subMonths(monthStart, 1), "yyyy-MM"),
    nextMonthKey: format(addMonths(monthStart, 1), "yyyy-MM"),
    weeks,
  };
}
