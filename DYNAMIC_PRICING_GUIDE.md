# Dynamic Pricing System Guide

## Overview

The Dynamic Pricing System allows you to set promotional prices like "Starting from $59/month" that are displayed across insurance pages. This helps increase form fills by showing attractive rates while maintaining compliance with actual offer pricing.

## How It Works

1. **Admin Panel**: Set display prices and promotional messaging for each Call Offer
2. **API**: Fetches the best pricing based on insurance type and location
3. **Frontend**: Displays dynamic pricing with promotional messaging

## Key Features

- ✅ Set custom display prices (e.g., $59) separate from regular rates
- ✅ Show savings percentages (e.g., "Save $91 (60% off)")
- ✅ Customizable promotional headlines and CTAs
- ✅ Schedule promotions with start/end dates
- ✅ Location-based pricing (different prices per state)
- ✅ Multiple display variants (hero, sidebar, inline, compact)

## Setup Instructions

### 1. Environment Variables

Make sure `apps/web/.env.local` has the admin URL:

```env
NEXT_PUBLIC_ADMIN_URL="http://localhost:3002"
```

### 2. Access the Pricing Manager

1. Go to Admin Panel → Marketing → **Pricing Manager**
2. Select a Call Offer to edit
3. Configure pricing and messaging
4. Save changes

### 3. Configure Pricing for an Offer

For each Call Offer, you can set:

| Field | Description | Example |
|-------|-------------|---------|
| **Display Price** | The attractive price shown | $59 |
| **Price Label** | Text before price | "Starting from", "As low as" |
| **Period** | Billing period | "/month", "/year" |
| **Regular Price** | Original price for comparison | $150 |
| **Promo Headline** | Main promotional message | "Limited Time: Save up to 60%" |
| **Promo Subheadline** | Supporting message | "Drivers are qualifying for rates as low as $59/month" |
| **Urgency Text** | Scarcity message | "Offer ends soon" |
| **CTA Text** | Button text | "Get Your Free Quote" |
| **CTA Subtext** | Small text under button | "Takes 2 minutes • No obligation" |

### 4. Use in Frontend Pages

#### Option A: PricingCard Component

```tsx
import { PricingCard } from '@/components/pricing';

// Full hero banner
<PricingCard 
  insuranceTypeId="uuid-of-car-insurance"
  stateId="uuid-of-california"
  variant="hero"
/>

// Sidebar widget
<PricingCard 
  insuranceTypeId="uuid-of-car-insurance"
  variant="sidebar"
/>

// Inline in content
<PricingCard 
  insuranceTypeId="uuid-of-car-insurance"
  variant="inline"
/>

// Compact badge
<PricingCard 
  insuranceTypeId="uuid-of-car-insurance"
  variant="compact"
/>
```

#### Option B: PriceDisplay Component (inline text)

```tsx
import { PriceDisplay } from '@/components/pricing';

// Simple inline price
<p>Get car insurance for just <PriceDisplay insuranceTypeId="uuid" />!</p>

// With savings info
<p><PriceDisplay variant="with-savings" insuranceTypeId="uuid" /></p>

// Full format with label
<p><PriceDisplay variant="full" insuranceTypeId="uuid" /></p>
```

#### Option C: usePricing Hook (custom implementation)

```tsx
import { usePricing, formatPrice } from '@/lib/hooks/usePricing';

function CustomPricingSection() {
  const { pricing, loading } = usePricing({
    insuranceTypeId: 'your-insurance-type-uuid',
    stateId: 'optional-state-uuid',
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{pricing?.promoHeadline}</h2>
      <p>
        {pricing?.displayPriceLabel} {formatPrice(pricing?.displayPrice || 0)}
        {pricing?.displayPricePeriod}
      </p>
      <button>{pricing?.ctaText}</button>
    </div>
  );
}
```

## API Endpoints

### Get Pricing (Public)

```
GET /api/public/pricing?insuranceTypeId=xxx&stateId=xxx&cityId=xxx
```

Response:
```json
{
  "success": true,
  "pricing": {
    "displayPrice": 59,
    "displayPriceLabel": "Starting from",
    "displayPricePeriod": "/month",
    "regularPrice": 150,
    "savingsAmount": 91,
    "savingsPercentage": 60,
    "priceDisclaimer": "*Rates vary based on profile",
    "promoHeadline": "Limited Time: Save up to 60%",
    "promoSubheadline": "Drivers are qualifying for rates as low as $59/month",
    "urgencyText": "Offer ends soon",
    "ctaText": "Get Your Free Quote",
    "ctaSubtext": "Takes 2 minutes • No obligation",
    "offerId": "uuid",
    "offerName": "Auto Insurance - CA",
    "formRedirectUrl": "https://..."
  }
}
```

### Get/Update Pricing (Admin)

```
GET /api/pricing?insuranceTypeId=xxx
```

Update via Call Offers API:
```
PATCH /api/call-offers/:id
{
  "displayPrice": 59,
  "regularPrice": 150,
  "promoHeadline": "Limited Time Offer"
}
```

## Best Practices

### 1. Price Psychology
- Use "charm pricing" (ending in 9): $59 instead of $60
- Show clear savings: strikethrough regular price + percentage saved
- Create urgency: "Limited time", "Offer ends soon"

### 2. A/B Testing Ideas
- Test different price points ($49 vs $59 vs $79)
- Test different CTAs ("Get Quote" vs "Compare Rates" vs "Save Now")
- Test different headlines ("Save 60%" vs "Starting from $59")

### 3. Compliance
- Always include disclaimer: "*Rates vary based on profile"
- Don't guarantee specific rates
- Ensure display price is achievable for some users

### 4. Seasonal Promotions
- Schedule promotions around holidays
- Black Friday: "Black Friday Special: Save 70%"
- New Year: "New Year, New Rate: Start from $49"

## Troubleshooting

### Prices not updating on pages
1. Check if Call Offer has `isActive: true`
2. Verify the offer has a `displayPrice` set
3. Check if promotion dates are valid (start <= now <= end)
4. Clear browser cache (pricing is cached for 5 minutes)

### Wrong price showing
1. Check priority - higher priority offers win
2. Check state matching - ensure offer covers the page's state
3. Check insurance type matching

### API errors
1. Verify `NEXT_PUBLIC_ADMIN_URL` is set correctly
2. Check if admin API is running
3. Check browser console for CORS errors

## Examples

### Example 1: Car Insurance Page (California)

```tsx
// In apps/web/app/car-insurance/page.tsx
import { PricingCard } from '@/components/pricing';

export default function CarInsurancePage() {
  const insuranceTypeId = 'uuid-for-car-insurance';
  
  return (
    <div>
      <h1>Car Insurance</h1>
      <PricingCard 
        insuranceTypeId={insuranceTypeId}
        variant="hero"
      />
    </div>
  );
}
```

### Example 2: State-Specific Page

```tsx
// In apps/web/app/states/[country]/[state]/page.tsx
import { PricingCard } from '@/components/pricing';

export default function StatePage({ params, pageData }: Props) {
  return (
    <div>
      <h1>Car Insurance in {pageData.state.name}</h1>
      <PricingCard 
        insuranceTypeId={pageData.insuranceType?.id}
        stateId={pageData.state?.id}
        variant="hero"
      />
    </div>
  );
}
```

### Example 3: Multiple Insurance Types

```tsx
import { PriceDisplay } from '@/components/pricing';

export default function ComparePage() {
  return (
    <table>
      <tr>
        <td>Car Insurance</td>
        <td><PriceDisplay insuranceTypeId="car-uuid" variant="with-savings" /></td>
      </tr>
      <tr>
        <td>Home Insurance</td>
        <td><PriceDisplay insuranceTypeId="home-uuid" variant="with-savings" /></td>
      </tr>
    </table>
  );
}
```

## Migration Notes

The database migration adds these fields to the `CallOffer` model:

- `displayPrice` - Promotional price
- `displayPriceLabel` - Label text
- `displayPricePeriod` - Billing period
- `regularPrice` - Original price
- `savingsAmount` - Calculated savings
- `savingsPercentage` - Calculated percentage
- `priceDisclaimer` - Legal disclaimer
- `promoHeadline` - Main promotional text
- `promoSubheadline` - Secondary promotional text
- `urgencyText` - Scarcity message
- `ctaText` - Button text
- `ctaSubtext` - Button subtext
- `promoStartDate` - Promotion start
- `promoEndDate` - Promotion end

Migration has been applied: `20260131144933_add_dynamic_pricing_to_offers`
