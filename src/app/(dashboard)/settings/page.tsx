import { PRIORITY_LABEL, DEFAULT_FREQUENCY_DAYS } from "@/lib/contact-frequency";
import type { Priority } from "@prisma/client";
import { ChangePasswordForm } from "@/components/change-password-form";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Settings</h1>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-700">
          Tần suất liên hệ mặc định theo Priority
        </h2>
        <div className="space-y-1.5">
          {(Object.keys(PRIORITY_LABEL) as Priority[]).map((p) => (
            <div key={p} className="flex justify-between text-sm">
              <span className="text-neutral-600">{PRIORITY_LABEL[p]}</span>
              <span className="font-medium text-neutral-900">
                {DEFAULT_FREQUENCY_DAYS[p]} ngày
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-neutral-400">
          Có thể ghi đè tần suất riêng cho từng contact khi tạo/sửa contact.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-700">
          Đổi mật khẩu
        </h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
