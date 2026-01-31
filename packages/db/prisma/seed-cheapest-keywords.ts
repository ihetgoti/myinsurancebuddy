import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding "cheapest" keyword configurations...\n');

  // Get all insurance types
  const insuranceTypes = await prisma.insuranceType.findMany({
    where: { isActive: true }
  });

  console.log(`Found ${insuranceTypes.length} insurance types`);

  for (const type of insuranceTypes) {
    const primaryKeyword = `cheapest ${type.name.toLowerCase()}`;
    
    // Check if config already exists
    const existing = await prisma.keywordConfig.findFirst({
      where: {
        insuranceTypeId: type.id,
        primaryKeyword: {
          startsWith: 'cheapest '
        }
      }
    });

    if (existing) {
      console.log(`  ⏩ ${type.name}: Already has "cheapest" config`);
      continue;
    }

    // Create new config with "cheapest" pattern
    await prisma.keywordConfig.create({
      data: {
        name: `${type.name} - Cheapest Strategy`,
        description: `Target "cheapest ${type.name.toLowerCase()} in [location]" as main keyword`,
        primaryKeyword,
        secondaryKeywords: [
          `cheap ${type.name.toLowerCase()}`,
          `affordable ${type.name.toLowerCase()}`,
          `low cost ${type.name.toLowerCase()}`,
          `${type.name.toLowerCase()} deals`,
          `discount ${type.name.toLowerCase()}`,
          `best ${type.name.toLowerCase()} rates`,
          `${type.name.toLowerCase()} quotes`,
          `save on ${type.name.toLowerCase()}`
        ],
        longTailKeywords: [
          `how to find cheapest ${type.name.toLowerCase()}`,
          `where to get cheap ${type.name.toLowerCase()}`,
          `most affordable ${type.name.toLowerCase()} providers`,
          `compare ${type.name.toLowerCase()} rates and save`,
          `${type.name.toLowerCase()} discounts and deals`,
          `how much does ${type.name.toLowerCase()} cost`,
          `best way to lower ${type.name.toLowerCase()} premiums`
        ],
        lsiKeywords: [
          'cheap', 'affordable', 'low cost', 'budget-friendly', 'inexpensive',
          'discount', 'savings', 'deals', 'bargain', 'reduced rates',
          'compare prices', 'shop around', 'best rates', 'low premiums',
          'money-saving tips', 'cut costs', 'reduce premiums'
        ],
        targetDensity: 2.5,
        maxDensity: 4.0,
        requireInTitle: true,
        requireInH1: true,
        requireInH2: true,
        requireInFirst100: true,
        requireInMeta: true,
        insuranceTypeId: type.id,
        isActive: true
      }
    });

    console.log(`  ✅ ${type.name}: Created "${primaryKeyword}" config`);
  }

  console.log('\n🎉 Done! All insurance types now target "cheapest" keywords.');
  console.log(`Total keyword configs: ${await prisma.keywordConfig.count()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
