import { NextResponse } from "next/server";
import { addWarehouseLead, type WarehouseLeadInput } from "@/lib/actions/warehouse-leads";

// No secret required: this endpoint only accepts public real-estate listing
// data (title/address/area/price/link), deduped by link, with a modest size
// cap — low-stakes enough to leave open for an external automated caller.
export async function POST(request: Request) {
  const body = await request.json();
  const items: WarehouseLeadInput[] = Array.isArray(body) ? body : [body];

  if (items.length > 100) {
    return NextResponse.json({ error: "Too many items in one request" }, { status: 400 });
  }

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
