import { addDays } from "date-fns";
import type { Priority } from "@prisma/client";

export const DEFAULT_FREQUENCY_DAYS: Record<Priority, number> = {
  A: 14,
  B: 30,
  C: 90,
  D: 180,
  E: 270,
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  A: "A – Rất quan trọng",
  B: "B – Quan trọng",
  C: "C – Duy trì quan hệ",
  D: "D – Quan hệ xa",
  E: "E – Mới quen / chưa xác định",
};

export const FREQUENCY_PRESETS = [
  { label: "2 tuần", days: 14 },
  { label: "1 tháng", days: 30 },
  { label: "3 tháng", days: 90 },
  { label: "6 tháng", days: 180 },
  { label: "12 tháng", days: 365 },
];

export function resolveFrequencyDays(
  priority: Priority,
  customDays: number | null | undefined,
): number {
  return customDays ?? DEFAULT_FREQUENCY_DAYS[priority];
}

export function computeNextContactDate(
  lastContactDate: Date | null | undefined,
  priority: Priority,
  customDays: number | null | undefined,
): Date | null {
  if (!lastContactDate) return null;
  const days = resolveFrequencyDays(priority, customDays);
  return addDays(lastContactDate, days);
}
