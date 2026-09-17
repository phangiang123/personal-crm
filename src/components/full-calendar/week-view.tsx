"use client";

import Link from "next/link";
import { useTransition } from "react";
import type { UnifiedEntry } from "@/lib/actions/calendar";
import { toggleTaskDone } from "@/lib/actions/tasks";
import { toggleFollowUpDone } from "@/lib/actions/interactions";
import { PriorityBadge } from "@/components/badges";
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isToday,
  startOfWeek,
} from "date-fns";

function WeekEntryItem({ entry }: { entry: UnifiedEntry }) {
  const [pending, startTransition] = useTransition();
  const canToggle = entry.kind === "task" || entry.kind === "follow-up";

  function handleToggle(checked: boolean) {
    startTransition(() => {
      if (entry.kind === "task") return toggleTaskDone(entry.rawId, checked);
      if (entry.kind === "follow-up")
        return toggleFollowUpDone(entry.rawId, checked);
      return Promise.resolve();
    });
  }

  const content = (
    <span
      className={`truncate ${entry.done ? "text-neutral-400 line-through" : "text-neutral-800"}`}
    >
      {entry.title}
    </span>
  );

  return (
    <div className="flex items-center gap-1.5 rounded-md px-1.5 py-1 hover:bg-neutral-50">
      {canToggle ? (
        <input
          type="checkbox"
          checked={entry.done}
          disabled={pending}
          onChange={(e) => handleToggle(e.target.checked)}
          className="h-3.5 w-3.5 shrink-0 rounded border-neutral-300"
        />
      ) : (
        <PriorityBadge priority={entry.priority} />
      )}
      {entry.contactId ? (
        <Link href={`/contacts/${entry.contactId}`} className="min-w-0 truncate text-xs hover:underline">
          {content}
        </Link>
      ) : (
        <span className="min-w-0 truncate text-xs">{content}</span>
      )}
    </div>
  );
}

export function WeekView({
  focusDate,
  entriesByDay,
}: {
  focusDate: Date;
  entriesByDay: Map<string, UnifiedEntry[]>;
}) {
  const weekStart = startOfWeek(focusDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(focusDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[900px] grid-cols-7 divide-x divide-neutral-100 border border-neutral-200 rounded-lg">
        {days.map((date) => {
          const key = format(date, "yyyy-MM-dd");
          const entries = entriesByDay.get(key) ?? [];
          const today = isToday(date);
          return (
            <div key={key} className="min-h-[300px] p-2">
              <Link
                href={`/calendar?view=day&date=${key}`}
                className="mb-2 flex items-center gap-1.5 hover:underline"
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    today ? "bg-neutral-900 font-semibold text-white" : "text-neutral-600"
                  }`}
                >
                  {date.getDate()}
                </span>
                <span className="text-xs text-neutral-400">
                  {format(date, "EEE")}
                </span>
              </Link>
              <div className="space-y-0.5">
                {entries.length === 0 ? (
                  <p className="px-1.5 text-xs text-neutral-300">—</p>
                ) : (
                  entries.map((entry) => <WeekEntryItem key={entry.id} entry={entry} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
