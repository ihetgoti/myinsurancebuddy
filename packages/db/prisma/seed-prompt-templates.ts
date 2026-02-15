/**
 * Seed Prompt Templates for Different Insurance Niches
 * 
 * Run with: npx ts-node prisma/seed-prompt-templates.ts
 * 
 * This creates default prompt templates that look like they were manually created,
 * so you can edit them later in the AI Templates section.
 * 
 * ALL 12 AI Content Sections are supported:
 * 1. intro - Introduction paragraph
 * 2. requirements - Coverage requirements  
 * 3. faqs - Frequently asked questions
 * 4. tips - Money-saving tips
 * 5. costBreakdown - Cost analysis
 * 6. comparison - Provider comparison
 * 7. discounts - Available discounts
 * 8. localStats - Local statistics
 * 9. coverageGuide - Coverage types guide
 * 10. claimsProcess - Claims process steps
 * 11. buyersGuide - Buyer's guide
 * 12. metaTags - SEO meta tags
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ALL 12 sections with complete prompts and examples
const ALL_SECTIONS = [
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
] as const;

// Complete prompt definitions for all 12 sections
const SECTION_PROMPTS = {
  intro: {
    prompt: `Write an engaging introduction (150-200 words) about finding the cheapest {{niche}} in {{location}}.

Key points to cover:
- Hook readers with a money-saving promise
- Mention average savings potential
- Highlight what makes {{location}} unique for {{niche}}
- Preview the money-saving tips they'll learn

Target keyword: "cheapest {{niche}} in {{location}}"

Write in a friendly, helpful tone that builds trust.`,
    example: `Looking for the cheapest auto insurance in Los Angeles? You're not alone. California drivers pay an average of $1,800/year, but savvy shoppers can cut that by 40% or more.

In this guide, we'll show you exactly how to find affordable coverage in Los Angeles without sacrificing protection. From little-known discounts to comparison shopping strategies, you'll learn proven ways to lower your premium.

Whether you're a new driver or looking to switch providers, these money-saving tips could put hundreds back in your pocket each year.`
  },
  
  requirements: {
    prompt: `List the minimum requirements for {{niche}} in {{location}}.

Focus on:
- What coverage is legally required vs optional (cheaper options)
- How meeting minimum requirements can lower costs
- Documentation needed
- State-specific requirements for {{location}}
- How to get the cheapest legal coverage

Format as easy-to-scan bullet points with clear explanations.`,
    example: `Minimum Auto Insurance Requirements in California:

• Bodily Injury Liability: $15,000 per person / $30,000 per accident
  - Covers medical expenses if you injure someone
  - Required by law - no way around this

• Property Damage Liability: $5,000 per accident
  - Covers damage to other people's property
  - Minimum is low; consider higher limits

• Uninsured Motorist Coverage: Optional but recommended
  - Protects you if hit by uninsured driver
  - Usually affordable add-on ($50-100/year)

Note: These are minimums. Higher coverage = higher premiums, but better protection.`
  },
  
  faqs: {
    prompt: `Create 5 FAQs focused on finding cheapest {{niche}} in {{location}}.

Required questions:
1. "How do I find the cheapest {{niche}} in {{location}}?"
2. "What factors affect {{niche}} rates in {{location}}?"
3. "How can I lower my {{niche}} premiums?"
4. "What discounts are available for {{niche}} in {{location}}?"
5. "Is minimum coverage enough or should I get more?"

Each answer should be 50-100 words with specific, actionable advice.
Include location-specific details where possible.`,
    example: JSON.stringify([
      {
        question: "How do I find the cheapest auto insurance in Los Angeles?",
        answer: "Start by comparing quotes from at least 3-5 providers. Use online comparison tools, but also contact local agents who may have access to exclusive discounts. Consider raising your deductible to $1,000, which can lower premiums by 15-30%. Bundle with renters or homeowners insurance for an additional 10-25% discount."
      },
      {
        question: "What factors affect auto insurance rates in Los Angeles?",
        answer: "Key factors include: ZIP code (rates vary by neighborhood), vehicle type (luxury cars cost more to insure), driving record (tickets can increase rates 20-40%), annual mileage (under 10,000 miles/year saves money), and credit score (higher scores get better rates)."
      },
      {
        question: "How can I lower my auto insurance premiums?",
        answer: "Top strategies: 1) Shop around every 6 months, 2) Bundle policies for multi-line discounts, 3) Raise deductibles to $1,000, 4) Ask about all available discounts, 5) Maintain good credit, 6) Drive safely to keep record clean, 7) Consider usage-based insurance if you drive less than average."
      },
      {
        question: "What discounts are available for auto insurance in Los Angeles?",
        answer: "Common discounts include: Safe driver (10-30%), Multi-policy (10-25%), Good student (10-15%), Low mileage (5-10%), Defensive driving course (5-15%), Anti-theft devices (5-10%), Paid-in-full (5-10%), and Auto-pay (5%). Always ask your agent about unadvertised discounts."
      },
      {
        question: "Is minimum coverage enough or should I get more?",
        answer: "Minimum coverage meets legal requirements but may not fully protect you. California's $15k/$30k/$5k limits are low - a serious accident could exceed these. Consider at least 50/100/50 coverage for better protection. Higher limits add relatively little cost while providing much better security."
      }
    ], null, 2)
  },
  
  tips: {
    prompt: `Provide 7 money-saving tips for {{niche}} in {{location}}.

Each tip should:
- Start with an action verb (Save, Compare, Bundle, etc.)
- Be specific to {{location}} when possible
- Include estimated savings if applicable
- Be 2-3 sentences long

Focus on: comparison shopping, discounts, coverage adjustments, and local opportunities.`,
    example: JSON.stringify([
      "Compare quotes every 6 months - Rates change frequently, and loyalty doesn't always pay. Shopping around could save you $300-500/year.",
      "Bundle policies for 10-25% off - Combine auto with renters or home insurance from the same provider.",
      "Raise your deductible to $1,000 - This simple change can reduce your premium by 15-30%.",
      "Ask about low-mileage discounts - If you drive under 10,000 miles/year, you could save 5-10%.",
      "Maintain good credit - In California, credit score significantly impacts your insurance rates.",
      "Take a defensive driving course - Many insurers offer 5-15% discounts for completed courses.",
      "Remove unnecessary coverage on old cars - If your car is worth less than $3,000, consider dropping comprehensive."
    ], null, 2)
  },
  
  costBreakdown: {
    prompt: `Explain {{niche}} costs in {{location}} with specific dollar amounts.

Include:
- Average cost ranges (minimum vs full coverage)
- How {{location}} compares to state/national averages
- Factors that make rates higher or lower in this area
- Cost examples for different profiles
- Ways to get the cheapest legal coverage
- Hidden fees to avoid

Use realistic dollar amounts based on {{location}} market.`,
    example: JSON.stringify([
      { factor: "Minimum Coverage", impact: "$450-650/year", description: "Meets legal requirements only. Cheapest option but limited protection." },
      { factor: "Standard Coverage", impact: "$1,200-1,800/year", description: "Includes collision and comprehensive. Most common choice." },
      { factor: "Full Coverage", impact: "$2,000-3,500/year", description: "Higher liability limits + all optional coverages. Maximum protection." },
      { factor: "Los Angeles Average", impact: "20% above state avg", description: "Higher population density and accident rates increase premiums." },
      { factor: "Good Driver Discount", impact: "Save 10-30%", description: "Clean driving record for 3+ years qualifies for significant savings." }
    ], null, 2)
  },
  
  comparison: {
    prompt: `Compare {{niche}} options in {{location}} focusing on value and price.

Compare 3-5 top providers or coverage levels:
- Minimum coverage (cheapest option)
- Standard coverage (best value)  
- Full coverage (most protection)

For each option include:
- Price range
- Coverage highlights
- Who it's best for
- Pros and cons

Be objective and help readers choose what's right for their budget.`,
    example: `Minimum Liability Coverage:
• Price: $450-650/year
• Coverage: State minimums only (15/30/5 in CA)
• Best for: Older cars worth less than $3,000, drivers on tight budgets
• Pros: Cheapest legal option, meets requirements
• Cons: No protection for your own vehicle, low liability limits

Standard Coverage (Recommended):
• Price: $1,200-1,800/year
• Coverage: 50/100/50 liability + collision + comprehensive
• Best for: Most drivers with vehicles worth $5,000+
• Pros: Good balance of protection and cost
• Cons: Higher out-of-pocket if you have an accident

Full Coverage Premium:
• Price: $2,000-3,500/year
• Coverage: 100/300/100 liability + all optional coverages
• Best for: Newer vehicles, high net worth individuals
• Pros: Maximum protection, peace of mind
• Cons: Significantly more expensive`
  },
  
  discounts: {
    prompt: `List all available {{niche}} discounts in {{location}}.

Include:
- Safe driver discounts
- Multi-policy/bundle discounts
- Good student discounts
- Low mileage discounts
- Defensive driving course discounts
- Loyalty discounts
- Payment method discounts (pay in full, auto-pay)
- Occupation/membership discounts
- Any location-specific discounts for {{location}}

For each discount include how much it can save (percentages or dollar amounts).`,
    example: `Available Auto Insurance Discounts in Los Angeles:

Safe Driver Discount: 10-30% off
• Qualify with 3-5 years of clean driving record
• No accidents, tickets, or claims

Multi-Policy Bundle: 10-25% off
• Combine auto + home/renters insurance
• Can also bundle with life insurance

Good Student Discount: 10-15% off
• Full-time students with B average or higher
• Available for drivers under 25

Low Mileage Discount: 5-10% off
• Drive under 7,500-10,000 miles/year
• Verified through odometer readings

Defensive Driving Course: 5-15% off
• Complete approved course (online or in-person)
• Valid for 3 years

Paid-in-Full Discount: 5-10% off
• Pay annual premium upfront
• Avoids monthly processing fees

Auto-Pay Discount: 5% off
• Set up automatic monthly payments
• Must use bank account (not credit card)

Affinity Discounts: Varies
• Certain employers, alumni associations, or professional groups
• Ask about memberships you may have`
  },
  
  localStats: {
    prompt: `Provide {{niche}} statistics for {{location}} relevant to saving money.

Include:
- Average premium costs (vs national/state average)
- What percentage of residents choose minimum coverage
- Most common discounts used in {{location}}
- How rates compare to neighboring areas
- Best times to shop for quotes
- Local factors that affect pricing
- Accident/claim rates if relevant

Make it specific to {{location}} - mention actual neighborhoods or ZIP codes if helpful.`,
    example: JSON.stringify([
      { stat: "Average Annual Premium", value: "$1,850", impact: "20% above state average", comparison: "California avg: $1,500 | National avg: $1,550" },
      { stat: "Minimum Coverage Users", value: "35%", impact: "Higher than state average", comparison: "Many choose minimum to save money" },
      { stat: "Most Common Discount", value: "Multi-Policy", impact: "25% average savings", comparison: "Bundling auto + home most popular" },
      { stat: "Highest Rate ZIP Codes", value: "90001, 90003, 90011", impact: "40-60% above average", comparison: "South LA areas have higher rates" },
      { stat: "Best Shopping Month", value: "December", impact: "5-10% lower quotes", comparison: "End-of-year promotions common" },
      { stat: "Accident Rate", value: "12% above average", impact: "Increases premiums", comparison: "Dense traffic leads to more claims" }
    ], null, 2)
  },
  
  coverageGuide: {
    prompt: `Explain {{niche}} coverage types with focus on cost vs protection in {{location}}.

Cover:
- Liability only (cheapest)
- Minimum required coverage
- Recommended coverage levels
- Full coverage (most expensive but most protection)
- Optional add-ons worth considering
- Coverage to skip to save money

Help readers choose the right balance of cost and protection for their budget and risk tolerance.`,
    example: `Understanding Auto Insurance Coverage Types:

Liability Coverage (Required):
• What it covers: Damage/injuries you cause to others
• Cost: Included in all policies (varies by limit)
• Recommendation: Get at least 50/100/50 (higher than minimum)

Collision Coverage (Optional):
• What it covers: Damage to your car from accidents
• Cost: $300-800/year depending on vehicle value
• Skip if: Your car is worth less than $3,000

Comprehensive Coverage (Optional):
• What it covers: Theft, vandalism, weather, fire
• Cost: $150-400/year
• Skip if: You can afford to replace your car

Uninsured/Underinsured Motorist:
• What it covers: Your injuries if hit by uninsured driver
• Cost: $50-150/year
• Recommendation: Worth it in LA (high uninsured driver rate)

Medical Payments:
• What it covers: Medical bills for you/passengers
• Cost: $50-200/year
• Recommendation: Optional if you have good health insurance`
  },
  
  claimsProcess: {
    prompt: `Explain the {{niche}} claims process in {{location}}.

Include:
- Step-by-step filing process
- Required documentation
- Expected timeline
- Local resources (adjusters, repair shops)
- Tips for smooth claims
- What to do immediately after an incident
- Common mistakes to avoid

Make it practical and actionable for someone who's just had an incident.`,
    example: JSON.stringify({
      steps: [
        "Stay safe and call 911 if there are injuries",
        "Document the scene with photos/video",
        "Exchange information with other parties",
        "Contact your insurance company within 24 hours",
        "File a police report if required ($1,000+ damage in CA)",
        "Get repair estimates from approved shops",
        "Work with your assigned claims adjuster",
        "Review settlement offer before accepting"
      ],
      documents: [
        "Police report (if applicable)",
        "Photos of damage",
        "Other driver's insurance info",
        "Witness contact information",
        "Medical records (if injured)",
        "Repair estimates"
      ],
      timeline: "Simple claims: 1-2 weeks. Complex claims: 30-60 days."
    }, null, 2)
  },
  
  buyersGuide: {
    prompt: `Create a step-by-step buyer's guide for {{niche}} in {{location}}.

Steps should include:
1. Assess your coverage needs
2. Gather your information
3. Get multiple quotes (how many, where)
4. Compare apples to apples
5. Ask about ALL discounts
6. Review the policy before buying
7. Re-shop every 6-12 months

Also include:
- What to look for in a good policy
- Red flags to avoid
- Questions to ask agents
- Local considerations for {{location}}

Make it a complete guide someone could follow start to finish.`,
    example: JSON.stringify({
      steps: [
        "Assess your needs: Consider vehicle value, assets to protect, and budget",
        "Gather info: Have VIN, driver's license, and current policy ready",
        "Get 5+ quotes: Use online tools + contact local independent agents",
        "Compare coverage: Match liability limits and deductibles for fair comparison",
        "Check reviews: Look at customer service and claims satisfaction ratings",
        "Ask about discounts: Mention all memberships, safe driving, etc.",
        "Read before signing: Understand exclusions, limits, and cancellation terms",
        "Set calendar reminder: Re-shop every 6 months for best rates"
      ],
      lookFor: [
        "Financial stability (A.M. Best rating)",
        "Good customer service reviews",
        "Easy claims process",
        "Multiple discount opportunities",
        "Flexible payment options"
      ],
      redFlags: [
        "Quotes significantly lower than competitors (may lack coverage)",
        "Pressure to buy immediately",
        "No local agent or support",
        "Poor claims reviews online",
        "Difficulty reaching customer service"
      ],
      questions: [
        "What discounts do I qualify for?",
        "What's the claims process like?",
        "Can I customize my coverage?",
        "What happens if I miss a payment?",
        "Is there a local agent I can meet?"
      ]
    }, null, 2)
  },
  
  metaTags: {
    prompt: `Generate SEO meta tags targeting "cheapest {{niche}} in {{location}}".

Requirements:
- Title: Include main keyword, under 60 characters, compelling
- Description: Under 160 characters, include benefits and CTA
- Keywords: Focus on cost-saving terms
- OG tags: For social sharing

Make it click-worthy but accurate.`,
    example: JSON.stringify({
      metaTitle: "Cheapest {{niche}} in {{location}} | Save Up to 40% Today",
      metaDescription: "Find the cheapest {{niche}} in {{location}}. Compare quotes from top providers and save up to $500/year. Free guide to affordable coverage.",
      metaKeywords: ["cheap {{niche}}", "affordable {{niche}}", "lowest rates", "{{niche}} quotes", "save on {{niche}}"],
      ogTitle: "Find Cheapest {{niche}} in {{location}} | Compare & Save",
      ogDescription: "Discover proven ways to save on {{niche}} in {{location}}. Compare rates and find affordable coverage that fits your budget."
    }, null, 2)
  }
};

// Template definitions for each niche
const nicheTemplates = [
  {
    category: 'auto-insurance',
    name: 'Auto Insurance - Complete Template',
    description: 'Complete template for auto insurance pages with all 12 sections. Includes example formats for consistent, high-quality output.',
    insuranceTypeSlug: 'car-insurance',
    systemPrompt: `You are an expert auto insurance content writer specializing in helping drivers find affordable coverage. Your content is:
- SEO-optimized with natural keyword placement
- Focused on cost savings without sacrificing necessary protection
- Accurate about insurance requirements and regulations
- Location-aware with state and city-specific details
- Practical with actionable money-saving tips

Write in a friendly, helpful tone that builds trust with readers looking to save money on their car insurance.`,
    ...SECTION_PROMPTS
  },
  {
    category: 'home-insurance',
    name: 'Home Insurance - Complete Template',
    description: 'Complete template for home insurance pages with all 12 sections. Focus on protecting homes while saving money.',
    insuranceTypeSlug: 'home-insurance',
    systemPrompt: `You are an expert home insurance content writer specializing in helping homeowners find affordable coverage. Your content is:
- SEO-optimized with natural keyword placement
- Focused on protecting homes while saving money
- Educational about coverage types and options
- Location-aware with regional risk factors
- Practical with actionable savings strategies

Balance cost savings with adequate protection for the home.`,
    intro: {
      prompt: `Write an engaging introduction (150-200 words) about finding affordable home insurance in {{location}}.

Key points:
- Address the importance of home protection
- Mention typical savings opportunities
- Reference local factors (weather, crime, property values in {{location}})
- Promise specific money-saving strategies

Target keyword: "cheapest home insurance in {{location}}"`,
      example: `Your home is likely your biggest investment, but that doesn't mean insurance has to break the bank. Homeowners in {{location}} can find quality coverage at surprisingly affordable rates with the right approach.

While average premiums in the area run around $1,200 annually, savvy homeowners are paying 20-35% less without sacrificing protection. The key is knowing which coverage you actually need, which discounts you qualify for, and how to comparison shop effectively.

In this guide, we'll walk you through proven strategies to lower your home insurance costs while maintaining the protection your home deserves. From bundling discounts to deductible strategies, these tips could save you $300-500 per year.`
    },
    requirements: SECTION_PROMPTS.requirements,
    faqs: {
      prompt: `Create 5 FAQs about home insurance in {{location}}.

Questions:
1. "How much does home insurance cost in {{location}}?"
2. "What does home insurance typically cover?"
3. "How can I lower my home insurance premiums?"
4. "What factors affect home insurance rates in {{location}}?"
5. "Do I need additional coverage beyond standard policy?"

Answers should be informative and include location-specific details.`,
      example: SECTION_PROMPTS.faqs.example
    },
    tips: {
      prompt: `Provide 7 tips for saving on home insurance in {{location}}.

Include tips on:
- Shopping and comparing rates
- Bundling with auto insurance
- Increasing deductibles
- Home improvements that lower rates
- Asking about all available discounts
- Maintaining good credit
- Reviewing coverage annually`,
      example: JSON.stringify([
        "Bundle with auto insurance - Save 10-25% by combining policies with one provider",
        "Raise your deductible - Going from $500 to $1,000 can save 15-25%",
        "Improve home security - Alarm systems and deadbolts can reduce premiums 5-20%",
        "Maintain good credit - Credit score significantly impacts home insurance rates",
        "Ask about loyalty discounts - Staying with one company 3+ years often saves 5-10%",
        "Review coverage annually - Don't pay for coverage you no longer need",
        "Shop around every 2-3 years - Loyalty doesn't always pay in insurance"
      ], null, 2)
    },
    costBreakdown: SECTION_PROMPTS.costBreakdown,
    comparison: SECTION_PROMPTS.comparison,
    discounts: SECTION_PROMPTS.discounts,
    localStats: SECTION_PROMPTS.localStats,
    coverageGuide: SECTION_PROMPTS.coverageGuide,
    claimsProcess: SECTION_PROMPTS.claimsProcess,
    buyersGuide: SECTION_PROMPTS.buyersGuide,
    metaTags: SECTION_PROMPTS.metaTags
  },
  {
    category: 'health-insurance',
    name: 'Health Insurance - Complete Template',
    description: 'Complete template for health insurance pages. Focus on finding affordable plans and understanding options.',
    insuranceTypeSlug: 'health-insurance',
    systemPrompt: `You are a health insurance content specialist focused on helping people find affordable coverage. Your content:
- Explains complex insurance terms simply
- Focuses on cost-saving opportunities
- Includes information about subsidies and assistance
- Is compliant and avoids medical advice
- Emphasizes finding the right balance of cost and coverage

Always encourage readers to consult licensed agents for personalized advice.`,
    intro: {
      prompt: `Write an introduction about finding affordable health insurance in {{location}}.

Address:
- Importance of having coverage
- Common concerns about cost
- Available options in {{location}}
- Savings opportunities (subsidies, etc.)

Target: "cheapest health insurance in {{location}}"`,
      example: `Finding affordable health insurance in {{location}} doesn't have to be overwhelming. Whether you're self-employed, between jobs, or looking for better coverage, options exist at every budget level.

Many residents qualify for subsidies that can reduce monthly premiums to $100 or less. Understanding your options—from marketplace plans to short-term coverage—can help you find the protection you need without straining your finances.

This guide breaks down everything you need to know about getting covered in {{location}}, including money-saving strategies many people overlook.`
    },
    requirements: SECTION_PROMPTS.requirements,
    faqs: {
      prompt: `Create FAQs about health insurance options in {{location}}.

Cover questions about:
- Costs and subsidies
- Enrollment periods
- Coverage types
- Pre-existing conditions
- Finding local providers`,
      example: SECTION_PROMPTS.faqs.example
    },
    tips: {
      prompt: `Provide tips for saving on health insurance.

Include:
- Subsidy qualification
- Plan comparison strategies
- HSA options
- Network considerations
- Annual review importance`,
      example: JSON.stringify([
        "Check subsidy eligibility - Many qualify for ACA subsidies reducing premiums significantly",
        "Compare Bronze vs Silver plans - Consider total cost including deductibles",
        "Use HSAs - Health Savings Accounts offer tax advantages for high-deductible plans",
        "Stay in-network - Out-of-network costs can be substantially higher",
        "Review annually - Life changes may qualify you for special enrollment or better plans"
      ], null, 2)
    },
    costBreakdown: SECTION_PROMPTS.costBreakdown,
    comparison: SECTION_PROMPTS.comparison,
    discounts: SECTION_PROMPTS.discounts,
    localStats: SECTION_PROMPTS.localStats,
    coverageGuide: SECTION_PROMPTS.coverageGuide,
    claimsProcess: SECTION_PROMPTS.claimsProcess,
    buyersGuide: SECTION_PROMPTS.buyersGuide,
    metaTags: SECTION_PROMPTS.metaTags
  },
  {
    category: 'life-insurance',
    name: 'Life Insurance - Complete Template',
    description: 'Complete template for life insurance pages. Focus on affordable protection for families.',
    insuranceTypeSlug: 'life-insurance',
    systemPrompt: `You are a life insurance content writer helping people understand and afford coverage. Your content:
- Explains different policy types clearly
- Focuses on value and appropriate coverage levels
- Is sensitive to the topic while being practical
- Includes cost-saving strategies
- Emphasizes protection for loved ones`,
    intro: {
      prompt: `Write about affordable life insurance options in {{location}}.

Focus on:
- Importance of protecting family
- Affordability of term life
- Getting the right amount of coverage
- Local considerations`,
      example: `Protecting your family's financial future doesn't have to be expensive. Life insurance in {{location}} is more affordable than most people think—especially term life policies that provide substantial coverage at low monthly costs.

A healthy 30-year-old can get $500,000 of term life coverage for less than $25 per month. The key is understanding your options and choosing the right type and amount of coverage for your specific situation.

In this guide, we'll help you navigate life insurance options in {{location}}, find affordable rates, and ensure your loved ones are protected without breaking your budget.`
    },
    requirements: SECTION_PROMPTS.requirements,
    faqs: {
      prompt: `Create FAQs about life insurance.

Cover:
- Term vs whole life
- How much coverage needed
- Cost factors
- Medical exams
- Beneficiary rules`,
      example: SECTION_PROMPTS.faqs.example
    },
    tips: {
      prompt: `Provide tips for affordable life insurance.

Include:
- Buying term life
- Comparing quotes
- Health improvements
- Payment options
- Laddering strategies`,
      example: JSON.stringify([
        "Buy term, not whole life - Term provides more coverage for less money",
        "Get quotes from 5+ companies - Rates vary significantly between insurers",
        "Improve health before applying - Quit smoking, lose weight for better rates",
        "Pay annually instead of monthly - Saves 5-10% on total cost",
        "Ladder policies - Buy multiple term policies with different lengths as needed"
      ], null, 2)
    },
    costBreakdown: SECTION_PROMPTS.costBreakdown,
    comparison: SECTION_PROMPTS.comparison,
    discounts: SECTION_PROMPTS.discounts,
    localStats: SECTION_PROMPTS.localStats,
    coverageGuide: SECTION_PROMPTS.coverageGuide,
    claimsProcess: SECTION_PROMPTS.claimsProcess,
    buyersGuide: SECTION_PROMPTS.buyersGuide,
    metaTags: SECTION_PROMPTS.metaTags
  },
  {
    category: 'business-insurance',
    name: 'Business Insurance - Complete Template',
    description: 'Complete template for business insurance pages. Focus on protecting businesses affordably.',
    insuranceTypeSlug: 'business-insurance',
    systemPrompt: `You are a business insurance expert helping business owners protect their companies affordably. Your content:
- Explains necessary coverage types
- Addresses industry-specific needs
- Focuses on cost-effective protection
- Includes risk management tips
- Scales advice for different business sizes`,
    intro: {
      prompt: `Write about affordable business insurance in {{location}}.

Address:
- Types of coverage needed
- Cost factors for businesses
- Local business environment
- Protection vs cost balance`,
      example: `Running a business in {{location}} comes with enough challenges—insurance shouldn't be one of them. Whether you're a startup or established company, affordable business insurance options exist to protect your investment without draining your budget.

Many business owners overpay because they don't understand which coverage they actually need. From general liability to professional liability, workers' comp to commercial property, knowing your options can save you thousands annually.

This guide breaks down business insurance requirements in {{location}}, helps you identify necessary coverage, and shows you strategies to get the best rates while maintaining proper protection.`
    },
    requirements: SECTION_PROMPTS.requirements,
    faqs: {
      prompt: `Create FAQs about business insurance.

Cover:
- Required coverage types
- Cost factors
- Industry-specific needs
- Claims process
- Policy updates`,
      example: SECTION_PROMPTS.faqs.example
    },
    tips: {
      prompt: `Provide tips for affordable business insurance.

Include:
- Risk management
- Bundling policies
- Deductible choices
- Annual reviews
- Agent relationships`,
      example: JSON.stringify([
        "Bundle multiple coverages - BOP (Business Owner's Policy) combines liability and property at discount",
        "Implement safety programs - Reduces workers' comp claims and premiums",
        "Choose higher deductibles - Lower premiums if you can afford out-of-pocket costs",
        "Pay annual premium upfront - Avoids installment fees (5-10% savings)",
        "Work with independent agent - Access to multiple carriers for best rates"
      ], null, 2)
    },
    costBreakdown: SECTION_PROMPTS.costBreakdown,
    comparison: SECTION_PROMPTS.comparison,
    discounts: SECTION_PROMPTS.discounts,
    localStats: SECTION_PROMPTS.localStats,
    coverageGuide: SECTION_PROMPTS.coverageGuide,
    claimsProcess: SECTION_PROMPTS.claimsProcess,
    buyersGuide: SECTION_PROMPTS.buyersGuide,
    metaTags: SECTION_PROMPTS.metaTags
  }
];

async function seedPromptTemplates() {
  console.log('🌱 Seeding prompt templates...\n');
  console.log(`📋 Supporting ALL ${ALL_SECTIONS.length} content sections:\n`);
  ALL_SECTIONS.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
  console.log('');

  for (const template of nicheTemplates) {
    try {
      // Find the insurance type
      const insuranceType = await prisma.insuranceType.findFirst({
        where: { 
          slug: template.insuranceTypeSlug 
        }
      });

      if (!insuranceType) {
        console.log(`⚠️  Insurance type "${template.insuranceTypeSlug}" not found, skipping...`);
        continue;
      }

      // Check if template already exists
      const existing = await prisma.aIPromptTemplate.findFirst({
        where: {
          name: template.name,
          insuranceTypeId: insuranceType.id
        }
      });

      if (existing) {
        console.log(`⏭️  Template "${template.name}" already exists, skipping...`);
        continue;
      }

      // Build the template data with ALL 12 sections
      const templateData: any = {
        name: template.name,
        description: template.description,
        category: template.category,
        insuranceTypeId: insuranceType.id,
        
        // System prompt
        systemPrompt: template.systemPrompt || SECTION_PROMPTS.systemPrompt,
        
        // ALL 12 section prompts
        introPrompt: template.intro?.prompt || template.introPrompt || SECTION_PROMPTS.intro.prompt,
        requirementsPrompt: template.requirements?.prompt || SECTION_PROMPTS.requirements.prompt,
        faqsPrompt: template.faqs?.prompt || template.faqsPrompt || SECTION_PROMPTS.faqs.prompt,
        tipsPrompt: template.tips?.prompt || template.tipsPrompt || SECTION_PROMPTS.tips.prompt,
        costBreakdownPrompt: template.costBreakdown?.prompt || SECTION_PROMPTS.costBreakdown.prompt,
        comparisonPrompt: template.comparison?.prompt || SECTION_PROMPTS.comparison.prompt,
        discountsPrompt: template.discounts?.prompt || SECTION_PROMPTS.discounts.prompt,
        localStatsPrompt: template.localStats?.prompt || SECTION_PROMPTS.localStats.prompt,
        coverageGuidePrompt: template.coverageGuide?.prompt || SECTION_PROMPTS.coverageGuide.prompt,
        claimsProcessPrompt: template.claimsProcess?.prompt || SECTION_PROMPTS.claimsProcess.prompt,
        buyersGuidePrompt: template.buyersGuide?.prompt || SECTION_PROMPTS.buyersGuide.prompt,
        metaTagsPrompt: template.metaTags?.prompt || SECTION_PROMPTS.metaTags.prompt,
        
        // Example formats for consistent output
        exampleIntroFormat: template.intro?.example || template.exampleIntroFormat || SECTION_PROMPTS.intro.example,
        exampleFaqsFormat: template.faqs?.example ? JSON.parse(template.faqs.example) : (template.exampleFaqsFormat || JSON.parse(SECTION_PROMPTS.faqs.example)),
        exampleTipsFormat: template.tips?.example ? JSON.parse(template.tips.example) : (template.exampleTipsFormat || JSON.parse(SECTION_PROMPTS.tips.example)),
        exampleCostBreakdownFormat: template.exampleCostBreakdownFormat || JSON.parse(SECTION_PROMPTS.costBreakdown.example),
        exampleMetaTagsFormat: template.exampleMetaTagsFormat || JSON.parse(SECTION_PROMPTS.metaTags.example),
        
        // AI settings
        model: 'deepseek/deepseek-r1:free',
        temperature: 0.7,
        maxTokens: 4000,
        
        // Status and tracking
        isActive: true,
        isDefault: true,
        isSystem: false, // Looks like manually created
        priority: 10,
        usageCount: 0,
        
        // Available variables documentation
        availableVars: JSON.stringify([
          '{{location}} - City or state name',
          '{{niche}} - Insurance type (auto insurance, home insurance, etc.)',
          '{{state}} - State name',
          '{{city}} - City name'
        ]),
        
        // Example complete output
        exampleOutput: JSON.stringify({
          intro: 'Introduction paragraph...',
          requirements: 'Requirements list...',
          faqs: [{ question: '...', answer: '...' }],
          tips: ['Tip 1...', 'Tip 2...'],
          costBreakdown: [{ factor: '...', impact: '...', description: '...' }],
          comparison: 'Comparison content...',
          discounts: 'Discounts list...',
          localStats: [{ stat: '...', value: '...', impact: '...', comparison: '...' }],
          coverageGuide: 'Coverage guide...',
          claimsProcess: { steps: [], documents: [], timeline: '' },
          buyersGuide: { steps: [], lookFor: [], redFlags: [], questions: [] },
          metaTags: { metaTitle: '...', metaDescription: '...', metaKeywords: [] }
        })
      };

      // Create the template
      await prisma.aIPromptTemplate.create({
        data: templateData
      });

      console.log(`✅ Created template: ${template.name}`);
      console.log(`   📁 Category: ${template.category}`);
      console.log(`   🔢 Sections: ${ALL_SECTIONS.length} (all configured)`);
      console.log('');
    } catch (error) {
      console.error(`❌ Error creating template "${template.name}":`, error);
    }
  }

  console.log('✨ Done seeding prompt templates!\n');
  console.log('📊 Summary:');
  console.log(`   • Total sections supported: ${ALL_SECTIONS.length}`);
  console.log(`   • Template categories: ${nicheTemplates.length}`);
  console.log(`   • All templates include example formats for consistent output`);
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Edit templates in: Admin Dashboard → AI Templates');
  console.log('   2. Customize prompts for your specific needs');
  console.log('   3. Update example formats to match your brand voice');
  console.log('');
}

seedPromptTemplates()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
