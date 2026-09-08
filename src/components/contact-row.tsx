import Link from "next/link";
import { PriorityBadge, NextContactBadge } from "@/components/badges";
import { formatDate } from "@/lib/format";
import { QuickLogButton } from "@/components/quick-log-button";

type ContactRowData = {
  id: string;
  fullName: string;
  company: string | null;
  jobTitle: string | null;
  priority: "A" | "B" | "C" | "D" | "E";
  nextContactDate: Date | null;
  groups?: { group: { name: string } }[];
};

export function ContactRow({ contact }: { contact: ContactRowData }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 hover:border-neutral-300 hover:shadow-sm">
      <Link
        href={`/contacts/${contact.id}`}
        className="flex min-w-0 flex-1 items-center justify-between gap-3"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={contact.priority} />
            <span className="truncate font-medium text-neutral-900">
              {contact.fullName}
            </span>
          </div>
          <p className="mt-0.5 truncate text-sm text-neutral-500">
            {[contact.jobTitle, contact.company].filter(Boolean).join(" · ") ||
              (contact.groups && contact.groups.length > 0
                ? contact.groups.map((g) => g.group.name).join(", ")
                : "")}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <NextContactBadge date={contact.nextContactDate} />
          <span className="text-xs text-neutral-400">
            {formatDate(contact.nextContactDate)}
          </span>
        </div>
      </Link>
      <QuickLogButton contactId={contact.id} />
    </div>
  );
}
