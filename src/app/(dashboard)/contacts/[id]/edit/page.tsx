import { notFound } from "next/navigation";
import { getContact } from "@/lib/actions/contacts";
import { listGroups, listTags, listHelpTopics } from "@/lib/actions/taxonomy";
import { toDateInputValue } from "@/lib/format";
import { EditContactClient } from "./edit-contact-client";

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [contact, groups, tags, helpTopics] = await Promise.all([
    getContact(id),
    listGroups(),
    listTags(),
    listHelpTopics(),
  ]);

  if (!contact) notFound();

  const initial = {
    fullName: contact.fullName,
    phone: contact.phone ?? "",
    email: contact.email ?? "",
    address: contact.address ?? "",
    company: contact.company ?? "",
    jobTitle: contact.jobTitle ?? "",
    industry: contact.industry ?? "",
    birthday: toDateInputValue(contact.birthday),
    avatarUrl: contact.avatarUrl ?? "",
    closeness: contact.closeness,
    priority: contact.priority,
    contactFrequencyDays: contact.contactFrequencyDays,
    theyCanHelpNote: contact.theyCanHelpNote ?? "",
    iCanHelpNote: contact.iCanHelpNote ?? "",
    notes: contact.notes ?? "",
    groupIds: contact.groups.map((g) => g.groupId),
    tagIds: contact.tags.map((t) => t.tagId),
    theyCanHelpTopicIds: contact.theyCanHelp.map((h) => h.id),
    iCanHelpTopicIds: contact.iCanHelp.map((h) => h.id),
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">
          Sửa thông tin: {contact.fullName}
        </h1>
      </div>
      <EditContactClient
        contactId={id}
        initial={initial}
        groups={groups}
        tags={tags}
        helpTopics={helpTopics}
      />
    </div>
  );
}
