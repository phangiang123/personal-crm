import Link from "next/link";
import type { UnifiedEntry } from "@/lib/actions/calendar";
import { PriorityBadge } from "@/components/badges";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";

const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MAX_VISIBLE_PER_DAY = 3;
const KIND_DOT: Record<UnifiedEntry["kind"], string> = {
  "next-contact": "bg-neutral-400",
  "follow-up": "bg-amber-500",
  task: "bg-blue-500",
};

export function MonthView({
  focusDate,
  entriesByDay,
}: {
  focusDate: Date;
  entriesByDay: Map<string, UnifiedEntry[]>;
}) {
  const monthStart = startOfMonth(focusDate);
  const monthEnd = endOfMonth(focusDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
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
                const entries = entriesByDay.get(key) ?? [];
                const visible = entries.slice(0, MAX_VISIBLE_PER_DAY);
                const extra = entries.length - visible.length;
                const inMonth = isSameMonth(date, monthStart);
                const today = isToday(date);
                return (
                  <Link
                    key={key}
                    href={`/calendar?view=day&date=${key}`}
                    className={`block min-h-[92px] p-1.5 hover:bg-neutral-50 ${
                      inMonth ? "bg-white" : "bg-neutral-50"
                    }`}
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
                      {visible.map((entry) => (
                        <div
                          key={entry.id}
                          className={`flex items-center gap-1 truncate rounded px-1 py-0.5 text-[11px] ${
                            entry.done ? "text-neutral-400" : "text-neutral-700"
                          }`}
                        >
                          {entry.done ? (
                            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" />
                          ) : entry.kind === "next-contact" ? (
                            <PriorityBadge priority={entry.priority} />
                          ) : (
                            <span
                              className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${KIND_DOT[entry.kind]}`}
                            />
                          )}
                          <span className={`truncate ${entry.done ? "line-through" : ""}`}>
                            {entry.title}
                          </span>
                        </div>
                      ))}
                      {extra > 0 && (
                        <p className="px-1 text-[11px] text-neutral-400">+{extra} khác</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
