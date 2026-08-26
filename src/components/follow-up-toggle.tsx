"use client";

import { useTransition } from "react";
import { toggleFollowUpDone } from "@/lib/actions/interactions";
import { formatDate } from "@/lib/format";

export function FollowUpToggle({
  interactionId,
  done,
  followUpDate,
}: {
  interactionId: string;
  done: boolean;
  followUpDate: Date;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={done}
        disabled={pending}
        onChange={(e) =>
          startTransition(() =>
            toggleFollowUpDone(interactionId, e.target.checked),
          )
        }
        className="h-4 w-4 rounded border-neutral-300"
      />
      <span className={done ? "text-neutral-400 line-through" : "text-neutral-700"}>
        Follow-up: {formatDate(followUpDate)}
      </span>
    </label>
  );
}
