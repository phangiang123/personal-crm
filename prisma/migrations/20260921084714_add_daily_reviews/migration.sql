-- CreateTable
CREATE TABLE "DailyReview" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "successSummary" TEXT,
    "fundAmount" DOUBLE PRECISION,
    "fundNote" TEXT,
    "cosmicOrder" TEXT,
    "gratitudePast" TEXT,
    "gratitudePresent" TEXT,
    "gratitudeFuture" TEXT,
    "vaks17" TEXT,
    "vision30Days" TEXT,
    "vision6Months" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyReview_date_key" ON "DailyReview"("date");
