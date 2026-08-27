import Link from "next/link";
import { listPendingFollowUps } from "@/lib/actions/interactions";
import { listContacts } from "@/lib/actions/contacts";
import { ContactRow } from "@/components/contact-row";
import { FollowUpToggle } from "@/components/follow-up-toggle";
import { INTERACTION_TYPE_LABEL } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function FollowUpsPage() {
  const [followUps, overdueContacts] = await Promise.all([
    listPendingFollowUps(),
    listContacts({ status: "OVERDUE" }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Follow-ups</h1>
        <p className="text-sm text-neutral-500">
          Việc cần follow-up và các contact quá hạn liên hệ
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-700">
          Follow-up đang chờ ({followUps.length})
        </h2>
        {followUps.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-400">
            Không có follow-up nào đang chờ xử lý.
          </p>
        ) : (
          <div className="space-y-2">
            {followUps.map((f) => (
              <div
                key={f.id}
                className="rounded-lg border border-neutral-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/contacts/${f.contactId}`}
                      className="font-medium text-neutral-900 hover:underline"
                    >
                      {f.contact.fullName}
                    </Link>
                    <p className="mt-0.5 text-sm text-neutral-500">
                      {INTERACTION_TYPE_LABEL[f.type]}
                      {f.nextAction ? ` · ${f.nextAction}` : ""}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <FollowUpToggle
                    interactionId={f.id}
                    done={f.followUpDone}
                    followUpDate={f.followUpDate!}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-700">
          Contact quá hạn liên hệ ({overdueContacts.length})
        </h2>
        {overdueContacts.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-400">
            Không có ai quá hạn liên hệ.
          </p>
        ) : (
          <div className="space-y-2">
            {overdueContacts.map((c) => (
              <ContactRow key={c.id} contact={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
