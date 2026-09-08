import type { Interaction } from "@prisma/client";
import { INTERACTION_TYPE_LABEL, formatDate } from "@/lib/format";
import { FollowUpToggle } from "@/components/follow-up-toggle";

function sortForDisplay(interactions: Interaction[]) {
  const pending = interactions
    .filter((it) => it.followUpDate && !it.followUpDone)
    .sort((a, b) => a.followUpDate!.getTime() - b.followUpDate!.getTime());
  const rest = interactions.filter(
    (it) => !(it.followUpDate && !it.followUpDone),
  );
  return [...pending, ...rest];
}

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

  const sorted = sortForDisplay(interactions);

  return (
    <div className="space-y-3">
      {sorted.map((it) => {
        const isPending = !!it.followUpDate && !it.followUpDone;
        return (
          <div
            key={it.id}
            className={`rounded-lg border bg-white p-4 ${
              isPending
                ? "border-amber-300 ring-1 ring-amber-100"
                : "border-neutral-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isPending && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                    Cần follow-up
                  </span>
                )}
                <span className="text-sm font-medium text-neutral-900">
                  {INTERACTION_TYPE_LABEL[it.type]}
                </span>
              </div>
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
        );
      })}
    </div>
  );
}
