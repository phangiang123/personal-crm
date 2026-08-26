"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function listGroups() {
  return db.group.findMany({ orderBy: { name: "asc" } });
}

export async function listTags() {
  return db.tag.findMany({ orderBy: { name: "asc" } });
}

export async function listHelpTopics() {
  return db.helpTopic.findMany({ orderBy: { name: "asc" } });
}

function requireName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Tên không được để trống.");
  return trimmed;
}

export async function createGroup(name: string) {
  const created = await db.group.create({ data: { name: requireName(name) } });
  revalidatePath("/tags");
  return created;
}

export async function renameGroup(id: string, name: string) {
  await db.group.update({ where: { id }, data: { name: requireName(name) } });
  revalidatePath("/tags");
}

export async function deleteGroup(id: string) {
  await db.group.delete({ where: { id } });
  revalidatePath("/tags");
}

export async function createTag(name: string) {
  const created = await db.tag.create({ data: { name: requireName(name) } });
  revalidatePath("/tags");
  return created;
}

export async function renameTag(id: string, name: string) {
  await db.tag.update({ where: { id }, data: { name: requireName(name) } });
  revalidatePath("/tags");
}

export async function deleteTag(id: string) {
  await db.tag.delete({ where: { id } });
  revalidatePath("/tags");
}

export async function createHelpTopic(name: string) {
  const created = await db.helpTopic.create({
    data: { name: requireName(name) },
  });
  revalidatePath("/tags");
  return created;
}

export async function renameHelpTopic(id: string, name: string) {
  await db.helpTopic.update({
    where: { id },
    data: { name: requireName(name) },
  });
  revalidatePath("/tags");
}

export async function deleteHelpTopic(id: string) {
  await db.helpTopic.delete({ where: { id } });
  revalidatePath("/tags");
}
