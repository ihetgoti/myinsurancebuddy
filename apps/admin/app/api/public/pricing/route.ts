import { NextRequest, NextResponse } from 'next/server';
import { PricingService } from '@/lib/pricingService';

/**
 * GET /api/public/pricing
 * Public endpoint to get pricing for pages (no auth required)
 * Query params: insuranceTypeId, stateId, cityId
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const insuranceTypeId = searchParams.get('insuranceTypeId');
    const stateId = searchParams.get('stateId') || undefined;
    const cityId = searchParams.get('cityId') || undefined;

    if (!insuranceTypeId) {
      return NextResponse.json(
        { error: 'insuranceTypeId is required' },
        { status: 400 }
      );
    }

    const pricing = await PricingService.getPricingWithFallback(
      insuranceTypeId,
      stateId,
      cityId
    );

    // Add CORS headers for public access
    return NextResponse.json(
      { success: true, pricing },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
        }
      }
    );
  } catch (error: any) {
    console.error('Get public pricing error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
