"use client";

import { useState, useTransition } from "react";
import { changePassword } from "@/lib/actions/auth";
import { inputClass } from "@/components/form-controls";

export function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (password !== confirm) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }
    startTransition(async () => {
      try {
        await changePassword(password);
        setPassword("");
        setConfirm("");
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Mật khẩu mới
        </label>
        <input
          type="password"
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Nhập lại mật khẩu mới
        </label>
        <input
          type="password"
          className={inputClass}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-600">Đổi mật khẩu thành công.</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Đang lưu..." : "Đổi mật khẩu"}
      </button>
    </form>
  );
}
