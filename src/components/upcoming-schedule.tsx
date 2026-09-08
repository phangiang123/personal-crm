import type { Interaction, Priority } from "@prisma/client";
import { NextContactBadge } from "@/components/badges";
import { formatDate } from "@/lib/format";
import { QuickLogButton } from "@/components/quick-log-button";
import { FollowUpToggle } from "@/components/follow-up-toggle";

type ScheduleItem =
  | { kind: "next-contact"; id: string; date: Date; label: string }
  | {
      kind: "follow-up";
      id: string;
      date: Date;
      label: string;
      note?: string | null;
    };

export function UpcomingSchedule({
  contactId,
  nextContactDate,
  priority,
  interactions,
}: {
  contactId: string;
  nextContactDate: Date | null;
  priority: Priority;
  interactions: Interaction[];
}) {
  const items: ScheduleItem[] = [];

  if (nextContactDate) {
    items.push({
      kind: "next-contact",
      id: "next-contact",
      date: nextContactDate,
      label: `Cần liên hệ tiếp theo (Priority ${priority})`,
    });
  }

  for (const it of interactions) {
    if (it.followUpDate && !it.followUpDone) {
      items.push({
        kind: "follow-up",
        id: it.id,
        date: it.followUpDate,
        label: "Follow-up",
        note: it.nextAction,
      });
    }
  }

  items.sort((a, b) => a.date.getTime() - b.date.getTime());

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-neutral-700">
        Lịch sắp tới
      </h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-neutral-900">
                {item.label}
              </p>
              {item.kind === "follow-up" && item.note && (
                <p className="text-sm text-neutral-500">{item.note}</p>
              )}
              {item.kind === "follow-up" && (
                <div className="mt-1">
                  <FollowUpToggle
                    interactionId={item.id}
                    done={false}
                    followUpDate={item.date}
                  />
                </div>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <NextContactBadge date={item.date} />
              <span className="text-sm text-neutral-600">
                {formatDate(item.date)}
              </span>
              {item.kind === "next-contact" && (
                <QuickLogButton contactId={contactId} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
