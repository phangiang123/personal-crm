import { format } from "date-fns";
import type { Closeness, InteractionType } from "@prisma/client";

export const CLOSENESS_LABEL: Record<Closeness, string> = {
  VERY_CLOSE: "Rất thân",
  CLOSE: "Thân",
  SOMEWHAT_CLOSE: "Khá thân",
  ACQUAINTANCE: "Người quen",
  NEW: "Mới quen",
};

export const INTERACTION_TYPE_LABEL: Record<InteractionType, string> = {
  CALL: "Gọi điện",
  MESSAGE: "Nhắn tin",
  EMAIL: "Email",
  MEETING: "Gặp mặt",
  MEAL: "Ăn uống",
  EVENT: "Sự kiện",
  WORK: "Công việc",
  OTHER: "Khác",
};

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return format(new Date(date), "dd/MM/yyyy");
}

export function toDateInputValue(date: Date | string | null | undefined) {
  if (!date) return "";
  return format(new Date(date), "yyyy-MM-dd");
}
