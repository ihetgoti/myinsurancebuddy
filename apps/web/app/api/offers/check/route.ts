import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/offers/check
 * Check if there's an offer available for the given niche/location
 * Returns offer details or indicates no offer available
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const insuranceTypeId = searchParams.get('insuranceTypeId');
    const stateId = searchParams.get('stateId');
    const cityId = searchParams.get('cityId');

    // Build the query - try multiple matching strategies
    const offer = await prisma.callOffer.findFirst({
      where: {
        isActive: true,
        AND: [
          {
            OR: [
              // Strategy 1: Match insurance type + state
              {
                insuranceTypeId: insuranceTypeId || undefined,
                stateIds: stateId ? { has: stateId } : undefined,
              },
              // Strategy 2: Match insurance type only (all states)
              {
                insuranceTypeId: insuranceTypeId || undefined,
                stateIds: { isEmpty: true },
              },
              // Strategy 3: Match state only (any insurance type)
              {
                stateIds: stateId ? { has: stateId } : undefined,
              },
              // Strategy 4: Any active offer (ultimate fallback)
              {},
            ],
          },
        ],
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        campaignId: true,
        scriptUrl: true,
        scriptCode: true,
        phoneNumber: true,
        formRedirectUrl: true,
        displayPrice: true,
        displayPriceLabel: true,
        displayPricePeriod: true,
        ctaText: true,
        insuranceType: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        stateIds: true,
      },
    });

    // Check if offer has any valid way to display
    const hasValidOffer = offer && (
      offer.scriptUrl || 
      offer.scriptCode || 
      offer.formRedirectUrl || 
      offer.phoneNumber
    );

    if (!hasValidOffer) {
      return NextResponse.json({
        hasOffer: false,
        message: 'No offer available for this location',
      });
    }

    return NextResponse.json({
      hasOffer: true,
      offerId: offer.id,
      name: offer.name,
      scriptUrl: offer.scriptUrl,
      scriptCode: offer.scriptCode,
      phoneNumber: offer.phoneNumber,
      formUrl: offer.formRedirectUrl,
      campaignId: offer.campaignId,
      displayPrice: offer.displayPrice,
      displayPriceLabel: offer.displayPriceLabel,
      displayPricePeriod: offer.displayPricePeriod,
      ctaText: offer.ctaText,
      insuranceType: offer.insuranceType,
    });

  } catch (error: any) {
    console.error('Offer check error:', error);
    return NextResponse.json(
      { 
        hasOffer: false,
        error: 'Failed to check offer availability'
      },
      { status: 500 }
    );
  }
}
