import Link from "next/link";
import { getDashboardData } from "@/lib/actions/dashboard";
import { ContactRow } from "@/components/contact-row";
import { formatDate } from "@/lib/format";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3">
      <p className="text-2xl font-semibold text-neutral-900">{value}</p>
      <p className="mt-0.5 text-sm text-neutral-500">{label}</p>
    </div>
  );
}

function Section({
  title,
  contacts,
  emptyText,
}: {
  title: string;
  contacts: Awaited<ReturnType<typeof getDashboardData>>["overdue"];
  emptyText: string;
}) {
  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold text-neutral-700">
        {title} ({contacts.length})
      </h2>
      {contacts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-400">
          {emptyText}
        </p>
      ) : (
        <div className="space-y-2">
          {contacts.map((c) => (
            <ContactRow key={c.id} contact={c} />
          ))}
        </div>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const { stats, priorityList } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500">
          Tổng quan các mối quan hệ cần chăm sóc
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Tổng Contacts" value={stats.totalContacts} />
        <StatCard label="Quá hạn liên hệ" value={stats.overdueCount} />
        <StatCard
          label="Chưa liên hệ 3 tháng"
          value={stats.notContacted3Months}
        />
        <StatCard
          label="Chưa liên hệ 6 tháng"
          value={stats.notContacted6Months}
        />
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-700">
          Theo nhóm quan hệ
        </h2>
        <div className="flex flex-wrap gap-2">
          {stats.byGroup.map((g) => (
            <span
              key={g.name}
              className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
            >
              {g.name}: {g.count}
            </span>
          ))}
        </div>
      </div>

      {(priorityList.priorityAOverdue.length > 0 ||
        priorityList.priorityBOverdue.length > 0 ||
        priorityList.pendingFollowUps.length > 0) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h2 className="mb-3 text-sm font-semibold text-amber-900">
            Danh sách ưu tiên
          </h2>
          <div className="space-y-4">
            {priorityList.priorityAOverdue.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-amber-800">
                  Priority A quá hạn liên hệ
                </p>
                <div className="space-y-2">
                  {priorityList.priorityAOverdue.map((c) => (
                    <ContactRow key={c.id} contact={c} />
                  ))}
                </div>
              </div>
            )}
            {priorityList.priorityBOverdue.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-amber-800">
                  Priority B quá hạn liên hệ
                </p>
                <div className="space-y-2">
                  {priorityList.priorityBOverdue.map((c) => (
                    <ContactRow key={c.id} contact={c} />
                  ))}
                </div>
              </div>
            )}
            {priorityList.pendingFollowUps.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-amber-800">
                  Cần follow-up
                </p>
                <div className="space-y-2">
                  {priorityList.pendingFollowUps.map((f) => (
                    <Link
                      key={f.id}
                      href={`/contacts/${f.contactId}`}
                      className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 hover:border-neutral-300"
                    >
                      <div>
                        <p className="font-medium text-neutral-900">
                          {f.contact.fullName}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {f.nextAction || "—"}
                        </p>
                      </div>
                      <span className="text-xs text-neutral-400">
                        {formatDate(f.followUpDate)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <Section
          title="Quá hạn liên hệ"
          contacts={data.overdue}
          emptyText="Không có ai quá hạn liên hệ."
        />
        <Section
          title="Cần liên hệ hôm nay"
          contacts={data.dueToday}
          emptyText="Không có ai cần liên hệ hôm nay."
        />
        <Section
          title="Cần liên hệ trong 7 ngày tới"
          contacts={data.due7}
          emptyText="Không có ai cần liên hệ trong 7 ngày tới."
        />
        <Section
          title="Cần liên hệ trong 30 ngày tới"
          contacts={data.due30}
          emptyText="Không có ai cần liên hệ trong 30 ngày tới."
        />
      </div>
    </div>
  );
}
