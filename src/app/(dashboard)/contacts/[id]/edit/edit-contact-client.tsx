"use client";

import { useRouter } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import {
  updateContact,
  type ContactInput,
} from "@/lib/actions/contacts";

type Option = { id: string; name: string };

export function EditContactClient({
  contactId,
  initial,
  groups,
  tags,
  helpTopics,
}: {
  contactId: string;
  initial: Partial<ContactInput>;
  groups: Option[];
  tags: Option[];
  helpTopics: Option[];
}) {
  const router = useRouter();

  async function handleSubmit(input: ContactInput) {
    await updateContact(contactId, input);
    router.push(`/contacts/${contactId}`);
  }

  return (
    <ContactForm
      initial={initial}
      groups={groups}
      tags={tags}
      helpTopics={helpTopics}
      onSubmit={handleSubmit}
      submitLabel="Lưu thay đổi"
    />
  );
}
