# SEO & AI Features Enhancement Guide

## Overview

Two major features have been enhanced/added:

1. **Sitemap Auto-Submission** - Automated submission to Google & Bing
2. **AI Content Ranking** - LLM-powered content quality scoring

---

## 1. 🗺️ Sitemap Auto-Submission

### What Changed

| Feature | Before | After |
|---------|--------|-------|
| Submission | Manual only | Auto + Manual |
| Search Engines | Google only | Google + Bing |
| Scheduling | None | Hourly, Daily, Weekly |
| Retry Logic | None | Built-in error handling |

### API Endpoints

```
POST /api/seo/sitemaps/ping          # Manual submission (existing)
POST /api/seo/sitemaps/auto-submit   # Configure auto-submit
GET  /api/seo/sitemaps/auto-submit   # Check status / trigger if due
```

### Configuration

```typescript
// Enable auto-submit
POST /api/seo/sitemaps/auto-submit
{
  "enabled": true,
  "schedule": "daily",  // hourly, daily, weekly
  "searchEngines": ["google", "bing"]
}
```

### Database Schema Changes

```prisma
model SiteSettings {
  autoSitemapSubmit     Boolean  @default(false)
  sitemapSubmitSchedule String   @default("daily")
  sitemapSearchEngines  Json?    @default("[\"google\", \"bing\"]")
  lastSitemapSubmit     DateTime?
}
```

### How It Works

1. **Manual Submission**: Click "Ping Google Now" in SEO Dashboard
2. **Auto-Submission**: 
   - System checks if submission is due based on schedule
   - Submits all sitemaps to configured search engines
   - Updates `lastSitemapSubmit` timestamp

### Setup Cron Job (for auto-submit)

Add to your server crontab:

```bash
# Check and submit sitemap every hour
0 * * * * curl -s http://localhost:3002/api/seo/sitemaps/auto-submit > /dev/null
```

---

## 2. 🤖 AI Content Ranking (LLM-as-Judge)

### What It Does

Uses AI to evaluate content quality across 5 dimensions:

| Dimension | Description | Weight |
|-----------|-------------|--------|
| **Readability** | Clear sentences, appropriate for audience | 20% |
| **SEO Optimization** | Keywords, headings, structure | 20% |
| **Comprehensiveness** | Topic coverage, depth of information | 20% |
| **User Value** | Helpful for decision making | 20% |
| **Originality** | Unique insights, not generic | 20% |

### Scoring Scale

| Score | Rating | Action |
|-------|--------|--------|
| 90-100 | Exceptional | Showcase as best practice |
| 80-89 | High Quality | Minor tweaks optional |
| 70-79 | Good | Review suggestions |
| 60-69 | Average | Needs improvement |
| 0-59 | Below Average | Major revision needed |

### API Endpoints

```
POST /api/ai/rank                    # Rank pages or score specific page
GET  /api/ai/rank                    # Get top/bottom rankings
GET  /api/ai/rank?type=improvements  # Get improvement queue
GET  /api/ai/rank?type=compare&pageA=x&pageB=y  # Compare two pages
```

### Usage Examples

**Score a single page:**
```bash
POST /api/ai/rank
{
  "scoreSpecificPage": "page-uuid"
}
```

**Batch rank pages:**
```bash
POST /api/ai/rank
{
  "insuranceTypeId": "optional-filter",
  "stateId": "optional-filter",
  "limit": 50
}
```

**Get improvement queue:**
```bash
GET /api/ai/rank?type=improvements&minScore=70
```

**Compare two pages:**
```bash
GET /api/ai/rank?type=compare&pageA=id1&pageB=id2
```

### Database Schema Changes

```prisma
model Page {
  contentScores   Json?         // AI-generated scores
  lastScoredAt    DateTime?     // When last evaluated
}
```

### UI Dashboard

Navigate to: **AI Content → AI Ranking**

Features:
- 📊 **Top Rankings**: See highest-scoring content
- 🎯 **Improvement Queue**: Prioritized list of pages needing work
- 🔄 **Rescore**: Update scores after making improvements
- 📈 **Stats**: Average scores, total ranked

### Response Format

```json
{
  "success": true,
  "rankings": [
    {
      "pageId": "uuid",
      "slug": "car-insurance/california",
      "rank": 1,
      "percentile": 98,
      "scores": {
        "overall": 87,
        "readability": 90,
        "seoOptimization": 85,
        "comprehensiveness": 88,
        "userValue": 89,
        "originality": 82,
        "strengths": ["Clear explanations", "Good structure"],
        "weaknesses": ["Could use more examples"],
        "suggestions": ["Add FAQ section", "Include specific rates"]
      },
      "aiAnalysis": "High-quality content with minor improvements possible. Strongest in readability (90/100). Needs work on originality (82/100)."
    }
  ]
}
```

---

## Migration Applied

```
packages/db/prisma/migrations/20260131153106_add_content_ranking_and_auto_submit
```

Changes:
- Added `contentScores`, `lastScoredAt` to `Page` model
- Added auto-submit fields to `SiteSettings` model

---

## Cost Considerations

### AI Content Ranking

Uses OpenRouter API (configurable model):

| Model | Cost per 1K pages | Speed | Quality |
|-------|------------------|-------|---------|
| `anthropic/claude-haiku` | ~$0.50 | Fast | Good |
| `deepseek/deepseek-r1:free` | Free | Medium | Good |
| `gpt-4o-mini` | ~$0.30 | Fast | Excellent |

**Recommendation**: Use free DeepSeek model for batch ranking, Claude for important pages.

### Sitemap Submission

- **Google/Bing ping endpoints**: FREE
- No API keys required
- No usage limits

---

## Best Practices

### Sitemap Auto-Submission

1. **Schedule**: Use `daily` for active sites, `weekly` for static sites
2. **Timing**: Schedule during low-traffic hours
3. **Monitor**: Check logs for failed submissions
4. **Don't over-submit**: More than daily can be seen as spam

### AI Content Ranking

1. **Initial Ranking**: Score all pages once to establish baseline
2. **Reschedule**: Rescore after major content updates
3. **Focus on improvements**: Prioritize high-traffic, low-score pages
4. **Track progress**: Compare scores over time
5. **Use suggestions**: AI suggestions are actionable

---

## Troubleshooting

### Sitemap submission failing

```bash
# Test manually
curl "https://www.google.com/ping?sitemap=https://yoursite.com/sitemap-index.xml"

# Check response (should be 200 OK)
```

### AI Ranking not working

1. Check `OPENROUTER_API_KEY` is set
2. Verify model name is correct
3. Check API rate limits
4. Review logs for specific errors

---

## Future Enhancements

- [ ] Automatic rescheduling based on content changes
- [ ] Email notifications for low-scoring pages
- [ ] Competitor content comparison
- [ ] Content improvement suggestions with AI rewrite
- [ ] Historical score tracking
- [ ] A/B test content variants
