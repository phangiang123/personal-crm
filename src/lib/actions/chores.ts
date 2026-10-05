"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { ChoreFrequency } from "@prisma/client";
import { todayInVietnam } from "@/lib/vn-date";

export type ChoreInput = {
  title: string;
  frequency: ChoreFrequency;
  weeklyDay: number | null; // 0=CN..6=T7
  monthlyDay: number | null; // 1-31
  reminderHour: number | null; // 0-23, giờ Việt Nam
};

export async function listChores() {
  return db.chore.findMany({ orderBy: [{ active: "desc" }, { title: "asc" }] });
}

export async function createChore(input: ChoreInput) {
  if (!input.title.trim()) throw new Error("Tên việc nhà không được để trống.");
  await db.chore.create({
    data: {
      title: input.title.trim(),
      frequency: input.frequency,
      weeklyDay: input.frequency === "WEEKLY" ? input.weeklyDay : null,
      monthlyDay: input.frequency === "MONTHLY" ? input.monthlyDay : null,
      reminderHour: input.reminderHour,
    },
  });
  revalidatePath("/chores");
}

export async function updateChore(id: string, input: ChoreInput) {
  if (!input.title.trim()) throw new Error("Tên việc nhà không được để trống.");
  await db.chore.update({
    where: { id },
    data: {
      title: input.title.trim(),
      frequency: input.frequency,
      weeklyDay: input.frequency === "WEEKLY" ? input.weeklyDay : null,
      monthlyDay: input.frequency === "MONTHLY" ? input.monthlyDay : null,
      reminderHour: input.reminderHour,
    },
  });
  revalidatePath("/chores");
}

export async function setChoreActive(id: string, active: boolean) {
  await db.chore.update({ where: { id }, data: { active } });
  revalidatePath("/chores");
}

export async function deleteChore(id: string) {
  await db.chore.delete({ where: { id } });
  revalidatePath("/chores");
}

function isDueOn(
  chore: { frequency: ChoreFrequency; weeklyDay: number | null; monthlyDay: number | null },
  dateKey: string,
) {
  const d = new Date(dateKey);
  if (chore.frequency === "DAILY") return true;
  if (chore.frequency === "WEEKLY") return d.getUTCDay() === chore.weeklyDay;
  if (chore.frequency === "MONTHLY") return d.getUTCDate() === chore.monthlyDay;
  return false;
}

export async function getChoresForDate(dateKey: string) {
  const [chores, completions] = await Promise.all([
    db.chore.findMany({ where: { active: true } }),
    db.choreCompletion.findMany({ where: { date: new Date(dateKey) } }),
  ]);

  const doneIds = new Set(completions.map((c) => c.choreId));

  return chores
    .filter((c) => isDueOn(c, dateKey))
    .map((c) => ({ ...c, done: doneIds.has(c.id) }))
    .sort((a, b) => Number(a.done) - Number(b.done) || a.title.localeCompare(b.title));
}

export async function toggleChoreDone(choreId: string, dateKey: string, done: boolean) {
  if (done) {
    await db.choreCompletion.upsert({
      where: { choreId_date: { choreId, date: new Date(dateKey) } },
      update: {},
      create: { choreId, date: new Date(dateKey) },
    });
  } else {
    await db.choreCompletion
      .delete({ where: { choreId_date: { choreId, date: new Date(dateKey) } } })
      .catch(() => {});
  }
  revalidatePath("/chores");
  revalidatePath("/");
}

export async function getTodayChores() {
  return getChoresForDate(todayInVietnam());
}

export type MonthChoreItem = {
  id: string;
  title: string;
  done: boolean;
};

export type MonthChoreDay = {
  dateKey: string;
  dayOfMonth: number;
  dueCount: number;
  doneCount: number;
  items: MonthChoreItem[];
};

export async function getChoresForMonth(monthKey: string) {
  // monthKey: yyyy-MM
  const [year, month] = monthKey.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const monthEnd = new Date(Date.UTC(year, month - 1, daysInMonth));

  const [chores, completions] = await Promise.all([
    db.chore.findMany({ where: { active: true } }),
    db.choreCompletion.findMany({
      where: { date: { gte: monthStart, lte: monthEnd } },
    }),
  ]);

  const doneByDay = new Map<string, Set<string>>();
  for (const c of completions) {
    const key = c.date.toISOString().slice(0, 10);
    const set = doneByDay.get(key) ?? new Set<string>();
    set.add(c.choreId);
    doneByDay.set(key, set);
  }

  const days: MonthChoreDay[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${monthKey}-${String(day).padStart(2, "0")}`;
    const due = chores.filter((c) => isDueOn(c, dateKey));
    const doneSet = doneByDay.get(dateKey) ?? new Set<string>();
    const items: MonthChoreItem[] = due
      .map((c) => ({ id: c.id, title: c.title, done: doneSet.has(c.id) }))
      .sort((a, b) => Number(a.done) - Number(b.done) || a.title.localeCompare(b.title));
    const doneCount = items.filter((i) => i.done).length;
    days.push({ dateKey, dayOfMonth: day, dueCount: due.length, doneCount, items });
  }

  return days;
}
