"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-neutral-900">
          Personal CRM
        </h1>
        <p className="mb-6 text-sm text-neutral-500">
          Đăng nhập để tiếp tục
        </p>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Mật khẩu
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {pending ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
