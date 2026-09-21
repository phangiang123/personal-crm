import Link from "next/link";
import { getReview, getJournalOverview } from "@/lib/actions/daily-review";
import { isValidDateKey, todayInVietnam } from "@/lib/vn-date";
import { JournalForm } from "./journal-form";

export const dynamic = "force-dynamic";

function shiftDate(dateKey: string, days: number) {
  const d = new Date(dateKey);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatKey(dateKey: string) {
  const [y, m, d] = dateKey.split("-");
  return `${d}/${m}/${y}`;
}

const money = (n: number) => `${n.toLocaleString("vi-VN")} ₫`;

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const sp = await searchParams;
  const today = todayInVietnam();
  const dateKey = isValidDateKey(sp.date) ? sp.date : today;

  const [review, overview] = await Promise.all([
    getReview(dateKey),
    getJournalOverview(dateKey),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Tổng kết ngày</h1>
          <p className="text-sm text-neutral-500">
            {formatKey(dateKey)}
            {dateKey === today && " (hôm nay)"}
            {review ? " · đã có tổng kết" : " · chưa viết"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/journal?date=${shiftDate(dateKey, -1)}`}
            className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
          >
            ‹
          </Link>
          <Link
            href="/journal"
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
          >
            Hôm nay
          </Link>
          <Link
            href={`/journal?date=${shiftDate(dateKey, 1)}`}
            className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
          >
            ›
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3">
          <p className="text-lg font-semibold text-neutral-900">
            {money(overview.totalFundAll)}
          </p>
          <p className="text-sm text-neutral-500">Quỹ tự do tài chính (cộng dồn)</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3">
          <p className="text-lg font-semibold text-neutral-900">
            {money(overview.totalFundMonth)}
          </p>
          <p className="text-sm text-neutral-500">Tháng {dateKey.slice(5, 7)}/{dateKey.slice(0, 4)}</p>
        </div>
      </div>

      <JournalForm key={dateKey} dateKey={dateKey} initial={review} />

      {overview.recent.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-neutral-700">
            Các ngày đã tổng kết gần đây
          </h2>
          <div className="flex flex-wrap gap-2">
            {overview.recent.map((r) => {
              const key = r.date.toISOString().slice(0, 10);
              return (
                <Link
                  key={r.id}
                  href={`/journal?date=${key}`}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    key === dateKey
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  {formatKey(key).slice(0, 5)}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
