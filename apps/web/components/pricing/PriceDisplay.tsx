'use client';

import { usePricing, formatPrice } from '@/lib/hooks/usePricing';

interface PriceDisplayProps {
  insuranceTypeId?: string;
  stateId?: string;
  cityId?: string;
  variant?: 'simple' | 'with-savings' | 'full';
  className?: string;
}

/**
 * Simple price display component for inline usage
 * 
 * Examples:
 * <PriceDisplay variant="simple" /> - Shows "$59/month"
 * <PriceDisplay variant="with-savings" /> - Shows "$59/month (Save $91)"
 * <PriceDisplay variant="full" /> - Shows full promotional message
 */
export function PriceDisplay({
  insuranceTypeId,
  stateId,
  cityId,
  variant = 'simple',
  className = '',
}: PriceDisplayProps) {
  const { pricing, loading } = usePricing({
    insuranceTypeId,
    stateId,
    cityId,
  });

  if (loading) {
    return <span className={`inline-block w-16 h-4 bg-gray-200 rounded animate-pulse ${className}`} />;
  }

  if (!pricing) {
    return <span className={className}>$59/month</span>;
  }

  switch (variant) {
    case 'with-savings':
      return (
        <span className={className}>
          <span className="font-bold text-green-600">
            {formatPrice(pricing.displayPrice)}{pricing.displayPricePeriod}
          </span>
          {pricing.savingsAmount && (
            <span className="text-green-600 text-sm ml-1">
              (Save {formatPrice(pricing.savingsAmount)})
            </span>
          )}
        </span>
      );

    case 'full':
      return (
        <span className={className}>
          {pricing.displayPriceLabel} {' '}
          <span className="font-bold text-green-600">
            {formatPrice(pricing.displayPrice)}{pricing.displayPricePeriod}
          </span>
          {pricing.regularPrice && (
            <span className="text-gray-400 line-through text-sm ml-1">
              {formatPrice(pricing.regularPrice)}{pricing.displayPricePeriod}
            </span>
          )}
        </span>
      );

    case 'simple':
    default:
      return (
        <span className={`font-bold text-green-600 ${className}`}>
          {formatPrice(pricing.displayPrice)}{pricing.displayPricePeriod}
        </span>
      );
  }
}
