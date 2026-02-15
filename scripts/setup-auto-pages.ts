#!/usr/bin/env ts-node
/**
 * Setup Auto Insurance Pages (For Admin AI Content Panel)
 * 
 * This script:
 * 1. Seeds the AI prompt template for admin use
 * 2. Creates pages for all cities (unpublished, ready for AI content)
 * 
 * After running this, use Admin → AI Content to generate content
 * 
 * Usage:
 *   npx ts-node scripts/setup-auto-pages.ts
 *   npx ts-node scripts/setup-auto-pages.ts --state=CA
 */

import { PrismaClient } from '@prisma/client';
import { program } from 'commander';

const prisma = new PrismaClient();

interface Options {
  state?: string;
  limit?: number;
  dryRun?: boolean;
}

async function seedTemplate() {
  console.log('📝 Step 1: Seeding AI Template...');
  
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
    throw new Error('Auto insurance type not found. Create it in Admin → Insurance Types first.');
  }

  // Check for existing template
  const existing = await prisma.aIPromptTemplate.findFirst({
    where: { insuranceTypeId: insuranceType.id, category: 'auto-insurance' }
  });

  if (existing) {
    console.log('   ℹ️  Template already exists (skipping)');
    return { insuranceType, templateId: existing.id };
  }

  // The template will be seeded separately via seed-auto-insurance-templates.ts
  console.log('   ⚠️  Template not found. Run:');
  console.log('   npx ts-node packages/db/prisma/seed-auto-insurance-templates.ts');
  
  return { insuranceType, templateId: null };
}

async function createPages(options: Options, insuranceType: any) {
  console.log('\n🏙️  Step 2: Creating Pages...');

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
    console.log('   [DRY RUN] Would create pages for:', cities.slice(0, 5).map(c => `${c.name}, ${c.state.code}`).join(', '));
    return { created: 0, existing: 0, cities };
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
          priority: city.isMajor ? 'high' : 'medium',
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
        process.stdout.write(`\r   ✅ Created ${created} pages...`);
      }

    } catch (error) {
      errors++;
    }
  }

  if (created % 100 !== 0 || created === 0) {
    process.stdout.write(`\r   ✅ Created ${created} pages...`);
  }
  
  console.log('\n');
  console.log(`   Summary: ${created} created, ${existing} already exist, ${errors} errors`);

  return { created, existing, cities };
}

async function showStats() {
  const total = await prisma.page.count({
    where: { insuranceType: { slug: 'auto' } }
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
    .option('-l, --limit <n>', 'Limit number of cities', parseInt)
    .option('-d, --dry-run', 'Show what would be done without making changes')
    .parse();

  const options: Options = program.opts();

  console.log('🚗 Auto Insurance Page Setup (for Admin AI Content)\n');
  console.log('Options:', JSON.stringify(options, null, 2));
  console.log();

  try {
    // Step 1: Template
    const { insuranceType, templateId } = await seedTemplate();

    // Step 2: Show stats
    await showStats();

    // Step 3: Create pages
    if (!options.dryRun) {
      await createPages(options, insuranceType);
      await showStats();
    }

    console.log('\n✨ Setup complete!');
    console.log('\n🎯 NEXT: Use Admin → AI Content to generate content:');
    console.log('   1. Go to /dashboard/ai-content');
    console.log('   2. Select "Auto" insurance type');
    console.log('   3. Select states/cities');
    console.log('   4. Check all 12 content sections');
    console.log('   5. Use model: deepseek/deepseek-r1:free');
    console.log('   6. Click "Start AI Generation"');
    console.log('\n   Or seed template first:');
    console.log('   npx ts-node packages/db/prisma/seed-auto-insurance-templates.ts');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
