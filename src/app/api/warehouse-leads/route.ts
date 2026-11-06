import { NextResponse } from "next/server";
import { addWarehouseLead, type WarehouseLeadInput } from "@/lib/actions/warehouse-leads";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const items: WarehouseLeadInput[] = Array.isArray(body) ? body : [body];

  let created = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const item of items) {
    try {
      const result = await addWarehouseLead(item);
      if (result.created) created++;
      else skipped++;
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "unknown error");
    }
  }

  return NextResponse.json({ created, skipped, errors });
}
