import Link from "next/link";
import { listContacts, type ContactFilter } from "@/lib/actions/contacts";
import { listGroups, listTags, listHelpTopics } from "@/lib/actions/taxonomy";
import { ContactRow } from "@/components/contact-row";
import { CLOSENESS_LABEL } from "@/lib/format";
import { PRIORITY_LABEL } from "@/lib/contact-frequency";
import type { Closeness, Priority } from "@prisma/client";
import { inputClass } from "@/components/form-controls";

const STATUS_LABEL: Record<string, string> = {
  OVERDUE: "Quá hạn",
  DUE_TODAY: "Hôm nay",
  DUE_7: "Trong 7 ngày",
  DUE_30: "Trong 30 ngày",
  NOT_SET: "Chưa đặt lịch",
};

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sp = await searchParams;

  const filter: ContactFilter = {
    search: sp.search || undefined,
    groupId: sp.groupId || undefined,
    tagId: sp.tagId || undefined,
    priority: (sp.priority as Priority) || undefined,
    closeness: (sp.closeness as Closeness) || undefined,
    helpTopicId: sp.helpTopicId || undefined,
    status: (sp.status as ContactFilter["status"]) || undefined,
  };

  const [contacts, groups, tags, helpTopics] = await Promise.all([
    listContacts(filter),
    listGroups(),
    listTags(),
    listHelpTopics(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">Contacts</h1>
        <Link
          href="/contacts/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Thêm Contact
        </Link>
      </div>

      <form
        method="get"
        className="grid grid-cols-1 gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-2 md:grid-cols-4"
      >
        <input
          type="text"
          name="search"
          defaultValue={sp.search || ""}
          placeholder="Tìm tên, công ty, ngành nghề..."
          className={`${inputClass} md:col-span-2`}
        />
        <select name="groupId" defaultValue={sp.groupId || ""} className={inputClass}>
          <option value="">Tất cả nhóm</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <select name="tagId" defaultValue={sp.tagId || ""} className={inputClass}>
          <option value="">Tất cả tags</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <select name="priority" defaultValue={sp.priority || ""} className={inputClass}>
          <option value="">Tất cả priority</option>
          {(Object.keys(PRIORITY_LABEL) as Priority[]).map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABEL[p]}
            </option>
          ))}
        </select>
        <select
          name="closeness"
          defaultValue={sp.closeness || ""}
          className={inputClass}
        >
          <option value="">Tất cả mức thân thiết</option>
          {(Object.keys(CLOSENESS_LABEL) as Closeness[]).map((c) => (
            <option key={c} value={c}>
              {CLOSENESS_LABEL[c]}
            </option>
          ))}
        </select>
        <select
          name="helpTopicId"
          defaultValue={sp.helpTopicId || ""}
          className={inputClass}
        >
          <option value="">Tất cả khả năng hỗ trợ</option>
          {helpTopics.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={sp.status || ""} className={inputClass}>
          <option value="">Tất cả tình trạng liên hệ</option>
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <div className="flex gap-2 md:col-span-4">
          <button
            type="submit"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Lọc
          </button>
          <Link
            href="/contacts"
            className="rounded-md px-4 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-100"
          >
            Xóa bộ lọc
          </Link>
        </div>
      </form>

      <p className="text-sm text-neutral-500">{contacts.length} kết quả</p>

      {contacts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-200 px-4 py-10 text-center text-sm text-neutral-400">
          Không tìm thấy contact nào phù hợp.
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
