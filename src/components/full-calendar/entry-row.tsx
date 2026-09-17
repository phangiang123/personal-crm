"use client";

import Link from "next/link";
import { useTransition } from "react";
import type { UnifiedEntry } from "@/lib/actions/calendar";
import { toggleTaskDone } from "@/lib/actions/tasks";
import { toggleFollowUpDone } from "@/lib/actions/interactions";
import { PriorityBadge } from "@/components/badges";
import { QuickLogButton } from "@/components/quick-log-button";

const KIND_LABEL: Record<UnifiedEntry["kind"], string> = {
  "next-contact": "Cần liên hệ",
  "follow-up": "Follow-up",
  task: "Công việc",
};

export function EntryRow({ entry }: { entry: UnifiedEntry }) {
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

  return (
    <div className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-3">
      {canToggle ? (
        <input
          type="checkbox"
          checked={entry.done}
          disabled={pending}
          onChange={(e) => handleToggle(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300"
        />
      ) : (
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-neutral-300" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={entry.priority} />
          <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
            {KIND_LABEL[entry.kind]}
          </span>
          {entry.contactId ? (
            <Link
              href={`/contacts/${entry.contactId}`}
              className={`text-sm font-medium hover:underline ${
                entry.done ? "text-neutral-400 line-through" : "text-neutral-900"
              }`}
            >
              {entry.title}
            </Link>
          ) : (
            <span
              className={`text-sm font-medium ${
                entry.done ? "text-neutral-400 line-through" : "text-neutral-900"
              }`}
            >
              {entry.title}
            </span>
          )}
        </div>
        {entry.note && (
          <p className="mt-0.5 text-sm text-neutral-500">{entry.note}</p>
        )}
      </div>
      {entry.kind === "next-contact" && !entry.done && entry.contactId && (
        <QuickLogButton contactId={entry.contactId} />
      )}
    </div>
  );
}
