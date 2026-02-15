#!/usr/bin/env ts-node
/**
 * Generate AI Content for Auto Insurance Pages
 * 
 * This script generates AI content for all auto insurance pages
 * using the seeded template and OpenRouter API.
 * 
 * Usage:
 *   npx ts-node scripts/generate-auto-content.ts
 * 
 * Options:
 *   --state=CA          Only generate for specific state
 *   --limit=100         Limit number of pages
 *   --batch=20          Batch size (default: 20)
 *   --delay=2000        Delay between batches in ms (default: 2000)
 *   --sections=all      Comma-separated sections or 'all'
 */

import { PrismaClient } from '@prisma/client';
import { program } from 'commander';

const prisma = new PrismaClient();

// Import from admin lib (adjust path as needed)
const ADMIN_LIB_PATH = '../apps/admin/lib/aiContentService';

interface Options {
  state?: string;
  limit?: number;
  batch?: number;
  delay?: number;
  sections?: string;
  dryRun?: boolean;
  perSection?: boolean;
}

const ALL_SECTIONS = [
  'metaTags', 'intro', 'requirements', 'faqs', 'tips',
  'costBreakdown', 'comparison', 'discounts', 'localStats',
  'coverageGuide', 'claimsProcess', 'buyersGuide'
];

async function loadAIService() {
  try {
    // Dynamic import to handle path issues
    const { OpenRouterService } = await import(ADMIN_LIB_PATH);
    return { OpenRouterService };
  } catch (error) {
    console.error('❌ Failed to load AI service from:', ADMIN_LIB_PATH);
    console.error('   Error:', error.message);
    console.error('\n   Make sure you are running from project root');
    throw error;
  }
}

async function getPagesToProcess(options: Options) {
  const where: any = {
    insuranceType: { slug: 'auto' },
    isAiGenerated: false
  };

  if (options.state) {
    where.state = { code: options.state.toUpperCase() };
  }

  const pages = await prisma.page.findMany({
    where,
    include: {
      state: true,
      city: true,
      insuranceType: true
    },
    take: options.limit || undefined,
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'asc' }
    ]
  });

  return pages;
}

async function getTemplate() {
  const template = await prisma.aIPromptTemplate.findFirst({
    where: { niche: 'auto', isSystem: true }
  });

  if (!template) {
    throw new Error('Auto insurance template not found. Run setup script first.');
  }

  return template;
}

function getSections(options: Options): string[] {
  if (!options.sections || options.sections === 'all') {
    return ALL_SECTIONS;
  }
  return options.sections.split(',').map(s => s.trim());
}

async function generateContentForPage(
  page: any,
  template: any,
  sections: string[],
  OpenRouterService: any,
  options: Options
) {
  const location = page.city 
    ? `${page.city.name}, ${page.state.name}`
    : page.state.name;

  const request = {
    pageData: {
      id: page.id,
      slug: page.slug,
      insuranceType: page.insuranceType?.name || 'Auto',
      state: page.state?.name,
      city: page.city?.name
    },
    sections,
    forceFreeModels: true,
    perSection: options.perSection !== false,
    templatePrompts: {
      systemPrompt: template.systemPrompt,
      introPrompt: template.introPrompt,
      requirementsPrompt: template.requirementsPrompt,
      faqsPrompt: template.faqsPrompt,
      tipsPrompt: template.tipsPrompt,
      costBreakdownPrompt: template.costBreakdownPrompt,
      comparisonPrompt: template.comparisonPrompt,
      discountsPrompt: template.discountsPrompt,
      localStatsPrompt: template.localStatsPrompt,
      coverageGuidePrompt: template.coverageGuidePrompt,
      claimsProcessPrompt: template.claimsProcessPrompt,
      buyersGuidePrompt: template.buyersGuidePrompt,
      metaTagsPrompt: template.metaTagsPrompt
    }
  };

  return await OpenRouterService.generateContent(request);
}

async function main() {
  program
    .option('-s, --state <code>', 'Only process specific state (e.g., CA, TX)')
    .option('-l, --limit <n>', 'Limit number of pages', parseInt)
    .option('-b, --batch <n>', 'Batch size', parseInt, 20)
    .option('-d, --delay <ms>', 'Delay between batches', parseInt, 2000)
    .option('--sections <list>', 'Sections to generate (comma-separated or "all")', 'all')
    .option('--dry-run', 'Show what would be generated without calling API')
    .option('--no-per-section', 'Generate all sections in one API call (faster but less reliable)')
    .parse();

  const options: Options = program.opts();

  console.log('🤖 Auto Insurance AI Content Generator\n');
  console.log('Options:', JSON.stringify(options, null, 2));
  console.log();

  // Load AI service
  const { OpenRouterService } = await loadAIService();

  // Get template
  console.log('📋 Loading template...');
  const template = await getTemplate();
  console.log('✅ Template loaded:', template.name);

  // Get pages
  console.log('\n🔍 Finding pages to process...');
  const pages = await getPagesToProcess(options);
  console.log(`✅ Found ${pages.length} pages needing content`);

  if (pages.length === 0) {
    console.log('\n✨ All pages already have AI content!');
    return;
  }

  // Get sections
  const sections = getSections(options);
  console.log(`📝 Sections to generate: ${sections.join(', ')}`);

  if (options.dryRun) {
    console.log('\n[DRY RUN] Would process:', pages.slice(0, 3).map(p => p.slug).join(', '), '...');
    return;
  }

  // Confirm
  console.log(`\n⚠️  About to generate content for ${pages.length} pages`);
  console.log(`   Batch size: ${options.batch}`);
  console.log(`   Delay: ${options.delay}ms`);
  console.log(`   Estimated time: ~${Math.ceil((pages.length / options.batch!) * (options.delay! / 1000) / 60)} minutes`);
  console.log('\n   Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Process pages
  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < pages.length; i += options.batch!) {
    const batch = pages.slice(i, i + options.batch!);
    const batchNum = Math.floor(i / options.batch!) + 1;
    const totalBatches = Math.ceil(pages.length / options.batch!);

    console.log(`\n🔄 Batch ${batchNum}/${totalBatches} (${batch.length} pages)`);
    console.log('─'.repeat(50));

    for (const page of batch) {
      const location = page.city 
        ? `${page.city.name}, ${page.state.code}`
        : page.state.name;

      try {
        process.stdout.write(`   ${location}... `);

        // Check if already has content
        if (page.aiGeneratedContent && Object.keys(page.aiGeneratedContent).length > 0) {
          process.stdout.write('SKIP (has content)\n');
          skipped++;
          continue;
        }

        const result = await generateContentForPage(
          page, template, sections, OpenRouterService, options
        );

        if (result.success && result.content) {
          // Save to database
          await prisma.page.update({
            where: { id: page.id },
            data: {
              aiGeneratedContent: result.content,
              isAiGenerated: true,
              aiGeneratedAt: new Date(),
              // Update meta from generated content
              metaTitle: result.content.metaTags?.metaTitle || page.metaTitle,
              metaDescription: result.content.metaTags?.metaDescription || page.metaDescription,
            }
          });

          process.stdout.write('✅\n');
          success++;
        } else {
          process.stdout.write(`❌ ${result.error?.substring(0, 50)}\n`);
          failed++;
        }

      } catch (error) {
        process.stdout.write(`❌ ${error.message?.substring(0, 50)}\n`);
        failed++;
      }
    }

    // Progress summary
    console.log(`\n   Progress: ${success} success, ${failed} failed, ${skipped} skipped`);
    console.log(`   ${pages.length - (success + failed + skipped)} remaining`);

    // Delay between batches
    if (i + options.batch! < pages.length) {
      console.log(`\n⏳ Waiting ${options.delay}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, options.delay));
    }
  }

  // Final summary
  console.log('\n' + '═'.repeat(50));
  console.log('✨ Content Generation Complete!');
  console.log('═'.repeat(50));
  console.log(`Total pages:    ${pages.length}`);
  console.log(`Successful:     ${success} ✅`);
  console.log(`Failed:         ${failed} ❌`);
  console.log(`Skipped:        ${skipped} ⏭️`);
  console.log();

  if (success > 0) {
    console.log('Next steps:');
    console.log('1. Review generated content in Admin → Pages');
    console.log('2. Publish pages: npx ts-node scripts/publish-pages.ts');
    console.log('3. Revalidate: curl /api/revalidate?secret=...&pattern=/car-insurance/**');
  }

  if (failed > 0) {
    console.log('\n⚠️  Some pages failed. You can re-run this script to retry.');
  }
}

main()
  .catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
