import type { Interaction, Priority } from "@prisma/client";
import { NextContactBadge } from "@/components/badges";
import { formatDate } from "@/lib/format";

type ScheduleItem = {
  id: string;
  date: Date;
  label: string;
  note?: string | null;
};

export function UpcomingSchedule({
  nextContactDate,
  priority,
  interactions,
}: {
  nextContactDate: Date | null;
  priority: Priority;
  interactions: Interaction[];
}) {
  const items: ScheduleItem[] = [];

  if (nextContactDate) {
    items.push({
      id: "next-contact",
      date: nextContactDate,
      label: `Cần liên hệ tiếp theo (Priority ${priority})`,
    });
  }

  for (const it of interactions) {
    if (it.followUpDate && !it.followUpDone) {
      items.push({
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
            className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {item.label}
              </p>
              {item.note && (
                <p className="text-sm text-neutral-500">{item.note}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <NextContactBadge date={item.date} />
              <span className="text-sm text-neutral-600">
                {formatDate(item.date)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
