"use client";

import { useState, useTransition } from "react";
import type { InteractionType } from "@prisma/client";
import { addInteraction } from "@/lib/actions/interactions";
import { INTERACTION_TYPE_LABEL } from "@/lib/format";
import { Field, inputClass } from "@/components/form-controls";

const TYPE_OPTIONS: InteractionType[] = [
  "CALL",
  "MESSAGE",
  "EMAIL",
  "MEETING",
  "MEAL",
  "EVENT",
  "WORK",
  "OTHER",
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function InteractionForm({ contactId }: { contactId: string }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(today());
  const [type, setType] = useState<InteractionType>("CALL");
  const [content, setContent] = useState("");
  const [outcome, setOutcome] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await addInteraction({
          contactId,
          date,
          type,
          content,
          outcome,
          nextAction,
          followUpDate: followUpDate || undefined,
        });
        setContent("");
        setOutcome("");
        setNextAction("");
        setFollowUpDate("");
        setDate(today());
        setType("CALL");
        setOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
      >
        + Thêm tương tác
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Ngày">
          <input
            type="date"
            className={inputClass}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Field>
        <Field label="Loại tương tác">
          <select
            className={inputClass}
            value={type}
            onChange={(e) => setType(e.target.value as InteractionType)}
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {INTERACTION_TYPE_LABEL[t]}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Nội dung">
        <textarea
          className={inputClass}
          rows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Field>
      <Field label="Kết quả">
        <textarea
          className={inputClass}
          rows={2}
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Việc cần làm tiếp theo">
          <input
            className={inputClass}
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
          />
        </Field>
        <Field label="Ngày follow-up">
          <input
            type="date"
            className={inputClass}
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
          />
        </Field>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : "Lưu tương tác"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md px-4 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-100"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
