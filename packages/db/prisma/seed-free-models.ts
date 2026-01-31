#!/usr/bin/env ts-node
/**
 * Seed Free AI Models for OpenRouter
 * Run with: npx ts-node prisma/seed-free-models.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_FREE_MODELS = [
  {
    modelId: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1 (Free)',
    provider: 'deepseek',
    description: 'DeepSeek R1 reasoning model - free tier',
    priority: 1
  },
  {
    modelId: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash (Free)',
    provider: 'google',
    description: 'Google Gemini 2.0 Flash experimental - free tier',
    priority: 2
  },
  {
    modelId: 'meta-llama/llama-3.1-8b-instruct:free',
    name: 'Llama 3.1 8B (Free)',
    provider: 'meta',
    description: 'Meta Llama 3.1 8B instruct - free tier',
    priority: 3
  },
  {
    modelId: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B (Free)',
    provider: 'meta',
    description: 'Meta Llama 3.3 70B instruct - free tier',
    priority: 4
  },
  {
    modelId: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B (Free)',
    provider: 'mistral',
    description: 'Mistral 7B instruct - free tier',
    priority: 5
  },
  {
    modelId: 'huggingfaceh4/zephyr-7b-beta:free',
    name: 'Zephyr 7B (Free)',
    provider: 'huggingface',
    description: 'Zephyr 7B beta - free tier',
    priority: 6
  }
];

async function main() {
  console.log('🌱 Seeding free AI models...\n');

  try {
    for (const model of DEFAULT_FREE_MODELS) {
      try {
        const existing = await prisma.freeAIModel.findUnique({
          where: { modelId: model.modelId }
        });

        if (existing) {
          console.log(`  ⏩ ${model.name} already exists`);
        } else {
          await prisma.freeAIModel.create({
            data: model
          });
          console.log(`  ✅ Added ${model.name}`);
        }
      } catch (err: any) {
        console.error(`  ❌ Error with ${model.name}: ${err.message}`);
      }
    }

    console.log('\n🎉 Free models seeding complete!');
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { main as seedFreeModels };
