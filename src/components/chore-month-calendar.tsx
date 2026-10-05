import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday as isTodayFn,
  startOfWeek,
  subMonths,
} from "date-fns";
import type { MonthChoreDay } from "@/lib/actions/chores";

const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MAX_VISIBLE_PER_DAY = 3;

export function ChoreMonthCalendar({
  monthKey,
  days,
}: {
  monthKey: string; // yyyy-MM
  days: MonthChoreDay[];
}) {
  const monthStart = new Date(`${monthKey}-01`);
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const gridDays = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const weeks: Date[][] = [];
  for (let i = 0; i < gridDays.length; i += 7) weeks.push(gridDays.slice(i, i + 7));

  const byKey = new Map(days.map((d) => [d.dateKey, d]));
  const prevMonthKey = format(subMonths(monthStart, 1), "yyyy-MM");
  const nextMonthKey = format(addMonths(monthStart, 1), "yyyy-MM");

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-700">
          Lịch việc nhà — Tháng {monthKey.slice(5, 7)}/{monthKey.slice(0, 4)}
        </h2>
        <div className="flex items-center gap-1">
          <Link
            href={`/chores?month=${prevMonthKey}`}
            className="rounded-md px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100"
          >
            ‹
          </Link>
          <Link
            href="/chores"
            className="rounded-md px-2 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-100"
          >
            Hôm nay
          </Link>
          <Link
            href={`/chores?month=${nextMonthKey}`}
            className="rounded-md px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100"
          >
            ›
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-7 border-b border-neutral-200 pb-1.5">
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className="text-center text-xs font-medium text-neutral-400">
                {label}
              </div>
            ))}
          </div>
          <div className="divide-y divide-neutral-100">
            {weeks.map((week, i) => (
              <div key={i} className="grid grid-cols-7 divide-x divide-neutral-100">
                {week.map((date) => {
                  const key = format(date, "yyyy-MM-dd");
                  const info = byKey.get(key);
                  const inMonth = isSameMonth(date, monthStart);
                  const today = isTodayFn(date);
                  const items = info?.items ?? [];
                  const visible = items.slice(0, MAX_VISIBLE_PER_DAY);
                  const extra = items.length - visible.length;

                  return (
                    <div
                      key={key}
                      className={`min-h-[92px] p-1.5 ${inMonth ? "bg-white" : "bg-neutral-50"}`}
                    >
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                          today
                            ? "bg-neutral-900 font-semibold text-white"
                            : inMonth
                              ? "text-neutral-600"
                              : "text-neutral-300"
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {visible.map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-center gap-1 truncate rounded px-1 py-0.5 text-[11px] ${
                              item.done ? "text-neutral-400" : "text-neutral-700"
                            }`}
                          >
                            <span
                              className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                                item.done ? "bg-neutral-300" : "bg-blue-500"
                              }`}
                            />
                            <span className={`truncate ${item.done ? "line-through" : ""}`}>
                              {item.title}
                            </span>
                          </div>
                        ))}
                        {extra > 0 && (
                          <p className="px-1 text-[11px] text-neutral-400">+{extra} khác</p>
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
