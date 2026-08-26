import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileNav />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
