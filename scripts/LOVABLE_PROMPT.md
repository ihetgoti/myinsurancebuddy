# Lovable.dev Prompt for Car Insurance Page Template

Copy the prompt below into Lovable.dev to generate a car insurance page template.

---

## PROMPT

```
Create a modern, conversion-focused car insurance landing page template for a programmatic SEO website. This template will be used for location-specific pages (California, Los Angeles, etc.).

## DATA STRUCTURE

The template receives this data from a CSV/database:

```typescript
interface CarInsurancePageData {
  // Location
  state_name: string;           // "California"
  state_code: string;           // "CA"
  city_name?: string;           // "Los Angeles" (optional for city pages)
  
  // State Requirements (factual)
  coverage_format: string;      // "15/30/5"
  is_no_fault: boolean;         // false
  pip_required: boolean;        // false
  um_required: boolean;         // false
  
  // SEO
  meta_title: string;           // "California Car Insurance - Compare & Save"
  meta_description: string;     // "Find affordable car insurance..."
  
  // Hero Section
  h1_title: string;             // "Car Insurance in California"
  hero_tagline: string;         // "Save up to $500+ on your premium"
  hero_description: string;     // "California drivers face unique challenges..."
  
  // Content Sections (AI-generated, unique per location)
  intro_paragraph_1: string;
  intro_paragraph_2: string;
  intro_paragraph_3: string;
  
  // State/City Insights
  state_insights: {
    uniqueChallenge: string;
    savingOpportunity: string;
    commonMistake: string;
  };
  
  // Local Factors (unique per location)
  local_factors: Array<{
    factor: string;             // "Traffic"
    impact: string;             // "LA has the worst traffic..."
    tip: string;                // "Consider usage-based insurance"
  }>;
  
  // Coverage Tips
  coverage_tips: string[];      // ["Tip 1", "Tip 2", ...]
  
  // Discounts
  discounts_list: Array<{
    name: string;               // "Good Driver"
    description: string;        // "Clean record for 3+ years"
    savings: string;            // "Up to 25%"
  }>;
  
  // Top Insurers (static list)
  top_insurers: Array<{
    name: string;               // "GEICO"
    slug: string;               // "geico"
    bestFor: string;            // "Low rates for good drivers"
    rating: string;             // "4.5"
  }>;
  
  // FAQs
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  
  // CTA
  cta_text: string;             // "Compare California Quotes"
  cta_subtext: string;          // "Find the best rates in minutes"
  cta_url: string;              // "/get-quote" (fallback affiliate URL)
  
  // City-specific (optional)
  neighborhood_guide?: string;  // "Your LA neighborhood affects..."
  driving_tips?: string[];      // City-specific driving tips
}
```

## DESIGN REQUIREMENTS

1. **Hero Section**
   - Dark navy gradient background (#0B1B34 → #1A3A5C)
   - Breadcrumb: Home > Car Insurance > {State} > {City}
   - H1: `{h1_title}`
   - Tagline: `{hero_tagline}` in accent color
   - Description: `{hero_description}`
   - ZIP code input form with prominent CTA button
   - Trust badges: "Compare 100+ Companies" | "Free Quotes" | "No Spam"

2. **State Requirements Box**
   - Prominent info box showing minimum requirements
   - Format: "{coverage_format}" explained
   - Icons for No-fault vs At-fault, PIP, UM
   - Clean, scannable layout

3. **Intro Content Section**
   - White background
   - Render 3 paragraphs of unique content
   - Typography: 18px, comfortable line height
   - Include a "Get Quote" CTA after content

4. **Local Factors Grid**
   - Light gray background
   - 2x2 grid of factor cards
   - Each card: Icon + Factor name + Impact + Tip
   - Icons: Traffic, Weather, Crime, Population
   - Subtle animations on hover

5. **Coverage Tips Section**
   - Numbered or bulleted list
   - Checkmark icons
   - Clear, actionable tips

6. **Discounts Table**
   - Clean table or card grid
   - Discount name, description, savings percentage
   - Highlight "Up to X%" prominently

7. **Top Insurers Comparison**
   - Card-based layout (3x2 grid)
   - Company name, "Best For" tag, star rating
   - "Get Quote" button with `{cta_url}` link
   - Note: "Rates vary by location and driver"

8. **FAQ Accordion**
   - Expandable questions
   - Schema.org FAQPage markup ready
   - Clean, accessible design

9. **Neighborhood Guide (City pages only)**
   - Highlighted box with location icon
   - Shows how neighborhood affects rates

10. **Final CTA Section**
    - Teal gradient background
    - `{cta_text}` as button
    - `{cta_subtext}` below
    - ZIP code form repeated

## COLOR SCHEME

- Primary: Teal (#0D9488)
- Dark: Navy (#0F172A)
- Accent: Blue (#3B82F6)
- Success: Green (#10B981)
- Text: Slate (#1E293B)
- Muted: Gray (#64748B)
- Background: White/Gray (#F8FAFC)

## TYPOGRAPHY

- Headings: Inter or system sans-serif, bold
- Body: 16-18px, comfortable reading
- H1: 36-48px
- H2: 24-32px

## COMPONENTS TO CREATE

1. `HeroSection` - ZIP form, stats, trust badges
2. `StateRequirementsBox` - Coverage minimums display
3. `IntroContent` - 3-paragraph content block
4. `LocalFactorsGrid` - 4 factor cards
5. `CoverageTipsSection` - Tips list
6. `DiscountsTable` - Savings grid
7. `InsurerComparison` - Company cards
8. `FaqAccordion` - Expandable FAQs
9. `NeighborhoodGuide` - City-specific info
10. `CtaBanner` - Final conversion section

## SAMPLE DATA

```json
{
  "state_name": "California",
  "state_code": "CA",
  "city_name": "Los Angeles",
  "coverage_format": "15/30/5",
  "is_no_fault": false,
  "pip_required": false,
  "um_required": false,
  "h1_title": "Car Insurance in Los Angeles, California",
  "hero_tagline": "LA Drivers Save an Average of $500+",
  "hero_description": "Navigate LA traffic with confidence. Compare quotes from top insurers and find coverage that fits your commute.",
  "intro_paragraph_1": "Finding affordable car insurance in Los Angeles requires understanding the unique factors that affect rates in America's second-largest city...",
  "intro_paragraph_2": "California's minimum requirements (15/30/5) provide basic protection, but LA drivers often need more coverage due to higher accident rates...",
  "intro_paragraph_3": "By comparing quotes from multiple insurers, you can find the best balance of coverage and cost for your situation...",
  "state_insights": {
    "uniqueChallenge": "LA's notorious traffic on I-405 and I-10 leads to higher accident rates",
    "savingOpportunity": "Low-mileage discounts for remote workers",
    "commonMistake": "Choosing minimum coverage in a high-litigation area"
  },
  "local_factors": [
    {"factor": "Traffic", "impact": "LA has the worst traffic in the US, increasing accident risk", "tip": "Consider comprehensive coverage"},
    {"factor": "Weather", "impact": "Year-round driving with occasional rain hazards", "tip": "Good weather = fewer weather claims"},
    {"factor": "Crime", "impact": "Vehicle theft 50% above national average", "tip": "Anti-theft devices earn discounts"},
    {"factor": "Density", "impact": "Urban density increases accident frequency", "tip": "Garage parking can lower rates"}
  ],
  "coverage_tips": [
    "Get uninsured motorist coverage - 15% of CA drivers are uninsured",
    "Consider higher liability limits for lawsuit protection",
    "Add rental reimbursement for LA's car-dependent lifestyle",
    "Compare at least 5 quotes before deciding",
    "Ask about good driver discounts (clean record 3+ years)"
  ],
  "discounts_list": [
    {"name": "Good Driver", "description": "Clean record for 3+ years", "savings": "Up to 25%"},
    {"name": "Multi-Vehicle", "description": "Insure 2+ cars", "savings": "Up to 20%"},
    {"name": "Bundling", "description": "Add renters/home insurance", "savings": "Up to 15%"},
    {"name": "Low Mileage", "description": "Under 7,500 miles/year", "savings": "Up to 10%"}
  ],
  "top_insurers": [
    {"name": "GEICO", "slug": "geico", "bestFor": "Low rates for good drivers", "rating": "4.5"},
    {"name": "Progressive", "slug": "progressive", "bestFor": "Usage-based discounts", "rating": "4.3"},
    {"name": "State Farm", "slug": "state-farm", "bestFor": "Local agent support", "rating": "4.6"},
    {"name": "USAA", "slug": "usaa", "bestFor": "Military families", "rating": "4.8"},
    {"name": "Allstate", "slug": "allstate", "bestFor": "Bundling options", "rating": "4.2"},
    {"name": "Liberty Mutual", "slug": "liberty-mutual", "bestFor": "Customizable coverage", "rating": "4.0"}
  ],
  "faqs": [
    {"question": "What are California's minimum car insurance requirements?", "answer": "California requires 15/30/5 coverage: $15,000 bodily injury per person, $30,000 per accident, and $5,000 property damage."},
    {"question": "Why is car insurance expensive in Los Angeles?", "answer": "LA has high rates due to heavy traffic, vehicle theft, litigation costs, and population density."},
    {"question": "How can I lower my car insurance in LA?", "answer": "Compare quotes, maintain a clean record, take advantage of discounts, and consider usage-based programs if you drive less."},
    {"question": "Is California a no-fault state?", "answer": "No, California is an at-fault state. The driver who caused the accident is responsible for damages."}
  ],
  "neighborhood_guide": "Your LA neighborhood significantly impacts your rates. Areas like Downtown and South LA have higher theft rates, while Pasadena and Glendale typically have lower premiums due to lower crime rates.",
  "cta_text": "Compare LA Car Insurance Quotes",
  "cta_subtext": "Find the best rates from top insurers in minutes",
  "cta_url": "/get-quote"
}
```

## OUTPUT

Create a complete React component with:
- TypeScript interfaces
- Tailwind CSS styling
- Mobile-first responsive design
- SEO-optimized semantic HTML
- Accessible (ARIA labels, keyboard navigation)
- All sections listed above
- Reusable for any state/city combination

Make it conversion-focused with prominent CTAs throughout.
```

---

## NOTES

After generating the template in Lovable.dev:

1. **Connect to your database** - Replace sample data with Prisma queries
2. **Add Schema.org markup** - FAQPage, LocalBusiness schemas
3. **Integrate affiliate URLs** - Pass `cta_url` to CTA buttons
4. **Add analytics tracking** - Track CTA clicks and conversions
