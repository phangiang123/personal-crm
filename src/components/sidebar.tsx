import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/contacts", label: "Contacts" },
  { href: "/follow-ups", label: "Follow-ups" },
  { href: "/tags", label: "Tags" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="hidden h-full w-56 shrink-0 flex-col border-r border-neutral-200 bg-white md:flex">
      <div className="px-5 py-5">
        <span className="text-base font-semibold text-neutral-900">
          Personal CRM
        </span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
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
    </aside>
  );
}
