-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "customVariables" JSONB;

-- CreateTable
CREATE TABLE "BulkJob" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "insuranceTypeId" TEXT NOT NULL,
    "geoLevel" "GeoLevel" NOT NULL,
    "countryId" TEXT,
    "stateId" TEXT,
    "csvData" JSONB,
    "variableMapping" JSONB,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "totalPages" INTEGER NOT NULL DEFAULT 0,
    "createdPages" INTEGER NOT NULL DEFAULT 0,
    "skippedPages" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "publishOnCreate" BOOLEAN NOT NULL DEFAULT false,
    "skipExisting" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BulkJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BulkJob_status_idx" ON "BulkJob"("status");

-- CreateIndex
CREATE INDEX "BulkJob_templateId_idx" ON "BulkJob"("templateId");

-- CreateIndex
CREATE INDEX "BulkJob_insuranceTypeId_idx" ON "BulkJob"("insuranceTypeId");

-- AddForeignKey
ALTER TABLE "BulkJob" ADD CONSTRAINT "BulkJob_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulkJob" ADD CONSTRAINT "BulkJob_insuranceTypeId_fkey" FOREIGN KEY ("insuranceTypeId") REFERENCES "InsuranceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
