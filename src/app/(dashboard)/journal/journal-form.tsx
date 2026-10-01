"use client";

import { useState, useTransition } from "react";
import { saveReview, type DailyReviewInput } from "@/lib/actions/daily-review";
import { Field, inputClass } from "@/components/form-controls";

type Initial = {
  successSummary: string | null;
  fundAmount: number | null;
  fundNote: string | null;
  cosmicOrder: string | null;
  gratitudePast: string | null;
  gratitudePresent: string | null;
  gratitudeFuture: string | null;
  vaks17: string | null;
  vision30Days: string | null;
  vision6Months: string | null;
} | null;

function Area({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <Field label={label}>
      <textarea
        className={inputClass}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function JournalForm({
  dateKey,
  initial,
}: {
  dateKey: string;
  initial: Initial;
}) {
  const [successSummary, setSuccessSummary] = useState(initial?.successSummary ?? "");
  const [fundAmount, setFundAmount] = useState(
    initial?.fundAmount != null ? String(initial.fundAmount) : "",
  );
  const [fundNote, setFundNote] = useState(initial?.fundNote ?? "");
  const [cosmicOrder, setCosmicOrder] = useState(initial?.cosmicOrder ?? "");
  const [gratitudePast, setGratitudePast] = useState(initial?.gratitudePast ?? "");
  const [gratitudePresent, setGratitudePresent] = useState(initial?.gratitudePresent ?? "");
  const [gratitudeFuture, setGratitudeFuture] = useState(initial?.gratitudeFuture ?? "");
  const [vaks17, setVaks17] = useState(initial?.vaks17 ?? "");
  const [vision30Days, setVision30Days] = useState(initial?.vision30Days ?? "");
  const [vision6Months, setVision6Months] = useState(initial?.vision6Months ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const input: DailyReviewInput = {
      successSummary,
      fundAmount: fundAmount.trim() === "" ? null : Number(fundAmount),
      fundNote,
      cosmicOrder,
      gratitudePast,
      gratitudePresent,
      gratitudeFuture,
      vaks17,
      vision30Days,
      vision6Months,
    };
    startTransition(async () => {
      try {
        await saveReview(dateKey, input);
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Area label="1. Tổng kết thành công" value={successSummary} onChange={setSuccessSummary} />

      <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-neutral-700">2. Bỏ quỹ tự do tài chính</h2>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            step="any"
            className={`${inputClass} max-w-[240px]`}
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
            placeholder="Số tiền hôm nay, vd: 200000"
          />
          <span className="text-sm text-neutral-500">VND</span>
        </div>
        <Area label="Ghi chú" value={fundNote} onChange={setFundNote} rows={2} />
      </div>

      <Area label="3. Đặt hàng vũ trụ" value={cosmicOrder} onChange={setCosmicOrder} />

      <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-neutral-700">4. Lòng biết ơn</h2>
        <Area label="4.1 Quá khứ" value={gratitudePast} onChange={setGratitudePast} rows={3} />
        <Area label="4.2 Hiện tại" value={gratitudePresent} onChange={setGratitudePresent} rows={3} />
        <Area label="4.3 Tương lai" value={gratitudeFuture} onChange={setGratitudeFuture} rows={3} />
      </div>

      <Area label="5. VAKS 17 Tư duy triệu phú" value={vaks17} onChange={setVaks17} />
      <Area label="6. Hình dung bức tranh 30 ngày" value={vision30Days} onChange={setVision30Days} />
      <Area label="7. Bức tranh 6 tháng" value={vision6Months} onChange={setVision6Months} />

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : "Lưu tổng kết"}
        </button>
        {saved && <span className="text-sm text-emerald-600">Đã lưu.</span>}
      </div>
    </form>
  );
}
