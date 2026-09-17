"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { Priority } from "@prisma/client";

export type TaskInput = {
  title: string;
  notes?: string;
  dueDate?: string; // yyyy-mm-dd
  priority: Priority;
  contactId?: string | null;
};

function toOptional(value: string | undefined) {
  return value && value.trim() !== "" ? value.trim() : null;
}

export async function listTasks() {
  return db.task.findMany({
    include: { contact: { select: { id: true, fullName: true } } },
    orderBy: [{ done: "asc" }, { dueDate: "asc" }, { priority: "asc" }],
  });
}

export async function createTask(input: TaskInput) {
  if (!input.title.trim()) throw new Error("Tên công việc không được để trống.");

  await db.task.create({
    data: {
      title: input.title.trim(),
      notes: toOptional(input.notes),
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      priority: input.priority,
      contactId: input.contactId || null,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function updateTask(id: string, input: TaskInput) {
  if (!input.title.trim()) throw new Error("Tên công việc không được để trống.");

  await db.task.update({
    where: { id },
    data: {
      title: input.title.trim(),
      notes: toOptional(input.notes),
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      priority: input.priority,
      contactId: input.contactId || null,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function toggleTaskDone(id: string, done: boolean) {
  await db.task.update({ where: { id }, data: { done } });
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function deleteTask(id: string) {
  await db.task.delete({ where: { id } });
  revalidatePath("/tasks");
  revalidatePath("/");
}
