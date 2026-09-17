import Link from "next/link";
import { format } from "date-fns";

type View = "day" | "week" | "month";

function buildHref(view: View, dateKey: string) {
  return `/calendar?view=${view}&date=${dateKey}`;
}

export function CalendarHeader({
  view,
  focusDate,
  prevDateKey,
  nextDateKey,
  todayKey,
  title,
}: {
  view: View;
  focusDate: Date;
  prevDateKey: string;
  nextDateKey: string;
  todayKey: string;
  title: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Link
          href={buildHref(view, prevDateKey)}
          className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
        >
          ‹
        </Link>
        <Link
          href={buildHref(view, todayKey)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
        >
          Hôm nay
        </Link>
        <Link
          href={buildHref(view, nextDateKey)}
          className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
        >
          ›
        </Link>
        <h1 className="ml-2 text-lg font-semibold text-neutral-900">{title}</h1>
      </div>
      <div className="flex rounded-md border border-neutral-300 p-0.5">
        {(["day", "week", "month"] as const).map((v) => (
          <Link
            key={v}
            href={buildHref(v, format(focusDate, "yyyy-MM-dd"))}
            className={`rounded px-3 py-1.5 text-sm font-medium ${
              view === v
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {v === "day" ? "Ngày" : v === "week" ? "Tuần" : "Tháng"}
          </Link>
        ))}
      </div>
    </div>
  );
}
