"use client";

import { useState, useTransition } from "react";

type Item = { id: string; name: string };

export function TaxonomyManager({
  title,
  items,
  onCreate,
  onRename,
  onDelete,
}: {
  title: string;
  items: Item[];
  onCreate: (name: string) => Promise<unknown>;
  onRename: (id: string, name: string) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
}) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        await onCreate(newName);
        setNewName("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      }
    });
  }

  function handleRename(id: string) {
    if (!editingName.trim()) return;
    startTransition(async () => {
      try {
        await onRename(id, editingName);
        setEditingId(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Xóa mục này? Các contact đang gắn sẽ mất liên kết.")) return;
    startTransition(async () => {
      try {
        await onDelete(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      }
    });
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-neutral-700">{title}</h2>

      <div className="mb-3 space-y-1.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-neutral-50"
          >
            {editingId === item.id ? (
              <input
                autoFocus
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRename(item.id)}
                onBlur={() => handleRename(item.id)}
                className="flex-1 rounded-md border border-neutral-300 px-2 py-1 text-sm outline-none focus:border-neutral-900"
              />
            ) : (
              <span className="text-sm text-neutral-700">{item.name}</span>
            )}
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  setEditingId(item.id);
                  setEditingName(item.name);
                }}
                className="rounded px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100"
              >
                Sửa
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => handleDelete(item.id)}
                className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="px-2 py-1.5 text-sm text-neutral-400">Chưa có mục nào.</p>
        )}
      </div>

      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Thêm mới..."
          className="flex-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-neutral-900"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          Thêm
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
