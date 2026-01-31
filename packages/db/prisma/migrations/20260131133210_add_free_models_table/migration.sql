-- CreateTable
CREATE TABLE "FreeAIModel" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FreeAIModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FreeAIModel_modelId_key" ON "FreeAIModel"("modelId");

-- CreateIndex
CREATE INDEX "FreeAIModel_isActive_idx" ON "FreeAIModel"("isActive");

-- CreateIndex
CREATE INDEX "FreeAIModel_priority_idx" ON "FreeAIModel"("priority");
