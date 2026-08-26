"use client";

type Option = { id: string; name: string };

export function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}
      </label>
      {options.length === 0 ? (
        <p className="text-sm text-neutral-400">
          Chưa có lựa chọn nào — tạo ở trang Tags.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const active = selected.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggle(opt.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400"
                }`}
              >
                {opt.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
