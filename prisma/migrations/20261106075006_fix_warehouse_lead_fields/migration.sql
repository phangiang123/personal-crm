/*
  Warnings:

  - You are about to drop the column `description` on the `WarehouseLead` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `WarehouseLead` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `WarehouseLead` table. All the data in the column will be lost.
  - Added the required column `title` to the `WarehouseLead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WarehouseLead" DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "phone",
ADD COLUMN     "area" TEXT,
ADD COLUMN     "postedAt" TEXT,
ADD COLUMN     "price" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
