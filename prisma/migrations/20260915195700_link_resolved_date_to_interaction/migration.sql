-- AlterTable
ALTER TABLE "ResolvedContactDate" ADD COLUMN     "interactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ResolvedContactDate_interactionId_key" ON "ResolvedContactDate"("interactionId");

-- AddForeignKey
ALTER TABLE "ResolvedContactDate" ADD CONSTRAINT "ResolvedContactDate_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
