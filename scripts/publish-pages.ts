#!/usr/bin/env ts-node
/**
 * Publish Auto Insurance Pages
 * 
 * Publishes all pages that have AI-generated content
 * 
 * Usage:
 *   npx ts-node scripts/publish-pages.ts
 *   npx ts-node scripts/publish-pages.ts --state=CA
 *   npx ts-node scripts/publish-pages.ts --dry-run
 */

import { PrismaClient } from '@prisma/client';
import { program } from 'commander';

const prisma = new PrismaClient();

interface Options {
  state?: string;
  dryRun?: boolean;
  revalidate?: boolean;
}

async function publishPages(options: Options) {
  const where: any = {
    insuranceType: { slug: 'auto' },
    isAiGenerated: true,
    isPublished: false
  };

  if (options.state) {
    where.state = { code: options.state.toUpperCase() };
  }

  const pages = await prisma.page.findMany({
    where,
    select: { id: true, slug: true, title: true }
  });

  console.log(`Found ${pages.length} unpublished pages with AI content`);

  if (options.dryRun) {
    console.log('\n[DRY RUN] Would publish:');
    pages.slice(0, 10).forEach(p => console.log(`  - ${p.slug}`));
    if (pages.length > 10) console.log(`  ... and ${pages.length - 10} more`);
    return { count: pages.length, pages };
  }

  // Update in batches
  const batchSize = 100;
  let updated = 0;

  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize);
    
    const result = await prisma.page.updateMany({
      where: {
        id: { in: batch.map(p => p.id) }
      },
      data: {
        isPublished: true,
        publishedAt: new Date()
      }
    });

    updated += result.count;
    console.log(`  Published ${updated}/${pages.length}...`);
  }

  return { count: updated, pages };
}

async function revalidatePages(pages: any[], appUrl: string, secret: string) {
  console.log('\n🔄 Revalidating pages...');

  const results = { success: 0, failed: 0 };

  // Group by state for pattern revalidation (more efficient)
  const states = [...new Set(pages.map(p => p.slug.split('/')[2]))];

  for (const state of states) {
    try {
      const response = await fetch(
        `${appUrl}/api/revalidate?secret=${secret}&pattern=/car-insurance/${state}/*`
      );

      if (response.ok) {
        console.log(`  ✅ ${state.toUpperCase()}`);
        results.success++;
      } else {
        console.log(`  ❌ ${state.toUpperCase()}: ${response.status}`);
        results.failed++;
      }
    } catch (error) {
      console.log(`  ❌ ${state.toUpperCase()}: ${error.message}`);
      results.failed++;
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

async function main() {
  program
    .option('-s, --state <code>', 'Only publish specific state')
    .option('-d, --dry-run', 'Show what would be published')
    .option('-r, --revalidate', 'Revalidate pages after publishing')
    .parse();

  const options: Options = program.opts();

  console.log('📰 Auto Insurance Page Publisher\n');

  try {
    // Publish
    const { count, pages } = await publishPages(options);

    if (count === 0) {
      console.log('\n✨ No pages to publish');
      return;
    }

    console.log(`\n✅ Published ${count} pages`);

    // Revalidate if requested
    if (options.revalidate && !options.dryRun) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const secret = process.env.REVALIDATE_SECRET;

      if (!secret) {
        console.log('\n⚠️  REVALIDATE_SECRET not set. Set it to revalidate pages.');
        console.log('   Or run manually: curl /api/revalidate?secret=...&pattern=/car-insurance/**');
      } else {
        const results = await revalidatePages(pages, appUrl, secret);
        console.log(`\nRevalidation: ${results.success} success, ${results.failed} failed`);
      }
    }

    // Show stats
    const stats = await prisma.page.groupBy({
      by: ['isPublished'],
      where: { insuranceType: { slug: 'auto' } },
      _count: { id: true }
    });

    console.log('\n📊 Final Stats:');
    stats.forEach(s => {
      const status = s.isPublished ? 'Published' : 'Unpublished';
      console.log(`   ${status}: ${s._count.id}`);
    });

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
