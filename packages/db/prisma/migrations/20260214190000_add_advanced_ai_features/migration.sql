-- AlterTable
ALTER TABLE "AIGenerationJob" DROP COLUMN "promptTemplate",
ADD COLUMN     "contentHash" TEXT,
ADD COLUMN     "dedupKey" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "jobGroupId" TEXT,
ADD COLUMN     "perSection" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "promptTemplateId" TEXT,
ADD COLUMN     "uniquenessScore" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "AIPromptTemplate" ADD COLUMN     "category" TEXT,
ADD COLUMN     "dedupEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "dedupStrategy" TEXT NOT NULL DEFAULT 'semantic',
ADD COLUMN     "editHistory" JSONB,
ADD COLUMN     "exampleCostBreakdownFormat" JSONB,
ADD COLUMN     "exampleFaqsFormat" JSONB,
ADD COLUMN     "exampleIntroFormat" TEXT,
ADD COLUMN     "exampleMetaTagsFormat" JSONB,
ADD COLUMN     "exampleTipsFormat" JSONB,
ADD COLUMN     "isSystem" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastEditedAt" TIMESTAMP(3),
ADD COLUMN     "lastEditedById" TEXT,
ADD COLUMN     "minUniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 80.0,
ALTER COLUMN "model" SET DEFAULT 'deepseek/deepseek-r1:free';

-- AlterTable
ALTER TABLE "AIProvider" ADD COLUMN     "headers" JSONB,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requestFormat" JSONB,
ADD COLUMN     "responsePath" TEXT;

-- CreateTable
CREATE TABLE "AIGenerationJobGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "totalJobs" INTEGER NOT NULL DEFAULT 0,
    "completedJobs" INTEGER NOT NULL DEFAULT 0,
    "failedJobs" INTEGER NOT NULL DEFAULT 0,
    "sharedSettings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIGenerationJobGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIGenerationJobGroup_status_idx" ON "AIGenerationJobGroup"("status");

-- CreateIndex
CREATE INDEX "AIGenerationJob_promptTemplateId_idx" ON "AIGenerationJob"("promptTemplateId");

-- CreateIndex
CREATE INDEX "AIGenerationJob_jobGroupId_idx" ON "AIGenerationJob"("jobGroupId");

-- CreateIndex
CREATE INDEX "AIPromptTemplate_category_idx" ON "AIPromptTemplate"("category");

-- AddForeignKey
ALTER TABLE "AIGenerationJob" ADD CONSTRAINT "AIGenerationJob_promptTemplateId_fkey" FOREIGN KEY ("promptTemplateId") REFERENCES "AIPromptTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIGenerationJob" ADD CONSTRAINT "AIGenerationJob_jobGroupId_fkey" FOREIGN KEY ("jobGroupId") REFERENCES "AIGenerationJobGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIPromptTemplate" ADD CONSTRAINT "AIPromptTemplate_insuranceTypeId_fkey" FOREIGN KEY ("insuranceTypeId") REFERENCES "InsuranceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
