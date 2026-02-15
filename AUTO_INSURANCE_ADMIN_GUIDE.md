# Auto Insurance - Admin AI Content Guide

> Use the existing Admin AI Content panel to generate unique pages

---

## Prerequisites

1. ✅ States and cities uploaded to database
2. ✅ Auto Insurance type created in Admin → Insurance Types
3. ✅ OpenRouter API key added to Admin → AI Providers

---

## Step 1: Seed the AI Template

Run this once to add the auto insurance template to the database:

```bash
cd packages/db
npx ts-node prisma/seed-auto-insurance-templates.ts
```

This creates the template with:
- 12 content section prompts
- Output format examples
- System instructions for unique content

---

## Step 2: Create Pages

Run this to create pages for all cities:

```bash
npx ts-node scripts/setup-auto-pages.ts
```

This creates unpublished pages:
- URL: `/car-insurance/{state}/{city}`
- Title: "Cheapest Car Insurance in {City}, {State}"
- Ready for AI content generation

---

## Step 3: Generate AI Content (Using Admin Panel)

### 3.1 Navigate to AI Content
```
Admin → AI Content
```

### 3.2 Configure Filters
| Setting | Value |
|---------|-------|
| **Insurance Type** | Auto (or Car) |
| **States** | All (or select specific) |
| **Priority** | All |
| **Regenerate** | Unchecked (for new pages) |

### 3.3 Select Content Sections
Check ALL 12 sections:
- [x] **metaTags** - SEO title & description
- [x] **intro** - 150-200 word introduction
- [x] **requirements** - State minimum coverage
- [x] **faqs** - 5 Q&A pairs
- [x] **tips** - 7 money-saving tips
- [x] **costBreakdown** - 5-6 pricing factors
- [x] **comparison** - 4-5 provider comparisons
- [x] **discounts** - 8-10 available discounts
- [x] **localStats** - City-specific statistics
- [x] **coverageGuide** - 4 coverage types explained
- [x] **claimsProcess** - Filing process
- [x] **buyersGuide** - Shopping guide

### 3.4 Choose Model & Settings
| Setting | Recommended Value |
|---------|-------------------|
| **Model** | `deepseek/deepseek-r1:free` |
| **Batch Size** | 10-20 |
| **Delay** | 1000-2000ms |

### 3.5 Start Generation
Click **"Start AI Generation"**

---

## Step 4: Monitor Progress

The AI Content page shows:
- Total pages in job
- Processed / Successful / Failed counts
- Real-time progress bar
- Estimated time remaining

**Typical Speed:**
- 10 pages: ~2 minutes
- 100 pages: ~15-20 minutes
- 1000 pages: ~2-3 hours

---

## Step 5: Review & Publish

### Review Content
1. Go to Admin → Pages
2. Filter by Insurance Type: Auto
3. Click any page to view AI-generated content
4. Check all 12 sections are populated

### Publish Pages
```bash
# Publish all pages with AI content
npx ts-node scripts/publish-pages.ts

# With revalidation
npx ts-node scripts/publish-pages.ts --revalidate
```

---

## Content Structure

Each page gets unique content in this format:

```json
{
  "metaTags": {
    "metaTitle": "Cheapest Car Insurance in Los Angeles, CA | Save $500+",
    "metaDescription": "Find cheap car insurance in Los Angeles...",
    "metaKeywords": ["..."],
    "ogTitle": "...",
    "ogDescription": "..."
  },
  "intro": "150-200 words about LA car insurance...",
  "requirements": "State minimums and penalties...",
  "faqs": [
    {"question": "...", "answer": "..."},
    // 5 total
  ],
  "tips": [
    "Tip 1...",
    // 7 total
  ],
  "costBreakdown": [
    {"factor": "...", "impact": "...", "description": "..."},
    // 5-6 total
  ],
  "comparison": [
    {"name": "GEICO", "strengths": [...], "weaknesses": [...], "bestFor": "...", "priceRange": "..."},
    // 4-5 providers
  ],
  "discounts": [
    {"name": "...", "savings": "...", "qualification": "...", "isLocal": true/false},
    // 8-10 discounts
  ],
  "localStats": [
    {"stat": "...", "value": "...", "impact": "...", "comparison": "..."},
    // 4-5 stats
  ],
  "coverageGuide": [
    {"type": "...", "description": "...", "recommended": "...", "whenNeeded": "..."},
    // 4 types
  ],
  "claimsProcess": {
    "steps": [...],
    "documents": [...],
    "timeline": "...",
    "resources": [...]
  },
  "buyersGuide": {
    "steps": [...],
    "lookFor": [...],
    "redFlags": [...],
    "questions": [...]
  }
}
```

---

## Lead Capture Integration

Your pages will include lead capture forms. The AI content is designed to:

1. **Hook readers** with local relevance
2. **Build trust** with helpful information
3. **Create urgency** with savings mentions
4. **Prompt action** at multiple CTAs

Recommended CTA placements:
- After intro section
- After tips section
- After cost breakdown
- Sticky footer on mobile

---

## Cost

Using free models:
- **Total Cost:** $0
- **API Provider:** OpenRouter
- **Model:** DeepSeek R1 (free)
- **Quality:** Excellent for SEO content

---

## Troubleshooting

### "No AI providers configured"
Go to Admin → AI Providers → Add OpenRouter key

### "Template not found"
Run: `npx ts-node packages/db/prisma/seed-auto-insurance-templates.ts`

### Rate limit errors
Increase delay to 3000ms, decrease batch size to 10

### Low quality output
Check that all 12 sections are selected
Verify template is seeded correctly

---

## Quick Commands

```bash
# Setup everything
npx ts-node packages/db/prisma/seed-auto-insurance-templates.ts
npx ts-node scripts/setup-auto-pages.ts

# Check progress
psql -d myinsurancebuddy -c "SELECT COUNT(*) as total, SUM(CASE WHEN \"isAiGenerated\" THEN 1 ELSE 0 END) as done FROM \"Page\" WHERE slug LIKE '/car-insurance/%';"

# Publish
npx ts-node scripts/publish-pages.ts --revalidate
```

---

## Expected Results

| Cities | Pages | Content Words | Generation Time |
|--------|-------|---------------|-----------------|
| 100 | 100 | ~200,000 | 20 min |
| 1,000 | 1,000 | ~2,000,000 | 3 hours |
| 5,000 | 5,000 | ~10,000,000 | 15 hours |

---

## Next Steps After Generation

1. ✅ Review sample pages for quality
2. ✅ Publish pages
3. ✅ Submit sitemap to Google
4. ✅ Set up lead tracking
5. ✅ Monitor rankings in Search Console

---

**Ready? Start here:**
```bash
npx ts-node packages/db/prisma/seed-auto-insurance-templates.ts
```

Then go to **Admin → AI Content** to generate!
