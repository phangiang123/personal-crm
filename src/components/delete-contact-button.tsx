"use client";

import { deleteContact } from "@/lib/actions/contacts";

export function DeleteContactButton({ contactId }: { contactId: string }) {
  return (
    <form
      action={deleteContact.bind(null, contactId)}
      onSubmit={(e) => {
        if (!confirm("Xóa contact này? Toàn bộ lịch sử tương tác sẽ mất.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Xóa
      </button>
    </form>
  );
}
