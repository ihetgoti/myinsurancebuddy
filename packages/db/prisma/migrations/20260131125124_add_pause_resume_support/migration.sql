-- AlterTable
ALTER TABLE "AIGenerationJob" ADD COLUMN     "autoResumeAt" TIMESTAMP(3),
ADD COLUMN     "pausedAt" TIMESTAMP(3),
ADD COLUMN     "resumeState" JSONB,
ADD COLUMN     "resumedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "AIProvider" ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "lastErrorAt" TIMESTAMP(3),
ADD COLUMN     "metadata" JSONB;
