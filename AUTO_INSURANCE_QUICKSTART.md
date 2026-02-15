# Auto Insurance Pages - Quick Start

> Get 5,000-30,000 SEO pages generating leads in 3 steps

---

## What You Get

✅ **Unique AI content** for every city/state  
✅ **12 content sections** per page (~2,000 words)  
✅ **SEO optimized** for "cheapest car insurance [city]"  
✅ **Mobile lead capture** integrated  
✅ **Cost: $0** (free AI models)  

---

## 3-Step Setup

### Step 1: Setup Pages
```bash
npx ts-node scripts/setup-auto-insurance-pages.ts
```
Creates:
- AI content template
- Pages: `/car-insurance/{state}/{city}`

### Step 2: Generate Content
```bash
npx ts-node scripts/generate-auto-content.ts
```
Generates unique content for all pages using AI.

### Step 3: Publish
```bash
npx ts-node scripts/publish-pages.ts --revalidate
```
Makes pages live and clears cache.

---

## Lead Capture Flow

```
User searches "cheap car insurance los angeles"
          ↓
  Lands on /car-insurance/ca/los-angeles
          ↓
  Reads unique AI content (2,000 words)
          ↓
  Clicks "Get Free Quote"
          ↓
  Enters: [Zip Code] [Mobile Number]
          ↓
  Lead captured → Admin notification
```

---

## Content Sections (All AI-Generated)

1. **Meta Tags** - SEO title/desc
2. **Intro** - Hook with local details
3. **Requirements** - State minimums
4. **FAQs** - 5 questions & answers
5. **Tips** - 7 money-saving tips
6. **Cost Breakdown** - Pricing factors
7. **Provider Comparison** - 4-5 insurers
8. **Discounts** - 8-10 available discounts
9. **Local Stats** - City-specific data
10. **Coverage Guide** - Types explained
11. **Claims Process** - How to file
12. **Buyer's Guide** - Shopping tips

---

## Key Files

| File | Purpose |
|------|---------|
| `scripts/setup-auto-insurance-pages.ts` | Create template + pages |
| `scripts/generate-auto-content.ts` | Generate AI content |
| `scripts/publish-pages.ts` | Publish pages |
| `packages/db/prisma/seed-auto-insurance-templates.ts` | Template seeder |
| `.claude/AUTO_INSURANCE_SETUP_GUIDE.md` | Full documentation |

---

## Commands

```bash
# Setup all
npx ts-node scripts/setup-auto-insurance-pages.ts

# One state only
npx ts-node scripts/setup-auto-insurance-pages.ts --state=CA

# Generate all content
npx ts-node scripts/generate-auto-content.ts

# Generate 100 test pages
npx ts-node scripts/generate-auto-content.ts --limit=100

# Publish
npx ts-node scripts/publish-pages.ts --revalidate
```

---

## Prerequisites

- [ ] States/cities uploaded to DB
- [ ] OpenRouter API key in admin
- [ ] Lead form with mobile number ready
- [ ] Auto insurance type created

---

## Time Estimates

| Cities | Setup | Content Gen | Total |
|--------|-------|-------------|-------|
| 100    | 2 min | 5 min       | 7 min |
| 1,000  | 2 min | 1 hour      | 1.5 hrs |
| 10,000 | 5 min | 10 hours    | 10 hrs |

---

## Monitor Progress

```sql
-- Pages created
SELECT COUNT(*) FROM "Page" WHERE slug LIKE '/car-insurance/%';

-- Content generated
SELECT COUNT(*) FROM "Page" WHERE "isAiGenerated" = true;

-- Leads captured
SELECT DATE(created_at), COUNT(*) FROM "Lead" 
WHERE source LIKE '%car-insurance%' 
GROUP BY DATE(created_at);
```

---

## Need Help?

Full guide: `.claude/AUTO_INSURANCE_SETUP_GUIDE.md`  
Template docs: `.claude/prompts/auto-insurance-ai-templates.md`

---

**Ready? Start with:**
```bash
npx ts-node scripts/setup-auto-insurance-pages.ts
```
