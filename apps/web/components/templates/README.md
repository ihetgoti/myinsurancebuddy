# Insurance Niche Templates

This directory contains specialized React components for rendering insurance landing pages for different niches.

## Available Templates

| Template | Slug | Description |
|----------|------|-------------|
| `AutoInsuranceTemplate` | auto | Car/auto insurance pages |
| `HomeInsuranceTemplate` | home | Homeowners insurance pages |
| `HealthInsuranceTemplate` | health | Health insurance pages |
| `LifeInsuranceTemplate` | life | Life insurance pages |
| `MotorcycleInsuranceTemplate` | motorcycle | Motorcycle insurance pages |
| `PetInsuranceTemplate` | pet | Pet insurance pages |
| `BusinessInsuranceTemplate` | business | Business/commercial insurance pages |
| `RentersInsuranceTemplate` | renters | Renters insurance pages |
| `UmbrellaInsuranceTemplate` | umbrella | Umbrella liability insurance pages |

## Usage

```tsx
import { getTemplateByType } from '@/components/templates';

const Template = getTemplateByType('auto');
if (Template) {
  return <Template variables={pageVariables} affiliates={[]} relatedLinks={{}} />;
}
```

## Template Props

All templates accept these props:

```typescript
interface TemplateProps {
  variables: Record<string, any>;     // Page-specific variables (state name, premiums, etc.)
  affiliates: any[];                  // Affiliate offers
  relatedLinks: any;                  // Related content links
  insuranceTypeId?: string;           // Insurance type UUID for MarketCall offers
  stateId?: string;                   // State UUID for MarketCall offers
}
```

## Common Template Structure

Each template follows a consistent pattern:

1. **Hero Section** - Gradient background, title, key stats, MarketCallCTA
2. **Table of Contents** - Anchor links to sections
3. **Quick Answer Box** - Summary of key information
4. **Coverage Types** - Cards explaining different coverage options
5. **Cost Factors** - What affects pricing
6. **FAQs** - Common questions with answers
7. **Sidebar** - CTA banner and related content

## Shared Components

Located in `./shared/`:

- `TableOfContents` - Section navigation
- `QuickAnswerBox` - Summary info grid
- `EnhancedFAQ` - Expandable FAQ component
- `CoverageCard` - Coverage type display
- `CTABanner` - Call-to-action sidebar
- `LastUpdated` - Timestamp display

## Adding a New Template

1. Create `NewInsuranceTemplate.tsx`
2. Follow the existing pattern with imports from `./shared`
3. Add to `TEMPLATE_MAP` in `index.ts`
4. Export from `index.ts`
