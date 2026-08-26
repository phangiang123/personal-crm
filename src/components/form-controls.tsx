export const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900";
export const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}
