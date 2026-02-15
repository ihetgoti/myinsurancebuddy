/**
 * Seed Auto Insurance AI Prompt Templates for Admin Panel
 * 
 * This seeds the AIPromptTemplate table for use with the admin AI Content page
 * 
 * Run: npx ts-node prisma/seed-auto-insurance-templates.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚗 Seeding Auto Insurance AI Templates for Admin Panel...\n');

  // Find auto insurance type
  const insuranceType = await prisma.insuranceType.findFirst({
    where: {
      OR: [
        { slug: 'auto' },
        { slug: 'car' },
        { name: { contains: 'Auto', mode: 'insensitive' } }
      ]
    }
  });

  if (!insuranceType) {
    console.log('⚠️  Auto insurance type not found. Please create it first in admin.');
    console.log('   Then run this script again.');
    process.exit(1);
  }

  console.log(`✅ Found insurance type: ${insuranceType.name} (${insuranceType.id})`);

  // Check if template already exists
  const existing = await prisma.aIPromptTemplate.findFirst({
    where: {
      insuranceTypeId: insuranceType.id,
      category: 'auto-insurance'
    }
  });

  const templateData = {
    name: 'Auto Insurance - Complete SEO Template',
    description: 'Complete AI content template for auto insurance lead generation pages. Generates 12 unique content sections optimized for "cheapest car insurance [city]" keywords.',
    category: 'auto-insurance',
    insuranceTypeId: insuranceType.id,
    geoLevel: 'CITY',
    isMajorCity: null, // All cities

    // System prompt - guides overall AI behavior
    systemPrompt: `You are an expert insurance content writer specializing in auto insurance SEO content.

MISSION: Create unique, helpful content that ranks for "cheapest car insurance in [location]" keywords.

CRITICAL RULES FOR UNIQUENESS:
1. NEVER copy phrases exactly - always reword and vary sentence structure
2. Use "car insurance" and "auto insurance" interchangeably for variety
3. Include specific location names ({{city}}, {{state}}) naturally throughout
4. Vary opening hooks: questions, bold statements, surprising facts
5. Adjust dollar amounts based on location cost of living
6. Use synonyms: cheap/affordable/low-cost/budget-friendly/inexpensive
7. Include 1-2 location-specific details (traffic, weather, crime, highways)
8. Write at 8th-grade reading level - clear and accessible
9. Focus on money-saving throughout all sections
10. Each page must feel written specifically for that city

TARGET KEYWORD: "cheapest car insurance in {{city}}, {{state}}"`,

    // Individual section prompts
    introPrompt: `Write an engaging 150-200 word introduction for auto insurance in {{city}}, {{state}}.

STRUCTURE:
1. HOOK (1 sentence): Question or bold statement about finding affordable coverage
2. LOCAL CONTEXT (2-3 sentences): {{city}}-specific challenges - traffic congestion, accident hotspots, weather risks, or vehicle theft rates
3. THE PROMISE (2 sentences): Mention average savings potential and rate variations between insurers
4. VALUE PREVIEW (2-3 sentences): Briefly mention what they'll learn (discounts, comparisons, local requirements)
5. SOFT CTA (1 sentence): Encourage reading on or getting quotes

VARIATIONS: Use different hooks for different cities:
- "Looking for...?"
- "Did you know...?"
- "Tired of overpaying...?"
- "Here's the truth about..."
- "{{city}} drivers are saving..."

EXAMPLE OPENING (vary this):
"Looking for the cheapest car insurance in {{city}}? You're not alone. With {{city}}'s notorious {{local_challenge}}, finding affordable coverage can feel like an uphill battle."

TARGET: Include "cheapest car insurance {{city}}" naturally within first 100 words`,

    requirementsPrompt: `Explain {{state}} auto insurance requirements in 150-200 words.

COVER:
1. MINIMUM COVERAGE LIMITS: Exact numbers (e.g., 15/30/5, 25/50/25)
2. FAULT SYSTEM: Is {{state}} fault or no-fault? Brief explanation
3. PENALTIES: Consequences of driving without insurance in {{state}}
4. SR-22: When required and for how long
5. MINIMUM vs RECOMMENDED: Why state minimums may not be enough
6. STATE-SPECIFIC: Any unique {{state}} requirements

TONE: Informative but cautionary - encourage adequate coverage while acknowledging budget constraints`,

    faqsPrompt: `Generate 5 FAQ pairs about car insurance in {{city}}, {{state}}.

QUESTIONS TO ANSWER:
1. How to find cheapest rates in {{city}}
2. Average costs in {{city}} vs elsewhere  
3. Minimum requirements in {{state}}
4. How to lower premiums
5. Best companies for cheap rates locally

FORMAT REQUIREMENTS:
- Question: 10-15 words, natural conversational tone
- Answer: 50-75 words, actionable with specific advice
- Include dollar amounts where possible (${{city}}-specific ranges)
- Mention {{city}} or {{state}} in each answer
- Focus on money-saving tips

OUTPUT FORMAT: JSON array
[
  {"question": "...", "answer": "..."},
  ...
]

VARY QUESTION PHRASING:
- "How do I find..."
- "What's the best way to..."
- "Why is..."
- "What factors affect..."
- "Which companies offer..."`,

    tipsPrompt: `Generate 7 money-saving tips for car insurance in {{city}}, {{state}}.

REQUIREMENTS:
- Each tip: Action-oriented title + 25-40 word explanation
- Include specific savings percentages
- Make relevant to {{city}} drivers when possible
- Cover: comparison shopping, bundling, deductibles, discounts, driving habits, credit, payment methods
- Write in second person ("you")

FORMAT: Array of strings
["Tip 1 text...", "Tip 2 text...", ...]

EXAMPLE TIPS (vary these):
- Compare quotes from 5+ insurers every 6 months
- Bundle auto with renters/home for 10-25% savings
- Raise deductible to $1,000 for 15-30% reduction
- Maintain clean driving record for 20% good driver discount
- Improve credit score for up to 40% savings
- Ask about occupation/membership discounts
- Pay annual premium upfront for 5-10% discount`,

    costBreakdownPrompt: `Explain 5-6 auto insurance cost factors for {{city}}, {{state}}.

FORMAT: JSON array with structure:
[
  {
    "factor": "Factor name",
    "impact": "$X/year or X%",
    "description": "50-60 words explaining the factor and how to minimize cost"
  }
]

FACTORS TO INCLUDE:
1. Minimum liability coverage (baseline cost)
2. Full coverage with collision/comprehensive
3. {{city}}-specific factor (traffic, theft, weather)
4. Driver profile factor (record, credit, age)
5. Vehicle factor (type, age, safety features)
6. Discount opportunity (bundle, good driver, etc.)

Make dollar amounts realistic for {{state}} cost of living.`,

    comparisonPrompt: `Compare 4-5 top auto insurance providers for {{city}}, {{state}} drivers.

FOCUS ON: National carriers with strong presence in {{state}} and competitive rates.

FORMAT: JSON array
[
  {
    "name": "Company Name",
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "bestFor": "description of ideal customer",
    "priceRange": "$X-$Y/month for full coverage"
  }
]

INCLUDE: GEICO, State Farm, Progressive, and 1-2 others relevant to {{state}}.
Be balanced - mention both pros and cons for each.
Price ranges should reflect {{state}} market rates.`,

    discountsPrompt: `List 8-10 auto insurance discounts available in {{state}}.

FORMAT: JSON array
[
  {
    "name": "Discount Name",
    "savings": "X% or $X",
    "qualification": "How to qualify",
    "isLocal": true/false (true if {{state}}-specific)
  }
]

INCLUDE:
- Good driver discount ({{state}} law if applicable)
- Multi-policy bundle
- Multi-vehicle
- Safe driver/clean record
- Good student
- Defensive driving course
- Low mileage
- Anti-theft devices
- Pay-in-full
- Occupational/affinity

Note {{state}}-specific discounts (like California's 20% good driver law).`,

    localStatsPrompt: `Provide 4-5 auto insurance statistics for {{city}}, {{state}}.

FORMAT: JSON array
[
  {
    "stat": "Statistic name",
    "value": "The number/value",
    "impact": "How this affects insurance costs (25-30 words)",
    "comparison": "vs state or national average"
  }
]

STATS TO INCLUDE:
1. Average annual premium in {{city}}
2. Uninsured driver percentage
3. Vehicle theft rate or accident rate
4. Traffic congestion ranking
5. Average commute time or miles driven

Make statistics realistic for {{city}}. Compare to state and national averages.`,

    coverageGuidePrompt: `Explain 4 auto insurance coverage types for {{city}} drivers.

FORMAT: JSON array
[
  {
    "type": "Coverage Type Name",
    "description": "What it covers (30-40 words)",
    "recommended": "Recommended limits for {{state}}",
    "whenNeeded": "Who should get this coverage"
  }
]

COVERAGE TYPES:
1. Liability Only (State Minimum)
2. Recommended Liability (Higher limits)
3. Full Coverage (Liability + Collision + Comprehensive)
4. Comprehensive + Uninsured Motorist

Tailor recommendations to {{city}} risks (traffic, theft, uninsured drivers).`,

    claimsProcessPrompt: `Explain the auto insurance claims process in {{state}}.

FORMAT: JSON object
{
  "steps": ["Step 1", "Step 2", ...], // 5-6 steps
  "documents": ["Doc 1", "Doc 2", ...], // 4-5 required docs
  "timeline": "How long claims typically take (20-30 words)",
  "resources": ["Resource 1", "Resource 2"] // State-specific resources
}

INCLUDE {{state}}-specific requirements and resources (DMV, Insurance Department).`,

    buyersGuidePrompt: `Create a buyer's guide: "How to Find Cheapest Car Insurance in {{city}}"

FORMAT: JSON object
{
  "steps": ["Step 1", "Step 2", ...], // 5-6 actionable steps
  "lookFor": ["Quality 1", "Quality 2", ...], // 3-4 things to seek
  "redFlags": ["Warning 1", "Warning 2", ...], // 3-4 red flags
  "questions": ["Question 1", "Question 2", ...] // 4-5 questions to ask
}

Make it specific to {{city}} when possible. Focus on finding affordable coverage.`,

    metaTagsPrompt: `Generate SEO meta tags for auto insurance in {{city}}, {{state}}.

TARGET KEYWORDS: "cheapest car insurance {{city}}", "cheap auto insurance {{state}}", "affordable car insurance {{city}} {{state}}"

REQUIREMENTS:
- metaTitle: 50-60 chars, include {{city}}, {{state}}, savings angle
- metaDescription: 150-160 chars, CTA, mention quotes/compare, dollar amounts
- metaKeywords: 6-8 relevant terms
- ogTitle: Social-friendly version
- ogDescription: Engaging social snippet

FORMAT: JSON object
{
  "metaTitle": "...",
  "metaDescription": "...",
  "metaKeywords": ["...", "..."],
  "ogTitle": "...",
  "ogDescription": "..."
}

EXAMPLES:
Title: "Cheapest Car Insurance in {{city}}, {{state}} | Save $500+"
Description: "Find cheap car insurance in {{city}}. Compare quotes and save. Average rates from $95/month. Get your free quote today!"`,

    // Example formats - shown to AI for consistent output structure
    exampleIntroFormat: `Looking for the cheapest car insurance in {{city}}? You're not alone. With {{city}}'s [local factor: heavy traffic on I-405/high accident rates in downtown/vehicle theft concerns], finding affordable coverage can feel like an uphill battle.

The good news? {{city}} drivers who compare quotes save an average of $[400-600] per year on their auto insurance. While the city's average premium of $[1,800-2,400] is higher than the state average, smart shoppers know that rates vary by $800+ between insurers.

Whether you're commuting through {{city}} or driving locally, this guide shows you how to find the cheapest rates, which discounts to ask for, and how to avoid costly coverage gaps. Ready to start saving? Let's dive in.`,

    exampleFaqsFormat: {
      faqs: [
        {
          question: "How do I find the cheapest car insurance in {{city}}?",
          answer: "Compare quotes from at least 5 insurers—rates vary by $800+ annually. Ask about multi-policy, safe driver, and good student discounts. Consider raising your deductible to $1,000 to save 15-30%. {{city}} drivers who shop around save an average of $487 per year."
        },
        {
          question: "What is the average cost of car insurance in {{city}}?",
          answer: "{{city}} drivers pay an average of $[1,800-2,200] annually for full coverage, about $[150-185]/month. Minimum liability averages $[550-750]/year. These rates are [comparison] due to [local factors]."
        },
        {
          question: "What car insurance is required in {{state}}?",
          answer: "{{state}} requires minimum liability coverage of [15/30/5 or state minimums]. This covers $15,000 per person, $30,000 per accident bodily injury, and $5,000 property damage. While this meets legal requirements, experts recommend higher limits for better protection."
        },
        {
          question: "How can I lower my car insurance rates in {{city}}?",
          answer: "Bundle auto with renters/home insurance for 10-25% savings. Maintain a clean driving record for 20% good driver discount. Raise your deductible to $1,000 for 15-30% reduction. Take a defensive driving course for 5-15% off. Shop around every 6 months."
        },
        {
          question: "Which insurance companies offer the cheapest rates in {{city}}?",
          answer: "GEICO, Progressive, and State Farm typically offer competitive rates in {{city}}, with good drivers finding policies from $[90-140]/month. However, rates vary by individual—always compare personalized quotes to find your best rate."
        }
      ]
    },

    exampleTipsFormat: {
      tips: [
        "Compare quotes from at least 5 different insurers every 6 months. {{city}} insurance rates vary by hundreds of dollars for identical coverage.",
        "Bundle your auto insurance with renters or homeowners insurance to save 10-25%. Multi-vehicle policies also qualify for discounts.",
        "Raise your deductible to $1,000 or higher to reduce premiums by 15-30%. Ensure you have emergency savings to cover the deductible if needed.",
        "Maintain a clean driving record—accidents can increase rates by 30-50% for 3-5 years. Take a defensive driving course for an additional 5-15% discount.",
        "Improve your credit score. Drivers with excellent credit pay 20-40% less than those with poor credit. Pay bills on time and reduce debt.",
        "Ask about all available discounts: good student (up to 25%), low mileage (up to 15%), occupational, and affinity group discounts.",
        "Pay your annual premium in full upfront rather than monthly to save 5-10%. Set up automatic payments to avoid late fees."
      ]
    },

    exampleCostBreakdownFormat: {
      costBreakdown: [
        {
          factor: "Minimum Liability Coverage",
          impact: "$540-720/year",
          description: "State-required minimum coverage. Cheapest option but offers limited protection. Suitable for older vehicles worth less than $3,000."
        },
        {
          factor: "Full Coverage (100/300/100)",
          impact: "$1,800-2,800/year",
          description: "Complete protection including collision and comprehensive. Recommended for vehicles worth more than $5,000 or if you have a loan/lease."
        },
        {
          factor: "High Traffic Areas",
          impact: "+15-25% premium",
          description: "Living in congested areas of {{city}} increases accident risk. Consider usage-based insurance if you work from home or drive less."
        },
        {
          factor: "Vehicle Theft Rate",
          impact: "+10-20% comprehensive",
          description: "{{city}}'s vehicle theft rates affect comprehensive premiums. Install anti-theft devices for a 5-15% discount."
        },
        {
          factor: "Good Driver Discount",
          impact: "Save 20%",
          description: "{{state}} requires a 20% discount for drivers with clean records (no accidents/tickets in 3 years)."
        },
        {
          factor: "Credit Score Impact",
          impact: "±20-40% variation",
          description: "Excellent credit can mean $400-800 annual savings compared to poor credit. Insurers use credit-based insurance scores."
        }
      ]
    },

    exampleMetaTagsFormat: {
      metaTags: {
        metaTitle: "Cheapest Car Insurance in {{city}}, {{state}} | Save $500+",
        metaDescription: "Find cheap car insurance in {{city}}. Compare quotes from top providers. Average rates from $95/month. Get your free quote today and save!",
        metaKeywords: [
          "cheap car insurance {{city}}",
          "affordable auto insurance {{state}}",
          "low cost car insurance {{city}}",
          "car insurance quotes {{city}}",
          "best car insurance rates {{state}}"
        ],
        ogTitle: "Save Big on Car Insurance in {{city}} | Free Quotes",
        ogDescription: "Compare affordable car insurance rates in {{city}}. Drivers save an average of $487/year. Get your free quote in minutes!"
      }
    }
  };

  if (existing) {
    console.log('📝 Updating existing template...');
    await prisma.aIPromptTemplate.update({
      where: { id: existing.id },
      data: templateData
    });
    console.log('✅ Template updated successfully!');
  } else {
    console.log('📝 Creating new template...');
    await prisma.aIPromptTemplate.create({
      data: templateData
    });
    console.log('✅ Template created successfully!');
  }

  console.log('\n📋 Template Summary:');
  console.log(`   Name: ${templateData.name}`);
  console.log(`   Insurance Type: ${insuranceType.name}`);
  console.log(`   Category: ${templateData.category}`);
  console.log(`   Sections: 12 content sections`);
  console.log(`   Example Formats: Included for all sections`);

  console.log('\n🎯 Next Steps:');
  console.log('1. Go to Admin → AI Content');
  console.log('2. Select "Auto" insurance type');
  console.log('3. Select states/cities to generate');
  console.log('4. Check all 12 content sections');
  console.log('5. Choose model: deepseek/deepseek-r1:free');
  console.log('6. Click "Start AI Generation"');

}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
