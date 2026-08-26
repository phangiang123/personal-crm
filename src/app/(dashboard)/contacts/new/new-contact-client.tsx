"use client";

import { useRouter } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { createContact, type ContactInput } from "@/lib/actions/contacts";

type Option = { id: string; name: string };

export function NewContactClient({
  groups,
  tags,
  helpTopics,
}: {
  groups: Option[];
  tags: Option[];
  helpTopics: Option[];
}) {
  const router = useRouter();

  async function handleSubmit(input: ContactInput) {
    const contact = await createContact(input);
    router.push(`/contacts/${contact.id}`);
  }

  return (
    <ContactForm
      groups={groups}
      tags={tags}
      helpTopics={helpTopics}
      onSubmit={handleSubmit}
      submitLabel="Tạo Contact"
    />
  );
}
