# MarketCall Lead Redirect Setup

## How It Works

When a user clicks "Get Quotes" on any page:

1. **Form captures ZIP + Email** (optional)
2. **System checks for matching MarketCall offer** based on:
   - Insurance type (e.g., car-insurance)
   - State (if available)
3. **Redirects to MarketCall form** with tracking params
4. **Lead is generated in MarketCall** when user fills their form

## Admin Setup

### 1. Add MarketCall Offers

Go to: **Admin Panel → Dashboard → Call Offers**

For each offer, fill:

| Field | Description | Example |
|-------|-------------|---------|
| **Name** | Descriptive name | "Auto Insurance - California" |
| **Campaign ID** | MarketCall campaign ID | "330575" |
| **Sub ID** | Your tracking ID | "mib_homepage" |
| **Form Redirect URL** | MarketCall form URL | "https://form.marketcall.com/insurance" |
| **Insurance Type** | Link to insurance type | "Auto Insurance" |
| **States** | Select applicable states | "California, Texas" (or leave empty for all) |
| **Priority** | Higher = preferred | 10 (for specific), 1 (for general) |

### 2. Example Offer Configurations

**Car Insurance - General (All States):**
```
Name: Auto Insurance - All States
Campaign ID: 330575
Sub ID: mib_auto_general
Form Redirect URL: https://form.marketcall.com/auto-insurance
Insurance Type: Auto Insurance
States: (empty = all states)
Priority: 1
```

**Car Insurance - California Only:**
```
Name: Auto Insurance - California
Campaign ID: 330576
Sub ID: mib_auto_ca
Form Redirect URL: https://form.marketcall.com/auto-ca
Insurance Type: Auto Insurance
States: California
Priority: 10
```

**Home Insurance - Specific:**
```
Name: Home Insurance - Texas
Campaign ID: 330577
Sub ID: mib_home_tx
Form Redirect URL: https://form.marketcall.com/home-tx
Insurance Type: Home Insurance
States: Texas
Priority: 10
```

## How Matching Works

The system finds the best offer using this logic:

1. **Insurance Type Match**: Find offers for that specific insurance type
2. **State Match**: Find offers that include the user's state
3. **Priority**: Highest priority offer wins
4. **Fallback**: If no specific match, use general offers

### Priority Rules

- **Specific (State + Type)**: Priority 10+
- **Type Only**: Priority 5
- **General**: Priority 1

## URL Parameters Passed

When redirecting to MarketCall, these params are added:

```
https://form.marketcall.com/auto-insurance?zip=90210&email=user@email.com&subid=mib_auto_ca&campaign=330576
```

| Param | Description |
|-------|-------------|
| `zip` | User's ZIP code |
| `email` | User's email (if provided) |
| `subid` | Your tracking sub ID |
| `campaign` | MarketCall campaign ID |

## Tracking

Events are tracked in GTM/DataLayer:

```javascript
// When user clicks button
dataLayer.push({
  event: 'cta_click',
  cta_text: 'Get Quotes',
  cta_url: 'marketcall_redirect',
  source: 'homepage_cta'
});

// When redirect happens
dataLayer.push({
  event: 'form_submit',
  form_id: 'lead_capture_form',
  zip_code: '90210',
  insurance_type: 'car-insurance',
  redirect_to: 'marketcall',
  offer_name: 'Auto Insurance - California'
});
```

## Testing

1. **Add a test offer** in admin panel
2. **Go to relevant page** (e.g., /car-insurance)
3. **Enter ZIP code** and click "Get Quotes"
4. **Should redirect** to MarketCall form
5. **Check URL** has correct parameters

## Fallback Behavior

If no MarketCall offer matches:
- User is redirected to `/get-quote` page
- ZIP and email are preserved in URL
- Local lead capture form is shown

## API Endpoint

You can test the API directly:

```bash
GET /api/redirect-offer?insuranceType=car-insurance&state=california&zip=90210&email=test@email.com

Response:
{
  "success": true,
  "redirectUrl": "https://form.marketcall.com/auto-insurance?zip=90210&email=test%40email.com&subid=mib_auto_ca&campaign=330576",
  "offer": {
    "id": "...",
    "name": "Auto Insurance - California",
    "insuranceType": "Auto Insurance",
    "phoneMask": "(xxx) xxx-xx-xx"
  }
}
```

## Troubleshooting

### No Redirect Happening
- Check browser console for errors
- Verify offer is **Active** in admin
- Check `formRedirectUrl` is not empty
- Ensure insurance type matches

### Wrong Offer Redirecting
- Check **Priority** values (higher = preferred)
- Verify state matching
- Check insurance type assignment

### MarketCall Not Receiving Leads
- Verify campaign ID is correct
- Check subid is being passed
- Test MarketCall form directly
- Check URL parameters in redirect

## Integration Flow

```
User on /car-insurance/california
       ↓
Fills ZIP: 90210
       ↓
Clicks "Get Quotes"
       ↓
API: /api/redirect-offer?type=car&state=california&zip=90210
       ↓
Finds: "Auto Insurance - California" (Priority: 10)
       ↓
Redirects to MarketCall Form
       ↓
User fills MarketCall form
       ↓
Lead generated in MarketCall
```
