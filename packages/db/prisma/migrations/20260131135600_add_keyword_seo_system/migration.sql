-- AlterTable
ALTER TABLE "AIGenerationJob" ADD COLUMN     "keywords" JSONB;

-- CreateTable
CREATE TABLE "KeywordConfig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "primaryKeyword" TEXT NOT NULL,
    "secondaryKeywords" TEXT[],
    "longTailKeywords" TEXT[],
    "lsiKeywords" TEXT[],
    "targetDensity" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "maxDensity" DOUBLE PRECISION NOT NULL DEFAULT 3.0,
    "requireInTitle" BOOLEAN NOT NULL DEFAULT true,
    "requireInH1" BOOLEAN NOT NULL DEFAULT true,
    "requireInH2" BOOLEAN NOT NULL DEFAULT true,
    "requireInFirst100" BOOLEAN NOT NULL DEFAULT true,
    "requireInMeta" BOOLEAN NOT NULL DEFAULT true,
    "insuranceTypeId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KeywordConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KeywordConfig_insuranceTypeId_idx" ON "KeywordConfig"("insuranceTypeId");

-- CreateIndex
CREATE INDEX "KeywordConfig_isActive_idx" ON "KeywordConfig"("isActive");

-- AddForeignKey
ALTER TABLE "KeywordConfig" ADD CONSTRAINT "KeywordConfig_insuranceTypeId_fkey" FOREIGN KEY ("insuranceTypeId") REFERENCES "InsuranceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
