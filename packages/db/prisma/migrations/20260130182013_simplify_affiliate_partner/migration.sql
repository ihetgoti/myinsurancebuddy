/*
  Warnings:

  - You are about to drop the column `affiliateId` on the `AffiliatePartner` table. All the data in the column will be lost.
  - You are about to drop the column `affiliateUrl` on the `AffiliatePartner` table. All the data in the column will be lost.
  - You are about to drop the column `ctaText` on the `AffiliatePartner` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `AffiliatePartner` table. All the data in the column will be lost.
  - You are about to drop the column `displayOrder` on the `AffiliatePartner` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceTypes` on the `AffiliatePartner` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `AffiliatePartner` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `AffiliatePartner` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `AffiliatePartner` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `AffiliatePartner` table. All the data in the column will be lost.
  - You are about to drop the column `trackingParams` on the `AffiliatePartner` table. All the data in the column will be lost.
  - Added the required column `marketCallUrl` to the `AffiliatePartner` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AffiliatePartner_displayOrder_idx";

-- DropIndex
DROP INDEX "AffiliatePartner_isFeatured_idx";

-- DropIndex
DROP INDEX "AffiliatePartner_slug_key";

-- AlterTable
ALTER TABLE "AffiliatePartner" DROP COLUMN "affiliateId",
DROP COLUMN "affiliateUrl",
DROP COLUMN "ctaText",
DROP COLUMN "description",
DROP COLUMN "displayOrder",
DROP COLUMN "insuranceTypes",
DROP COLUMN "isFeatured",
DROP COLUMN "logo",
DROP COLUMN "notes",
DROP COLUMN "slug",
DROP COLUMN "trackingParams",
ADD COLUMN     "insuranceTypeId" TEXT,
ADD COLUMN     "marketCallUrl" TEXT NOT NULL,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subId" TEXT;

-- CreateIndex
CREATE INDEX "AffiliatePartner_insuranceTypeId_idx" ON "AffiliatePartner"("insuranceTypeId");

-- CreateIndex
CREATE INDEX "AffiliatePartner_priority_idx" ON "AffiliatePartner"("priority");

-- AddForeignKey
ALTER TABLE "AffiliatePartner" ADD CONSTRAINT "AffiliatePartner_insuranceTypeId_fkey" FOREIGN KEY ("insuranceTypeId") REFERENCES "InsuranceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
