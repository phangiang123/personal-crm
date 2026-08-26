import type { Priority } from "@prisma/client";
import { CLOSENESS_LABEL } from "@/lib/format";
import type { Closeness } from "@prisma/client";
import { isPast, isToday } from "date-fns";

const PRIORITY_STYLE: Record<Priority, string> = {
  A: "bg-red-100 text-red-700",
  B: "bg-orange-100 text-orange-700",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-blue-100 text-blue-700",
  E: "bg-neutral-100 text-neutral-600",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLE[priority]}`}
    >
      {priority}
    </span>
  );
}

export function ClosenessBadge({ closeness }: { closeness: Closeness }) {
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
      {CLOSENESS_LABEL[closeness]}
    </span>
  );
}

export function NextContactBadge({
  date,
}: {
  date: Date | string | null | undefined;
}) {
  if (!date) {
    return (
      <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
        Chưa đặt lịch
      </span>
    );
  }
  const d = new Date(date);
  const overdue = isPast(d) && !isToday(d);
  const today = isToday(d);

  if (overdue) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
        Quá hạn
      </span>
    );
  }
  if (today) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
        Hôm nay
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
      Sắp tới
    </span>
  );
}

