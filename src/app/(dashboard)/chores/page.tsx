import { listChores, getChoresForDate, getChoresForMonth } from "@/lib/actions/chores";
import { todayInVietnam } from "@/lib/vn-date";
import { ChoresClient } from "./chores-client";
import { ChoreMonthCalendar } from "@/components/chore-month-calendar";

export const dynamic = "force-dynamic";

export default async function ChoresPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const sp = await searchParams;
  const todayKey = todayInVietnam();
  const monthKey = sp.month && /^\d{4}-\d{2}$/.test(sp.month) ? sp.month : todayKey.slice(0, 7);

  const [allChores, todayChores, monthDays] = await Promise.all([
    listChores(),
    getChoresForDate(todayKey),
    getChoresForMonth(monthKey),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Việc nhà</h1>
        <p className="text-sm text-neutral-500">Danh sách việc nhà lặp lại định kỳ</p>
      </div>
      <ChoreMonthCalendar monthKey={monthKey} days={monthDays} />
      <ChoresClient
        todayChores={todayChores}
        allChores={allChores}
        todayKey={todayKey}
      />
    </div>
  );
}
