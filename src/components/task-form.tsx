"use client";

import { useState, useTransition } from "react";
import type { Priority } from "@prisma/client";
import { PRIORITY_LABEL } from "@/lib/contact-frequency";
import { Field, inputClass } from "@/components/form-controls";
import type { TaskInput } from "@/lib/actions/tasks";

const PRIORITY_OPTIONS: Priority[] = ["A", "B", "C", "D", "E"];

type ContactOption = { id: string; fullName: string };

export function TaskForm({
  initial,
  contacts,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial?: Partial<TaskInput>;
  contacts: ContactOption[];
  onSubmit: (input: TaskInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "E");
  const [contactId, setContactId] = useState(initial?.contactId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Tên công việc không được để trống.");
      return;
    }
    startTransition(async () => {
      try {
        await onSubmit({ title, notes, dueDate, priority, contactId: contactId || null });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
      <Field label="Tên công việc *">
        <input
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Ngày hết hạn">
          <input
            type="date"
            className={inputClass}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </Field>
        <Field label="Mức độ ưu tiên">
          <select
            className={inputClass}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABEL[p]}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Liên quan đến contact (tùy chọn)">
        <select
          className={inputClass}
          value={contactId}
          onChange={(e) => setContactId(e.target.value)}
        >
          <option value="">Không liên quan ai</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Ghi chú">
        <textarea
          className={inputClass}
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Field>

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
