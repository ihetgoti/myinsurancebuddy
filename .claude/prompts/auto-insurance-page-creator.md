# Auto Insurance Page Creator

> Complete guide to create auto insurance pages for all cities/states

---

## Prerequisites

1. ✅ States and cities uploaded to database
2. ✅ Auto Insurance AI Template seeded
3. ✅ OpenRouter API key configured in admin
4. ✅ Lead capture form with mobile number working

---

## Step 1: Verify Data Upload

### Check States
```sql
SELECT COUNT(*) as total_states FROM "State" WHERE "countryId" = 'us';
SELECT name, code FROM "State" ORDER BY name;
```

### Check Cities  
```sql
SELECT COUNT(*) as total_cities FROM "City" WHERE "stateId" IN (SELECT id FROM "State" WHERE "countryId" = 'us');
SELECT s.name as state, COUNT(c.id) as cities 
FROM "City" c 
JOIN "State" s ON c."stateId" = s.id 
GROUP BY s.name 
ORDER BY cities DESC;
```

---

## Step 2: Seed Auto Insurance Template

### Option A: Run Seed Script
```bash
cd packages/db
npx ts-node prisma/seed-auto-insurance-templates.ts
```

### Option B: Via Admin API
```bash
curl -X POST http://localhost:3000/api/ai-templates/seed \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"niche": "auto"}'
```

---

## Step 3: Create Pages for All Cities

### API Endpoint: Bulk Page Creation

Create file: `apps/admin/app/api/pages/bulk-create/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@myinsurancebuddy/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const bulkCreateSchema = z.object({
  insuranceTypeId: z.string(),
  countryId: z.string().default('us'),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  templateId: z.string().optional(), // AI template to use
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { insuranceTypeId, countryId, priority, templateId } = bulkCreateSchema.parse(body);

    // Get insurance type
    const insuranceType = await prisma.insuranceType.findUnique({
      where: { id: insuranceTypeId }
    });

    if (!insuranceType) {
      return NextResponse.json({ success: false, error: 'Insurance type not found' }, { status: 404 });
    }

    // Get all cities with their states
    const cities = await prisma.city.findMany({
      where: {
        state: {
          countryId: countryId
        }
      },
      include: {
        state: true
      }
    });

    console.log(`🏙️  Found ${cities.length} cities to create pages for`);

    // Create pages
    const pages = [];
    const errors = [];

    for (const city of cities) {
      try {
        const slug = `/car-insurance/${city.state.code.toLowerCase()}/${city.slug}`;
        
        // Check if page already exists
        const existing = await prisma.page.findUnique({
          where: { slug }
        });

        if (existing) {
          console.log(`⚠️  Page already exists: ${slug}`);
          continue;
        }

        const page = await prisma.page.create({
          data: {
            slug,
            title: `Cheapest Car Insurance in ${city.name}, ${city.state.name}`,
            excerpt: `Find affordable car insurance in ${city.name}. Compare quotes and save up to $500/year.`,
            insuranceTypeId: insuranceType.id,
            stateId: city.state.id,
            cityId: city.id,
            priority,
            isPublished: false, // Will publish after AI content is generated
            customData: {
              city_name: city.name,
              state_name: city.state.name,
              state_code: city.state.code,
              template_id: templateId
            }
          }
        });

        pages.push(page);
        
        if (pages.length % 100 === 0) {
          console.log(`✅ Created ${pages.length} pages...`);
        }

      } catch (error) {
        console.error(`❌ Error creating page for ${city.name}:`, error);
        errors.push({ city: city.name, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalCities: cities.length,
        pagesCreated: pages.length,
        errors: errors.length,
        errorDetails: errors.slice(0, 10) // First 10 errors
      }
    });

  } catch (error) {
    console.error('Bulk create error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### Run Bulk Creation

```bash
curl -X POST http://localhost:3000/api/pages/bulk-create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "insuranceTypeId": "auto-insurance-id",
    "countryId": "us",
    "priority": "high",
    "templateId": "auto-template-id"
  }'
```

---

## Step 4: Generate AI Content

### Via Admin Dashboard
1. Navigate to: `http://localhost:3000/dashboard/ai-content`
2. Select:
   - **Insurance Type**: Auto
   - **States**: All (or specific)
   - **Sections**: All 12 sections
   - **Model**: `deepseek/deepseek-r1:free`
   - **Batch Size**: 20
   - **Delay**: 2000ms
3. Click **"Start AI Generation"**

### Via API Script

Create: `scripts/generate-auto-content.ts`

```typescript
import { prisma } from '@myinsurancebuddy/db';
import { OpenRouterService } from '../apps/admin/lib/aiContentService';

const BATCH_SIZE = 20;
const DELAY_MS = 2000;

async function generateContentForPages() {
  // Get all unpublished auto insurance pages
  const pages = await prisma.page.findMany({
    where: {
      insuranceType: { slug: 'auto' },
      isAiGenerated: false
    },
    include: {
      state: true,
      city: true,
      insuranceType: true
    },
    take: 100 // Process 100 at a time
  });

  console.log(`📝 Found ${pages.length} pages needing content`);

  // Get auto insurance template
  const template = await prisma.aIPromptTemplate.findFirst({
    where: { niche: 'auto', isSystem: true }
  });

  const sections: AIContentSection[] = [
    'metaTags', 'intro', 'requirements', 'faqs', 'tips',
    'costBreakdown', 'comparison', 'discounts', 'localStats',
    'coverageGuide', 'claimsProcess', 'buyersGuide'
  ];

  for (let i = 0; i < pages.length; i += BATCH_SIZE) {
    const batch = pages.slice(i, i + BATCH_SIZE);
    
    console.log(`\n🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(pages.length / BATCH_SIZE)}`);

    for (const page of batch) {
      try {
        const request: AIContentRequest = {
          pageData: {
            id: page.id,
            slug: page.slug,
            insuranceType: page.insuranceType.name,
            state: page.state?.name,
            city: page.city?.name
          },
          sections,
          forceFreeModels: true,
          perSection: true, // Generate each section separately for better quality
          templatePrompts: {
            systemPrompt: template?.systemPrompt,
            introPrompt: template?.introPrompt,
            requirementsPrompt: template?.requirementsPrompt,
            faqsPrompt: template?.faqsPrompt,
            tipsPrompt: template?.tipsPrompt,
            costBreakdownPrompt: template?.costBreakdownPrompt,
            comparisonPrompt: template?.comparisonPrompt,
            discountsPrompt: template?.discountsPrompt,
            localStatsPrompt: template?.localStatsPrompt,
            coverageGuidePrompt: template?.coverageGuidePrompt,
            claimsProcessPrompt: template?.claimsProcessPrompt,
            buyersGuidePrompt: template?.buyersGuidePrompt,
            metaTagsPrompt: template?.metaTagsPrompt
          }
        };

        const result = await OpenRouterService.generateContent(request);

        if (result.success && result.content) {
          // Save AI content to page
          await prisma.page.update({
            where: { id: page.id },
            data: {
              aiGeneratedContent: result.content,
              isAiGenerated: true,
              aiGeneratedAt: new Date()
            }
          });

          console.log(`✅ ${page.city?.name}, ${page.state?.code}`);
        } else {
          console.error(`❌ Failed: ${page.city?.name} - ${result.error}`);
        }

      } catch (error) {
        console.error(`❌ Error: ${page.city?.name} - ${error.message}`);
      }
    }

    // Delay between batches
    if (i + BATCH_SIZE < pages.length) {
      console.log(`⏳ Waiting ${DELAY_MS}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log('\n✨ Content generation complete!');
}

generateContentForPages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Run Script
```bash
cd /var/www/myinsurancebuddies.com
npx ts-node scripts/generate-auto-content.ts
```

---

## Step 5: Verify & Publish

### Check Content Quality
```sql
-- Check generation progress
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN "isAiGenerated" = true THEN 1 ELSE 0 END) as completed,
  SUM(CASE WHEN "isAiGenerated" = false THEN 1 ELSE 0 END) as pending
FROM "Page" 
WHERE "insuranceTypeId" = 'auto-id';

-- View sample content
SELECT 
  p.slug,
  p."aiGeneratedContent"->>'intro' as intro_preview
FROM "Page" p
WHERE p."isAiGenerated" = true
LIMIT 5;
```

### Publish Pages
```sql
-- Publish all pages with AI content
UPDATE "Page" 
SET "isPublished" = true 
WHERE "isAiGenerated" = true 
AND "insuranceTypeId" = 'auto-id';
```

### Or via Admin API
```bash
curl -X POST http://localhost:3000/api/pages/publish \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "insuranceTypeId": "auto-id",
    "filter": "ai_generated"
  }'
```

---

## Step 6: Revalidate & Go Live

### Trigger ISR Revalidation
```bash
# Revalidate all auto insurance pages
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "YOUR_REVALIDATE_SECRET",
    "pattern": "/car-insurance/**"
  }'
```

### Verify Live Pages
```bash
# Test a few pages
curl -s http://localhost:3000/car-insurance/ca/los-angeles | head -100
curl -s http://localhost:3000/car-insurance/tx/houston | head -100
curl -s http://localhost:3000/car-insurance/ny/new-york | head -100
```

---

## Monitoring

### Lead Generation Tracking
```sql
-- Track leads by page
SELECT 
  p.slug,
  p."cityId",
  COUNT(l.id) as leads,
  AVG(l."leadScore") as avg_score
FROM "Page" p
LEFT JOIN "Lead" l ON l."pageId" = p.id
WHERE p."insuranceTypeId" = 'auto-id'
GROUP BY p.id
ORDER BY leads DESC
LIMIT 20;
```

### Page Performance
```sql
-- Most visited pages
SELECT 
  p.slug,
  p."aiGeneratedContent"->'metaTags'->>'metaTitle' as title,
  p."viewCount"
FROM "Page" p
WHERE p."insuranceTypeId" = 'auto-id'
ORDER BY p."viewCount" DESC
LIMIT 20;
```

---

## Expected Output

After completion:
- ✅ 30,000+ unique auto insurance pages
- ✅ 12 AI content sections per page
- ✅ ~2,000 words per page (60M+ words total)
- ✅ All content unique with slight natural duplication
- ✅ SEO-optimized for "cheapest car insurance [city]"
- ✅ Lead capture forms on every page

---

## Cost Estimate

Using FREE models (DeepSeek R1):
- **Total Cost**: $0
- **Time**: ~24-30 hours for 30k pages
- **API Calls**: ~360,000 (12 sections × 30k pages)

---

## Troubleshooting

### Rate Limit Errors
- Increase delay to 3000-5000ms
- Add more OpenRouter accounts
- Reduce batch size to 10

### Low Quality Content
- Check template prompts are seeded correctly
- Verify perSection mode is enabled
- Review example formats in template

### Missing Content Sections
- Check section results in generation log
- Re-run for failed sections only
- Use admin dashboard for manual regeneration
