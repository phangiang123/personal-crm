"use client";

import { useState, useTransition } from "react";
import type { Closeness, Priority } from "@prisma/client";
import type { ContactInput } from "@/lib/actions/contacts";
import { CLOSENESS_LABEL } from "@/lib/format";
import { PRIORITY_LABEL, FREQUENCY_PRESETS } from "@/lib/contact-frequency";
import { CheckboxGroup } from "@/components/checkbox-group";
import { Field, inputClass } from "@/components/form-controls";

type Option = { id: string; name: string };

const CLOSENESS_OPTIONS: Closeness[] = [
  "VERY_CLOSE",
  "CLOSE",
  "SOMEWHAT_CLOSE",
  "ACQUAINTANCE",
  "NEW",
];
const PRIORITY_OPTIONS: Priority[] = ["A", "B", "C", "D", "E"];

export function ContactForm({
  initial,
  groups,
  tags,
  helpTopics,
  onSubmit,
  submitLabel,
}: {
  initial?: Partial<ContactInput>;
  groups: Option[];
  tags: Option[];
  helpTopics: Option[];
  onSubmit: (input: ContactInput) => Promise<void>;
  submitLabel: string;
}) {
  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [company, setCompany] = useState(initial?.company ?? "");
  const [jobTitle, setJobTitle] = useState(initial?.jobTitle ?? "");
  const [industry, setIndustry] = useState(initial?.industry ?? "");
  const [birthday, setBirthday] = useState(initial?.birthday ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatarUrl ?? "");
  const [closeness, setCloseness] = useState<Closeness>(
    initial?.closeness ?? "NEW",
  );
  const [priority, setPriority] = useState<Priority>(
    initial?.priority ?? "E",
  );
  const [contactFrequencyDays, setContactFrequencyDays] = useState<
    number | null
  >(initial?.contactFrequencyDays ?? null);
  const [theyCanHelpNote, setTheyCanHelpNote] = useState(
    initial?.theyCanHelpNote ?? "",
  );
  const [iCanHelpNote, setICanHelpNote] = useState(
    initial?.iCanHelpNote ?? "",
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [groupIds, setGroupIds] = useState<string[]>(
    initial?.groupIds ?? [],
  );
  const [tagIds, setTagIds] = useState<string[]>(initial?.tagIds ?? []);
  const [theyCanHelpTopicIds, setTheyCanHelpTopicIds] = useState<string[]>(
    initial?.theyCanHelpTopicIds ?? [],
  );
  const [iCanHelpTopicIds, setICanHelpTopicIds] = useState<string[]>(
    initial?.iCanHelpTopicIds ?? [],
  );

  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Họ tên không được để trống.");
      return;
    }

    const input: ContactInput = {
      fullName,
      phone,
      email,
      address,
      company,
      jobTitle,
      industry,
      birthday,
      avatarUrl,
      closeness,
      priority,
      contactFrequencyDays,
      theyCanHelpNote,
      iCanHelpNote,
      notes,
      groupIds,
      tagIds,
      theyCanHelpTopicIds,
      iCanHelpTopicIds,
    };

    startTransition(async () => {
      try {
        await onSubmit(input);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-700">
          Thông tin cơ bản
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Họ tên *">
            <input
              className={inputClass}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Field>
          <Field label="Số điện thoại">
            <input
              className={inputClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Địa chỉ">
            <input
              className={inputClass}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Field>
          <Field label="Công ty">
            <input
              className={inputClass}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </Field>
          <Field label="Chức vụ">
            <input
              className={inputClass}
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </Field>
          <Field label="Ngành nghề">
            <input
              className={inputClass}
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </Field>
          <Field label="Ngày sinh">
            <input
              type="date"
              className={inputClass}
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </Field>
          <Field label="Ảnh đại diện (URL)">
            <input
              className={inputClass}
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-700">
          Quan hệ & ưu tiên
        </h2>
        <CheckboxGroup
          label="Nhóm quan hệ"
          options={groups}
          selected={groupIds}
          onChange={setGroupIds}
        />
        <CheckboxGroup
          label="Tags / Vai trò"
          options={tags}
          selected={tagIds}
          onChange={setTagIds}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Mức độ thân thiết">
            <select
              className={inputClass}
              value={closeness}
              onChange={(e) => setCloseness(e.target.value as Closeness)}
            >
              {CLOSENESS_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {CLOSENESS_LABEL[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Mức độ ưu tiên">
            <select
              className={inputClass}
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABEL[p]}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Tần suất liên hệ (để trống = dùng mặc định theo priority)">
          <select
            className={inputClass}
            value={contactFrequencyDays ?? ""}
            onChange={(e) =>
              setContactFrequencyDays(
                e.target.value ? Number(e.target.value) : null,
              )
            }
          >
            <option value="">Mặc định theo priority</option>
            {FREQUENCY_PRESETS.map((f) => (
              <option key={f.days} value={f.days}>
                {f.label}
              </option>
            ))}
          </select>
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-700">
          Khả năng hỗ trợ
        </h2>
        <CheckboxGroup
          label="Người này có thể hỗ trợ tôi"
          options={helpTopics}
          selected={theyCanHelpTopicIds}
          onChange={setTheyCanHelpTopicIds}
        />
        <Field label="Ghi chú thêm (họ giúp tôi gì)">
          <textarea
            className={inputClass}
            rows={2}
            value={theyCanHelpNote}
            onChange={(e) => setTheyCanHelpNote(e.target.value)}
          />
        </Field>
        <CheckboxGroup
          label="Tôi có thể hỗ trợ người này"
          options={helpTopics}
          selected={iCanHelpTopicIds}
          onChange={setICanHelpTopicIds}
        />
        <Field label="Ghi chú thêm (tôi giúp họ gì)">
          <textarea
            className={inputClass}
            rows={2}
            value={iCanHelpNote}
            onChange={(e) => setICanHelpNote(e.target.value)}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-700">Ghi chú</h2>
        <textarea
          className={inputClass}
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Đang lưu..." : submitLabel}
      </button>
    </form>
  );
}
