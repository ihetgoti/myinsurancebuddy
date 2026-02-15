# Prompt Template Sync Verification

This document verifies that the prompt templates are fully synchronized with the TypeScript types.

## ✅ All 12 Content Sections

| # | Section | TypeScript Type | DB Model | Prompt Template | Example Format | Default Prompt |
|---|---------|----------------|----------|-----------------|----------------|----------------|
| 1 | intro | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 | requirements | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 | faqs | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 | tips | ✅ | ✅ | ✅ | ✅ | ✅ |
| 5 | costBreakdown | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6 | comparison | ✅ | ✅ | ✅ | ✅ | ✅ |
| 7 | discounts | ✅ | ✅ | ✅ | ✅ | ✅ |
| 8 | localStats | ✅ | ✅ | ✅ | ✅ | ✅ |
| 9 | coverageGuide | ✅ | ✅ | ✅ | ✅ | ✅ |
| 10 | claimsProcess | ✅ | ✅ | ✅ | ✅ | ✅ |
| 11 | buyersGuide | ✅ | ✅ | ✅ | ✅ | ✅ |
| 12 | metaTags | ✅ | ✅ | ✅ | ✅ | ✅ |

## TypeScript Type Definition

```typescript
// apps/admin/lib/aiContentService.ts
export type AIContentSection =
  | 'intro'
  | 'requirements'
  | 'faqs'
  | 'tips'
  | 'costBreakdown'
  | 'comparison'
  | 'discounts'
  | 'localStats'
  | 'coverageGuide'
  | 'claimsProcess'
  | 'buyersGuide'
  | 'metaTags';
```

## Database Schema (Prisma)

```prisma
// packages/db/prisma/schema.prisma
model AIPromptTemplate {
  // ALL 12 prompt fields
  introPrompt        String?
  requirementsPrompt String?
  faqsPrompt         String?
  tipsPrompt         String?
  costBreakdownPrompt  String?
  comparisonPrompt     String?
  discountsPrompt      String?
  localStatsPrompt     String?
  coverageGuidePrompt  String?
  claimsProcessPrompt  String?
  buyersGuidePrompt    String?
  metaTagsPrompt       String?
  
  // Example formats
  exampleIntroFormat        String?
  exampleFaqsFormat         Json?
  exampleTipsFormat         Json?
  exampleCostBreakdownFormat Json?
  exampleMetaTagsFormat     Json?
}
```

## Template Prompts Interface

```typescript
// apps/admin/lib/aiContentService.ts
export interface AIContentRequest {
  templatePrompts?: {
    // ALL 12 prompt fields
    introPrompt?: string;
    requirementsPrompt?: string;
    faqsPrompt?: string;
    tipsPrompt?: string;
    costBreakdownPrompt?: string;
    comparisonPrompt?: string;
    discountsPrompt?: string;
    localStatsPrompt?: string;
    coverageGuidePrompt?: string;
    claimsProcessPrompt?: string;
    buyersGuidePrompt?: string;
    metaTagsPrompt?: string;
    
    // ALL 12 example formats
    exampleFormats?: {
      intro?: string;
      requirements?: string;
      faqs?: Array<{ question: string; answer: string }>;
      tips?: string[];
      costBreakdown?: any;
      comparison?: any;
      discounts?: any;
      localStats?: any;
      coverageGuide?: any;
      claimsProcess?: any;
      buyersGuide?: any;
      metaTags?: any;
    };
  };
}
```

## Service Functions Coverage

### 1. getDefaultSectionPrompt()
Returns default prompts for ALL 12 sections with:
- Section-specific instructions
- Location variables ({{location}})
- Keyword targeting ({{niche}})
- Money-saving focus

### 2. getTemplatePromptForSection()
Maps ALL 12 sections to their corresponding template prompt fields.

### 3. getExampleFormatForSection()
Returns example formats for ALL 12 sections from templatePrompts.exampleFormats.

### 4. getExpectedStructure()
Defines JSON output structure for ALL 12 sections:
- `intro`: string
- `requirements`: string
- `faqs`: Array<{question, answer}>
- `tips`: string[]
- `costBreakdown`: Array<{factor, impact, description}>
- `comparison`: Array<{name, strengths, weaknesses, bestFor, priceRange}>
- `discounts`: Array<{name, savings, qualification, isLocal}>
- `localStats`: Array<{stat, value, impact, comparison}>
- `coverageGuide`: Array<{type, description, recommended, whenNeeded}>
- `claimsProcess`: {steps, documents, timeline, resources}
- `buyersGuide`: {steps, lookFor, redFlags, questions}
- `metaTags`: {metaTitle, metaDescription, metaKeywords, ogTitle, ogDescription}

## Seed Script Coverage

The seed script (`seed-prompt-templates.ts`) includes:

### Complete Prompts for All Sections
Each template includes full prompts for all 12 sections with:
- Detailed instructions
- Required content elements
- Format specifications
- Location-specific guidance

### Example Formats for All Sections
Each template includes example outputs:
- **intro**: Full example paragraph
- **requirements**: Formatted list example
- **faqs**: JSON array with 5 Q&A pairs
- **tips**: JSON array with 7 tips
- **costBreakdown**: JSON array with cost factors
- **comparison**: Text comparison format
- **discounts**: Detailed discount list
- **localStats**: JSON array with statistics
- **coverageGuide**: Coverage types explanation
- **claimsProcess**: JSON with steps, documents, timeline
- **buyersGuide**: JSON with steps, lookFor, redFlags, questions
- **metaTags**: JSON with all meta tag fields

### Niche-Specific Templates
Complete templates for 5 niches:
1. Auto Insurance
2. Home Insurance
3. Health Insurance
4. Life Insurance
5. Business Insurance

Each includes ALL 12 sections with niche-specific content.

## Verification Commands

```bash
# Check TypeScript types
grep -n "AIContentSection" apps/admin/lib/aiContentService.ts

# Check Prisma schema
grep -n "Prompt" packages/db/prisma/schema.prisma

# Check seed script sections
grep -n "SECTION_PROMPTS\|example" packages/db/prisma/seed-prompt-templates.ts
```

## Usage Example

```typescript
// Using all 12 sections in a request
const request: AIContentRequest = {
  pageData: { ... },
  sections: [
    'intro',
    'requirements',
    'faqs',
    'tips',
    'costBreakdown',
    'comparison',
    'discounts',
    'localStats',
    'coverageGuide',
    'claimsProcess',
    'buyersGuide',
    'metaTags'
  ],
  templatePrompts: {
    // All 12 prompts can be customized
    introPrompt: 'Custom intro prompt...',
    requirementsPrompt: 'Custom requirements prompt...',
    // ... etc for all 12
    
    // All 12 example formats
    exampleFormats: {
      intro: 'Example intro text...',
      requirements: 'Example requirements...',
      faqs: [{ question: '...', answer: '...' }],
      tips: ['Tip 1...', 'Tip 2...'],
      costBreakdown: [...],
      comparison: {...},
      discounts: {...},
      localStats: [...],
      coverageGuide: {...},
      claimsProcess: {...},
      buyersGuide: {...},
      metaTags: {...}
    }
  }
};
```

## Migration Checklist

When adding a new section:

- [ ] Add to `AIContentSection` type
- [ ] Add to `AIPromptTemplate` Prisma model
- [ ] Add to `templatePrompts` interface
- [ ] Add to `exampleFormats` interface
- [ ] Add case in `getDefaultSectionPrompt()`
- [ ] Add case in `getTemplatePromptForSection()`
- [ ] Add case in `getExampleFormatForSection()`
- [ ] Add case in `getExpectedStructure()`
- [ ] Add prompt to seed script
- [ ] Add example format to seed script
- [ ] Update documentation

## Current Status: ✅ FULLY SYNCED

All 12 content sections are fully synchronized across:
- ✅ TypeScript types
- ✅ Prisma schema
- ✅ Service functions
- ✅ Seed templates
- ✅ Example formats
