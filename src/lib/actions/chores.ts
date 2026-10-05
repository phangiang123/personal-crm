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
