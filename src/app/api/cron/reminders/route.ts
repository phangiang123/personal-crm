import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { broadcastPush } from "@/lib/push";
import { endOfDay, startOfDay } from "date-fns";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const todayEnd = endOfDay(now);
  const todayStart = startOfDay(now);

  const [overdueCount, dueTodayCount] = await Promise.all([
    db.contact.count({ where: { nextContactDate: { lt: todayStart } } }),
    db.contact.count({
      where: { nextContactDate: { gte: todayStart, lte: todayEnd } },
    }),
  ]);

  if (overdueCount === 0 && dueTodayCount === 0) {
    return NextResponse.json({ sent: 0, reason: "nothing due" });
  }

  const parts: string[] = [];
  if (overdueCount > 0) parts.push(`${overdueCount} người quá hạn liên hệ`);
  if (dueTodayCount > 0) parts.push(`${dueTodayCount} người cần liên hệ hôm nay`);

  const result = await broadcastPush({
    title: "Nhắc liên hệ hôm nay",
    body: parts.join(", "),
    url: "/follow-ups",
  });

  return NextResponse.json(result);
}
