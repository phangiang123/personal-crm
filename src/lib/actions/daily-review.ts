"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type DailyReviewInput = {
  successSummary: string;
  fundAmount: number | null;
  fundNote: string;
  cosmicOrder: string;
  gratitudePast: string;
  gratitudePresent: string;
  gratitudeFuture: string;
  vaks17: string;
  vision30Days: string;
  vision6Months: string;
};

function clean(value: string) {
  return value.trim() === "" ? null : value.trim();
}

export async function getReview(dateKey: string) {
  return db.dailyReview.findUnique({ where: { date: new Date(dateKey) } });
}

export async function saveReview(dateKey: string, input: DailyReviewInput) {
  const data = {
    successSummary: clean(input.successSummary),
    fundAmount:
      input.fundAmount !== null && input.fundAmount >= 0 ? input.fundAmount : null,
    fundNote: clean(input.fundNote),
    cosmicOrder: clean(input.cosmicOrder),
    gratitudePast: clean(input.gratitudePast),
    gratitudePresent: clean(input.gratitudePresent),
    gratitudeFuture: clean(input.gratitudeFuture),
    vaks17: clean(input.vaks17),
    vision30Days: clean(input.vision30Days),
    vision6Months: clean(input.vision6Months),
  };

  await db.dailyReview.upsert({
    where: { date: new Date(dateKey) },
    update: data,
    create: { date: new Date(dateKey), ...data },
  });

  revalidatePath("/journal");
}

export async function getJournalOverview(dateKey: string) {
  const monthStart = new Date(`${dateKey.slice(0, 7)}-01`);
  const nextMonth = new Date(monthStart);
  nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);

  const [recent, totalAll, totalMonth] = await Promise.all([
    db.dailyReview.findMany({
      orderBy: { date: "desc" },
      take: 30,
      select: { id: true, date: true, fundAmount: true },
    }),
    db.dailyReview.aggregate({ _sum: { fundAmount: true } }),
    db.dailyReview.aggregate({
      _sum: { fundAmount: true },
      where: { date: { gte: monthStart, lt: nextMonth } },
    }),
  ]);

  return {
    recent,
    totalFundAll: totalAll._sum.fundAmount ?? 0,
    totalFundMonth: totalMonth._sum.fundAmount ?? 0,
  };
}
