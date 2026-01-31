/**
 * usePricing Hook
 * Fetches dynamic pricing for insurance pages
 * 
 * Usage:
 * const { pricing, loading, error } = usePricing({
 *   insuranceTypeId: 'insurance-type-uuid',
 *   stateId: 'state-uuid', // optional
 *   cityId: 'city-uuid',   // optional
 * });
 */

import { useState, useEffect, useCallback } from 'react';

export interface PricingData {
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

interface UsePricingOptions {
  insuranceTypeId?: string;
  stateId?: string;
  cityId?: string;
  baseUrl?: string;
}

interface UsePricingReturn {
  pricing: PricingData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Default/fallback pricing
const defaultPricing: PricingData = {
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
  formRedirectUrl: null,
};

export function usePricing(options: UsePricingOptions = {}): UsePricingReturn {
  const {
    insuranceTypeId,
    stateId,
    cityId,
    baseUrl = process.env.NEXT_PUBLIC_ADMIN_URL || '',
  } = options;

  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPricing = useCallback(async () => {
    // If no insurance type ID is provided, use default pricing
    if (!insuranceTypeId) {
      setPricing(defaultPricing);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('insuranceTypeId', insuranceTypeId);
      if (stateId) params.set('stateId', stateId);
      if (cityId) params.set('cityId', cityId);

      const url = `${baseUrl}/api/public/pricing?${params.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
        // Cache for 5 minutes
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pricing: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.pricing) {
        setPricing(data.pricing);
      } else {
        // Fallback to default if API returns unexpected format
        setPricing(defaultPricing);
      }
    } catch (err) {
      console.error('Error fetching pricing:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pricing');
      // Use default pricing on error
      setPricing(defaultPricing);
    } finally {
      setLoading(false);
    }
  }, [insuranceTypeId, stateId, cityId, baseUrl]);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  return {
    pricing: pricing || defaultPricing,
    loading,
    error,
    refetch: fetchPricing,
  };
}

// Helper function to format price
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Helper function to format full price display
export function formatPriceDisplay(
  pricing: PricingData | null,
  options: { showLabel?: boolean; showPeriod?: boolean } = {}
): string {
  if (!pricing) return '$59/month';
  
  const { showLabel = true, showPeriod = true } = options;
  
  let display = '';
  if (showLabel && pricing.displayPriceLabel) {
    display = `${pricing.displayPriceLabel} `;
  }
  display += formatPrice(pricing.displayPrice);
  if (showPeriod && pricing.displayPricePeriod) {
    display += pricing.displayPricePeriod;
  }
  
  return display;
}
