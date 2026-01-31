-- AlterTable
ALTER TABLE "AIGenerationJob" ALTER COLUMN "model" SET DEFAULT 'deepseek/deepseek-r1:free';

-- AlterTable
ALTER TABLE "AIProvider" ALTER COLUMN "preferredModel" SET DEFAULT 'deepseek/deepseek-r1:free';
