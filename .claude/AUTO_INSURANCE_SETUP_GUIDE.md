# Auto Insurance Lead Generation Setup Guide

> Complete setup for auto insurance pages with AI content + mobile lead capture

---

## What You're Building

**Lead Generation Funnel:**
```
SEO Traffic → City Page → Content + CTA → Mobile Number Capture → Lead
```

**Scale:**
- 50 states × 100+ cities = **5,000-30,000 pages**
- Each page: ~2,000 unique words (12 content sections)
- Total content: **10-60 million words**
- **Cost: $0** (using free AI models)

---

## Prerequisites Checklist

- [ ] States and cities uploaded to database
- [ ] Admin panel accessible
- [ ] OpenRouter API key (free) configured
- [ ] Lead capture form working with mobile number
- [ ] Auto Insurance insurance type created

---

## Quick Start (3 Steps)

### Step 1: Setup Pages

```bash
# Seed AI template + create pages for all cities
cd /var/www/myinsurancebuddies.com
npx ts-node scripts/setup-auto-insurance-pages.ts
```

This creates:
- AI content template with 12 sections
- Pages for all cities: `/car-insurance/{state}/{city}`
- Pages unpublished (ready for content)

**Expected output:**
```
✅ Template created
📊 Total auto pages: 0
🏙️  Found 2847 cities
   ✅ Created 2847 pages
📊 Total auto pages: 2847
```

---

### Step 2: Generate AI Content

**Option A: Via Script (Recommended)**
```bash
# Generate content for all pages
npx ts-node scripts/generate-auto-content.ts

# Or with options
npx ts-node scripts/generate-auto-content.ts --state=CA --limit=100
```

**Option B: Via Admin Dashboard**
1. Go to: `http://yourdomain.com/dashboard/ai-content`
2. Select:
   - Insurance Type: **Auto**
   - States: **All** (or specific)
   - Sections: **All 12**
   - Model: `deepseek/deepseek-r1:free`
3. Click **Start Generation**

**Progress tracking:**
```
🔄 Batch 1/143 (20 pages)
   Los Angeles, CA... ✅
   San Diego, CA... ✅
   San Jose, CA... ✅
   ...

Progress: 20 success, 0 failed, 0 skipped
2847 remaining
```

**Time estimate:**
- 100 pages: ~5 minutes
- 1,000 pages: ~1 hour
- 10,000 pages: ~10 hours

---

### Step 3: Publish & Go Live

```bash
# Publish all pages with AI content
npx ts-node scripts/publish-pages.ts

# Revalidate cache
curl "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&pattern=/car-insurance/**"
```

---

## Content Structure

Each page includes these **12 AI-generated sections**:

| Section | Purpose | Lead Gen Integration |
|---------|---------|---------------------|
| **Meta Tags** | SEO title/desc | CTA in description |
| **Intro** | Hook readers | Lead form after intro |
| **Requirements** | State laws | - |
| **FAQs** | Long-tail keywords | - |
| **Tips** | Value content | CTA: "Get quotes to apply these tips" |
| **Cost Breakdown** | Pricing info | CTA: "See your personalized rate" |
| **Comparison** | Provider compare | Affiliate links |
| **Discounts** | Savings info | CTA: "Find which discounts you qualify for" |
| **Local Stats** | Local relevance | - |
| **Coverage Guide** | Education | CTA: "Get covered today" |
| **Claims Process** | Trust building | - |
| **Buyer's Guide** | How to shop | CTA: "Start comparing" |

---

## Lead Capture Strategy

### Placement
1. **Hero Section**: Above the fold
   - Headline: "Cheapest Car Insurance in {City}"
   - Sub: "Compare quotes & save up to $500/year"
   - Form: Zip Code + Mobile Number

2. **Mid-Content**: After Tips section
   - "Ready to save? Get your free quote"
   - Same form

3. **Sticky Footer**: Mobile
   - "Get Free Quote" button
   - Click-to-call for mobile users

### Form Fields
```
[Zip Code] [Mobile Number] [Get My Free Quote]
         ↑ Required
                    ↑ Required (your existing implementation)
```

---

## AI Template Details

The template generates **unique content** for each page using:

### Variables
- `{{city}}` - City name
- `{{state}}` - State name
- `{{state_code}}` - State abbreviation
- `{{avg_savings}}` - Localized savings amount
- `{{city_avg}}` - City average premium
- `{{local_factors}}` - City-specific risk factors

### Uniqueness Strategy
1. **Variable insertion** - Location names throughout
2. **Synonym rotation** - "cheap/affordable/low-cost/budget-friendly"
3. **Structure variation** - Different opening hooks
4. **Local details** - Traffic, weather, crime stats per city
5. **Dollar amounts** - Adjusted to local cost of living

---

## Files Created

```
.claude/
├── prompts/
│   └── auto-insurance-ai-templates.md    # Template reference
├── AUTO_INSURANCE_SETUP_GUIDE.md         # This guide

packages/db/prisma/
└── seed-auto-insurance-templates.ts      # Template seeder

scripts/
├── setup-auto-insurance-pages.ts         # Setup script
└── generate-auto-content.ts              # Content generator
```

---

## Commands Reference

### Setup
```bash
# Full setup (template + pages)
npx ts-node scripts/setup-auto-insurance-pages.ts

# Setup for one state only
npx ts-node scripts/setup-auto-insurance-pages.ts --state=CA

# Dry run (see what would be created)
npx ts-node scripts/setup-auto-insurance-pages.ts --dry-run
```

### Content Generation
```bash
# Generate all content
npx ts-node scripts/generate-auto-content.ts

# Generate for one state
npx ts-node scripts/generate-auto-content.ts --state=TX

# Generate only 100 pages (test)
npx ts-node scripts/generate-auto-content.ts --limit=100

# Faster generation (less reliable)
npx ts-node scripts/generate-auto-content.ts --no-per-section
```

### Monitoring
```bash
# Check progress
psql -d myinsurancebuddy -c "SELECT COUNT(*) as total, SUM(CASE WHEN \"isAiGenerated\" THEN 1 ELSE 0 END) as done FROM \"Page\" WHERE slug LIKE '/car-insurance/%';"

# View sample content
psql -d myinsurancebuddy -c "SELECT slug, \"aiGeneratedContent\"->>'intro' FROM \"Page\" WHERE \"isAiGenerated\" LIMIT 1;"
```

---

## Troubleshooting

### "Template not found"
```bash
# Re-seed template
npx ts-node packages/db/prisma/seed-auto-insurance-templates.ts
```

### "No AI providers configured"
1. Go to Admin → AI Providers
2. Add OpenRouter API key
3. Use model: `deepseek/deepseek-r1:free`

### Rate limit errors
```bash
# Slow down generation
npx ts-node scripts/generate-auto-content.ts --delay=5000 --batch=10
```

### Content not showing on pages
```bash
# Clear Next.js cache
rm -rf apps/web/.next
pnpm dev  # or restart production server
```

---

## SEO Strategy

### Target Keywords
- Primary: `cheapest car insurance {city}`
- Secondary: `cheap auto insurance {state}`, `affordable car insurance {city} {state}`
- Long-tail: `best car insurance rates {city}`, `car insurance quotes {city}`

### On-Page SEO
- ✅ Unique title for each page
- ✅ Unique meta description
- ✅ H1: "Cheapest Car Insurance in {City}, {State}"
- ✅ Local keywords in content
- ✅ FAQ schema for rich snippets
- ✅ Fast loading (ISR)

### Link Structure
```
/car-insurance/                     (state list)
/car-insurance/ca/                  (CA cities)
/car-insurance/ca/los-angeles       (city page - with content)
```

---

## Expected Results

### Traffic Estimates
| Pages | Monthly Traffic | Leads/Month |
|-------|-----------------|-------------|
| 100   | 500-1,000       | 10-25       |
| 1,000 | 5,000-10,000    | 100-250     |
| 10,000| 50,000-100,000  | 1,000-2,500 |

### Conversion Funnel
```
100 visitors → 20 click CTA → 10 enter mobile → 3 qualified leads
(3% visitor-to-lead conversion)
```

---

## Next Steps After Setup

1. **Monitor rankings** - Check Google Search Console
2. **A/B test CTAs** - Test different lead form placements
3. **Add more cities** - Expand to smaller towns
4. **Other insurance types** - Home, health, life (use same system)
5. **Retargeting** - Facebook/Google ads to visitors who didn't convert

---

## Support

**Admin Dashboard:**
- AI Content: `/dashboard/ai-content`
- AI Providers: `/dashboard/ai-providers`
- Pages: `/dashboard/pages`
- Leads: `/dashboard/leads`

**Documentation:**
- Templates: `.claude/prompts/auto-insurance-ai-templates.md`
- Setup: `.claude/AUTO_INSURANCE_SETUP_GUIDE.md` (this file)

---

**Ready to start? Run:**
```bash
npx ts-node scripts/setup-auto-insurance-pages.ts
```
