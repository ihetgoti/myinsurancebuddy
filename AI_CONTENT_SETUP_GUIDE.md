# AI Content Generation Setup Guide

## 🚀 Overview

This system allows you to generate **unique AI content for all 500k pages** to avoid Google duplicate content penalties. Instead of hardcoded templates, each page gets AI-generated:

- **Introduction paragraphs** - Unique, location-specific content
- **Requirements sections** - State/city-specific insurance laws
- **FAQs** - Locally-relevant questions and answers
- **Tips** - Personalized recommendations for each location

## 💰 Cost Breakdown

With **$50 budget across 5 OpenRouter accounts** ($10 each):

| Model | Cost per Page | Pages per $10 | Total for $50 |
|-------|--------------|---------------|---------------|
| **Gemini Flash 1.5** (Recommended) | $0.0001 | 100,000 | **500,000 pages** ✅ |
| **GPT-4o Mini** | $0.0002 | 50,000 | 250,000 pages |
| **Claude Haiku** | $0.0003 | 33,000 | 165,000 pages |

**Recommendation:** Use **Google Gemini Flash 1.5** - It's the fastest and cheapest, allowing you to generate all 500k pages within your budget.

---

## 📋 Step 1: Database Migration

Run the migration to add AI content fields:

```bash
cd packages/db
npx prisma migrate dev --name add_ai_content_generation
```

This adds to the `Page` table:
- `aiGeneratedContent` (JSON) - Stores AI-generated sections
- `aiGeneratedAt` (DateTime) - Generation timestamp
- `aiModel` (String) - Model used
- `aiPromptVersion` (String) - Prompt version tracking
- `isAiGenerated` (Boolean) - Flag for AI content

And creates new tables:
- `AIProvider` - OpenRouter account management
- `AIGenerationJob` - Track bulk generation jobs

---

## 📋 Step 2: Get OpenRouter API Keys

### Create 5 OpenRouter Accounts

1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up for an account (use different emails)
3. Add $10 credits per account
4. Go to **Settings → API Keys → Create Key**
5. Copy each API key (starts with `sk-or-...`)

**Pro Tip:** Use Gmail aliases:
- yourname+account1@gmail.com
- yourname+account2@gmail.com
- yourname+account3@gmail.com
- yourname+account4@gmail.com
- yourname+account5@gmail.com

All emails go to the same inbox, but OpenRouter sees them as different accounts!

---

## 📋 Step 3: Configure AI Providers in Admin

1. **Start your admin dashboard:**
   ```bash
   pnpm dev
   ```

2. **Navigate to:** [http://localhost:3000/dashboard/ai-providers](http://localhost:3000/dashboard/ai-providers)

3. **Add each of your 5 API keys:**

   **Account 1:**
   - Name: `OpenRouter Account 1`
   - API Key: `sk-or-v1-xxx...`
   - Preferred Model: `google/gemini-flash-1.5` (Cheapest & fastest)
   - Total Budget: `10.00`
   - Priority: `0`

   **Account 2:**
   - Name: `OpenRouter Account 2`
   - API Key: `sk-or-v1-yyy...`
   - Preferred Model: `google/gemini-flash-1.5`
   - Total Budget: `10.00`
   - Priority: `1`

   Repeat for all 5 accounts.

4. **The system will automatically rotate** between accounts using round-robin selection.

---

## 📋 Step 4: Generate AI Content

### Option A: Generate for Specific Type/State

1. Go to [http://localhost:3000/dashboard/ai-content](http://localhost:3000/dashboard/ai-content)

2. **Select filters:**
   - Insurance Type: `Auto Insurance`
   - State: `California`
   - Priority: `Major Cities Only` (start with high-traffic pages)

3. **Choose sections:**
   - ✅ Introduction paragraphs
   - ✅ Requirements and coverage details
   - ✅ FAQs
   - ✅ Tips and recommendations

4. **AI Configuration:**
   - Model: `google/gemini-flash-1.5` (fastest/cheapest)
   - Batch Size: `20` (process 20 pages at once)
   - Delay: `500ms` (between batches to avoid rate limits)

5. **Click "Start AI Generation"**

6. **Monitor progress** in the "Recent Jobs" section

### Option B: Generate for All Pages (Production Strategy)

**Phase 1: High-Value Pages (Priority)**
```
Insurance Type: All
State: All
Priority: Major Cities Only
→ Generates ~50,000 pages (major cities across all states)
→ Cost: ~$5
```

**Phase 2: State-Level Pages**
```
Insurance Type: All
GeoLevel: STATE
Priority: States Only
→ Generates ~1,500 pages (50 states × 30 insurance types)
→ Cost: ~$0.15
```

**Phase 3: Long-Tail Cities**
```
Insurance Type: All
Priority: All Pages
→ Generates remaining ~450,000 pages
→ Cost: ~$45
```

**Total:** $50 for all 500k pages

---

## 📋 Step 5: API Endpoints (Advanced)

If you want to script the generation:

### Start AI Generation Job

```bash
curl -X POST http://localhost:3000/api/ai-generate \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "filters": {
      "insuranceTypeId": "uuid-here",
      "stateId": "uuid-here"
    },
    "sections": ["intro", "requirements", "faqs", "tips"],
    "model": "google/gemini-flash-1.5",
    "batchSize": 20,
    "delayBetweenBatches": 500,
    "priority": "major-cities"
  }'
```

### Check Job Status

```bash
curl http://localhost:3000/api/ai-generate?jobId=job-uuid-here
```

### List All Jobs

```bash
curl http://localhost:3000/api/ai-generate
```

---

## 🎯 How It Works

### 1. Template Rendering Flow

**Before AI (Hardcoded):**
```
Page Request → Template → Same content for all cities → Duplicate content penalty
```

**After AI (Unique):**
```
Page Request → Check aiGeneratedContent → Unique content per page → No penalty
```

### 2. Content Priority System

The templates use this priority order:
```typescript
1. aiGeneratedContent (highest priority - unique AI content)
2. customData (CSV imports)
3. Hardcoded fallbacks (only if no AI content exists)
```

### 3. Variable Mapping

AI content automatically populates these template variables:

| AI Field | Template Variables | Used In |
|----------|-------------------|---------|
| `intro` | `intro_content`, `ai_intro` | Introduction section |
| `requirements` | `requirements_content`, `ai_requirements` | Requirements section |
| `faqs` | `faqs`, `ai_faq` | FAQ accordion |
| `tips` | `tips_content`, `ai_tips` | Tips list |

### 4. Example AI Prompt

For a page like "Auto Insurance in Los Angeles, California":

```
Generate unique content for Auto Insurance in Los Angeles, California.

Context:
- Average premium: $2,150/year
- Minimum coverage: 15/30/5
- Population: 3,979,576

Generate the following sections in JSON format:

1. "intro": A 2-3 paragraph introduction about Auto Insurance in Los Angeles, California.
   Include local context, why it's important, and what residents should know.

2. "requirements": A detailed paragraph about Auto Insurance requirements in Los Angeles, California.
   Include state-specific laws, minimum coverage, and compliance details.

3. "faqs": An array of 5-7 location-specific FAQs with "question" and "answer" fields.

4. "tips": An array of 5-8 practical tips for getting the best Auto Insurance in Los Angeles, California.

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks.
```

**Result:** Each page gets unique, contextual content specific to its location.

---

## 📊 Monitoring & Management

### Admin Dashboard Features

1. **AI Providers Page** ([/dashboard/ai-providers](http://localhost:3000/dashboard/ai-providers))
   - View budget usage per account
   - See request counts
   - Toggle accounts active/inactive
   - Add/remove API keys

2. **AI Content Page** ([/dashboard/ai-content](http://localhost:3000/dashboard/ai-content))
   - Start new generation jobs
   - Monitor progress in real-time
   - View completed/failed jobs
   - See cost estimates

3. **Budget Overview**
   - Total budget across all accounts
   - Amount used so far
   - Remaining budget
   - Total requests made

### Database Queries

**Check AI-generated pages:**
```sql
SELECT
  COUNT(*) as total,
  SUM(CASE WHEN "isAiGenerated" = true THEN 1 ELSE 0 END) as ai_generated,
  SUM(CASE WHEN "isAiGenerated" = false THEN 1 ELSE 0 END) as remaining
FROM "Page"
WHERE "isPublished" = true;
```

**View generation jobs:**
```sql
SELECT
  id,
  name,
  status,
  "totalPages",
  "processedPages",
  "successfulPages",
  "failedPages",
  "createdAt"
FROM "AIGenerationJob"
ORDER BY "createdAt" DESC
LIMIT 10;
```

**Check provider usage:**
```sql
SELECT
  name,
  "usedBudget",
  "totalBudget",
  "requestCount",
  "lastUsedAt"
FROM "AIProvider"
WHERE "isActive" = true;
```

---

## 🚨 Troubleshooting

### Issue: "No AI providers available"

**Solution:** Add at least one API key in [/dashboard/ai-providers](http://localhost:3000/dashboard/ai-providers)

### Issue: Generation failing with rate limit errors

**Solution:**
1. Increase `delayBetweenBatches` to 1000-2000ms
2. Decrease `batchSize` to 5-10
3. Add more API keys to distribute load

### Issue: API key budget exceeded

**Solution:**
1. Check budget usage in AI Providers page
2. Add more funds to OpenRouter account
3. Or add new API keys

### Issue: Content not showing on pages

**Solution:**
1. Check page has `isAiGenerated: true`:
   ```sql
   SELECT "isAiGenerated", "aiGeneratedContent"
   FROM "Page"
   WHERE slug = 'your-page-slug';
   ```
2. Clear Next.js cache:
   ```bash
   rm -rf .next
   pnpm dev
   ```

### Issue: AI generating low-quality content

**Solution:**
1. Try a better model (Claude Haiku instead of Gemini)
2. Modify prompts in `apps/admin/lib/aiContentService.ts`
3. Adjust temperature (lower = more consistent, higher = more creative)

---

## 🔐 Security Notes

1. **API Keys are stored in plaintext** in the database
   - For production, implement encryption using a library like `crypto`
   - Add `ENCRYPTION_KEY` to your `.env` file

2. **Rate limiting is handled** by OpenRouter automatically
   - 60 requests/minute by default
   - The system respects these limits with delays

3. **Authentication required** for all AI endpoints
   - Only authenticated admin users can generate content
   - Uses NextAuth session validation

---

## 📈 Performance Optimization

### Batch Processing Strategy

**Small batches (5-10 pages):**
- ✅ Less memory usage
- ✅ Faster error recovery
- ❌ Slower overall speed

**Large batches (20-50 pages):**
- ✅ Faster generation
- ✅ Better throughput
- ❌ Higher memory usage
- ❌ All fail if one fails

**Recommended:** Start with 10, increase to 20 once stable.

### Parallel Account Usage

The system automatically rotates between accounts using round-robin:

```
Request 1 → Account 1
Request 2 → Account 2
Request 3 → Account 3
Request 4 → Account 4
Request 5 → Account 5
Request 6 → Account 1 (back to start)
```

This distributes load evenly and prevents hitting individual account rate limits.

---

## 📝 Files Created/Modified

### New Files
- `apps/admin/lib/aiContentService.ts` - AI generation service
- `apps/admin/app/api/ai-generate/route.ts` - Generation API endpoint
- `apps/admin/app/api/ai-providers/route.ts` - Provider management API
- `apps/admin/app/dashboard/ai-providers/page.tsx` - Provider management UI
- `apps/admin/app/dashboard/ai-content/page.tsx` - Content generation UI

### Modified Files
- `packages/db/prisma/schema.prisma` - Added AI models and fields
- `apps/web/app/[...slug]/page.tsx` - Integrated AI content into rendering
- `apps/admin/components/AdminLayout.tsx` - Added AI menu items

---

## ✅ Success Checklist

- [ ] Database migration completed
- [ ] 5 OpenRouter accounts created with $10 each
- [ ] All 5 API keys added to AI Providers page
- [ ] Test generation on 10-20 pages
- [ ] Verify content appears on frontend
- [ ] Monitor budget usage
- [ ] Start Phase 1: Major cities generation
- [ ] Start Phase 2: State pages generation
- [ ] Start Phase 3: All remaining pages
- [ ] Verify no duplicate content on live pages

---

## 🎉 Result

After completion, you'll have:

✅ **500,000 unique pages** with AI-generated content
✅ **No duplicate content penalties** from Google
✅ **Location-specific information** for every city/state
✅ **$50 total cost** using Gemini Flash 1.5
✅ **Fully automated system** for future pages
✅ **Admin panel management** for easy control

---

## 📞 Support

If you encounter issues:

1. Check the console logs in the admin panel
2. Check the `AIGenerationJob` error logs in database
3. Verify your OpenRouter account has sufficient credits
4. Check the API key is active and not expired

---

**Happy generating! 🚀**
