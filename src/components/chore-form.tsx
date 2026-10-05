"use client";

import { useState, useTransition } from "react";
import type { ChoreFrequency } from "@prisma/client";
import type { ChoreInput } from "@/lib/actions/chores";
import { Field, inputClass } from "@/components/form-controls";

const WEEKDAY_OPTIONS = [
  { value: 1, label: "Thứ 2" },
  { value: 2, label: "Thứ 3" },
  { value: 3, label: "Thứ 4" },
  { value: 4, label: "Thứ 5" },
  { value: 5, label: "Thứ 6" },
  { value: 6, label: "Thứ 7" },
  { value: 0, label: "Chủ nhật" },
];

export function ChoreForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial?: Partial<ChoreInput>;
  onSubmit: (input: ChoreInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [frequency, setFrequency] = useState<ChoreFrequency>(
    initial?.frequency ?? "DAILY",
  );
  const [weeklyDay, setWeeklyDay] = useState<number>(initial?.weeklyDay ?? 1);
  const [monthlyDay, setMonthlyDay] = useState<number>(initial?.monthlyDay ?? 1);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Tên việc nhà không được để trống.");
      return;
    }
    startTransition(async () => {
      try {
        await onSubmit({
          title,
          frequency,
          weeklyDay: frequency === "WEEKLY" ? weeklyDay : null,
          monthlyDay: frequency === "MONTHLY" ? monthlyDay : null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4"
    >
      <Field label="Tên việc nhà *">
        <input
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Field>

      <Field label="Lặp lại">
        <select
          className={inputClass}
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as ChoreFrequency)}
        >
          <option value="DAILY">Hàng ngày</option>
          <option value="WEEKLY">Hàng tuần</option>
          <option value="MONTHLY">Hàng tháng</option>
        </select>
      </Field>

      {frequency === "WEEKLY" && (
        <Field label="Vào ngày">
          <select
            className={inputClass}
            value={weeklyDay}
            onChange={(e) => setWeeklyDay(Number(e.target.value))}
          >
            {WEEKDAY_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </Field>
      )}

      {frequency === "MONTHLY" && (
        <Field label="Vào ngày (1-31) trong tháng">
          <input
            type="number"
            min={1}
            max={31}
            className={`${inputClass} max-w-[140px]`}
            value={monthlyDay}
            onChange={(e) => setMonthlyDay(Number(e.target.value))}
          />
        </Field>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-4 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-100"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}
