import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { getCalendarEntries } from "@/lib/actions/calendar";
import { CalendarHeader } from "@/components/full-calendar/calendar-header";
import { MonthView } from "@/components/full-calendar/month-view";
import { WeekView } from "@/components/full-calendar/week-view";
import { DayView } from "@/components/full-calendar/day-view";

export const dynamic = "force-dynamic";

type View = "day" | "week" | "month";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; date?: string }>;
}) {
  const sp = await searchParams;
  const view: View =
    sp.view === "day" || sp.view === "week" ? sp.view : "month";
  const focusDate = sp.date ? new Date(sp.date) : new Date();

  let rangeStart: Date;
  let rangeEnd: Date;
  let title: string;
  let prevDateKey: string;
  let nextDateKey: string;

  if (view === "day") {
    rangeStart = focusDate;
    rangeEnd = focusDate;
    title = format(focusDate, "dd/MM/yyyy");
    prevDateKey = format(subDays(focusDate, 1), "yyyy-MM-dd");
    nextDateKey = format(addDays(focusDate, 1), "yyyy-MM-dd");
  } else if (view === "week") {
    rangeStart = startOfWeek(focusDate, { weekStartsOn: 1 });
    rangeEnd = endOfWeek(focusDate, { weekStartsOn: 1 });
    title = `${format(rangeStart, "dd/MM")} – ${format(rangeEnd, "dd/MM/yyyy")}`;
    prevDateKey = format(subWeeks(focusDate, 1), "yyyy-MM-dd");
    nextDateKey = format(addWeeks(focusDate, 1), "yyyy-MM-dd");
  } else {
    const monthStart = startOfMonth(focusDate);
    const monthEnd = endOfMonth(focusDate);
    rangeStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    rangeEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    title = format(focusDate, "'Tháng' MM/yyyy");
    prevDateKey = format(subMonths(focusDate, 1), "yyyy-MM-dd");
    nextDateKey = format(addMonths(focusDate, 1), "yyyy-MM-dd");
  }

  const entriesByDay = await getCalendarEntries(rangeStart, rangeEnd);
  const todayKey = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="space-y-4">
      <CalendarHeader
        view={view}
        focusDate={focusDate}
        prevDateKey={prevDateKey}
        nextDateKey={nextDateKey}
        todayKey={todayKey}
        title={title}
      />

      <div className="mb-1 flex flex-wrap gap-3 text-[11px] text-neutral-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-neutral-400" />
          Cần liên hệ
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
          Follow-up
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
          Công việc
        </span>
      </div>

      {view === "month" && (
        <MonthView focusDate={focusDate} entriesByDay={entriesByDay} />
      )}
      {view === "week" && (
        <WeekView focusDate={focusDate} entriesByDay={entriesByDay} />
      )}
      {view === "day" && (
        <DayView focusDate={focusDate} entriesByDay={entriesByDay} />
      )}
    </div>
  );
}
