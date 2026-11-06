import { listWarehouseLeads } from "@/lib/actions/warehouse-leads";
import { DeleteWarehouseLeadButton } from "@/components/delete-warehouse-lead-button";

export const dynamic = "force-dynamic";

function formatSavedAt(d: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function WarehouseLeadsPage() {
  const leads = await listWarehouseLeads();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Tìm kho hàng</h1>
        <p className="text-sm text-neutral-500">
          Tin kho/nhà xưởng cho thuê tìm được — tin mới nhất ở trên cùng ({leads.length})
        </p>
      </div>

      {leads.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-200 px-4 py-10 text-center text-sm text-neutral-400">
          Chưa có tin nào được lưu.
        </p>
      ) : (
        <div className="space-y-2">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-lg border border-neutral-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <a
                  href={lead.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-neutral-900 hover:underline"
                >
                  {lead.title}
                </a>
                <DeleteWarehouseLeadButton id={lead.id} />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600">
                {lead.address && <span>📍 {lead.address}</span>}
                {lead.area && <span>📐 {lead.area}</span>}
                {lead.price && <span>💰 {lead.price}</span>}
                {lead.postedAt && <span>🕒 Đăng: {lead.postedAt}</span>}
              </div>
              <p className="mt-2 text-xs text-neutral-400">
                Lưu lúc {formatSavedAt(lead.createdAt)}
                {lead.keyword && ` · từ khóa "${lead.keyword}"`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
