# AI Content Section Prompt

Generate a new AI content section type for programmatic pages.

## Request Format

```
Section: {{SECTION_NAME}}
Purpose: {{PURPOSE_DESCRIPTION}}
Fields: {{OUTPUT_FIELDS}}
Example: {{EXAMPLE_DATA}}
```

## Example Request

```
Section: localRisks
Purpose: Location-specific risks that affect insurance rates
Fields: riskType, description, severity, mitigationTips
Example: [{"riskType": "Flooding", "severity": "high", "tips": ["Get flood insurance"] }]
```

## Prompt Template

---

Create a new AI content section for programmatic insurance pages:

### Requirements:
1. **TypeScript**: Add to `AIContentSection` type
2. **Database**: Add to `AIPromptTemplate` model
3. **Service**: Add to `aiContentService.ts`
4. **Seed**: Add default prompts to seed script
5. **UI**: Add rendering component

### Implementation Steps:

#### 1. Update Type Definition

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
  | 'metaTags'
  | '{{SECTION_NAME}}'; // Add new section
```

#### 2. Update Database Schema

```prisma
// packages/db/prisma/schema.prisma

model AIPromptTemplate {
  // ... existing fields
  
  // New section prompts
  {{sectionName}}Prompt String?
  example{{SectionNamePascal}}Format Json?
}
```

#### 3. Add Service Functions

```typescript
// apps/admin/lib/aiContentService.ts

// Add to getDefaultSectionPrompt()
case '{{SECTION_NAME}}':
  return `Generate a {{SECTION_NAME}} section for {{niche}} insurance in {{location}}.

Requirements:
- Include 4-6 items
- Each item should have: {{FIELDS}}
- Focus on money-saving aspects
- Use location-specific data where possible

Output as JSON array.`;

// Add to getTemplatePromptForSection()
case '{{SECTION_NAME}}':
  return templatePrompts?.{{sectionName}}Prompt || getDefaultSectionPrompt('{{SECTION_NAME}}', pageData);

// Add to getExampleFormatForSection()
case '{{SECTION_NAME}}':
  return templatePrompts?.exampleFormats?.{{sectionName}} || getDefaultExampleFormat('{{SECTION_NAME}}');

// Add to getExpectedStructure()
case '{{SECTION_NAME}}':
  return `[{ {{FIELD_SCHEMA}} }]`;
```

#### 4. Add Seed Data

```typescript
// packages/db/prisma/seed-prompt-templates.ts

const SECTION_PROMPTS = {
  // ... existing prompts
  
  {{SECTION_NAME}}: `Generate a {{SECTION_NAME}} section for {{niche}} insurance in {{location}}.

{{DETAILED_INSTRUCTIONS}}`,
};

const EXAMPLE_FORMATS = {
  // ... existing formats
  
  {{SECTION_NAME}}: [
    {{EXAMPLE_JSON}}
  ],
};
```

#### 5. Add UI Component

```tsx
// apps/web/components/sections/{{SectionName}}Section.tsx

interface {{SectionName}}SectionProps {
  data: Array<{
    // Define item type
  }>;
  location: string;
  insuranceType: string;
}

export function {{SectionName}}Section({ 
  data, 
  location, 
  insuranceType 
}: {{SectionName}}SectionProps) {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">
        {{SECTION_DISPLAY_NAME}} in {location}
      </h2>
      <div className="grid gap-4">
        {data.map((item, index) => (
          <div key={index} className="border rounded-lg p-4">
            {/* Render item */}
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Content Section Schema:

Each section should output structured JSON:

```typescript
interface {{SectionName}}Item {
  // Define fields based on requirements
  field1: string;
  field2: number;
  field3?: string[];
}

type {{SectionName}}Data = {{SectionName}}Item[];
```

### AI Prompt Guidelines:

1. **Clear Instructions**: Be specific about what to generate
2. **Output Format**: Always specify JSON output
3. **Length Limits**: Specify word/character counts
4. **Location Context**: Use {{location}} and {{niche}} variables
5. **Money Focus**: Emphasize savings and cost factors
6. **Example Output**: Provide example in prompt for consistency

### Deliverables:
1. TypeScript type update
2. Prisma schema migration
3. Service function updates
4. Seed data
5. UI component
6. Documentation update

---

## Pre-built Section Templates

### weatherRisks
```
Section: weatherRisks
Purpose: Weather-related risks affecting insurance in the location
Fields: riskType, description, frequency, avgClaimAmount, preventionTips
Example: [{"riskType": "Hurricane", "frequency": "Seasonal", "avgClaimAmount": 15000, "preventionTips": ["Install storm shutters"] }]
```

### localProviders
```
Section: localProviders
Purpose: Insurance providers with local presence
Fields: name, address, phone, rating, specialties, hours
Example: [{"name": "State Farm - Downtown", "rating": 4.8, "specialties": ["Auto", "Home"] }]
```

### rateFactors
```
Section: rateFactors
Purpose: Specific factors affecting rates in this location
Fields: factor, impact, explanation, mitigation
Example: [{"factor": "Traffic Density", "impact": "high", "mitigation": "Use public transit when possible" }]
```

### coverageGaps
```
Section: coverageGaps
Purpose: Common coverage gaps in the location
Fields: gapType, riskLevel, typicalCost, recommendation
Example: [{"gapType": "Uninsured Motorist", "riskLevel": "high", "typicalCost": 500 }]
```
