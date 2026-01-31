-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "contentScores" JSONB,
ADD COLUMN     "lastScoredAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "autoSitemapSubmit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSitemapSubmit" TIMESTAMP(3),
ADD COLUMN     "sitemapSearchEngines" JSONB DEFAULT '["google", "bing"]',
ADD COLUMN     "sitemapSubmitSchedule" TEXT NOT NULL DEFAULT 'daily';
