import Link from "next/link";
import { format } from "date-fns";
import type { CalendarDay } from "@/lib/actions/dashboard";
import { PriorityBadge } from "@/components/badges";

const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MAX_VISIBLE_PER_DAY = 3;

export function MonthCalendar({
  monthLabel,
  monthKey,
  prevMonthKey,
  nextMonthKey,
  weeks,
}: {
  monthLabel: string;
  monthKey: string;
  prevMonthKey: string;
  nextMonthKey: string;
  weeks: CalendarDay[][];
}) {
  const currentMonthKey = format(new Date(), "yyyy-MM");

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-700">
          Lịch liên hệ — Tháng {monthLabel}
        </h2>
        <div className="flex items-center gap-1">
          <Link
            href={`/?month=${prevMonthKey}`}
            className="rounded-md px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100"
          >
            ‹
          </Link>
          {monthKey !== currentMonthKey && (
            <Link
              href="/"
              className="rounded-md px-2 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-100"
            >
              Hôm nay
            </Link>
          )}
          <Link
            href={`/?month=${nextMonthKey}`}
            className="rounded-md px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100"
          >
            ›
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-7 border-b border-neutral-200 pb-1.5">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="text-center text-xs font-medium text-neutral-400"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="divide-y divide-neutral-100">
            {weeks.map((week, i) => (
              <div key={i} className="grid grid-cols-7 divide-x divide-neutral-100">
                {week.map((day) => {
                  const visible = day.contacts.slice(0, MAX_VISIBLE_PER_DAY);
                  const extra = day.contacts.length - visible.length;
                  return (
                    <div
                      key={day.date.toISOString()}
                      className={`min-h-[92px] p-1.5 ${
                        day.inCurrentMonth ? "bg-white" : "bg-neutral-50"
                      }`}
                    >
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                          day.isToday
                            ? "bg-neutral-900 font-semibold text-white"
                            : day.inCurrentMonth
                              ? "text-neutral-600"
                              : "text-neutral-300"
                        }`}
                      >
                        {day.date.getDate()}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {visible.map((c) => (
                          <Link
                            key={c.id}
                            href={`/contacts/${c.id}`}
                            className="flex items-center gap-1 truncate rounded px-1 py-0.5 text-[11px] text-neutral-700 hover:bg-neutral-100"
                            title={c.fullName}
                          >
                            <PriorityBadge
                              priority={c.priority as "A" | "B" | "C" | "D" | "E"}
                            />
                            <span className="truncate">{c.fullName}</span>
                          </Link>
                        ))}
                        {extra > 0 && (
                          <p className="px-1 text-[11px] text-neutral-400">
                            +{extra} khác
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
