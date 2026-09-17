import { format } from "date-fns";
import type { UnifiedEntry } from "@/lib/actions/calendar";
import { EntryRow } from "@/components/full-calendar/entry-row";

export function DayView({
  focusDate,
  entriesByDay,
}: {
  focusDate: Date;
  entriesByDay: Map<string, UnifiedEntry[]>;
}) {
  const key = format(focusDate, "yyyy-MM-dd");
  const entries = entriesByDay.get(key) ?? [];

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-neutral-700">
        {format(focusDate, "EEEE, dd/MM/yyyy")}
      </h2>
      {entries.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-200 px-4 py-10 text-center text-sm text-neutral-400">
          Không có việc gì trong ngày này.
        </p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <EntryRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
