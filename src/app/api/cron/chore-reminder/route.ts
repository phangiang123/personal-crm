import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { broadcastPush } from "@/lib/push";
import { todayInVietnam, currentHourInVietnam } from "@/lib/vn-date";
import type { ChoreFrequency } from "@prisma/client";

function isDueOn(
  chore: { frequency: ChoreFrequency; weeklyDay: number | null; monthlyDay: number | null },
  dateKey: string,
) {
  const d = new Date(dateKey);
  if (chore.frequency === "DAILY") return true;
  if (chore.frequency === "WEEKLY") return d.getUTCDay() === chore.weeklyDay;
  if (chore.frequency === "MONTHLY") return d.getUTCDate() === chore.monthlyDay;
  return false;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hour = currentHourInVietnam();
  const todayKey = todayInVietnam();

  const [chores, completions] = await Promise.all([
    db.chore.findMany({ where: { active: true, reminderHour: hour } }),
    db.choreCompletion.findMany({ where: { date: new Date(todayKey) } }),
  ]);

  const doneIds = new Set(completions.map((c) => c.choreId));
  const pending = chores.filter(
    (c) => isDueOn(c, todayKey) && !doneIds.has(c.id),
  );

  if (pending.length === 0) {
    return NextResponse.json({ sent: 0, reason: "nothing pending this hour" });
  }

  const result = await broadcastPush({
    title: "Nhắc việc nhà",
    body: pending.map((c) => c.title).join(", "),
    url: "/chores",
  });

  return NextResponse.json(result);
}
