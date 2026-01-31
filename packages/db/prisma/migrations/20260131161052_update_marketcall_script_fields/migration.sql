/*
  Warnings:

  - You are about to drop the column `description` on the `CallOffer` table. All the data in the column will be lost.
  - You are about to drop the column `marketcallProgramId` on the `CallOffer` table. All the data in the column will be lost.
  - You are about to drop the column `marketcallRentId` on the `CallOffer` table. All the data in the column will be lost.
  - You are about to drop the column `validFrom` on the `CallOffer` table. All the data in the column will be lost.
  - You are about to drop the column `validTo` on the `CallOffer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CallOffer" DROP COLUMN "description",
DROP COLUMN "marketcallProgramId",
DROP COLUMN "marketcallRentId",
DROP COLUMN "validFrom",
DROP COLUMN "validTo",
ADD COLUMN     "marketcallCampaignId" TEXT,
ADD COLUMN     "scriptCode" TEXT,
ADD COLUMN     "scriptUrl" TEXT;
