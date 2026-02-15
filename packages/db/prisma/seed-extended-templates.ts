/**
 * Extended AI Prompt Templates - 25+ Content Sections
 * 
 * Run with: npx ts-node prisma/seed-extended-templates.ts
 * 
 * This adds prompts for all extended AI content sections
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extended section prompts for rich content generation
const EXTENDED_SECTIONS = {
  heroSection: {
    prompt: `Create a compelling hero section for {{niche}} in {{location}}.

Include:
- Attention-grabbing headline (5-8 words) with main keyword
- Supporting subheadline (10-15 words) that promises value
- Hook statement that creates urgency or curiosity
- Primary value proposition (save money, get better coverage, etc.)

Target: "cheapest {{niche}} in {{location}}"
Tone: Confident, helpful, urgent but not pushy`,
    example: JSON.stringify({
      headline: "Save Up to 40% on Car Insurance in Los Angeles",
      subheadline: "Compare rates from top providers and find affordable coverage in minutes",
      hook: "LA drivers are overpaying by $500/year on average. Don't be one of them.",
      cta: "Get Your Free Quote"
    })
  },

  keyTakeaways: {
    prompt: `Generate 5-7 key takeaways for {{niche}} in {{location}}.

These should be:
- Scannable bullet points
- Highlight the most important information
- Include specific numbers/data when possible
- Focus on money-saving and protection
- Optimized for featured snippets

Format as concise bullets (1-2 sentences each).`,
    example: JSON.stringify([
      "LA drivers pay an average of $1,800/year, but comparison shopping can save 40%",
      "Minimum coverage costs $450-650/year while full coverage ranges $2,000-3,500",
      "Bundling auto + renters insurance saves 10-25% with most providers",
      "Raising deductibles to $1,000 reduces premiums by 15-30%",
      "Good driver discounts can lower rates by 10-30%"
    ])
  },

  quickAnswers: {
    prompt: `Create 5 quick answer boxes for common {{niche}} questions in {{location}}.

Format like "People Also Ask" boxes:
- Direct, concise answers (30-50 words)
- Start with the key information
- Include location-specific details
- Easy to scan and understand

Questions to answer:
1. What's the cheapest {{niche}} in {{location}}?
2. How much is {{niche}} per month in {{location}}?
3. Who has the best rates for {{niche}} in {{location}}?
4. What coverage do I need in {{location}}?
5. How can I lower my {{niche}} costs?`,
    example: JSON.stringify([
      { question: "What's the cheapest auto insurance in Los Angeles?", answer: "The cheapest auto insurance in LA starts at $450/year for minimum coverage. Providers like GEICO, Progressive, and State Farm offer competitive rates. Compare quotes from at least 5 companies to find the best deal." },
      { question: "How much is car insurance per month in LA?", answer: "Car insurance in LA averages $150/month for full coverage and $55/month for minimum coverage. Rates vary by ZIP code, driving record, and vehicle type." }
    ])
  },

  prosCons: {
    prompt: `Generate pros and cons for getting {{niche}} in {{location}}.

Include:
- 5-6 pros specific to {{location}} (local advantages, savings opportunities)
- 5-6 cons/challenges (cost factors, requirements)
- Be honest and balanced
- Focus on practical considerations

Format as structured pros/cons list.`,
    example: JSON.stringify({
      pros: [
        "Competitive market means more choices and better rates",
        "Many discount opportunities available (good driver, multi-policy, etc.)",
        "Online comparison tools make shopping easy",
        "California requires insurers to offer good driver discounts",
        "Usage-based insurance options for low-mileage drivers"
      ],
      cons: [
        "Higher than average rates due to traffic and theft",
        "Minimum coverage limits are low ($15k/$30k/$5k)",
        "Credit score can impact rates significantly",
        "Dense traffic increases accident risk",
        "Vehicle theft rates are above national average"
      ]
    })
  },

  topProviders: {
    prompt: `Create a comparison of top 5 {{niche}} providers in {{location}}.

For each provider include:
- Company name
- Estimated price range for {{location}}
- 2-3 key strengths
- 1-2 potential drawbacks
- Best for (type of driver)
- Star rating (1-5)

Be objective and helpful. Focus on value, not just price.`,
    example: JSON.stringify([
      { name: "GEICO", priceRange: "$600-1,400/year", strengths: ["Competitive rates", "Easy online quotes", "Strong financial rating"], drawbacks: ["Limited local agents"], bestFor: "Tech-savvy shoppers", rating: 4.5 },
      { name: "State Farm", priceRange: "$700-1,600/year", strengths: ["Local agent support", "Bundling discounts", "Strong claims service"], drawbacks: ["Higher base rates"], bestFor: "Those who want personal service", rating: 4.3 }
    ])
  },

  pricingTable: {
    prompt: `Create a detailed pricing table for {{niche}} in {{location}}.

Include:
- Coverage levels (Minimum, Standard, Full)
- Price ranges for each level
- What's included in each
- Best use cases
- Average savings opportunities

Make it specific to {{location}} market conditions.`,
    example: JSON.stringify([
      { level: "Minimum Coverage", annualCost: "$450-650", monthlyCost: "$38-54", coverage: "15/30/5 liability only", bestFor: "Budget-conscious drivers with older cars", savingsOpportunity: "Pay annually to save 5-10%" },
      { level: "Standard Coverage", annualCost: "$1,200-1,800", monthlyCost: "$100-150", coverage: "50/100/50 + collision/comprehensive", bestFor: "Most drivers with newer vehicles", savingsOpportunity: "Bundle with renters for 10-25% off" },
      { level: "Full Coverage", annualCost: "$2,000-3,500", monthlyCost: "$167-292", coverage: "100/300/100 + all options", bestFor: "New cars, high assets, peace of mind", savingsOpportunity: "Shop every 6 months, compare 5+ quotes" }
    ])
  },

  localInsights: {
    prompt: `Generate location-specific insights for {{niche}} in {{location}}.

Include:
- Neighborhood-specific rate variations
- Local risk factors (traffic, weather, crime)
- City/state regulations that affect pricing
- Best ZIP codes for rates
- Local insurance trends
- Unique factors about {{location}}

Make it highly specific and valuable.`,
    example: JSON.stringify([
      { insight: "West LA ZIP codes (90025, 90064) have 15-20% higher rates due to traffic density", category: "Location Factor" },
      { insight: "Valley areas (Sherman Oaks, Encino) often see lower comprehensive rates", category: "Theft Risk" },
      { insight: "California's Proposition 103 regulates rate increases and ensures good driver discounts", category: "Regulation" },
      { insight: "LA County has 3x the national average for vehicle theft - comprehensive is highly recommended", category: "Risk Factor" }
    ])
  },

  commonMistakes: {
    prompt: `List 7 common mistakes people make with {{niche}} in {{location}}.

For each mistake include:
- What the mistake is
- Why it costs money
- How to avoid it
- Potential savings from avoiding it

Focus on practical, actionable advice.`,
    example: JSON.stringify([
      { mistake: "Not comparing quotes annually", cost: "$300-500/year", solution: "Shop around every 6-12 months using comparison sites", savings: "Up to 40% off your current rate" },
      { mistake: "Buying minimum coverage only", cost: "Financial risk in accidents", solution: "Get at least 50/100/50 coverage for adequate protection", savings: "Prevents out-of-pocket costs" },
      { mistake: "Missing eligible discounts", cost: "$200-400/year", solution: "Ask agents about all available discounts", savings: "10-25% with bundling alone" }
    ])
  },

  expertTips: {
    prompt: `Generate 7 expert-level insider tips for {{niche}} in {{location}}.

These should be:
- Advanced strategies most people don't know
- Insider knowledge from industry experts
- Tactics that save significant money
- Legal but clever approaches

Make readers feel like they're getting privileged information.`,
    example: JSON.stringify([
      "Time your quote requests: Rates are often lower mid-month when agents need sales",
      "Use 'quote stacking' - get quotes 2 weeks apart and mention competitors' rates",
      "Pay annually instead of monthly to avoid $50-100 in installment fees",
      "Remove comprehensive on cars worth under $3,000 (calculate break-even)",
      "Ask for 're-shopping' - some agents can access better rates than online quotes"
    ])
  },

  savingStrategies: {
    prompt: `Create 10 specific money-saving strategies for {{niche}} in {{location}}.

Each strategy should:
- Have a clear action step
- Include estimated savings
- Explain how it works
- Be specific to {{location}} when possible

Organize by ease of implementation (easy to advanced).`,
    example: JSON.stringify([
      { strategy: "Increase deductible to $1,000", savings: "$200-400/year", effort: "Easy", description: "Simple phone call or online change" },
      { strategy: "Bundle auto + renters", savings: "$150-300/year", effort: "Easy", description: "Use same provider for both policies" },
      { strategy: "Complete defensive driving course", savings: "$100-200/year", effort: "Medium", description: "6-hour online course, valid for 3 years" },
      { strategy: "Install anti-theft device", savings: "$50-150/year", effort: "Medium", description: "VIN etching, alarm system, or GPS tracker" }
    ])
  },

  regulatoryInfo: {
    prompt: `Explain {{niche}} regulations specific to {{location}} (state level).

Include:
- Minimum coverage requirements
- State-specific laws affecting rates
- Consumer protection regulations
- Recent regulatory changes
- How to file complaints
- Department of Insurance contact info

Be accurate and helpful for compliance.`,
    example: JSON.stringify({
      minimumRequirements: "California requires 15/30/5 liability coverage",
      consumerProtections: "Proposition 103 requires good driver discounts, limits rate increases",
      recentChanges: "No recent major changes to auto insurance regulations",
      complaints: "File with California Department of Insurance at insurance.ca.gov"
    })
  },

  industryTrends: {
    prompt: `Describe current {{niche}} industry trends affecting {{location}}.

Include:
- Rate trends (increasing/decreasing)
- New coverage options
- Technology impacts (telematics, apps)
- Market competition changes
- Emerging risks
- Future outlook

Keep it current and relevant.`,
    example: JSON.stringify([
      { trend: "Usage-based insurance growing 15% annually", impact: "Low-mileage drivers can save 30-40%" },
      { trend: "Digital-first insurers gaining market share", impact: "Lower overhead = lower rates for consumers" },
      { trend: "Telematics becoming standard", impact: "Safe driving habits directly reduce premiums" }
    ])
  },

  testimonials: {
    prompt: `Create 5 realistic testimonial templates for {{niche}} customers in {{location}}.

Each testimonial should:
- Feel authentic and specific
- Mention {{location}} or local details
- Include specific savings amounts
- Tell a mini-story
- Sound like real people (varied backgrounds)

Make them relatable and trustworthy.`,
    example: JSON.stringify([
      { name: "Sarah M.", location: "Santa Monica", quote: "I was paying $2,100/year with my old insurer. After comparing quotes, I found the same coverage for $1,400. That's $700 back in my pocket!", savings: "$700/year", rating: 5 },
      { name: "David K.", location: "Downtown LA", quote: "As a rideshare driver, I needed special coverage. Found a policy that covers both personal and business use for less than I was paying before.", savings: "$300/year", rating: 5 }
    ])
  },

  socialPosts: {
    prompt: `Create 5 social media post variations for {{niche}} in {{location}}.

Include:
- 1 attention-grabbing stat post
- 1 tip/savings post
- 1 question/engagement post
- 1 testimonial-style post
- 1 urgency/limited-time post

Each should be platform-agnostic (works on FB, IG, Twitter).`,
    example: JSON.stringify([
      { type: "stat", content: "🚨 LA drivers are overpaying by $500/year on car insurance. Are you one of them? Compare quotes and save up to 40%!" },
      { type: "tip", content: "💡 Insurance Tip: Raising your deductible from $500 to $1,000 can save you 15-30% on premiums. That's $200-400/year!" },
      { type: "question", content: "What's the most you've ever saved on car insurance? Share your story! 👇" }
    ])
  },

  emailTemplate: {
    prompt: `Write an email capture template for {{niche}} in {{location}}.

Include:
- Subject line options (3 variations)
- Headline for the form
- Brief value proposition
- What they'll get (lead magnet)
- CTA button text
- Privacy reassurance

Focus on high conversion.`,
    example: JSON.stringify({
      subjectLines: ["Save up to 40% on car insurance in LA", "Your personalized insurance savings report", "LA drivers: Stop overpaying for insurance"],
      headline: "Get Your Free Insurance Savings Report",
      valueProp: "Discover exactly how much you could save based on your specific situation",
      leadMagnet: "Personalized comparison of top 5 providers + exclusive local discounts",
      cta: "Send My Free Report",
      privacy: "We never spam. Unsubscribe anytime."
    })
  },

  longFormGuide: {
    prompt: `Write a comprehensive 2000+ word guide outline for {{niche}} in {{location}}.

Include:
- Detailed H2 and H3 headings
- Key points to cover in each section
- Statistics and data to include
- Local {{location}} specifics throughout
- Actionable takeaways at each section

This should be the ultimate resource on the topic.`,
    example: JSON.stringify({
      sections: [
        { h2: "Understanding Car Insurance in Los Angeles", h3s: ["Why LA Rates Are Higher", "California Insurance Laws", "How Rates Are Calculated"], keyPoints: ["LA rates 20% above state average", "ZIP code matters significantly"] },
        { h2: "Minimum vs Full Coverage", h3s: ["What Minimum Coverage Includes", "When Full Coverage Makes Sense", "Cost Comparison"], keyPoints: ["Minimum: $450-650/year", "Full: $2,000-3,500/year"] },
        { h2: "Top 10 Ways to Save", h3s: ["Shop Around", "Bundle Policies", "Raise Deductibles"], keyPoints: ["Compare 5+ quotes", "Bundle saves 10-25%"] }
      ]
    })
  },

  comparisonMatrix: {
    prompt: `Create a detailed comparison matrix for top {{niche}} providers in {{location}}.

Compare on:
- Price (1-5 scale)
- Customer service
- Claims handling
- Coverage options
- Digital experience
- Financial strength

Use a matrix format that's easy to scan.`,
    example: JSON.stringify({
      providers: ["GEICO", "State Farm", "Progressive", "Allstate", "Farmers"],
      criteria: ["Price", "Service", "Claims", "Coverage Options", "App Experience", "Financial Strength"],
      ratings: {
        "GEICO": { price: 5, service: 4, claims: 4, coverage: 4, app: 5, financial: 5 },
        "State Farm": { price: 3, service: 5, claims: 5, coverage: 5, app: 4, financial: 5 }
      }
    })
  },

  glossaryTerms: {
    prompt: `Generate 8-10 relevant glossary terms for {{niche}} with definitions.

Include:
- Common terms people don't understand
- Location-specific terms if applicable
- Clear, simple definitions
- Usage examples

Help readers understand insurance jargon.`,
    example: JSON.stringify([
      { term: "Premium", definition: "The amount you pay for insurance, typically monthly or annually", example: "If your premium is $100/month, you pay $1,200/year" },
      { term: "Deductible", definition: "Amount you pay out-of-pocket before insurance kicks in", example: "With a $500 deductible, you pay the first $500 of any claim" },
      { term: "Liability Coverage", definition: "Covers damage/injury you cause to others", example: "15/30/5 means $15k per person, $30k per accident, $5k property damage" }
    ])
  },

  relatedQuestions: {
    prompt: `Generate 8 "People Also Ask" style questions for {{niche}} in {{location}}.

These should be:
- Related but different from main FAQs
- Questions people actually search
- Linked to semantic keywords
- Brief but complete answers

Expand topical coverage.`,
    example: JSON.stringify([
      { question: "Is car insurance more expensive in Los Angeles?", answer: "Yes, LA car insurance averages 20% higher than the California state average due to higher traffic density, accident rates, and vehicle theft." },
      { question: "What's the best car insurance for new drivers in LA?", answer: "New drivers should look for companies offering good student discounts, defensive driving course discounts, and accident forgiveness programs. State Farm and GEICO both have strong programs for new drivers." }
    ])
  },

  trustSignals: {
    prompt: `Create trust signals and credibility elements for {{niche}} in {{location}}.

Include:
- Certifications to mention
- Guarantees or promises
- Security badges
- Trust statistics
- Authority indicators
- Social proof elements

Build confidence and reduce friction.`,
    example: JSON.stringify({
      badges: ["Licensed California Insurance Broker", "A+ BBB Rating", "256-bit SSL Secure"],
      guarantees: ["Free quotes, no obligation", "Compare 5+ providers instantly", "Unbiased comparisons"],
      stats: ["Helped 50,000+ LA drivers save", "Average savings: $500/year", "4.8/5 customer rating"],
      authority: ["Featured in LA Times", "Insurance experts since 2010"]
    })
  },

  urgencyTriggers: {
    prompt: `Create urgency/scarcity messaging for {{niche}} in {{location}}.

Include:
- Time-sensitive reasons to act
- Seasonal factors
- Rate increase warnings
- Limited availability messaging
- FOMO triggers

Be honest but create motivation to act now.`,
    example: JSON.stringify([
      "Rates typically increase 3-5% in January - lock in current rates now",
      "California good driver discounts require 3+ years clean record - start the clock now",
      "Accidents and tickets can raise rates 20-40% for 3 years - protect your rate today",
      "Bundling discounts up to 25% - but only available when you switch both policies together"
    ])
  },

  schemaMarkup: {
    prompt: `Generate JSON-LD schema markup for {{niche}} page about {{location}}.

Include:
- @context and @type definitions
- FAQPage schema for FAQs
- HowTo schema for guides
- LocalBusiness if applicable
- BreadcrumbList
- Review/Rating schema

Output valid JSON-LD ready for <script> tag.`,
    example: JSON.stringify({
      faqSchema: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "How much is car insurance in LA?", "acceptedAnswer": { "@type": "Answer", "text": "Car insurance in LA averages $1,800/year." } }
        ]
      },
      howToSchema: {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Get Cheap Car Insurance in Los Angeles",
        "step": [
          { "@type": "HowToStep", "name": "Compare Quotes", "text": "Get quotes from 5+ providers" }
        ]
      }
    })
  }
};

async function seedExtendedTemplates() {
  console.log('🚀 Seeding extended AI content templates...\n');
  console.log(`📦 Adding ${Object.keys(EXTENDED_SECTIONS).length} extended content sections\n`);

  const templates = await prisma.aIPromptTemplate.findMany();
  console.log(`Found ${templates.length} existing templates to update\n`);

  for (const template of templates) {
    try {
      const updateData: any = {};
      
      // Add all extended section prompts
      for (const [key, value] of Object.entries(EXTENDED_SECTIONS)) {
        const promptKey = `${key}Prompt`;
        updateData[promptKey] = value.prompt;
        
        // Add example formats where applicable (map to correct field names)
        if ('example' in value) {
          // Map section names to field names (some are shortened in schema)
          const fieldNameMap: Record<string, string> = {
            'heroSection': 'exampleHero',
            'keyTakeaways': 'exampleKeyTakeaways',
            'quickAnswers': '',
            'prosCons': 'exampleProsCons',
            'topProviders': '',
            'pricingTable': 'examplePricingTable',
            'localInsights': '',
            'commonMistakes': '',
            'expertTips': '',
            'savingStrategies': '',
            'regulatoryInfo': '',
            'industryTrends': '',
            'testimonials': '',
            'socialPosts': '',
            'emailTemplate': '',
            'longFormGuide': 'exampleLongForm',
            'comparisonMatrix': '',
            'glossaryTerms': '',
            'relatedQuestions': '',
            'trustSignals': '',
            'urgencyTriggers': '',
            'schemaMarkup': ''
          };
          
          const baseName = fieldNameMap[key];
          if (baseName) {
            const exampleKey = `${baseName}Format`;
            try {
              updateData[exampleKey] = typeof value.example === 'string' ? value.example : JSON.parse(value.example);
            } catch (e) {
              updateData[exampleKey] = value.example;
            }
          }
        }
      }

      await prisma.aIPromptTemplate.update({
        where: { id: template.id },
        data: updateData
      });

      console.log(`✅ Updated: ${template.name}`);
    } catch (error) {
      console.error(`❌ Error updating ${template.name}:`, error);
    }
  }

  console.log('\n✨ Done! All templates now have 25+ AI content sections.\n');
  console.log('📊 Summary:');
  console.log(`   • Original sections: 12`);
  console.log(`   • Extended sections: ${Object.keys(EXTENDED_SECTIONS).length}`);
  console.log(`   • Total sections: ${12 + Object.keys(EXTENDED_SECTIONS).length}`);
  console.log('');
  console.log('🎯 You can now generate:');
  console.log('   • Hero sections with compelling headlines');
  console.log('   • Key takeaways for featured snippets');
  console.log('   • Quick answer boxes (People Also Ask style)');
  console.log('   • Pros/cons comparisons');
  console.log('   • Top provider showcases');
  console.log('   • Pricing tables');
  console.log('   • Local insights');
  console.log('   • Expert tips & strategies');
  console.log('   • Video scripts');
  console.log('   • Social media posts');
  console.log('   • Email templates');
  console.log('   • Long-form guides (2000+ words)');
  console.log('   • Schema markup (JSON-LD)');
  console.log('   • And more...');
  console.log('');
}

seedExtendedTemplates()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
