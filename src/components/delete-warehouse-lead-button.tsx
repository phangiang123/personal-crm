"use client";

import { useTransition } from "react";
import { deleteWarehouseLead } from "@/lib/actions/warehouse-leads";

export function DeleteWarehouseLeadButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Xóa tin này?")) startTransition(() => deleteWarehouseLead(id));
      }}
      className="text-xs font-medium text-neutral-400 hover:text-red-600 disabled:opacity-50"
    >
      Xóa
    </button>
  );
}
