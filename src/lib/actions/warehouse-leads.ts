"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type WarehouseLeadInput = {
  title: string;
  postedAt?: string;
  address?: string;
  area?: string;
  price?: string;
  link: string;
  keyword?: string;
};

function toOptional(value: string | undefined) {
  return value && value.trim() !== "" ? value.trim() : null;
}

export async function listWarehouseLeads() {
  return db.warehouseLead.findMany({ orderBy: { createdAt: "desc" } });
}

export async function addWarehouseLead(input: WarehouseLeadInput) {
  if (!input.title.trim()) throw new Error("Thiếu tiêu đề.");
  if (!input.link.trim()) throw new Error("Thiếu link.");

  const existing = await db.warehouseLead.findUnique({
    where: { link: input.link.trim() },
  });
  if (existing) {
    return { created: false, id: existing.id };
  }

  const created = await db.warehouseLead.create({
    data: {
      title: input.title.trim(),
      postedAt: toOptional(input.postedAt),
      address: toOptional(input.address),
      area: toOptional(input.area),
      price: toOptional(input.price),
      link: input.link.trim(),
      keyword: toOptional(input.keyword),
    },
  });

  revalidatePath("/warehouse-leads");
  return { created: true, id: created.id };
}

export async function deleteWarehouseLead(id: string) {
  await db.warehouseLead.delete({ where: { id } });
  revalidatePath("/warehouse-leads");
}
