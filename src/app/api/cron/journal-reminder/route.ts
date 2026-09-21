import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { broadcastPush } from "@/lib/push";
import { todayInVietnam } from "@/lib/vn-date";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = todayInVietnam();
  const review = await db.dailyReview.findUnique({
    where: { date: new Date(today) },
  });

  const written =
    !!review &&
    [
      review.successSummary,
      review.fundNote,
      review.cosmicOrder,
      review.gratitudePast,
      review.gratitudePresent,
      review.gratitudeFuture,
      review.vaks17,
      review.vision30Days,
      review.vision6Months,
    ].some((v) => !!v) ||
    (!!review && review.fundAmount !== null);

  if (written) {
    return NextResponse.json({ sent: 0, reason: "already written" });
  }

  const result = await broadcastPush({
    title: "Tổng kết ngày",
    body: "Đã 8 giờ tối, bạn chưa viết tổng kết hôm nay.",
    url: "/journal",
  });

  return NextResponse.json(result);
}
