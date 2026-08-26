"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { InteractionType } from "@prisma/client";
import { computeNextContactDate } from "@/lib/contact-frequency";

export type InteractionInput = {
  contactId: string;
  date: string; // yyyy-mm-dd
  type: InteractionType;
  content?: string;
  outcome?: string;
  nextAction?: string;
  followUpDate?: string; // yyyy-mm-dd
};

function toOptional(value: string | undefined) {
  return value && value.trim() !== "" ? value.trim() : null;
}

export async function addInteraction(input: InteractionInput) {
  const date = new Date(input.date);

  await db.interaction.create({
    data: {
      contactId: input.contactId,
      date,
      type: input.type,
      content: toOptional(input.content),
      outcome: toOptional(input.outcome),
      nextAction: toOptional(input.nextAction),
      followUpDate: input.followUpDate ? new Date(input.followUpDate) : null,
    },
  });

  const contact = await db.contact.findUniqueOrThrow({
    where: { id: input.contactId },
  });

  if (!contact.lastContactDate || date >= contact.lastContactDate) {
    const nextContactDate = computeNextContactDate(
      date,
      contact.priority,
      contact.contactFrequencyDays,
    );
    await db.contact.update({
      where: { id: input.contactId },
      data: {
        lastContactDate: date,
        lastContactType: input.type,
        lastContactNote: toOptional(input.content),
        nextContactDate,
      },
    });
  }

  revalidatePath(`/contacts/${input.contactId}`);
  revalidatePath("/follow-ups");
  revalidatePath("/");
}

export async function listPendingFollowUps() {
  return db.interaction.findMany({
    where: { followUpDone: false, followUpDate: { not: null } },
    include: { contact: true },
    orderBy: { followUpDate: "asc" },
  });
}

export async function toggleFollowUpDone(interactionId: string, done: boolean) {
  const interaction = await db.interaction.update({
    where: { id: interactionId },
    data: { followUpDone: done },
  });
  revalidatePath(`/contacts/${interaction.contactId}`);
  revalidatePath("/follow-ups");
}
