"use client";

import { useTransition } from "react";
import { addInteraction } from "@/lib/actions/interactions";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function QuickLogButton({ contactId }: { contactId: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(() => addInteraction({ contactId, date: today(), type: "OTHER" }));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      title="Đánh dấu đã liên hệ hôm nay"
      className="shrink-0 rounded-full border border-neutral-300 px-2 py-1 text-xs font-medium text-neutral-500 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
    >
      {pending ? "..." : "✓ Đã liên hệ"}
    </button>
  );
}
