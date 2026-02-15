# Advanced AI Content Generation Features

This document covers the advanced features for AI content generation including NVIDIA API support, per-section generation, parallel jobs, niche-specific templates, and deduplication.

## Table of Contents

1. [NVIDIA API Support](#nvidia-api-support)
2. [Per-Section Generation](#per-section-generation)
3. [Parallel Job Processing](#parallel-job-processing)
4. [Niche-Specific Prompt Templates](#niche-specific-prompt-templates)
5. [Content Deduplication](#content-deduplication)
6. [Example Formats in Prompts](#example-formats-in-prompts)
7. [API Reference](#api-reference)

---

## NVIDIA API Support

### Setting up NVIDIA API

1. Add NVIDIA provider in Admin Dashboard:
   - **Provider Type**: `nvidia`
   - **API Key**: Your `nvapi-...` key
   - **Endpoint**: `https://integrate.api.nvidia.com/v1/chat/completions`
   - **Model**: `nvidia/llama-3.1-nemotron-70b-reward`

### API Usage with NVIDIA

```bash
POST /api/ai-generate
{
  "filters": { "insuranceTypeId": "..." },
  "sections": ["intro", "faqs", "tips"],
  "providerId": "your-nvidia-provider-id",
  "model": "nvidia/llama-3.1-nemotron-70b-reward",
  "perSection": true
}
```

### Provider Configuration

| Field | NVIDIA Value | Description |
|-------|-------------|-------------|
| provider | `nvidia` | Provider type identifier |
| apiEndpoint | `https://integrate.api.nvidia.com/v1/chat/completions` | NVIDIA API endpoint |
| apiKey | `nvapi-...` | Your NVIDIA API key |
| preferredModel | `nvidia/llama-3.1-nemotron-70b-reward` | Default model |

---

## Per-Section Generation

Generate each section with a separate API request for better quality and error handling.

### Enable Per-Section Mode

```bash
POST /api/ai-generate
{
  "filters": { "insuranceTypeId": "..." },
  "sections": ["intro", "faqs", "tips", "costBreakdown"],
  "perSection": true,
  "batchSize": 3,
  "delayBetweenBatches": 2000
}
```

### Benefits

- **Better Quality**: Focused prompts per section
- **Error Isolation**: One section failing doesn't affect others
- **Granular Retries**: Regenerate only failed sections
- **Higher Success Rate**: Smaller, more focused requests

### Cost Considerations

| Mode | API Calls for 100 pages × 5 sections |
|------|--------------------------------------|
| Normal | 100 calls |
| Per-Section | 500 calls |

---

## Parallel Job Processing

Run multiple content generation jobs simultaneously for different niches.

### Creating a Job Group

```bash
POST /api/ai-generate/groups
{
  "name": "Auto + Home Insurance Batch",
  "description": "Generating content for auto and home insurance simultaneously",
  "jobs": [
    {
      "name": "Auto Insurance - All States",
      "filters": { 
        "insuranceTypeId": "auto-insurance-id",
        "geoLevel": "STATE"
      },
      "sections": ["intro", "faqs", "tips"],
      "providerId": "nvidia-provider-id",
      "model": "nvidia/llama-3.1-nemotron-70b-reward",
      "perSection": true,
      "batchSize": 5,
      "templateId": "auto-template-id"
    },
    {
      "name": "Home Insurance - All States",
      "filters": { 
        "insuranceTypeId": "home-insurance-id", 
        "geoLevel": "STATE"
      },
      "sections": ["intro", "faqs", "tips"],
      "providerId": "openrouter-provider-id",
      "model": "deepseek/deepseek-r1:free",
      "batchSize": 10
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "group": {
    "id": "group-uuid",
    "name": "Auto + Home Insurance Batch",
    "totalJobs": 2
  },
  "jobs": [
    { "id": "job-1-uuid", "name": "Auto Insurance - All States", ... },
    { "id": "job-2-uuid", "name": "Home Insurance - All States", ... }
  ]
}
```

### Job Group Status

```bash
GET /api/ai-generate/groups
```

Returns all job groups with their individual jobs and statuses.

---

## Niche-Specific Prompt Templates

### Seeding Default Templates

Run the seed script to create templates for all niches:

```bash
cd packages/db
npx ts-node prisma/seed-prompt-templates.ts
```

This creates templates that:
- Look like they were manually created (editable)
- Are organized by category (auto-insurance, home-insurance, etc.)
- Include example formats for consistent output
- Are set as defaults for their respective niches

### Template Structure

```typescript
{
  name: "Auto Insurance - Standard",
  category: "auto-insurance",
  insuranceTypeId: "...", // Linked to insurance type
  
  // Prompts for each section
  systemPrompt: "...",
  introPrompt: "...",
  faqsPrompt: "...",
  tipsPrompt: "...",
  
  // Example formats for consistent output
  exampleIntroFormat: "...",
  exampleFaqsFormat: [...],
  exampleTipsFormat: [...],
  
  // AI settings
  model: "deepseek/deepseek-r1:free",
  temperature: 0.7,
  maxTokens: 4000,
  
  // Deduplication
  dedupEnabled: true,
  dedupStrategy: "semantic"
}
```

### Editing Templates

Templates can be edited in:
**Admin Dashboard → AI Templates → [Template Name]**

Changes are tracked in `editHistory` with timestamps.

---

## Content Deduplication

Prevent duplicate content across pages using deduplication keys.

### How It Works

1. Each job gets a `dedupKey` (e.g., `auto-insurance-states-2024`)
2. AI is instructed to create unique content for each location
3. System tracks content hashes to detect similarity

### Setting Deduplication

```bash
POST /api/ai-generate
{
  "filters": { 
    "insuranceTypeId": "...",
    "geoLevel": "STATE"
  },
  "sections": ["intro", "faqs"],
  "dedupKey": "auto-insurance-states-batch-1",
  "perSection": true
}
```

### Deduplication Strategies

| Strategy | Description | Use Case |
|----------|-------------|----------|
| `exact` | Exact text matching | Strict uniqueness |
| `semantic` | Meaning-based similarity | Allow rephrasing |
| `none` | No deduplication | Maximum flexibility |

### Template-Level Deduplication

Set in prompt template:
```json
{
  "dedupEnabled": true,
  "dedupStrategy": "semantic",
  "minUniquenessScore": 80.0
}
```

---

## Example Formats in Prompts

Include example formats in prompts to get consistent, high-quality output.

### How It Works

When `exampleFormats` are provided in the template, they're included in the prompt:

```
EXAMPLE FORMAT for INTRO:
[Example text here]

Follow the above format structure but create COMPLETELY ORIGINAL content. 
Do not copy the example text.
```

### Setting Example Formats

In your prompt template:

```typescript
{
  exampleIntroFormat: `Looking for the cheapest auto insurance in Los Angeles? 
You're not alone. California drivers pay an average of $1,800/year...`,
  
  exampleFaqsFormat: [
    {
      question: "How do I find the cheapest auto insurance?",
      answer: "Start by comparing quotes from at least 3-5 providers..."
    }
  ],
  
  exampleTipsFormat: [
    "Compare quotes every 6 months - Rates change frequently...",
    "Bundle policies for 10-25% off - Combine auto with home..."
  ]
}
```

### Benefits

- **Consistent Structure**: Same format across all pages
- **Quality Benchmark**: AI knows the expected quality level
- **Style Guide**: Maintains brand voice
- **Training Effect**: Better results with examples

---

## API Reference

### POST /api/ai-generate

Generate AI content for pages.

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| filters | object | Yes | Filter criteria for pages |
| filters.insuranceTypeId | string | No | Insurance type UUID |
| filters.stateId | string | No | State UUID |
| filters.geoLevel | string | No | NICHE, STATE, CITY |
| sections | string[] | Yes | Sections to generate |
| model | string | No | AI model to use |
| providerId | string | No | Specific provider UUID |
| templateId | string | No | Prompt template UUID |
| perSection | boolean | No | One API call per section |
| batchSize | number | No | Pages per batch (default: 10) |
| delayBetweenBatches | number | No | Delay in ms (default: 1000) |
| regenerate | boolean | No | Regenerate existing content |
| includeDrafts | boolean | No | Include unpublished pages |
| jobGroupId | string | No | Add to job group |
| jobName | string | No | Custom job name |
| dedupKey | string | No | Deduplication key |

#### Example Request

```bash
curl -X POST https://your-domain.com/api/ai-generate \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "filters": {
      "insuranceTypeId": "123e4567-e89b-12d3-a456-426614174000",
      "geoLevel": "STATE"
    },
    "sections": ["intro", "faqs", "tips"],
    "providerId": "nvidia-provider-uuid",
    "model": "nvidia/llama-3.1-nemotron-70b-reward",
    "templateId": "auto-template-uuid",
    "perSection": true,
    "batchSize": 5,
    "dedupKey": "auto-states-batch-1"
  }'
```

#### Response

```json
{
  "success": true,
  "jobId": "job-uuid",
  "totalPages": 50,
  "totalSections": 3,
  "perSectionMode": true,
  "estimatedApiCalls": 150,
  "message": "Started AI generation for 50 pages with 3 sections each (150 total API calls)"
}
```

### POST /api/ai-generate/groups

Create a job group for parallel processing.

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Group name |
| description | string | No | Group description |
| jobs | array | Yes | Array of job configurations |
| jobs[].name | string | Yes | Job name |
| jobs[].filters | object | Yes | Page filters |
| jobs[].sections | string[] | Yes | Sections to generate |
| jobs[].providerId | string | No | Provider UUID |
| jobs[].model | string | No | Model name |
| jobs[].templateId | string | No | Template UUID |
| jobs[].perSection | boolean | No | Per-section mode |
| jobs[].batchSize | number | No | Batch size |

### GET /api/ai-generate/groups

List all job groups with their jobs.

### GET /api/ai-generate?jobId={id}

Get status of a specific job.

---

## Best Practices

### 1. Choosing Provider and Model

| Use Case | Recommended Provider | Model |
|----------|---------------------|-------|
| High quality, cost ok | NVIDIA | llama-3.1-nemotron-70b-reward |
| Budget conscious | OpenRouter | deepseek/deepseek-r1:free |
| Fast generation | OpenRouter | google/gemini-2.0-flash-exp:free |
| Parallel jobs | Mix of both | Varies by job |

### 2. Batch Size Guidelines

| Provider | Normal Mode | Per-Section Mode |
|----------|-------------|------------------|
| NVIDIA | 5-10 | 3-5 |
| OpenRouter Free | 10-20 | 5-10 |

### 3. Delay Between Batches

| Provider | Recommended Delay |
|----------|-------------------|
| NVIDIA | 1000-2000ms |
| OpenRouter Free | 500-1000ms |
| Rate-limited | 5000ms+ |

### 4. Deduplication Keys

Use descriptive keys:
```
auto-insurance-states-2024
home-insurance-cities-batch-1
life-insurance-major-cities
```

### 5. Job Grouping

Group related jobs:
- Same niche, different geo levels
- Different niches, same geo level
- Template testing jobs

---

## Troubleshooting

### Rate Limiting

If you hit rate limits:
1. Increase `delayBetweenBatches`
2. Reduce `batchSize`
3. Use multiple providers
4. Enable per-section mode with longer delays

### Content Similarity

If content is too similar across pages:
1. Enable deduplication with `semantic` strategy
2. Use location-specific prompts
3. Add `dedupKey` to jobs
4. Increase `minUniquenessScore`

### Provider Failures

If a provider fails:
1. Check provider status in admin
2. Verify API key is valid
3. Check rate limits
4. Switch to fallback provider

---

## Migration Guide

### From Old System

1. **Seed templates**: Run `seed-prompt-templates.ts`
2. **Add NVIDIA provider**: Configure in admin dashboard
3. **Update existing jobs**: No action needed, backward compatible

### Enabling New Features

1. Update schema: `npx prisma migrate dev`
2. Seed templates: `npx ts-node prisma/seed-prompt-templates.ts`
3. Restart server
4. Configure providers in admin

---

## Example Workflows

### Workflow 1: High-Quality Content with NVIDIA

```bash
# 1. Add NVIDIA provider (one-time)
POST /api/ai-providers
{
  "name": "NVIDIA NIM",
  "provider": "nvidia",
  "apiKey": "nvapi-...",
  "apiEndpoint": "https://integrate.api.nvidia.com/v1/chat/completions",
  "preferredModel": "nvidia/llama-3.1-nemotron-70b-reward"
}

# 2. Generate content
POST /api/ai-generate
{
  "filters": { "insuranceTypeId": "...", "geoLevel": "CITY" },
  "sections": ["intro", "faqs", "tips", "costBreakdown"],
  "providerId": "nvidia-provider-id",
  "perSection": true,
  "batchSize": 3,
  "dedupKey": "high-quality-auto-cities"
}
```

### Workflow 2: Parallel Niche Generation

```bash
# Create parallel jobs for auto and home insurance
POST /api/ai-generate/groups
{
  "name": "Auto + Home - All States",
  "jobs": [
    {
      "name": "Auto Insurance",
      "filters": { "insuranceTypeId": "auto-id", "geoLevel": "STATE" },
      "sections": ["intro", "faqs"],
      "providerId": "nvidia-id"
    },
    {
      "name": "Home Insurance", 
      "filters": { "insuranceTypeId": "home-id", "geoLevel": "STATE" },
      "sections": ["intro", "faqs"],
      "providerId": "openrouter-id"
    }
  ]
}
```

### Workflow 3: Template Testing

```bash
# Test different templates on same pages
POST /api/ai-generate/groups
{
  "name": "Template A/B Test",
  "jobs": [
    {
      "name": "Template A - Standard",
      "filters": { "insuranceTypeId": "..." },
      "templateId": "template-a-id"
    },
    {
      "name": "Template B - Enhanced",
      "filters": { "insuranceTypeId": "..." },
      "templateId": "template-b-id"
    }
  ]
}
```
