import Link from "next/link";
import { notFound } from "next/navigation";
import { getContact } from "@/lib/actions/contacts";
import {
  PriorityBadge,
  ClosenessBadge,
  NextContactBadge,
} from "@/components/badges";
import { formatDate, INTERACTION_TYPE_LABEL } from "@/lib/format";
import { InteractionForm } from "@/components/interaction-form";
import { InteractionTimeline } from "@/components/interaction-timeline";
import { DeleteContactButton } from "@/components/delete-contact-button";
import { UpcomingSchedule } from "@/components/upcoming-schedule";

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-neutral-400">{label}</p>
      <p className="text-sm text-neutral-800">{value}</p>
    </div>
  );
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contact = await getContact(id);
  if (!contact) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {contact.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={contact.avatarUrl}
              alt={contact.fullName}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-200 text-xl font-semibold text-neutral-500">
              {contact.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-neutral-900">
                {contact.fullName}
              </h1>
              <PriorityBadge priority={contact.priority} />
              <ClosenessBadge closeness={contact.closeness} />
            </div>
            <p className="text-sm text-neutral-500">
              {[contact.jobTitle, contact.company].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href={`/contacts/${contact.id}/edit`}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Sửa
          </Link>
          <DeleteContactButton contactId={contact.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4 md:col-span-2">
          <h2 className="text-sm font-semibold text-neutral-700">
            Thông tin
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow label="Số điện thoại" value={contact.phone} />
            <InfoRow label="Email" value={contact.email} />
            <InfoRow label="Địa chỉ" value={contact.address} />
            <InfoRow label="Ngành nghề" value={contact.industry} />
            <InfoRow label="Ngày sinh" value={formatDate(contact.birthday)} />
          </div>

          {contact.groups.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs text-neutral-400">Nhóm quan hệ</p>
              <div className="flex flex-wrap gap-1.5">
                {contact.groups.map((g) => (
                  <span
                    key={g.groupId}
                    className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600"
                  >
                    {g.group.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {contact.tags.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs text-neutral-400">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {contact.tags.map((t) => (
                  <span
                    key={t.tagId}
                    className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                  >
                    {t.tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(contact.theyCanHelp.length > 0 || contact.theyCanHelpNote) && (
            <div>
              <p className="mb-1.5 text-xs text-neutral-400">
                Người này có thể hỗ trợ tôi
              </p>
              <div className="flex flex-wrap gap-1.5">
                {contact.theyCanHelp.map((h) => (
                  <span
                    key={h.id}
                    className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                  >
                    {h.name}
                  </span>
                ))}
              </div>
              {contact.theyCanHelpNote && (
                <p className="mt-1.5 text-sm text-neutral-600">
                  {contact.theyCanHelpNote}
                </p>
              )}
            </div>
          )}

          {(contact.iCanHelp.length > 0 || contact.iCanHelpNote) && (
            <div>
              <p className="mb-1.5 text-xs text-neutral-400">
                Tôi có thể hỗ trợ người này
              </p>
              <div className="flex flex-wrap gap-1.5">
                {contact.iCanHelp.map((h) => (
                  <span
                    key={h.id}
                    className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700"
                  >
                    {h.name}
                  </span>
                ))}
              </div>
              {contact.iCanHelpNote && (
                <p className="mt-1.5 text-sm text-neutral-600">
                  {contact.iCanHelpNote}
                </p>
              )}
            </div>
          )}

          {contact.notes && (
            <div>
              <p className="mb-1 text-xs text-neutral-400">Notes</p>
              <p className="whitespace-pre-wrap text-sm text-neutral-700">
                {contact.notes}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-neutral-700">Liên hệ</h2>
          <div>
            <p className="text-xs text-neutral-400">Lần liên hệ gần nhất</p>
            <p className="text-sm text-neutral-800">
              {formatDate(contact.lastContactDate)}
              {contact.lastContactType &&
                ` · ${INTERACTION_TYPE_LABEL[contact.lastContactType]}`}
            </p>
            {contact.lastContactNote && (
              <p className="mt-1 text-sm text-neutral-500">
                {contact.lastContactNote}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs text-neutral-400">Cần liên hệ tiếp theo</p>
            <div className="mt-1 flex items-center gap-2">
              <NextContactBadge date={contact.nextContactDate} />
              <span className="text-sm text-neutral-800">
                {formatDate(contact.nextContactDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-700">
            Lịch sử tương tác
          </h2>
          <InteractionForm contactId={contact.id} />
        </div>
        <InteractionTimeline interactions={contact.interactions} />
      </div>

      <UpcomingSchedule
        nextContactDate={contact.nextContactDate}
        priority={contact.priority}
        interactions={contact.interactions}
      />
    </div>
  );
}
