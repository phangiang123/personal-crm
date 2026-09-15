-- CreateTable
CREATE TABLE "ResolvedContactDate" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResolvedContactDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResolvedContactDate_date_idx" ON "ResolvedContactDate"("date");

-- AddForeignKey
ALTER TABLE "ResolvedContactDate" ADD CONSTRAINT "ResolvedContactDate_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
