"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { computeNextContactDate } from "@/lib/contact-frequency";
import type { Closeness, Priority, InteractionType, Prisma } from "@prisma/client";
import { addDays, endOfDay, startOfDay } from "date-fns";

export type ContactInput = {
  fullName: string;
  phone?: string;
  email?: string;
  address?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  birthday?: string; // yyyy-mm-dd
  avatarUrl?: string;
  closeness: Closeness;
  priority: Priority;
  contactFrequencyDays?: number | null;
  theyCanHelpNote?: string;
  iCanHelpNote?: string;
  notes?: string;
  groupIds: string[];
  tagIds: string[];
  theyCanHelpTopicIds: string[];
  iCanHelpTopicIds: string[];
};

function toOptional(value: string | undefined) {
  return value && value.trim() !== "" ? value.trim() : null;
}

export async function createContact(input: ContactInput) {
  if (!input.fullName.trim()) throw new Error("Họ tên không được để trống.");

  const contact = await db.contact.create({
    data: {
      fullName: input.fullName.trim(),
      phone: toOptional(input.phone),
      email: toOptional(input.email),
      address: toOptional(input.address),
      company: toOptional(input.company),
      jobTitle: toOptional(input.jobTitle),
      industry: toOptional(input.industry),
      birthday: input.birthday ? new Date(input.birthday) : null,
      avatarUrl: toOptional(input.avatarUrl),
      closeness: input.closeness,
      priority: input.priority,
      contactFrequencyDays: input.contactFrequencyDays ?? null,
      theyCanHelpNote: toOptional(input.theyCanHelpNote),
      iCanHelpNote: toOptional(input.iCanHelpNote),
      notes: toOptional(input.notes),
      groups: { create: input.groupIds.map((groupId) => ({ groupId })) },
      tags: { create: input.tagIds.map((tagId) => ({ tagId })) },
      theyCanHelp: { connect: input.theyCanHelpTopicIds.map((id) => ({ id })) },
      iCanHelp: { connect: input.iCanHelpTopicIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/contacts");
  revalidatePath("/");
  return contact;
}

export async function updateContact(id: string, input: ContactInput) {
  if (!input.fullName.trim()) throw new Error("Họ tên không được để trống.");

  const existing = await db.contact.findUniqueOrThrow({ where: { id } });
  const nextContactDate = computeNextContactDate(
    existing.lastContactDate,
    input.priority,
    input.contactFrequencyDays ?? null,
  );

  await db.contact.update({
    where: { id },
    data: {
      fullName: input.fullName.trim(),
      phone: toOptional(input.phone),
      email: toOptional(input.email),
      address: toOptional(input.address),
      company: toOptional(input.company),
      jobTitle: toOptional(input.jobTitle),
      industry: toOptional(input.industry),
      birthday: input.birthday ? new Date(input.birthday) : null,
      avatarUrl: toOptional(input.avatarUrl),
      closeness: input.closeness,
      priority: input.priority,
      contactFrequencyDays: input.contactFrequencyDays ?? null,
      nextContactDate,
      theyCanHelpNote: toOptional(input.theyCanHelpNote),
      iCanHelpNote: toOptional(input.iCanHelpNote),
      notes: toOptional(input.notes),
      groups: {
        deleteMany: {},
        create: input.groupIds.map((groupId) => ({ groupId })),
      },
      tags: {
        deleteMany: {},
        create: input.tagIds.map((tagId) => ({ tagId })),
      },
      theyCanHelp: { set: input.theyCanHelpTopicIds.map((id) => ({ id })) },
      iCanHelp: { set: input.iCanHelpTopicIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/contacts");
  revalidatePath(`/contacts/${id}`);
  revalidatePath("/");
}

export async function deleteContact(id: string) {
  await db.contact.delete({ where: { id } });
  revalidatePath("/contacts");
  revalidatePath("/");
  redirect("/contacts");
}

export async function getContact(id: string) {
  return db.contact.findUnique({
    where: { id },
    include: {
      groups: { include: { group: true } },
      tags: { include: { tag: true } },
      theyCanHelp: true,
      iCanHelp: true,
      interactions: { orderBy: { date: "desc" } },
    },
  });
}

export type ContactStatus =
  | "OVERDUE"
  | "DUE_TODAY"
  | "DUE_7"
  | "DUE_30"
  | "NOT_SET";

export type ContactFilter = {
  search?: string;
  groupId?: string;
  tagId?: string;
  priority?: Priority;
  closeness?: Closeness;
  helpTopicId?: string;
  status?: ContactStatus;
};

export async function listContacts(filter: ContactFilter = {}) {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const in7 = endOfDay(addDays(now, 7));
  const in30 = endOfDay(addDays(now, 30));

  const where: Prisma.ContactWhereInput = {};

  if (filter.search) {
    const q = filter.search;
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { company: { contains: q, mode: "insensitive" } },
      { industry: { contains: q, mode: "insensitive" } },
    ];
  }
  if (filter.priority) where.priority = filter.priority;
  if (filter.closeness) where.closeness = filter.closeness;
  if (filter.groupId) where.groups = { some: { groupId: filter.groupId } };
  if (filter.tagId) where.tags = { some: { tagId: filter.tagId } };
  if (filter.helpTopicId) {
    where.OR = [
      ...(where.OR ?? []),
      { theyCanHelp: { some: { id: filter.helpTopicId } } },
      { iCanHelp: { some: { id: filter.helpTopicId } } },
    ];
  }
  if (filter.status === "OVERDUE") {
    where.nextContactDate = { lt: todayStart };
  } else if (filter.status === "DUE_TODAY") {
    where.nextContactDate = { gte: todayStart, lte: todayEnd };
  } else if (filter.status === "DUE_7") {
    where.nextContactDate = { gte: todayStart, lte: in7 };
  } else if (filter.status === "DUE_30") {
    where.nextContactDate = { gte: todayStart, lte: in30 };
  } else if (filter.status === "NOT_SET") {
    where.nextContactDate = null;
  }

  return db.contact.findMany({
    where,
    include: {
      groups: { include: { group: true } },
      tags: { include: { tag: true } },
    },
    orderBy: [{ priority: "asc" }, { nextContactDate: "asc" }],
  });
}

export async function recordInteractionAndSync(contactId: string, date: Date, type: InteractionType, note: string | null) {
  const contact = await db.contact.findUniqueOrThrow({ where: { id: contactId } });
  const nextContactDate = computeNextContactDate(
    date,
    contact.priority,
    contact.contactFrequencyDays,
  );
  await db.contact.update({
    where: { id: contactId },
    data: {
      lastContactDate: date,
      lastContactType: type,
      lastContactNote: note,
      nextContactDate,
    },
  });
}
