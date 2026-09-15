"use client";

import { useTransition } from "react";
import { deleteInteraction } from "@/lib/actions/interactions";

export function DeleteInteractionButton({
  interactionId,
}: {
  interactionId: string;
}) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Xóa tương tác này? Ngày liên hệ sẽ được tính lại.")) return;
    startTransition(() => deleteInteraction(interactionId));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-xs font-medium text-neutral-400 hover:text-red-600 disabled:opacity-50"
    >
      {pending ? "..." : "Xóa tương tác này"}
    </button>
  );
}
