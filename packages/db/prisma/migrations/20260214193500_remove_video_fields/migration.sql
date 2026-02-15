-- AlterTable
ALTER TABLE "AIPromptTemplate" DROP COLUMN "exampleVideoScriptFormat",
DROP COLUMN "videoScriptPrompt";

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "aiVideoScript";
