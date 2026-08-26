import type { Interaction } from "@prisma/client";
import { INTERACTION_TYPE_LABEL, formatDate } from "@/lib/format";
import { FollowUpToggle } from "@/components/follow-up-toggle";

export function InteractionTimeline({
  interactions,
}: {
  interactions: Interaction[];
}) {
  if (interactions.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-400">
        Chưa có lịch sử tương tác nào.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {interactions.map((it) => (
        <div
          key={it.id}
          className="rounded-lg border border-neutral-200 bg-white p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-900">
              {INTERACTION_TYPE_LABEL[it.type]}
            </span>
            <span className="text-xs text-neutral-400">
              {formatDate(it.date)}
            </span>
          </div>
          {it.content && (
            <p className="mt-1 text-sm text-neutral-600">{it.content}</p>
          )}
          {it.outcome && (
            <p className="mt-1 text-sm text-neutral-500">
              <span className="font-medium">Kết quả: </span>
              {it.outcome}
            </p>
          )}
          {it.nextAction && (
            <p className="mt-1 text-sm text-neutral-500">
              <span className="font-medium">Việc tiếp theo: </span>
              {it.nextAction}
            </p>
          )}
          {it.followUpDate && (
            <div className="mt-2">
              <FollowUpToggle
                interactionId={it.id}
                done={it.followUpDone}
                followUpDate={it.followUpDate}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
