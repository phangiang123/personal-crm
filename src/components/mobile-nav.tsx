"use client";

import Link from "next/link";
import { useState } from "react";
import { logoutAction } from "@/lib/actions/auth";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/contacts", label: "Contacts" },
  { href: "/follow-ups", label: "Follow-ups" },
  { href: "/tags", label: "Tags" },
  { href: "/settings", label: "Settings" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
        <span className="text-base font-semibold text-neutral-900">
          Personal CRM
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Mở menu"
          className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex h-full w-64 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-base font-semibold text-neutral-900">
                Personal CRM
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Đóng menu"
                className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <form action={logoutAction} className="border-t border-neutral-200 p-3">
              <button
                type="submit"
                className="w-full rounded-md px-3 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-100"
              >
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
