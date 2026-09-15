"use client";

import { useState, useTransition } from "react";
import { setNextContactDate } from "@/lib/actions/contacts";
import { toDateInputValue } from "@/lib/format";
import { inputClass } from "@/components/form-controls";

export function EditNextContactDate({
  contactId,
  nextContactDate,
}: {
  contactId: string;
  nextContactDate: Date | null;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(toDateInputValue(nextContactDate));
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      await setNextContactDate(contactId, value || null);
      setEditing(false);
    });
  }

  function clear() {
    startTransition(async () => {
      await setNextContactDate(contactId, null);
      setValue("");
      setEditing(false);
    });
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-xs font-medium text-neutral-400 hover:text-neutral-700"
      >
        Sửa ngày
      </button>
    );
  }

  return (
    <div className="w-full space-y-1.5">
      <input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`${inputClass} h-8 w-full py-1 text-sm`}
      />
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="rounded-md bg-neutral-900 px-2 py-1 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          Lưu
        </button>
        <button
          type="button"
          onClick={clear}
          disabled={pending}
          className="rounded-md px-2 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-100"
        >
          Bỏ lịch
        </button>
        <button
          type="button"
          onClick={() => {
            setValue(toDateInputValue(nextContactDate));
            setEditing(false);
          }}
          className="rounded-md px-2 py-1 text-xs font-medium text-neutral-400 hover:bg-neutral-100"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
