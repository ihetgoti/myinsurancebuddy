# Per-Section AI Content Generation API

This document explains how to use the per-section content generation feature, which makes **one API request per section** instead of one request for all sections.

## Overview

The per-section mode provides:
- **Better error handling**: One section failing doesn't affect others
- **Higher quality content**: More focused prompts per section
- **Easier debugging**: See exactly which sections succeed/fail
- **Granular retries**: Regenerate only failed sections

**Trade-off**: Uses more API calls (e.g., 5 sections = 5 API calls per page)

## API Endpoint

### POST `/api/ai-generate`

Generate AI content for pages with per-section mode.

#### Request Body

```json
{
  "filters": {
    "insuranceTypeId": "uuid-of-insurance-type",
    "stateId": "uuid-of-state",
    "geoLevel": "CITY"
  },
  "sections": ["intro", "requirements", "faqs", "tips", "costBreakdown"],
  "model": "deepseek/deepseek-r1:free",
  "perSection": true,
  "batchSize": 5,
  "delayBetweenBatches": 1000,
  "regenerate": false,
  "includeDrafts": false
}
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `filters` | object | - | Filter which pages to generate content for |
| `sections` | string[] | `["intro", "requirements", "faqs", "tips"]` | Sections to generate |
| `model` | string | `"deepseek/deepseek-r1:free"` | AI model to use |
| `perSection` | boolean | `false` | **Enable per-section mode** |
| `batchSize` | number | `10` | Pages per batch |
| `delayBetweenBatches` | number | `1000` | Delay between batches (ms) |
| `regenerate` | boolean | `false` | Regenerate existing AI content |
| `includeDrafts` | boolean | `false` | Include unpublished pages |
| `templateId` | string | - | Custom prompt template ID |

#### Available Sections

- `intro` - Introduction paragraph
- `requirements` - Coverage requirements
- `faqs` - Frequently asked questions
- `tips` - Money-saving tips
- `costBreakdown` - Cost analysis
- `comparison` - Provider comparison
- `discounts` - Available discounts
- `localStats` - Local statistics
- `coverageGuide` - Coverage guide
- `claimsProcess` - Claims process steps
- `buyersGuide` - Buyer's guide
- `metaTags` - SEO meta tags

#### Response

```json
{
  "success": true,
  "jobId": "uuid-of-job",
  "totalPages": 100,
  "totalSections": 5,
  "perSectionMode": true,
  "estimatedApiCalls": 500,
  "message": "Started AI generation for 100 pages with 5 sections each (500 total API calls)"
}
```

## Usage Examples

### Example 1: Generate Content for All Pages (Per-Section Mode)

```bash
curl -X POST https://your-domain.com/api/ai-generate \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "filters": {
      "insuranceTypeId": "123e4567-e89b-12d3-a456-426614174000"
    },
    "sections": ["intro", "faqs", "tips"],
    "perSection": true,
    "batchSize": 3,
    "delayBetweenBatches": 2000
  }'
```

### Example 2: Generate Only Meta Tags for State Pages

```bash
curl -X POST https://your-domain.com/api/ai-generate \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "filters": {
      "geoLevel": "STATE"
    },
    "sections": ["metaTags"],
    "perSection": true
  }'
```

### Example 3: Regenerate Failed Sections Only

```bash
curl -X POST https://your-domain.com/api/ai-generate \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "filters": {
      "insuranceTypeId": "123e4567-e89b-12d3-a456-426614174000"
    },
    "sections": ["costBreakdown", "comparison"],
    "perSection": true,
    "regenerate": true
  }'
```

## Checking Job Status

### GET `/api/ai-generate?jobId={jobId}`

```bash
curl https://your-domain.com/api/ai-generate?jobId=your-job-id \
  -H "Cookie: your-session-cookie"
```

Response includes section-level results when using per-section mode.

## Rate Limit Considerations

When using `perSection: true`:

| Scenario | API Calls | Recommended Delay |
|----------|-----------|-------------------|
| 1 page × 5 sections | 5 | 500ms between sections |
| 10 pages × 5 sections | 50 | 2s between batches |
| 100 pages × 5 sections | 500 | 5s between batches |

**Tips to avoid rate limits:**
1. Use smaller `batchSize` (3-5) in per-section mode
2. Increase `delayBetweenBatches` (2000-5000ms)
3. Use free models (`:free` suffix)
4. Enable multiple AI providers for failover

## How It Works

### Normal Mode (perSection: false)
```
Page 1 → [intro, faqs, tips] → 1 API call
Page 2 → [intro, faqs, tips] → 1 API call
Page 3 → [intro, faqs, tips] → 1 API call
Total: 3 API calls
```

### Per-Section Mode (perSection: true)
```
Page 1 → intro → 1 API call
Page 1 → faqs → 1 API call
Page 1 → tips → 1 API call
Page 2 → intro → 1 API call
Page 2 → faqs → 1 API call
...
Total: 9 API calls (3 pages × 3 sections)
```

## Error Handling

In per-section mode, if one section fails, others may still succeed:

```json
{
  "success": true,
  "content": {
    "intro": "Generated successfully...",
    "faqs": [{"question": "...", "answer": "..."}],
    // "tips" missing - failed to generate
  },
  "sectionResults": {
    "intro": { "success": true },
    "faqs": { "success": true },
    "tips": { "success": false, "error": "Rate limit exceeded" }
  }
}
```

## Database Schema

The `AIGenerationJob` model stores per-section mode in filters:

```prisma
model AIGenerationJob {
  id          String    @id @default(uuid())
  pageIds     String[]
  sections    String[]
  filters     Json?     // Contains perSection flag
  status      JobStatus @default(PENDING)
  // ...
}
```

## Comparison: Normal vs Per-Section Mode

| Aspect | Normal Mode | Per-Section Mode |
|--------|-------------|------------------|
| API calls | 1 per page | 1 per section per page |
| Quality | Good | Better (focused prompts) |
| Error handling | All-or-nothing | Granular |
| Retry capability | Full page only | Per section |
| Speed | Faster | Slower (more calls) |
| Rate limit risk | Lower | Higher |
| Best for | Bulk generation | High-quality content |

## Recommended Usage

1. **Use Normal Mode when:**
   - Generating content for many pages quickly
   - Rate limits are a concern
   - Content quality requirements are standard

2. **Use Per-Section Mode when:**
   - Maximum content quality is needed
   - Debugging generation issues
   - Regenerating specific sections
   - Working with premium models (not free)

## JavaScript/TypeScript Example

```typescript
// Start per-section generation
const response = await fetch('/api/ai-generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filters: { insuranceTypeId: 'abc-123' },
    sections: ['intro', 'faqs', 'tips', 'costBreakdown'],
    perSection: true,
    batchSize: 5,
    delayBetweenBatches: 3000,
    model: 'deepseek/deepseek-r1:free'
  })
});

const data = await response.json();
console.log(`Job started: ${data.jobId}`);
console.log(`Estimated API calls: ${data.estimatedApiCalls}`);

// Poll for status
const checkStatus = async (jobId: string) => {
  const res = await fetch(`/api/ai-generate?jobId=${jobId}`);
  const status = await res.json();
  console.log(`Progress: ${status.job.processedPages}/${status.job.totalPages}`);
  return status.job.status;
};

// Poll every 5 seconds
const interval = setInterval(async () => {
  const status = await checkStatus(data.jobId);
  if (status === 'COMPLETED' || status === 'FAILED') {
    clearInterval(interval);
  }
}, 5000);
```
