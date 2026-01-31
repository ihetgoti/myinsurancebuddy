import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  getMarketcallPhones,
  getMarketcallOffers,
  getMarketcallRegions,
  getMarketcallCategories,
} from '@/lib/marketcallApi';

/**
 * POST /api/marketcall/sync
 * Sync data from Marketcall to our database
 * 
 * This is what you run to:
 * 1. Get all phone numbers from Marketcall
 * 2. Get all offers (niches + states)
 * 3. Save them to our database for display on website
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      apiKey, // Your Marketcall API key
      syncPhones = true,
      syncOffers = true,
      dryRun = false // If true, just preview what would happen
    } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Marketcall API key is required' },
        { status: 400 }
      );
    }

    const config = { apiKey };
    const results: any = {
      phones: { added: 0, updated: 0, errors: [] },
      offers: { added: 0, updated: 0, errors: [] },
    };

    // 1. Get regions (states) from Marketcall
    const regions = await getMarketcallRegions(config);
    const regionMap = new Map(regions.map((r: any) => [r.id, r.name]));

    // 2. Get categories (insurance types) from Marketcall
    const categories = await getMarketcallCategories(config);
    const categoryMap = new Map(categories.map((c: any) => [c.id, c.name]));

    // 3. Sync Phone Numbers
    if (syncPhones) {
      try {
        const phones = await getMarketcallPhones(config);
        
        for (const phone of phones) {
          try {
            const phoneData = {
              phoneNumber: phone.phone_number,
              marketcallCampaignId: phone.program_id?.toString(),
            };

            if (!dryRun) {
              // Check if we already have this phone
              const existing = await prisma.callOffer.findFirst({
                where: { phoneNumber: phone.phone_number },
              });

              if (existing) {
                await prisma.callOffer.update({
                  where: { id: existing.id },
                  data: phoneData,
                });
                results.phones.updated++;
              }
              // Note: New phones need to be linked to offers manually
            }
          } catch (err: any) {
            results.phones.errors.push({
              phone: phone.phone_number,
              error: err.message,
            });
          }
        }
      } catch (err: any) {
        results.phones.errors.push({ error: `Failed to fetch phones: ${err.message}` });
      }
    }

    // 4. Sync Offers
    if (syncOffers) {
      try {
        // Get active offers only (state=1)
        const offers = await getMarketcallOffers(config, { state: [1] });
        
        for (const offer of offers) {
          try {
            // Get category name (insurance type)
            const categoryName = offer.categories?.[0] 
              ? categoryMap.get(offer.categories[0]) 
              : null;
            
            // Get regions (states) this offer works in
            const regionNames = offer.regions?.map((r: number) => regionMap.get(r)).filter(Boolean);

            // Find matching insurance type in our database
            let insuranceType = null;
            if (categoryName && typeof categoryName === 'string') {
              insuranceType = await prisma.insuranceType.findFirst({
                where: {
                  name: {
                    contains: categoryName.replace(/insurance/i, '').trim(),
                    mode: 'insensitive',
                  },
                },
              });
            }

            // Find matching states in our database
            const stateIds: string[] = [];
            if (regionNames?.length) {
              for (const regionName of regionNames) {
                const state = await prisma.state.findFirst({
                  where: {
                    name: {
                      contains: regionName,
                      mode: 'insensitive',
                    },
                  },
                });
                if (state) stateIds.push(state.id);
              }
            }

            const offerData = {
              name: `${categoryName || 'Insurance'} - ${regionNames?.join(', ') || 'All States'}`,
              marketcallOfferId: offer.id.toString(),
              campaignId: offer.id.toString(),
              insuranceTypeId: insuranceType?.id || null,
              stateIds: stateIds,
              description: offer.description || null,
              isActive: offer.state === 1,
            };

            if (!dryRun) {
              const existing = await prisma.callOffer.findFirst({
                where: { marketcallOfferId: offer.id.toString() },
              });

              if (existing) {
                await prisma.callOffer.update({
                  where: { id: existing.id },
                  data: offerData,
                });
                results.offers.updated++;
              } else {
                await prisma.callOffer.create({
                  data: offerData,
                });
                results.offers.added++;
              }
            }
          } catch (err: any) {
            results.offers.errors.push({
              offer: offer.id,
              error: err.message,
            });
          }
        }
      } catch (err: any) {
        results.offers.errors.push({ error: `Failed to fetch offers: ${err.message}` });
      }
    }

    return NextResponse.json({
      success: true,
      dryRun,
      message: dryRun 
        ? 'Dry run completed - no changes made'
        : `Sync completed: ${results.phones.updated} phones updated, ${results.offers.added} offers added, ${results.offers.updated} updated`,
      results,
      mappings: {
        regionsFound: regions.length,
        categoriesFound: categories.length,
      },
    });

  } catch (error: any) {
    console.error('Marketcall sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Sync failed' },
      { status: 500 }
    );
  }
}
