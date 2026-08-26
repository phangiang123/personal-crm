"use server";

import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { addDays, endOfDay, startOfDay, subMonths } from "date-fns";

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
