import { NextRequest, NextResponse } from 'next/server';
import { PricingService } from '@/lib/pricingService';

/**
 * GET /api/pricing
 * Get pricing for a specific insurance type and location
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

    return NextResponse.json({ 
      success: true,
      pricing 
    });
  } catch (error: any) {
    console.error('Get pricing error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
