/*
  Warnings:

  - You are about to drop the column `totalPages` on the `BulkJob` table. All the data in the column will be lost.
  - You are about to drop the column `heroSubtitle` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `heroTitle` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `sections` on the `Page` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[countryId,code]` on the table `State` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `originalName` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SUCCESS', 'WARNING', 'INFO', 'ERROR');

-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('PAGE', 'LANDING', 'BLOG', 'CATEGORY', 'CARRIER', 'COMPARISON', 'CALCULATOR', 'GUIDE', 'HTML', 'FAQ', 'GLOSSARY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'SCHEDULED', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED', 'DELETED');

-- CreateEnum
CREATE TYPE "ABTestStatus" AS ENUM ('DRAFT', 'RUNNING', 'PAUSED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DataSource" AS ENUM ('CSV', 'API', 'DATABASE', 'MANUAL');

-- CreateEnum
CREATE TYPE "SitemapType" AS ENUM ('INDEX', 'PAGES', 'LOCATIONS', 'CARRIERS', 'BLOG', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PopupType" AS ENUM ('SCROLL', 'EXIT_INTENT', 'TIMED', 'CLICK');

-- CreateEnum
CREATE TYPE "PopupPosition" AS ENUM ('CENTER', 'BOTTOM_RIGHT', 'BOTTOM_LEFT', 'TOP_CENTER');

-- CreateEnum
CREATE TYPE "PopupSize" AS ENUM ('SM', 'MD', 'LG');

-- AlterEnum
ALTER TYPE "GeoLevel" ADD VALUE 'NONE';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "JobStatus" ADD VALUE 'QUEUED';
ALTER TYPE "JobStatus" ADD VALUE 'PAUSED';
ALTER TYPE "JobStatus" ADD VALUE 'CANCELLED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'VIEWER';
ALTER TYPE "UserRole" ADD VALUE 'API_USER';

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "BulkJob" DROP CONSTRAINT "BulkJob_insuranceTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_insuranceTypeId_fkey";

-- DropIndex
DROP INDEX "Page_insuranceTypeId_geoLevel_countryId_stateId_cityId_key";

-- DropIndex
DROP INDEX "Template_slug_key";

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "entityName" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "userAgent" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BulkJob" DROP COLUMN "totalPages",
ADD COLUMN     "apiEndpoint" TEXT,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "csvFileName" TEXT,
ADD COLUMN     "dataSource" "DataSource" NOT NULL DEFAULT 'CSV',
ADD COLUMN     "defaultValues" JSONB,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "dryRun" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "errorLog" JSONB,
ADD COLUMN     "failedPages" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "processedRows" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ADD COLUMN     "slugPattern" TEXT,
ADD COLUMN     "slugTransform" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "totalRows" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updateExisting" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedPages" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "validateData" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "insuranceTypeId" DROP NOT NULL,
ALTER COLUMN "geoLevel" DROP NOT NULL;

-- AlterTable
ALTER TABLE "City" ADD COLUMN     "area" DOUBLE PRECISION,
ADD COLUMN     "avgPremium" DOUBLE PRECISION,
ADD COLUMN     "crimeRate" DOUBLE PRECISION,
ADD COLUMN     "isMajorCity" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "metaDesc" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "timezone" TEXT,
ADD COLUMN     "trafficScore" DOUBLE PRECISION,
ADD COLUMN     "zipCodes" TEXT[];

-- AlterTable
ALTER TABLE "Country" ADD COLUMN     "code3" TEXT,
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "flag" TEXT,
ADD COLUMN     "metaDesc" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "nativeName" TEXT,
ADD COLUMN     "phoneCode" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "InsuranceType" ADD COLUMN     "avgRating" DOUBLE PRECISION,
ADD COLUMN     "avgSavings" TEXT,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "heroCta" TEXT,
ADD COLUMN     "heroCtaUrl" TEXT,
ADD COLUMN     "heroImage" TEXT,
ADD COLUMN     "heroSubtitle" TEXT,
ADD COLUMN     "heroTitle" TEXT,
ADD COLUMN     "iconSvg" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "pluralName" TEXT,
ADD COLUMN     "schemaType" TEXT,
ADD COLUMN     "shortName" TEXT,
ADD COLUMN     "showInFooter" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showInNav" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "totalProviders" INTEGER,
ADD COLUMN     "totalReviews" INTEGER;

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "caption" TEXT,
ADD COLUMN     "folder" TEXT,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "title" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ADD COLUMN     "variants" JSONB;

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "heroSubtitle",
DROP COLUMN "heroTitle",
DROP COLUMN "sections",
ADD COLUMN     "aiGeneratedAt" TIMESTAMP(3),
ADD COLUMN     "aiGeneratedContent" JSONB,
ADD COLUMN     "aiModel" TEXT,
ADD COLUMN     "aiPromptVersion" TEXT,
ADD COLUMN     "avgTimeOnPage" INTEGER,
ADD COLUMN     "bodyClasses" TEXT,
ADD COLUMN     "bounceRate" DOUBLE PRECISION,
ADD COLUMN     "breadcrumbs" JSONB,
ADD COLUMN     "canonicalTag" TEXT,
ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "content" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "customCss" TEXT,
ADD COLUMN     "customData" JSONB,
ADD COLUMN     "customJs" TEXT,
ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "hreflangTags" JSONB,
ADD COLUMN     "internalNotes" TEXT,
ADD COLUMN     "isAiGenerated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPasswordProtected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metaKeywords" TEXT[],
ADD COLUMN     "ogDescription" TEXT,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "ogTitle" TEXT,
ADD COLUMN     "ogType" TEXT NOT NULL DEFAULT 'website',
ADD COLUMN     "password" TEXT,
ADD COLUMN     "prefetchPages" TEXT[],
ADD COLUMN     "preloadImages" TEXT[],
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "redirectTo" TEXT,
ADD COLUMN     "robots" TEXT,
ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ADD COLUMN     "schemaMarkup" JSONB,
ADD COLUMN     "shareCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "showAds" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "status" "PageStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "subtitle" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "twitterCard" TEXT NOT NULL DEFAULT 'summary_large_image',
ADD COLUMN     "twitterDesc" TEXT,
ADD COLUMN     "twitterImage" TEXT,
ADD COLUMN     "twitterTitle" TEXT,
ADD COLUMN     "uniqueViews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unpublishedAt" TIMESTAMP(3),
ADD COLUMN     "updatedById" TEXT,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "insuranceTypeId" DROP NOT NULL,
ALTER COLUMN "geoLevel" DROP NOT NULL;

-- AlterTable
ALTER TABLE "State" ADD COLUMN     "area" DOUBLE PRECISION,
ADD COLUMN     "avgPremium" DOUBLE PRECISION,
ADD COLUMN     "capital" TEXT,
ADD COLUMN     "largestCity" TEXT,
ADD COLUMN     "metaDesc" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "minCoverage" JSONB,
ADD COLUMN     "population" INTEGER,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "timezone" TEXT;

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "category" TEXT,
ADD COLUMN     "colorScheme" JSONB,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "customCss" TEXT,
ADD COLUMN     "customJs" TEXT,
ADD COLUMN     "fontConfig" JSONB,
ADD COLUMN     "footerConfig" JSONB,
ADD COLUMN     "headerConfig" JSONB,
ADD COLUMN     "htmlContent" TEXT,
ADD COLUMN     "includeFooter" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "includeHeader" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "layout" TEXT NOT NULL DEFAULT 'default',
ADD COLUMN     "maxWidth" TEXT,
ADD COLUMN     "ogDescTemplate" TEXT,
ADD COLUMN     "ogTitleTemplate" TEXT,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "schemaTemplate" JSONB,
ADD COLUMN     "seoDescTemplate" TEXT,
ADD COLUMN     "seoKeywordsTemplate" TEXT,
ADD COLUMN     "seoTitleTemplate" TEXT,
ADD COLUMN     "showAffiliates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sidebarConfig" JSONB,
ADD COLUMN     "type" "TemplateType" NOT NULL DEFAULT 'PAGE',
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "preferences" JSONB;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "type" "NotificationType" NOT NULL DEFAULT 'INFO',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'MyInsuranceBuddies',
    "siteUrl" TEXT NOT NULL DEFAULT 'https://myinsurancebuddies.com',
    "siteDescription" TEXT,
    "siteLogo" TEXT,
    "siteFavicon" TEXT,
    "defaultMetaTitle" TEXT,
    "defaultMetaDesc" TEXT,
    "defaultOgImage" TEXT,
    "googleAnalyticsId" TEXT,
    "googleTagManagerId" TEXT,
    "googleSearchConsoleId" TEXT,
    "bingWebmasterToolsId" TEXT,
    "facebookPixelId" TEXT,
    "organizationName" TEXT,
    "organizationLogo" TEXT,
    "organizationPhone" TEXT,
    "organizationEmail" TEXT,
    "organizationAddress" JSONB,
    "socialProfiles" JSONB,
    "sitemapEnabled" BOOLEAN NOT NULL DEFAULT true,
    "sitemapChangeFreq" TEXT NOT NULL DEFAULT 'weekly',
    "sitemapPriority" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "sitemapMaxUrls" INTEGER NOT NULL DEFAULT 50000,
    "sitemapAutoGenerate" BOOLEAN NOT NULL DEFAULT true,
    "sitemapLastGenerated" TIMESTAMP(3),
    "robotsTxtContent" TEXT,
    "headScripts" TEXT,
    "bodyStartScripts" TEXT,
    "bodyEndScripts" TEXT,
    "customCss" TEXT,
    "enableComments" BOOLEAN NOT NULL DEFAULT false,
    "enableRatings" BOOLEAN NOT NULL DEFAULT false,
    "enableSearch" BOOLEAN NOT NULL DEFAULT true,
    "enableBreadcrumbs" BOOLEAN NOT NULL DEFAULT true,
    "enableTableOfContents" BOOLEAN NOT NULL DEFAULT true,
    "enableRelatedPages" BOOLEAN NOT NULL DEFAULT true,
    "enableSocialShare" BOOLEAN NOT NULL DEFAULT true,
    "adsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "adsenseId" TEXT,
    "adSlots" JSONB,
    "customAdCode" TEXT,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carrier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "logoLight" TEXT,
    "logoDark" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "description" TEXT,
    "foundedYear" INTEGER,
    "headquarters" TEXT,
    "amBestRating" TEXT,
    "jdPowerRating" DOUBLE PRECISION,
    "bbbbRating" TEXT,
    "avgRating" DOUBLE PRECISION,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "features" JSONB,
    "pros" TEXT[],
    "cons" TEXT[],
    "avgMonthlyRate" DOUBLE PRECISION,
    "minMonthlyRate" DOUBLE PRECISION,
    "maxMonthlyRate" DOUBLE PRECISION,
    "availableStates" TEXT[],
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPartner" BOOLEAN NOT NULL DEFAULT false,
    "partnerUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carrier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarrierReview" (
    "id" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorEmail" TEXT,
    "authorState" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "pros" TEXT,
    "cons" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarrierReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentDefinition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "schema" JSONB NOT NULL,
    "defaultProps" JSONB,
    "renderType" TEXT NOT NULL DEFAULT 'react',
    "componentCode" TEXT,
    "defaultStyles" JSONB,
    "styleVariants" JSONB,
    "isCore" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "allowCustomCss" BOOLEAN NOT NULL DEFAULT true,
    "allowCustomJs" BOOLEAN NOT NULL DEFAULT false,
    "mobileHidden" BOOLEAN NOT NULL DEFAULT false,
    "tabletHidden" BOOLEAN NOT NULL DEFAULT false,
    "desktopHidden" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComponentDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageVersion" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "metadata" JSONB,
    "changeNote" TEXT,
    "changedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageComment" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ABTest" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "variants" JSONB NOT NULL,
    "primaryMetric" TEXT NOT NULL,
    "status" "ABTestStatus" NOT NULL DEFAULT 'DRAFT',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "results" JSONB,
    "winnerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ABTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sitemap" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "SitemapType" NOT NULL DEFAULT 'PAGES',
    "insuranceTypeId" TEXT,
    "geoLevel" "GeoLevel",
    "changeFreq" TEXT NOT NULL DEFAULT 'weekly',
    "priority" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "maxUrls" INTEGER NOT NULL DEFAULT 50000,
    "content" TEXT,
    "urlCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastGenerated" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sitemap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "insuranceTypeId" TEXT,
    "category" TEXT,
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "includeInSchema" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryTerm" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "extendedContent" TEXT,
    "relatedTerms" TEXT[],
    "category" TEXT,
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlossaryTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redirect" (
    "id" TEXT NOT NULL,
    "fromPath" TEXT NOT NULL,
    "toPath" TEXT NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 301,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isRegex" BOOLEAN NOT NULL DEFAULT false,
    "hitCount" INTEGER NOT NULL DEFAULT 0,
    "lastHitAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT,
    "featuredAlt" TEXT,
    "categoryId" TEXT,
    "tags" TEXT[],
    "authorId" TEXT,
    "authorName" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImage" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledTask" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "cronExpression" TEXT,
    "nextRunAt" TIMESTAMP(3),
    "lastRunAt" TIMESTAMP(3),
    "targetType" TEXT,
    "targetId" TEXT,
    "config" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastStatus" TEXT,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "events" TEXT[],
    "secret" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastTriggeredAt" TIMESTAMP(3),
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsSnapshot" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "totalPages" INTEGER NOT NULL,
    "publishedPages" INTEGER NOT NULL,
    "draftPages" INTEGER NOT NULL,
    "totalViews" INTEGER NOT NULL,
    "uniqueVisitors" INTEGER NOT NULL,
    "pagesByType" JSONB,
    "viewsByType" JSONB,
    "topPages" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliatePartner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT,
    "affiliateUrl" TEXT,
    "affiliateId" TEXT,
    "trackingParams" JSONB,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "insuranceTypes" TEXT[],
    "ctaText" TEXT NOT NULL DEFAULT 'Get Quote',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliatePartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallOffer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "subId" TEXT,
    "phoneMask" TEXT NOT NULL DEFAULT '(xxx) xxx-xx-xx',
    "insuranceTypeId" TEXT,
    "geoLevel" "GeoLevel",
    "stateIds" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CallOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallTrackingSettings" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'marketcall',
    "siteId" TEXT NOT NULL,
    "serviceBaseUrl" TEXT NOT NULL DEFAULT '//www.marketcall.com',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CallTrackingSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'openrouter',
    "apiKey" TEXT NOT NULL,
    "apiEndpoint" TEXT NOT NULL DEFAULT 'https://openrouter.ai/api/v1/chat/completions',
    "preferredModel" TEXT NOT NULL DEFAULT 'xiaomi/mimo-v2-flash',
    "fallbackModel" TEXT,
    "maxRequestsPerMinute" INTEGER NOT NULL DEFAULT 60,
    "maxTokensPerRequest" INTEGER NOT NULL DEFAULT 4000,
    "totalBudget" DOUBLE PRECISION,
    "usedBudget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "requestCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIGenerationJob" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pageIds" TEXT[],
    "filters" JSONB,
    "sections" TEXT[],
    "providerId" TEXT,
    "model" TEXT NOT NULL DEFAULT 'xiaomi/mimo-v2-flash',
    "promptTemplate" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "maxTokens" INTEGER NOT NULL DEFAULT 2000,
    "batchSize" INTEGER NOT NULL DEFAULT 10,
    "delayBetweenBatches" INTEGER NOT NULL DEFAULT 1000,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "totalPages" INTEGER NOT NULL DEFAULT 0,
    "processedPages" INTEGER NOT NULL DEFAULT 0,
    "successfulPages" INTEGER NOT NULL DEFAULT 0,
    "failedPages" INTEGER NOT NULL DEFAULT 0,
    "totalTokensUsed" INTEGER NOT NULL DEFAULT 0,
    "estimatedCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "errorLog" JSONB,
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIGenerationJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIPromptTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "insuranceTypeId" TEXT,
    "geoLevel" "GeoLevel",
    "isMajorCity" BOOLEAN,
    "systemPrompt" TEXT NOT NULL,
    "introPrompt" TEXT,
    "requirementsPrompt" TEXT,
    "faqsPrompt" TEXT,
    "tipsPrompt" TEXT,
    "model" TEXT NOT NULL DEFAULT 'xiaomi/mimo-v2-flash',
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "maxTokens" INTEGER NOT NULL DEFAULT 2000,
    "availableVars" JSONB,
    "exampleOutput" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIPromptTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Popup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "ctaText" TEXT NOT NULL DEFAULT 'Get Quote',
    "ctaUrl" TEXT NOT NULL,
    "secondaryCtaText" TEXT,
    "secondaryCtaUrl" TEXT,
    "phoneNumber" TEXT,
    "imageUrl" TEXT,
    "badgeText" TEXT,
    "accentColor" TEXT NOT NULL DEFAULT 'blue',
    "position" "PopupPosition" NOT NULL DEFAULT 'CENTER',
    "size" "PopupSize" NOT NULL DEFAULT 'MD',
    "showTrustBadges" BOOLEAN NOT NULL DEFAULT true,
    "type" "PopupType" NOT NULL DEFAULT 'SCROLL',
    "scrollPercentage" INTEGER DEFAULT 50,
    "delaySeconds" INTEGER DEFAULT 0,
    "showOncePerSession" BOOLEAN NOT NULL DEFAULT true,
    "showOncePerDay" BOOLEAN NOT NULL DEFAULT false,
    "cookieKey" TEXT,
    "insuranceTypeIds" TEXT[],
    "stateIds" TEXT[],
    "pageTypes" TEXT[],
    "excludePageSlugs" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Popup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CarrierToInsuranceType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_keyHash_key" ON "ApiKey"("keyHash");

-- CreateIndex
CREATE INDEX "ApiKey_userId_idx" ON "ApiKey"("userId");

-- CreateIndex
CREATE INDEX "ApiKey_keyHash_idx" ON "ApiKey"("keyHash");

-- CreateIndex
CREATE UNIQUE INDEX "Carrier_slug_key" ON "Carrier"("slug");

-- CreateIndex
CREATE INDEX "Carrier_isActive_idx" ON "Carrier"("isActive");

-- CreateIndex
CREATE INDEX "Carrier_slug_idx" ON "Carrier"("slug");

-- CreateIndex
CREATE INDEX "CarrierReview_carrierId_idx" ON "CarrierReview"("carrierId");

-- CreateIndex
CREATE INDEX "CarrierReview_isApproved_idx" ON "CarrierReview"("isApproved");

-- CreateIndex
CREATE INDEX "CarrierReview_rating_idx" ON "CarrierReview"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "ComponentDefinition_slug_key" ON "ComponentDefinition"("slug");

-- CreateIndex
CREATE INDEX "ComponentDefinition_category_idx" ON "ComponentDefinition"("category");

-- CreateIndex
CREATE INDEX "ComponentDefinition_isActive_idx" ON "ComponentDefinition"("isActive");

-- CreateIndex
CREATE INDEX "PageVersion_pageId_idx" ON "PageVersion"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "PageVersion_pageId_version_key" ON "PageVersion"("pageId", "version");

-- CreateIndex
CREATE INDEX "PageComment_pageId_idx" ON "PageComment"("pageId");

-- CreateIndex
CREATE INDEX "PageComment_userId_idx" ON "PageComment"("userId");

-- CreateIndex
CREATE INDEX "ABTest_pageId_idx" ON "ABTest"("pageId");

-- CreateIndex
CREATE INDEX "ABTest_status_idx" ON "ABTest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Sitemap_slug_key" ON "Sitemap"("slug");

-- CreateIndex
CREATE INDEX "Sitemap_type_idx" ON "Sitemap"("type");

-- CreateIndex
CREATE INDEX "Sitemap_isActive_idx" ON "Sitemap"("isActive");

-- CreateIndex
CREATE INDEX "FAQ_insuranceTypeId_idx" ON "FAQ"("insuranceTypeId");

-- CreateIndex
CREATE INDEX "FAQ_isActive_idx" ON "FAQ"("isActive");

-- CreateIndex
CREATE INDEX "FAQ_category_idx" ON "FAQ"("category");

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryTerm_slug_key" ON "GlossaryTerm"("slug");

-- CreateIndex
CREATE INDEX "GlossaryTerm_isActive_idx" ON "GlossaryTerm"("isActive");

-- CreateIndex
CREATE INDEX "GlossaryTerm_category_idx" ON "GlossaryTerm"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Redirect_fromPath_key" ON "Redirect"("fromPath");

-- CreateIndex
CREATE INDEX "Redirect_fromPath_idx" ON "Redirect"("fromPath");

-- CreateIndex
CREATE INDEX "Redirect_isActive_idx" ON "Redirect"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "BlogCategory"("slug");

-- CreateIndex
CREATE INDEX "BlogCategory_isActive_idx" ON "BlogCategory"("isActive");

-- CreateIndex
CREATE INDEX "BlogCategory_slug_idx" ON "BlogCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_isPublished_idx" ON "BlogPost"("isPublished");

-- CreateIndex
CREATE INDEX "BlogPost_isFeatured_idx" ON "BlogPost"("isFeatured");

-- CreateIndex
CREATE INDEX "BlogPost_categoryId_idx" ON "BlogPost"("categoryId");

-- CreateIndex
CREATE INDEX "BlogPost_publishedAt_idx" ON "BlogPost"("publishedAt");

-- CreateIndex
CREATE INDEX "BlogPost_slug_idx" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "ScheduledTask_isActive_idx" ON "ScheduledTask"("isActive");

-- CreateIndex
CREATE INDEX "ScheduledTask_nextRunAt_idx" ON "ScheduledTask"("nextRunAt");

-- CreateIndex
CREATE INDEX "Webhook_isActive_idx" ON "Webhook"("isActive");

-- CreateIndex
CREATE INDEX "AnalyticsSnapshot_date_idx" ON "AnalyticsSnapshot"("date");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsSnapshot_date_key" ON "AnalyticsSnapshot"("date");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliatePartner_slug_key" ON "AffiliatePartner"("slug");

-- CreateIndex
CREATE INDEX "AffiliatePartner_isActive_idx" ON "AffiliatePartner"("isActive");

-- CreateIndex
CREATE INDEX "AffiliatePartner_isFeatured_idx" ON "AffiliatePartner"("isFeatured");

-- CreateIndex
CREATE INDEX "AffiliatePartner_displayOrder_idx" ON "AffiliatePartner"("displayOrder");

-- CreateIndex
CREATE INDEX "CallOffer_insuranceTypeId_idx" ON "CallOffer"("insuranceTypeId");

-- CreateIndex
CREATE INDEX "CallOffer_isActive_idx" ON "CallOffer"("isActive");

-- CreateIndex
CREATE INDEX "CallOffer_geoLevel_idx" ON "CallOffer"("geoLevel");

-- CreateIndex
CREATE INDEX "AIProvider_isActive_idx" ON "AIProvider"("isActive");

-- CreateIndex
CREATE INDEX "AIProvider_priority_idx" ON "AIProvider"("priority");

-- CreateIndex
CREATE INDEX "AIGenerationJob_status_idx" ON "AIGenerationJob"("status");

-- CreateIndex
CREATE INDEX "AIGenerationJob_providerId_idx" ON "AIGenerationJob"("providerId");

-- CreateIndex
CREATE INDEX "AIPromptTemplate_insuranceTypeId_idx" ON "AIPromptTemplate"("insuranceTypeId");

-- CreateIndex
CREATE INDEX "AIPromptTemplate_geoLevel_idx" ON "AIPromptTemplate"("geoLevel");

-- CreateIndex
CREATE INDEX "AIPromptTemplate_isActive_idx" ON "AIPromptTemplate"("isActive");

-- CreateIndex
CREATE INDEX "AIPromptTemplate_isDefault_idx" ON "AIPromptTemplate"("isDefault");

-- CreateIndex
CREATE INDEX "Popup_isActive_idx" ON "Popup"("isActive");

-- CreateIndex
CREATE INDEX "Popup_type_idx" ON "Popup"("type");

-- CreateIndex
CREATE INDEX "Popup_priority_idx" ON "Popup"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "_CarrierToInsuranceType_AB_unique" ON "_CarrierToInsuranceType"("A", "B");

-- CreateIndex
CREATE INDEX "_CarrierToInsuranceType_B_index" ON "_CarrierToInsuranceType"("B");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_idx" ON "AuditLog"("entityType");

-- CreateIndex
CREATE INDEX "AuditLog_entityId_idx" ON "AuditLog"("entityId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "BulkJob_createdById_idx" ON "BulkJob"("createdById");

-- CreateIndex
CREATE INDEX "City_isActive_idx" ON "City"("isActive");

-- CreateIndex
CREATE INDEX "City_isMajorCity_idx" ON "City"("isMajorCity");

-- CreateIndex
CREATE INDEX "City_name_idx" ON "City"("name");

-- CreateIndex
CREATE INDEX "Country_isActive_idx" ON "Country"("isActive");

-- CreateIndex
CREATE INDEX "Country_code_idx" ON "Country"("code");

-- CreateIndex
CREATE INDEX "InsuranceType_isActive_idx" ON "InsuranceType"("isActive");

-- CreateIndex
CREATE INDEX "InsuranceType_sortOrder_idx" ON "InsuranceType"("sortOrder");

-- CreateIndex
CREATE INDEX "InsuranceType_parentId_idx" ON "InsuranceType"("parentId");

-- CreateIndex
CREATE INDEX "Media_folder_idx" ON "Media"("folder");

-- CreateIndex
CREATE INDEX "Media_mimeType_idx" ON "Media"("mimeType");

-- CreateIndex
CREATE INDEX "Page_status_idx" ON "Page"("status");

-- CreateIndex
CREATE INDEX "Page_publishedAt_idx" ON "Page"("publishedAt");

-- CreateIndex
CREATE INDEX "Page_stateId_isPublished_idx" ON "Page"("stateId", "isPublished");

-- CreateIndex
CREATE INDEX "Page_cityId_isPublished_idx" ON "Page"("cityId", "isPublished");

-- CreateIndex
CREATE INDEX "Page_insuranceTypeId_isPublished_idx" ON "Page"("insuranceTypeId", "isPublished");

-- CreateIndex
CREATE INDEX "Page_countryId_isPublished_idx" ON "Page"("countryId", "isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE INDEX "State_isActive_idx" ON "State"("isActive");

-- CreateIndex
CREATE INDEX "State_name_idx" ON "State"("name");

-- CreateIndex
CREATE UNIQUE INDEX "State_countryId_code_key" ON "State"("countryId", "code");

-- CreateIndex
CREATE INDEX "Template_type_idx" ON "Template"("type");

-- CreateIndex
CREATE INDEX "Template_isActive_idx" ON "Template"("isActive");

-- CreateIndex
CREATE INDEX "Template_category_idx" ON "Template"("category");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceType" ADD CONSTRAINT "InsuranceType_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "InsuranceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrierReview" ADD CONSTRAINT "CarrierReview_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_insuranceTypeId_fkey" FOREIGN KEY ("insuranceTypeId") REFERENCES "InsuranceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageVersion" ADD CONSTRAINT "PageVersion_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageComment" ADD CONSTRAINT "PageComment_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageComment" ADD CONSTRAINT "PageComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageComment" ADD CONSTRAINT "PageComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PageComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ABTest" ADD CONSTRAINT "ABTest_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulkJob" ADD CONSTRAINT "BulkJob_insuranceTypeId_fkey" FOREIGN KEY ("insuranceTypeId") REFERENCES "InsuranceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulkJob" ADD CONSTRAINT "BulkJob_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQ" ADD CONSTRAINT "FAQ_insuranceTypeId_fkey" FOREIGN KEY ("insuranceTypeId") REFERENCES "InsuranceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallOffer" ADD CONSTRAINT "CallOffer_insuranceTypeId_fkey" FOREIGN KEY ("insuranceTypeId") REFERENCES "InsuranceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIGenerationJob" ADD CONSTRAINT "AIGenerationJob_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "AIProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIGenerationJob" ADD CONSTRAINT "AIGenerationJob_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIPromptTemplate" ADD CONSTRAINT "AIPromptTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarrierToInsuranceType" ADD CONSTRAINT "_CarrierToInsuranceType_A_fkey" FOREIGN KEY ("A") REFERENCES "Carrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarrierToInsuranceType" ADD CONSTRAINT "_CarrierToInsuranceType_B_fkey" FOREIGN KEY ("B") REFERENCES "InsuranceType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
