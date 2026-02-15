# Complete Guide to All 12 Content Sections

This guide explains each of the 12 content sections available for AI generation.

## Quick Reference

| Section | Purpose | Output Type | Best For |
|---------|---------|-------------|----------|
| intro | Hook readers | Paragraph | All pages |
| requirements | Legal needs | Bullet list | Compliance info |
| faqs | Common questions | Q&A pairs | SEO long-tail |
| tips | Actionable advice | List | Engagement |
| costBreakdown | Price analysis | Table/data | Comparison |
| comparison | Provider compare | Comparison | Decision making |
| discounts | Savings opportunities | List | Conversions |
| localStats | Location data | Statistics | Local SEO |
| coverageGuide | Coverage explained | Guide | Education |
| claimsProcess | How to file | Steps | Trust building |
| buyersGuide | Purchase guide | Checklist | First-time buyers |
| metaTags | SEO metadata | Meta fields | Search ranking |

---

## 1. Intro
**Purpose**: Engage readers and set the stage for money-saving content.

**Output**: 150-200 word paragraph

**Example**:
```
Looking for the cheapest auto insurance in Los Angeles? You're not alone. 
California drivers pay an average of $1,800/year, but savvy shoppers can 
cut that by 40% or more...
```

**Best For**: All pages - essential opening content

---

## 2. Requirements
**Purpose**: Explain legal coverage requirements.

**Output**: Bullet list with explanations

**Example**:
```
• Bodily Injury Liability: $15,000/$30,000 (required)
• Property Damage Liability: $5,000 (required)
• Uninsured Motorist: Optional but recommended
```

**Best For**: State/city pages, compliance-focused content

---

## 3. FAQs
**Purpose**: Answer common questions for SEO.

**Output**: Array of 5 Q&A objects

**Example**:
```json
[
  {
    "question": "How do I find the cheapest insurance?",
    "answer": "Start by comparing quotes from 3-5 providers..."
  }
]
```

**Best For**: Long-tail SEO, voice search optimization

---

## 4. Tips
**Purpose**: Provide actionable money-saving advice.

**Output**: Array of 7 tip strings

**Example**:
```json
[
  "Compare quotes every 6 months - Rates change frequently...",
  "Bundle policies for 10-25% off - Combine auto with home..."
]
```

**Best For**: Engagement, social sharing, practical value

---

## 5. Cost Breakdown
**Purpose**: Explain pricing factors with real numbers.

**Output**: Array of cost factor objects

**Example**:
```json
[
  {
    "factor": "Minimum Coverage",
    "impact": "$450-650/year",
    "description": "Meets legal requirements only"
  }
]
```

**Best For**: Comparison pages, budget-conscious visitors

---

## 6. Comparison
**Purpose**: Compare coverage levels or providers.

**Output**: Text comparison or structured data

**Example**:
```
Minimum Liability:
• Price: $450-650/year
• Coverage: State minimums
• Best for: Budget-conscious drivers

Standard Coverage:
• Price: $1,200-1,800/year
• Coverage: Includes collision
• Best for: Most drivers
```

**Best For**: Decision-making, comparison pages

---

## 7. Discounts
**Purpose**: List all available savings opportunities.

**Output**: Categorized discount list

**Example**:
```
Safe Driver Discount: 10-30% off
• Qualify with 3-5 years clean record
• No accidents or tickets

Multi-Policy Bundle: 10-25% off
• Combine auto + home insurance
```

**Best For**: Conversion optimization, email capture

---

## 8. Local Stats
**Purpose**: Provide location-specific data.

**Output**: Array of statistic objects

**Example**:
```json
[
  {
    "stat": "Average Annual Premium",
    "value": "$1,850",
    "impact": "20% above state average",
    "comparison": "CA avg: $1,500"
  }
]
```

**Best For**: Local SEO, credibility building

---

## 9. Coverage Guide
**Purpose**: Explain different coverage types.

**Output**: Educational guide content

**Example**:
```
Liability Coverage (Required):
• What it covers: Damage you cause to others
• Cost: Included in all policies
• Recommendation: Get at least 50/100/50

Collision Coverage (Optional):
• What it covers: Damage to your car
• Cost: $300-800/year
• Skip if: Car worth less than $3,000
```

**Best For**: Education, building trust

---

## 10. Claims Process
**Purpose**: Explain how to file a claim.

**Output**: Structured process guide

**Example**:
```json
{
  "steps": [
    "Stay safe and call 911 if injuries",
    "Document scene with photos",
    "Contact insurance within 24 hours"
  ],
  "documents": ["Police report", "Photos", "Repair estimates"],
  "timeline": "Simple claims: 1-2 weeks"
}
```

**Best For**: Trust building, customer service

---

## 11. Buyers Guide
**Purpose**: Step-by-step purchase guide.

**Output**: Complete buying checklist

**Example**:
```json
{
  "steps": [
    "Assess your coverage needs",
    "Get 5+ quotes",
    "Compare apples to apples"
  ],
  "lookFor": ["Financial stability", "Good reviews"],
  "redFlags": ["Quotes too low", "Pressure tactics"],
  "questions": ["What discounts do I qualify for?"]
}
```

**Best For**: First-time buyers, long-form content

---

## 12. Meta Tags
**Purpose**: SEO metadata for search engines.

**Output**: Structured meta tag object

**Example**:
```json
{
  "metaTitle": "Cheapest Auto Insurance in LA | Save 40%",
  "metaDescription": "Find the cheapest auto insurance...",
  "metaKeywords": ["cheap auto insurance", "affordable"],
  "ogTitle": "Find Cheapest Auto Insurance in LA",
  "ogDescription": "Discover proven ways to save..."
}
```

**Best For**: SEO, social sharing

---

## Recommended Section Combinations

### Essential (4 sections)
```javascript
['intro', 'faqs', 'tips', 'metaTags']
```

### Standard (7 sections)
```javascript
['intro', 'requirements', 'faqs', 'tips', 'costBreakdown', 'discounts', 'metaTags']
```

### Complete (12 sections)
```javascript
[
  'intro', 'requirements', 'faqs', 'tips', 'costBreakdown',
  'comparison', 'discounts', 'localStats', 'coverageGuide',
  'claimsProcess', 'buyersGuide', 'metaTags'
]
```

### SEO-Focused
```javascript
['intro', 'faqs', 'localStats', 'buyersGuide', 'metaTags']
```

### Conversion-Focused
```javascript
['intro', 'tips', 'costBreakdown', 'comparison', 'discounts', 'metaTags']
```

---

## API Usage Examples

### Generate All 12 Sections
```bash
POST /api/ai-generate
{
  "filters": { "insuranceTypeId": "..." },
  "sections": [
    "intro", "requirements", "faqs", "tips", "costBreakdown",
    "comparison", "discounts", "localStats", "coverageGuide",
    "claimsProcess", "buyersGuide", "metaTags"
  ],
  "perSection": true,
  "providerId": "nvidia-provider-id",
  "templateId": "auto-complete-template"
}
```

### Generate Essential Only
```bash
POST /api/ai-generate
{
  "filters": { "insuranceTypeId": "..." },
  "sections": ["intro", "faqs", "tips", "metaTags"],
  "batchSize": 20
}
```

### Generate SEO Sections
```bash
POST /api/ai-generate
{
  "filters": { "insuranceTypeId": "..." },
  "sections": ["intro", "localStats", "metaTags"]
}
```

---

## Content Length Estimates

| Section | Approx. Words | API Tokens |
|---------|---------------|------------|
| intro | 150-200 | ~250 |
| requirements | 100-150 | ~200 |
| faqs | 300-400 | ~500 |
| tips | 200-300 | ~350 |
| costBreakdown | 150-200 | ~250 |
| comparison | 200-300 | ~350 |
| discounts | 150-200 | ~250 |
| localStats | 100-150 | ~200 |
| coverageGuide | 200-300 | ~350 |
| claimsProcess | 150-200 | ~250 |
| buyersGuide | 200-300 | ~350 |
| metaTags | 50-100 | ~100 |
| **Total** | **~2,000** | **~3,500** |

---

## Per-Section Mode Recommendations

When using `perSection: true` with all 12 sections:

- **Batch Size**: 3-5 pages (36-60 API calls per batch)
- **Delay**: 2000-3000ms between batches
- **Total API Calls**: 12 × number of pages
- **Best For**: Maximum quality, error isolation

---

## Template Customization

Each section can be customized in the AI Templates dashboard:

1. **Prompt**: Custom instructions for the section
2. **Example Format**: Sample output structure
3. **Temperature**: Creativity level (0.0 - 1.0)
4. **Max Tokens**: Maximum length

Edit at: **Admin Dashboard → AI Templates → [Template Name]**
