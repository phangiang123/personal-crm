"use server";

import { db } from "@/lib/db";
import { format } from "date-fns";

export type UnifiedEntry = {
  id: string;
  rawId: string;
  kind: "next-contact" | "follow-up" | "task";
  title: string;
  priority: "A" | "B" | "C" | "D" | "E";
  done: boolean;
  note?: string | null;
  contactId?: string | null;
  taskId?: string | null;
};

export async function getCalendarEntries(
  rangeStart: Date,
  rangeEnd: Date,
): Promise<Map<string, UnifiedEntry[]>> {
  const [contacts, followUps, resolvedDates, tasks] = await Promise.all([
    db.contact.findMany({
      where: { nextContactDate: { gte: rangeStart, lte: rangeEnd } },
      select: { id: true, fullName: true, priority: true, nextContactDate: true },
    }),
    db.interaction.findMany({
      where: { followUpDate: { gte: rangeStart, lte: rangeEnd } },
      select: {
        id: true,
        followUpDate: true,
        nextAction: true,
        followUpDone: true,
        contact: { select: { id: true, fullName: true, priority: true } },
      },
    }),
    db.resolvedContactDate.findMany({
      where: { date: { gte: rangeStart, lte: rangeEnd } },
      select: {
        id: true,
        date: true,
        contact: { select: { id: true, fullName: true, priority: true } },
      },
    }),
    db.task.findMany({
      where: { dueDate: { gte: rangeStart, lte: rangeEnd } },
      select: {
        id: true,
        title: true,
        notes: true,
        dueDate: true,
        priority: true,
        done: true,
        contactId: true,
      },
    }),
  ]);

  const byDay = new Map<string, UnifiedEntry[]>();
  function push(date: Date, entry: UnifiedEntry) {
    const key = format(date, "yyyy-MM-dd");
    const list = byDay.get(key) ?? [];
    list.push(entry);
    byDay.set(key, list);
  }

  for (const c of contacts) {
    if (!c.nextContactDate) continue;
    push(c.nextContactDate, {
      id: `nc-${c.id}`,
      rawId: c.id,
      kind: "next-contact",
      title: c.fullName,
      priority: c.priority,
      done: false,
      contactId: c.id,
    });
  }
  for (const f of followUps) {
    if (!f.followUpDate) continue;
    push(f.followUpDate, {
      id: `fu-${f.id}`,
      rawId: f.id,
      kind: "follow-up",
      title: f.contact.fullName,
      priority: f.contact.priority,
      done: f.followUpDone,
      note: f.nextAction,
      contactId: f.contact.id,
    });
  }
  for (const r of resolvedDates) {
    push(r.date, {
      id: `rc-${r.id}`,
      rawId: r.contact.id,
      kind: "next-contact",
      title: r.contact.fullName,
      priority: r.contact.priority,
      done: true,
      contactId: r.contact.id,
    });
  }
  for (const t of tasks) {
    if (!t.dueDate) continue;
    push(t.dueDate, {
      id: `tk-${t.id}`,
      rawId: t.id,
      kind: "task",
      title: t.title,
      priority: t.priority,
      done: t.done,
      note: t.notes,
      contactId: t.contactId,
      taskId: t.id,
    });
  }

  for (const list of byDay.values()) {
    list.sort((a, b) => Number(a.done) - Number(b.done));
  }

  return byDay;
}
