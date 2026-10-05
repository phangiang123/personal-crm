"use client";

import { useState, useTransition } from "react";
import type { ChoreFrequency } from "@prisma/client";
import {
  createChore,
  updateChore,
  deleteChore,
  setChoreActive,
  toggleChoreDone,
  type ChoreInput,
} from "@/lib/actions/chores";
import { ChoreForm } from "@/components/chore-form";

type ChoreData = {
  id: string;
  title: string;
  frequency: ChoreFrequency;
  weeklyDay: number | null;
  monthlyDay: number | null;
  reminderHour: number | null;
  active: boolean;
};

type TodayChore = ChoreData & { done: boolean };

const WEEKDAY_LABEL: Record<number, string> = {
  0: "Chủ nhật",
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
};

function frequencyLabel(c: ChoreData) {
  const base =
    c.frequency === "DAILY"
      ? "Hàng ngày"
      : c.frequency === "WEEKLY"
        ? `Hàng tuần · ${WEEKDAY_LABEL[c.weeklyDay ?? 1]}`
        : `Hàng tháng · ngày ${c.monthlyDay}`;
  if (c.reminderHour == null) return base;
  return `${base} · nhắc ${String(c.reminderHour).padStart(2, "0")}:00`;
}

function TodayItem({ chore, todayKey }: { chore: TodayChore; todayKey: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <label className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 hover:bg-neutral-50">
      <input
        type="checkbox"
        checked={chore.done}
        disabled={pending}
        onChange={(e) =>
          startTransition(() =>
            toggleChoreDone(chore.id, todayKey, e.target.checked),
          )
        }
        className="h-4 w-4 rounded border-neutral-300"
      />
      <span
        className={`text-sm font-medium ${
          chore.done ? "text-neutral-400 line-through" : "text-neutral-900"
        }`}
      >
        {chore.title}
      </span>
    </label>
  );
}

function ChoreRow({ chore }: { chore: ChoreData }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <ChoreForm
        initial={chore}
        submitLabel="Lưu thay đổi"
        onCancel={() => setEditing(false)}
        onSubmit={async (input: ChoreInput) => {
          await updateChore(chore.id, input);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-3">
      <div>
        <p className={`text-sm font-medium ${chore.active ? "text-neutral-900" : "text-neutral-400"}`}>
          {chore.title}
        </p>
        <p className="text-xs text-neutral-400">{frequencyLabel(chore)}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(() => setChoreActive(chore.id, !chore.active))
          }
          className="text-xs font-medium text-neutral-400 hover:text-neutral-700"
        >
          {chore.active ? "Tạm dừng" : "Kích hoạt lại"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs font-medium text-neutral-400 hover:text-neutral-700"
        >
          Sửa việc nhà
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm("Xóa hẳn việc nhà này?")) {
              startTransition(() => deleteChore(chore.id));
            }
          }}
          className="text-xs font-medium text-neutral-400 hover:text-red-600"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}

export function ChoresClient({
  todayChores,
  allChores,
  todayKey,
}: {
  todayChores: TodayChore[];
  allChores: ChoreData[];
  todayKey: string;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-700">
          Hôm nay ({todayChores.length})
        </h2>
        {todayChores.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-400">
            Không có việc nhà nào đến hạn hôm nay.
          </p>
        ) : (
          <div className="space-y-2">
            {todayChores.map((c) => (
              <TodayItem key={c.id} chore={c} todayKey={todayKey} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-700">
            Danh sách việc nhà định kỳ ({allChores.length})
          </h2>
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              + Thêm việc nhà
            </button>
          )}
        </div>

        {showForm && (
          <ChoreForm
            submitLabel="Tạo việc nhà"
            onCancel={() => setShowForm(false)}
            onSubmit={async (input) => {
              await createChore(input);
              setShowForm(false);
            }}
          />
        )}

        {allChores.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-400">
            Chưa có việc nhà nào.
          </p>
        ) : (
          <div className="space-y-2">
            {allChores.map((c) => (
              <ChoreRow key={c.id} chore={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
