/**
 * Dynamic Pricing Service
 * Returns the best promotional pricing for insurance pages
 */

import { prisma } from '@/lib/prisma';

export interface PricingDisplay {
  displayPrice: number;
  displayPriceLabel: string;
  displayPricePeriod: string;
  regularPrice: number | null;
  savingsAmount: number | null;
  savingsPercentage: number | null;
  priceDisclaimer: string;
  promoHeadline: string | null;
  promoSubheadline: string | null;
  urgencyText: string | null;
  ctaText: string;
  ctaSubtext: string | null;
  offerId: string;
  offerName: string;
  formRedirectUrl: string | null;
}

export class PricingService {
  
  /**
   * Get the best pricing for a specific insurance type and location
   */
  static async getPricingForLocation(
    insuranceTypeId: string,
    stateId?: string,
    cityId?: string
  ): Promise<PricingDisplay | null> {
    const now = new Date();
    
    // Find active offers for this insurance type and location
    const offers = await prisma.callOffer.findMany({
      where: {
        isActive: true,
        insuranceTypeId,
        displayPrice: { not: null }, // Must have a display price
        AND: [
          {
            OR: [
              { promoStartDate: null },
              { promoStartDate: { lte: now } }
            ]
          },
          {
            OR: [
              { promoEndDate: null },
              { promoEndDate: { gte: now } }
            ]
          }
        ],
        // State matching - either no specific states or includes this state
        OR: [
          { stateIds: { isEmpty: true } },
          { stateIds: { has: stateId || '' } }
        ]
      },
      orderBy: [
        { priority: 'desc' },
        { displayPrice: 'asc' } // Lower price = better for users
      ],
      take: 1
    });

    if (offers.length === 0) {
      return null;
    }

    const offer = offers[0];
    
    return {
      displayPrice: offer.displayPrice!,
      displayPriceLabel: offer.displayPriceLabel,
      displayPricePeriod: offer.displayPricePeriod,
      regularPrice: offer.regularPrice,
      savingsAmount: offer.savingsAmount,
      savingsPercentage: offer.savingsPercentage,
      priceDisclaimer: offer.priceDisclaimer || '*Rates vary based on profile',
      promoHeadline: offer.promoHeadline,
      promoSubheadline: offer.promoSubheadline,
      urgencyText: offer.urgencyText,
      ctaText: offer.ctaText,
      ctaSubtext: offer.ctaSubtext,
      offerId: offer.id,
      offerName: offer.name,
      formRedirectUrl: offer.formRedirectUrl
    };
  }

  /**
   * Get pricing with fallback to default
   */
  static async getPricingWithFallback(
    insuranceTypeId: string,
    stateId?: string,
    cityId?: string
  ): Promise<PricingDisplay> {
    const pricing = await this.getPricingForLocation(insuranceTypeId, stateId, cityId);
    
    if (pricing) {
      return pricing;
    }

    // Return default/fallback pricing
    return {
      displayPrice: 59,
      displayPriceLabel: 'Starting from',
      displayPricePeriod: '/month',
      regularPrice: 150,
      savingsAmount: 91,
      savingsPercentage: 60,
      priceDisclaimer: '*Rates vary based on profile',
      promoHeadline: 'Compare & Save Today',
      promoSubheadline: 'See how much you could save on your insurance',
      urgencyText: null,
      ctaText: 'Get Your Free Quote',
      ctaSubtext: 'Takes 2 minutes • No obligation',
      offerId: 'default',
      offerName: 'Default Pricing',
      formRedirectUrl: null
    };
  }

  /**
   * Format price for display
   */
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  /**
   * Get all active offers for admin dashboard
   */
  static async getAllActiveOffers() {
    const now = new Date();
    
    return prisma.callOffer.findMany({
      where: {
        isActive: true,
        AND: [
          {
            OR: [
              { promoStartDate: null },
              { promoStartDate: { lte: now } }
            ]
          },
          {
            OR: [
              { promoEndDate: null },
              { promoEndDate: { gte: now } }
            ]
          }
        ]
      },
      include: {
        insuranceType: {
          select: { name: true, slug: true }
        }
      },
      orderBy: { priority: 'desc' }
    });
  }

  /**
   * Create or update pricing for an offer
   */
  static async updateOfferPricing(
    offerId: string,
    pricingData: {
      displayPrice: number;
      regularPrice?: number;
      displayPriceLabel?: string;
      promoHeadline?: string;
      promoSubheadline?: string;
    }
  ) {
    // Calculate savings
    const savingsAmount = pricingData.regularPrice 
      ? pricingData.regularPrice - pricingData.displayPrice 
      : null;
    
    const savingsPercentage = pricingData.regularPrice && savingsAmount
      ? Math.round((savingsAmount / pricingData.regularPrice) * 100)
      : null;

    return prisma.callOffer.update({
      where: { id: offerId },
      data: {
        displayPrice: pricingData.displayPrice,
        regularPrice: pricingData.regularPrice,
        displayPriceLabel: pricingData.displayPriceLabel,
        savingsAmount,
        savingsPercentage,
        promoHeadline: pricingData.promoHeadline,
        promoSubheadline: pricingData.promoSubheadline
      }
    });
  }
}
