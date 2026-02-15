#!/usr/bin/env ts-node
/**
 * Setup Auto Insurance Pages
 * 
 * This script:
 * 1. Seeds the auto insurance AI template
 * 2. Creates pages for all cities
 * 3. Triggers AI content generation
 * 
 * Usage:
 *   npx ts-node scripts/setup-auto-insurance-pages.ts
 * 
 * Or with options:
 *   npx ts-node scripts/setup-auto-insurance-pages.ts --state=CA --limit=100
 */

import { PrismaClient } from '@prisma/client';
import { program } from 'commander';

const prisma = new PrismaClient();

// Auto Insurance AI Template
const AUTO_INSURANCE_TEMPLATE = {
  name: 'Auto Insurance - SEO Template',
  description: 'Complete AI content template for auto insurance pages',
  niche: 'auto',
  isSystem: true,
  
  systemPrompt: `You are an expert insurance content writer. Create SEO-optimized, helpful auto insurance content.

CRITICAL RULES:
1. Content MUST be unique - vary vocabulary and examples
2. Include specific {{city}} and {{state}} details naturally
3. Focus on money-saving and finding cheapest rates
4. Use "car insurance" and "auto insurance" interchangeably
5. Include specific dollar amounts and percentages
6. Never copy phrases exactly between different pages

TARGET: "cheapest car insurance in {{city}}, {{state}}"`,

  // Section prompts
  introPrompt: `Write 150-200 words introducing cheap car insurance in {{city}}, {{state}}.

Start with a hook about finding affordable coverage. Mention {{city}}-specific factors (traffic, accidents, weather). Include average rates and promise savings tips. End with soft CTA.

Make it unique by varying the opening hook and local details.`,

  requirementsPrompt: `Explain {{state}} auto insurance requirements in 150-200 words.

List minimum coverage limits, fault/no-fault status, penalties for no insurance, and SR-22 if applicable. Compare minimum vs recommended coverage.`,

  faqsPrompt: `Generate 5 FAQs about car insurance in {{city}}, {{state}} as JSON array.

Questions: finding cheapest rates, average costs, state requirements, lowering rates, best companies.

Format: [{"question": "...", "answer": "50-75 words with specific advice"}]`,

  tipsPrompt: `Generate 7 money-saving tips for {{city}} drivers as JSON array of strings.

Each tip: 25-40 words with specific savings %. Cover comparison, bundling, deductibles, discounts, credit score.`,

  costBreakdownPrompt: `Explain 5-6 cost factors for {{city}} as JSON array.

Format: [{"factor": "...", "impact": "$X or X%", "description": "..."}]

Include: minimum coverage, full coverage, local risk factors, discounts.`,

  comparisonPrompt: `Compare 4-5 insurance providers in {{state}} as JSON array.

Format: [{"name": "...", "strengths": ["..."], "weaknesses": ["..."], "bestFor": "...", "priceRange": "$X-$Y/month"}]`,

  discountsPrompt: `List 8-10 available discounts in {{state}} as JSON array.

Format: [{"name": "...", "savings": "X%", "qualification": "...", "isLocal": boolean}]

Include state-specific discounts.`,

  localStatsPrompt: `Provide 4-5 insurance statistics for {{city}} as JSON array.

Format: [{"stat": "...", "value": "...", "impact": "...", "comparison": "..."}]

Include: average premium, uninsured rate, accident rate, theft rate.`,

  coverageGuidePrompt: `Explain 4 coverage types for {{city}} drivers as JSON array.

Format: [{"type": "...", "description": "...", "recommended": "...", "whenNeeded": "..."}]

Types: Liability Only, Recommended Liability, Full Coverage, Comprehensive.`,

  claimsProcessPrompt: `Explain claims process in {{state}} as JSON object.

Format: {"steps": [...], "documents": [...], "timeline": "...", "resources": [...]}`,

  buyersGuidePrompt: `Create buyer's guide for {{city}} as JSON object.

Format: {"steps": [...], "lookFor": [...], "redFlags": [...], "questions": [...]}`,

  metaTagsPrompt: `Generate SEO meta tags for {{city}}, {{state}}.

TARGET: "cheapest car insurance {{city}}"

Return JSON: {"metaTitle": "50-60 chars", "metaDescription": "150-160 chars", "metaKeywords": [...], "ogTitle": "...", "ogDescription": "..."}`,

  // Example formats
  exampleIntroFormat: 'Looking for the cheapest car insurance in {{city}}? With {{local_factors}}, finding affordable coverage matters. {{city}} drivers save an average of {{avg_savings}}/year by comparing quotes. While the average premium is {{city_avg}}, rates vary by $800+ between insurers. This guide shows you how to find the best rates in {{city}}, which discounts to ask for, and how to avoid coverage gaps.',

  exampleFaqsFormat: JSON.stringify([
    { question: 'How do I find the cheapest car insurance in {{city}}?', answer: 'Compare quotes from 5+ insurers. {{city}} drivers save {{avg_savings}}/year by shopping around. Ask about multi-policy, safe driver, and good student discounts.' },
    { question: 'What is the average cost in {{city}}?', answer: '{{city}} drivers pay {{city_avg}}/year for full coverage ({{monthly}}/month). Minimum liability averages {{min_avg}}/year. Rates are {{comparison}} due to {{local_factors}}.' }
  ]),

  exampleTipsFormat: JSON.stringify([
    'Compare quotes from 5+ insurers every 6 months. {{city}} rates vary by $500+ for the same coverage.',
    'Bundle auto with renters/home insurance to save 10-25%.',
    'Raise deductible to $1,000 to save 15-30% on premiums.'
  ]),

  exampleCostBreakdownFormat: JSON.stringify([
    { factor: 'Minimum Liability', impact: '$500-700/year', description: 'State-required minimum coverage' },
    { factor: 'Full Coverage', impact: '$1,500-2,500/year', description: 'Complete protection with collision/comprehensive' },
    { factor: 'Traffic Density', impact: '+10-20%', description: '{{city}} congestion increases accident risk' }
  ]),

  exampleComparisonFormat: JSON.stringify([
    { name: 'GEICO', strengths: ['Low rates', 'Good app'], weaknesses: ['Limited local agents'], bestFor: 'Budget-conscious drivers', priceRange: '$90-140/month' },
    { name: 'State Farm', strengths: ['Local agents', 'Claims service'], weaknesses: ['Higher base rates'], bestFor: 'Personal service', priceRange: '$110-170/month' }
  ]),

  exampleDiscountsFormat: JSON.stringify([
    { name: 'Good Driver', savings: '20%', qualification: 'No accidents in 3 years', isLocal: true },
    { name: 'Multi-Policy', savings: '10-25%', qualification: 'Bundle auto + home/renters', isLocal: false }
  ]),

  exampleLocalStatsFormat: JSON.stringify([
    { stat: 'Average Premium', value: '$1,800', impact: 'Above national average', comparison: '15% above $1,565 national avg' },
    { stat: 'Uninsured Drivers', value: '12%', impact: 'Increases insured driver costs', comparison: 'Near national average' }
  ]),

  exampleCoverageGuideFormat: JSON.stringify([
    { type: 'Liability Only', description: 'Covers damage to others', recommended: 'State minimum', whenNeeded: 'Older vehicles under $3,000' },
    { type: 'Full Coverage', description: 'Complete protection', recommended: '100/300/100', whenNeeded: 'Newer vehicles, loans/leases' }
  ]),

  exampleClaimsProcessFormat: JSON.stringify({
    steps: ['Ensure safety', 'Exchange info', 'Document scene', 'File report', 'Contact insurer', 'Get estimates'],
    documents: ['Police report', 'Photos', 'Insurance info'],
    timeline: '30-45 days for simple claims',
    resources: ['{{state}} DMV', '{{state}} Insurance Dept']
  }),

  exampleBuyersGuideFormat: JSON.stringify({
    steps: ['Assess needs', 'Get 5+ quotes', 'Compare coverage', 'Ask about discounts', 'Review policy', 'Re-shop yearly'],
    lookFor: ['A-rated companies', '24/7 claims', 'Good reviews'],
    redFlags: ['Too-good rates', 'High complaints', 'Pressure tactics'],
    questions: ['What discounts apply?', 'How will rates change?', "What's your claims rating?"]
  }),

  exampleMetaTagsFormat: JSON.stringify({
    metaTitle: 'Cheapest Car Insurance in {{city}}, {{state}} | Save $500+',
    metaDescription: 'Find cheap car insurance in {{city}}. Compare quotes and save. Average rates from {{monthly}}/month. Get your free quote today!',
    metaKeywords: ['cheap car insurance {{city}}', 'affordable auto insurance {{state}}'],
    ogTitle: 'Save on Car Insurance in {{city}} | Free Quotes',
    ogDescription: 'Compare rates in {{city}}. Drivers save {{avg_savings}}/year. Free quotes!'
  })
};

interface Options {
  state?: string;
  limit?: number;
  dryRun?: boolean;
  skipTemplate?: boolean;
  skipPages?: boolean;
}

async function seedTemplate() {
  console.log('📝 Seeding auto insurance template...');
  
  const existing = await prisma.aIPromptTemplate.findFirst({
    where: { niche: 'auto', isSystem: true }
  });

  if (existing) {
    await prisma.aIPromptTemplate.update({
      where: { id: existing.id },
      data: AUTO_INSURANCE_TEMPLATE
    });
    console.log('✅ Template updated');
    return existing.id;
  } else {
    const template = await prisma.aIPromptTemplate.create({
      data: AUTO_INSURANCE_TEMPLATE
    });
    console.log('✅ Template created');
    return template.id;
  }
}

async function createPages(options: Options) {
  console.log('\n🏙️  Creating pages for cities...');

  // Get auto insurance type
  const insuranceType = await prisma.insuranceType.findFirst({
    where: { OR: [{ slug: 'auto' }, { name: { contains: 'Auto', mode: 'insensitive' } }] }
  });

  if (!insuranceType) {
    throw new Error('Auto insurance type not found. Please create it first.');
  }

  console.log(`   Insurance type: ${insuranceType.name}`);

  // Get cities
  const where: any = {
    state: { country: { code: 'US' } }
  };
  
  if (options.state) {
    where.state.code = options.state.toUpperCase();
  }

  const cities = await prisma.city.findMany({
    where,
    include: { state: true },
    take: options.limit || undefined
  });

  console.log(`   Found ${cities.length} cities`);

  if (options.dryRun) {
    console.log('   [DRY RUN] Would create pages for:', cities.slice(0, 5).map(c => c.name).join(', '), '...');
    return { cities, insuranceType, created: 0 };
  }

  let created = 0;
  let existing = 0;
  let errors = 0;

  for (const city of cities) {
    try {
      const slug = `/car-insurance/${city.state.code.toLowerCase()}/${city.slug}`;
      
      const pageExists = await prisma.page.findUnique({ where: { slug } });
      
      if (pageExists) {
        existing++;
        continue;
      }

      await prisma.page.create({
        data: {
          slug,
          title: `Cheapest Car Insurance in ${city.name}, ${city.state.name}`,
          excerpt: `Find affordable car insurance in ${city.name}, ${city.state.name}. Compare quotes from top providers and save up to $500/year.`,
          insuranceTypeId: insuranceType.id,
          stateId: city.state.id,
          cityId: city.id,
          priority: 'medium',
          isPublished: false,
          customData: {
            city_name: city.name,
            state_name: city.state.name,
            state_code: city.state.code,
            setup_at: new Date().toISOString()
          }
        }
      });

      created++;
      
      if (created % 100 === 0) {
        console.log(`   ✅ Created ${created} pages...`);
      }

    } catch (error) {
      errors++;
      if (errors <= 5) {
        console.error(`   ❌ Error creating page for ${city.name}:`, error.message);
      }
    }
  }

  console.log(`\n   Summary:`);
  console.log(`   - Created: ${created}`);
  console.log(`   - Already existed: ${existing}`);
  console.log(`   - Errors: ${errors}`);

  return { cities, insuranceType, created };
}

async function showStats() {
  const total = await prisma.page.count({
    where: {
      insuranceType: { slug: 'auto' }
    }
  });

  const withContent = await prisma.page.count({
    where: {
      insuranceType: { slug: 'auto' },
      isAiGenerated: true
    }
  });

  const published = await prisma.page.count({
    where: {
      insuranceType: { slug: 'auto' },
      isPublished: true
    }
  });

  console.log('\n📊 Current Status:');
  console.log(`   Total auto pages: ${total}`);
  console.log(`   With AI content: ${withContent}`);
  console.log(`   Published: ${published}`);
  console.log(`   Pending content: ${total - withContent}`);
}

async function main() {
  program
    .option('-s, --state <code>', 'Only create pages for specific state (e.g., CA, TX)')
    .option('-l, --limit <n>', 'Limit number of cities to process', parseInt)
    .option('-d, --dry-run', 'Show what would be done without making changes')
    .option('--skip-template', 'Skip seeding the AI template')
    .option('--skip-pages', 'Skip creating pages (just show stats)')
    .parse();

  const options: Options = program.opts();

  console.log('🚗 Auto Insurance Page Setup\n');
  console.log('Options:', JSON.stringify(options, null, 2));
  console.log();

  try {
    // Step 1: Seed template
    if (!options.skipTemplate) {
      await seedTemplate();
    }

    // Step 2: Show stats
    await showStats();

    // Step 3: Create pages
    if (!options.skipPages) {
      await createPages(options);
      
      // Show updated stats
      await showStats();
    }

    console.log('\n✨ Setup complete!');
    console.log('\nNext steps:');
    console.log('1. Go to Admin → AI Content');
    console.log('2. Select Auto insurance type');
    console.log('3. Choose all 12 content sections');
    console.log('4. Start AI generation');
    console.log('\nOr run: npx ts-node scripts/generate-auto-content.ts');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
