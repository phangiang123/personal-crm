import { listGroups, listTags, listHelpTopics } from "@/lib/actions/taxonomy";
import { NewContactClient } from "./new-contact-client";

export default async function NewContactPage() {
  const [groups, tags, helpTopics] = await Promise.all([
    listGroups(),
    listTags(),
    listHelpTopics(),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">
          Thêm Contact mới
        </h1>
      </div>
      <NewContactClient groups={groups} tags={tags} helpTopics={helpTopics} />
    </div>
  );
}
