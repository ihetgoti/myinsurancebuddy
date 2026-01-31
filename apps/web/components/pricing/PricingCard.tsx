'use client';

import { usePricing, formatPrice, PricingData } from '@/lib/hooks/usePricing';
import { TrendingDown, Clock, ArrowRight } from 'lucide-react';

interface PricingCardProps {
  insuranceTypeId?: string;
  stateId?: string;
  cityId?: string;
  variant?: 'hero' | 'sidebar' | 'inline' | 'compact';
  className?: string;
  onCtaClick?: () => void;
  customRedirectUrl?: string;
}

export function PricingCard({
  insuranceTypeId,
  stateId,
  cityId,
  variant = 'hero',
  className = '',
  onCtaClick,
  customRedirectUrl,
}: PricingCardProps) {
  const { pricing, loading } = usePricing({
    insuranceTypeId,
    stateId,
    cityId,
  });

  if (loading) {
    return <PricingCardSkeleton variant={variant} className={className} />;
  }

  if (!pricing) {
    return null;
  }

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
      return;
    }

    // Redirect to form URL if available
    const redirectUrl = customRedirectUrl || pricing.formRedirectUrl;
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  switch (variant) {
    case 'hero':
      return <HeroVariant pricing={pricing} onCtaClick={handleCtaClick} className={className} />;
    case 'sidebar':
      return <SidebarVariant pricing={pricing} onCtaClick={handleCtaClick} className={className} />;
    case 'inline':
      return <InlineVariant pricing={pricing} onCtaClick={handleCtaClick} className={className} />;
    case 'compact':
      return <CompactVariant pricing={pricing} onCtaClick={handleCtaClick} className={className} />;
    default:
      return <HeroVariant pricing={pricing} onCtaClick={handleCtaClick} className={className} />;
  }
}

// Hero Variant - Full featured with all promotional messaging
function HeroVariant({
  pricing,
  onCtaClick,
  className,
}: {
  pricing: PricingData;
  onCtaClick: () => void;
  className?: string;
}) {
  return (
    <div className={`bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white shadow-xl ${className}`}>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        {/* Price Section */}
        <div className="text-center md:text-left">
          {pricing.promoHeadline && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium mb-4">
              <TrendingDown className="w-4 h-4" />
              {pricing.promoHeadline}
            </div>
          )}
          
          <div className="text-blue-200 text-sm mb-1">{pricing.displayPriceLabel}</div>
          <div className="text-5xl md:text-6xl font-bold mb-2">
            {formatPrice(pricing.displayPrice)}
            <span className="text-2xl md:text-3xl font-normal">{pricing.displayPricePeriod}</span>
          </div>
          
          {pricing.regularPrice && pricing.savingsAmount && (
            <div className="flex items-center justify-center md:justify-start gap-3 text-sm">
              <span className="text-blue-200 line-through">
                {formatPrice(pricing.regularPrice)}{pricing.displayPricePeriod}
              </span>
              <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                Save {pricing.savingsPercentage}%
              </span>
            </div>
          )}
          
          {pricing.priceDisclaimer && (
            <p className="text-blue-200 text-xs mt-2">{pricing.priceDisclaimer}</p>
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center md:text-left">
          {pricing.promoSubheadline && (
            <p className="text-blue-100 mb-4">{pricing.promoSubheadline}</p>
          )}
          
          {pricing.urgencyText && (
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-300 text-sm mb-4">
              <Clock className="w-4 h-4" />
              {pricing.urgencyText}
            </div>
          )}
          
          <button
            onClick={onCtaClick}
            className="w-full md:w-auto bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            {pricing.ctaText}
            <ArrowRight className="w-5 h-5" />
          </button>
          
          {pricing.ctaSubtext && (
            <p className="text-blue-200 text-sm mt-3">{pricing.ctaSubtext}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Sidebar Variant - Compact for sidebars
function SidebarVariant({
  pricing,
  onCtaClick,
  className,
}: {
  pricing: PricingData;
  onCtaClick: () => void;
  className?: string;
}) {
  return (
    <div className={`bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white ${className}`}>
      {pricing.promoHeadline && (
        <div className="flex items-center gap-1 text-xs font-medium text-blue-200 mb-2">
          <TrendingDown className="w-3 h-3" />
          {pricing.promoHeadline}
        </div>
      )}
      
      <div className="text-blue-200 text-xs">{pricing.displayPriceLabel}</div>
      <div className="text-3xl font-bold">
        {formatPrice(pricing.displayPrice)}
        <span className="text-base font-normal">{pricing.displayPricePeriod}</span>
      </div>
      
      {pricing.regularPrice && (
        <div className="text-xs text-blue-200 line-through mt-1">
          Was {formatPrice(pricing.regularPrice)}{pricing.displayPricePeriod}
        </div>
      )}
      
      <button
        onClick={onCtaClick}
        className="w-full bg-green-500 hover:bg-green-400 text-white px-4 py-3 rounded-lg font-semibold text-sm mt-4 transition"
      >
        {pricing.ctaText}
      </button>
      
      {pricing.ctaSubtext && (
        <p className="text-blue-200 text-xs text-center mt-2">{pricing.ctaSubtext}</p>
      )}
      
      {pricing.priceDisclaimer && (
        <p className="text-blue-300 text-[10px] mt-2">{pricing.priceDisclaimer}</p>
      )}
    </div>
  );
}

// Inline Variant - For embedding in content
function InlineVariant({
  pricing,
  onCtaClick,
  className,
}: {
  pricing: PricingData;
  onCtaClick: () => void;
  className?: string;
}) {
  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-4">
        <div>
          <div className="text-blue-600 text-xs font-medium">{pricing.displayPriceLabel}</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(pricing.displayPrice)}
            <span className="text-sm font-normal text-gray-500">{pricing.displayPricePeriod}</span>
          </div>
          {pricing.regularPrice && (
            <div className="text-xs text-gray-400 line-through">
              {formatPrice(pricing.regularPrice)}{pricing.displayPricePeriod}
            </div>
          )}
        </div>
        
        {pricing.savingsPercentage && (
          <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
            Save {pricing.savingsPercentage}%
          </div>
        )}
      </div>
      
      <button
        onClick={onCtaClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition"
      >
        {pricing.ctaText}
      </button>
    </div>
  );
}

// Compact Variant - Minimal for small spaces
function CompactVariant({
  pricing,
  onCtaClick,
  className,
}: {
  pricing: PricingData;
  onCtaClick: () => void;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-3 bg-green-50 border border-green-200 rounded-full px-4 py-2 ${className}`}>
      <span className="text-green-700 text-sm">
        <span className="font-bold">{formatPrice(pricing.displayPrice)}{pricing.displayPricePeriod}</span>
        {pricing.regularPrice && (
          <span className="text-green-500 line-through ml-1 text-xs">
            {formatPrice(pricing.regularPrice)}
          </span>
        )}
      </span>
      <button
        onClick={onCtaClick}
        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-xs font-medium transition"
      >
        Get Quote
      </button>
    </div>
  );
}

// Loading Skeleton
function PricingCardSkeleton({ variant, className }: { variant: string; className?: string }) {
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2 ${className}`}>
        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
        <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`bg-gray-100 rounded-2xl p-6 md:p-8 animate-pulse ${className}`}>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="w-32 h-4 bg-gray-200 rounded mb-4" />
          <div className="w-40 h-12 bg-gray-200 rounded mb-2" />
          <div className="w-24 h-4 bg-gray-200 rounded" />
        </div>
        <div>
          <div className="w-full h-4 bg-gray-200 rounded mb-4" />
          <div className="w-full h-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
