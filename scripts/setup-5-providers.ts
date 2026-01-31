/**
 * Setup script for 5 OpenRouter accounts
 * Run with: npx tsx scripts/setup-5-providers.ts
 */

import { prisma } from '../packages/db/src/client';

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Setting up 5 OpenRouter Accounts');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Free models to rotate through
  const FREE_MODELS = [
    'deepseek/deepseek-r1:free',
    'google/gemini-2.0-flash-exp:free',
    'meta-llama/llama-3.1-8b-instruct:free'
  ];

  // Create 5 providers
  const providers = [
    { name: 'OpenRouter Account 1', model: FREE_MODELS[0], priority: 1 },
    { name: 'OpenRouter Account 2', model: FREE_MODELS[1], priority: 2 },
    { name: 'OpenRouter Account 3', model: FREE_MODELS[2], priority: 3 },
    { name: 'OpenRouter Account 4', model: FREE_MODELS[0], priority: 4 }, // Backup for model 1
    { name: 'OpenRouter Account 5', model: FREE_MODELS[1], priority: 5 }, // Backup for model 2
  ];

  console.log('Creating providers...\n');

  for (let i = 0; i < providers.length; i++) {
    const p = providers[i];
    
    // Check if provider already exists
    const existing = await prisma.aIProvider.findFirst({
      where: { name: p.name }
    });

    if (existing) {
      console.log(`  ✓ ${p.name} already exists (skipping)`);
      continue;
    }

    // Note: You'll need to manually add the API keys
    console.log(`  ➜ ${p.name}`);
    console.log(`    Model: ${p.model}`);
    console.log(`    Priority: ${p.priority}`);
    console.log(`    API Key: (you need to add this manually)\n`);
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  IMPORTANT: Setup Instructions');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('1. Create 5 OpenRouter accounts at https://openrouter.ai');
  console.log('2. Deposit $10 in each account (total $50)');
  console.log('   - This is a DEPOSIT, not a purchase!');
  console.log('   - You only spend money if you use PAID models');
  console.log('   - FREE models cost $0!\n');
  
  console.log('3. Get API keys for each account and add them to the database:');
  console.log('   - Go to Admin Dashboard → AI Providers');
  console.log('   - Or use the API: POST /api/admin/ai-providers\n');
  
  console.log('4. Daily Limits (with $10 deposit):');
  console.log('   - Per account: 1,000 requests/day');
  console.log('   - Per account: 20 requests/minute');
  console.log('   - Total with 5 accounts: 5,000 requests/day\n');
  
  console.log('5. Your Content Generation Capacity:');
  console.log('   ┌─────────────┬─────────────┬──────────────┐');
  console.log('   │ Sections    │ API Calls   │ Pages/Day    │');
  console.log('   ├─────────────┼─────────────┼──────────────┤');
  console.log('   │ 4 sections  │ 4 per page  │ 1,250 pages  │');
  console.log('   │ 6 sections  │ 6 per page  │ 833 pages    │');
  console.log('   │ 8 sections  │ 8 per page  │ 625 pages    │');
  console.log('   │ 12 sections │ 12 per page │ 416 pages    │');
  console.log('   └─────────────┴─────────────┴──────────────┘\n');
  
  console.log('6. With PAUSE & RESUME:');
  console.log('   - When all 5 accounts hit daily limits, job PAUSES');
  console.log('   - Automatically resumes after 24 hours');
  console.log('   - Remembers exactly where it stopped');
  console.log('   - No pages lost or duplicated!\n');
  
  console.log('═══════════════════════════════════════════════════════════\n');
  
  // Show sample API call
  console.log('Sample API call to add a provider:');
  console.log('```bash');
  console.log('curl -X POST http://localhost:3000/api/admin/ai-providers \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -H "Authorization: Bearer YOUR_TOKEN" \\');
  console.log('  -d \'{\n');
  console.log('    "name": "OpenRouter Account 1",');
  console.log('    "apiKey": "sk-or-v1-xxxxxxxx",');
  console.log('    "preferredModel": "deepseek/deepseek-r1:free",');
  console.log('    "priority": 1\n');
  console.log('  }\'');
  console.log('```\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
