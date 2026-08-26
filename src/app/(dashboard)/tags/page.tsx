import {
  listGroups,
  listTags,
  listHelpTopics,
  createGroup,
  renameGroup,
  deleteGroup,
  createTag,
  renameTag,
  deleteTag,
  createHelpTopic,
  renameHelpTopic,
  deleteHelpTopic,
} from "@/lib/actions/taxonomy";
import { TaxonomyManager } from "@/components/taxonomy-manager";

export default async function TagsPage() {
  const [groups, tags, helpTopics] = await Promise.all([
    listGroups(),
    listTags(),
    listHelpTopics(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Tags</h1>
        <p className="text-sm text-neutral-500">
          Quản lý Nhóm quan hệ, Tags/Vai trò và Chủ đề hỗ trợ
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <TaxonomyManager
          title="Nhóm quan hệ"
          items={groups}
          onCreate={createGroup}
          onRename={renameGroup}
          onDelete={deleteGroup}
        />
        <TaxonomyManager
          title="Tags / Vai trò"
          items={tags}
          onCreate={createTag}
          onRename={renameTag}
          onDelete={deleteTag}
        />
        <TaxonomyManager
          title="Chủ đề hỗ trợ"
          items={helpTopics}
          onCreate={createHelpTopic}
          onRename={renameHelpTopic}
          onDelete={deleteHelpTopic}
        />
      </div>
    </div>
  );
}
