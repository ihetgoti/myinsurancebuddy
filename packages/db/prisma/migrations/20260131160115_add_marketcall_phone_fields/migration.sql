-- AlterTable
ALTER TABLE "CallOffer" ADD COLUMN     "description" TEXT,
ADD COLUMN     "marketcallOfferId" TEXT,
ADD COLUMN     "marketcallProgramId" TEXT,
ADD COLUMN     "marketcallRentId" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "validFrom" TIMESTAMP(3),
ADD COLUMN     "validTo" TIMESTAMP(3);
