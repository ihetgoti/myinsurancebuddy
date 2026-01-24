# Lead Generation & Monetization Setup Guide

## 🎯 Overview

Your insurance website has a comprehensive lead generation system with **TWO main monetization methods**:

1. **📞 Pay-Per-Call** - MarketCall integration for phone number tracking
2. **📝 Lead Forms** - Capture ZIP code + email for quote requests

Both support **popup modals** with multiple trigger types (scroll, exit-intent, timed).

---

## 💰 Monetization Channels

### 1. Pay-Per-Call (MarketCall)
- **Provider**: MarketCall (www.marketcall.com)
- **Revenue Model**: $5-$50 per qualified phone call
- **How It Works**: Display tracked phone numbers that route through MarketCall
- **Popup Support**: ✅ Yes (phone number shown in popup modal)

### 2. Lead Capture Forms
- **Revenue Model**: Sell leads to insurance carriers ($2-$20 per lead)
- **Data Captured**: ZIP code (required), email (optional)
- **Popup Support**: ✅ Yes (form shown in popup modal)

### 3. Affiliate Links (Future)
- Partner with insurance carriers
- Get commission on policy sales
- OfferVault/ShareASale integration ready

---

## 🚀 Quick Start Setup

### Step 1: Run Database Migration

First, apply the new Lead model to your database:

```bash
cd packages/db
npx prisma migrate dev --name add_lead_model
npx prisma generate
```

### Step 2: Configure Google Analytics (Optional but Recommended)

1. Go to Admin Panel: `/admin/dashboard/settings/analytics`
2. Add your Google Analytics 4 Measurement ID
3. (Optional) Add Google Tag Manager Container ID
4. Click "Save Settings"

### Step 3: Set Up MarketCall Campaigns

#### A. Sign Up for MarketCall

1. Visit: https://www.marketcall.com
2. Create an account
3. Set up your first campaign
4. Get your Campaign ID and tracking phone number

#### B. Add Campaign in Admin Panel

1. Go to: `/admin/dashboard/call-offers`
2. Click "Add Call Offer"
3. Fill in details:
   - **Campaign ID**: From MarketCall dashboard
   - **Phone Number**: Your tracked number (e.g., 1-855-XXX-XXXX)
   - **Insurance Types**: Select which types this applies to
   - **States**: Select target states
   - **Priority**: Set to 10 for default campaign
4. Click "Create Call Offer"

### Step 4: Create Lead Capture Popups

#### A. Create Phone Call Popup

1. Go to: `/admin/dashboard/popups`
2. Click "Create New Popup"
3. **Content Tab**:
   - Title: "Get a Free Quote in 2 Minutes"
   - Subtitle: "Speak with a Licensed Agent Today"
   - Description: "Compare rates from top carriers and save up to $500/year"
   - Phone Number: "1-855-205-2412" (or your MarketCall number)
   - CTA Text: "Call Now for Free Quote"
   - CTA URL: `tel:1-855-205-2412` (or your number)
   - Badge Text: "Limited Time Savings"

4. **Trigger Tab**:
   - Type: "Exit Intent" (shows when user tries to leave)
   - OR Type: "Scroll" with 50% threshold
   - Frequency: "Once per session"

5. **Targeting Tab**:
   - Insurance Types: Select "Auto", "Home", etc.
   - States: Select your target states
   - Page Types: Select "insurance"

6. **Style Tab**:
   - Accent Color: "blue" or "emerald"
   - Position: "center"
   - Size: "md"
   - Show Trust Badges: ✅ Enabled

7. Click "Create Popup"

#### B. Create Lead Capture Form Popup

1. Create another popup
2. **Content Tab**:
   - Title: "Compare Insurance Quotes"
   - Subtitle: "Get the Best Rates in Your Area"
   - CTA Text: "Get My Free Quotes"
   - CTA URL: `/get-quote` (your quote page)
   - **NO** Phone Number (form-based)

3. **Trigger Tab**:
   - Type: "Timed"
   - Delay: 30 seconds
   - Frequency: "Once per day"

4. **Targeting & Style**: Same as phone popup

### Step 5: Add Lead Forms to Pages

Your templates already include lead capture forms! They're in:
- `AutoInsuranceTemplate.tsx`
- `HomeInsuranceTemplate.tsx`
- `HealthInsuranceTemplate.tsx`

The forms automatically:
- ✅ Capture ZIP code + email
- ✅ Track submissions via Google Analytics
- ✅ Store leads in database
- ✅ Redirect to quote page

---

## 📊 Viewing Leads & Analytics

### View Captured Leads

1. Go to: `/admin/dashboard/leads`
2. Features:
   - Filter by status, insurance type, source
   - Export to CSV
   - View contact info, referrer, metadata
   - Track conversion rates

### Lead Statuses

- **NEW**: Freshly captured
- **CONTACTED**: You reached out
- **QUALIFIED**: Verified as legitimate
- **CONVERTED**: Purchased a policy
- **DISQUALIFIED**: Not valid
- **DUPLICATE**: Duplicate submission

### Analytics Tracking

All events are automatically tracked:

**Phone Clicks**:
```javascript
trackPhoneClick(phoneNumber, source)
```

**Form Submissions**:
```javascript
trackFormSubmit('lead_capture_form', { zip_code, has_email, insurance_type, source })
```

**Popup Events**:
```javascript
trackPopupImpression(popupId, popupType)
trackPopupClick(popupId, popupType, ctaUrl)
trackPopupClose(popupId, popupType)
```

**CTA Clicks**:
```javascript
trackCTAClick(ctaText, ctaUrl, position)
```

---

## 🎨 Customization Options

### Popup Trigger Types

1. **Scroll Popup** - Triggers at X% scroll depth (10-90%)
2. **Exit Intent** - Shows when user tries to leave page
3. **Timed Popup** - Appears after X seconds on page
4. **Click Popup** - Triggers on specific button click (coming soon)

### Popup Positions

- **center** - Modal in screen center (recommended)
- **bottom-right** - Small popup in corner
- **bottom-left** - Small popup in corner

### Popup Sizes

- **sm** - Compact (320px)
- **md** - Standard (450px) - recommended
- **lg** - Large (600px)

### Accent Colors

- **blue** - Professional (default)
- **emerald** - Growth/savings
- **orange** - Urgency/limited time
- **purple** - Premium/quality
- **red** - Urgent action needed

---

## 💡 Best Practices

### Phone Popups

✅ **DO**:
- Use exit-intent trigger (catches abandoning visitors)
- Show phone number prominently
- Include "Free Quote" messaging
- Add trust badges ("100% Free", "No Obligation")
- Use urgent colors (orange/red) sparingly

❌ **DON'T**:
- Show popup immediately on page load
- Use more than one phone popup per page
- Hide the close button

### Form Popups

✅ **DO**:
- Use timed trigger (30-60 seconds)
- Keep forms simple (ZIP code only or + email)
- Show value proposition clearly
- Add privacy assurance
- Use "Once per day" frequency

❌ **DON'T**:
- Ask for too much information
- Show popup on every page visit
- Use aggressive trigger (< 10s delay)

### General

✅ **DO**:
- A/B test different messages
- Monitor conversion rates in `/admin/dashboard/leads`
- Export leads weekly for follow-up
- Track phone vs form performance
- Adjust popup priority based on performance

❌ **DON'T**:
- Show 2+ popups on same page visit
- Use popups on mobile without testing
- Set exit-intent sensitivity too high

---

## 📈 Revenue Optimization

### Recommended Popup Strategy

**Page Load:**
1. No popup (clean experience)

**30 seconds:**
2. Show lead capture form popup (timed trigger)

**Exit attempt:**
3. Show phone call popup (exit-intent trigger)

This gives TWO conversion opportunities without annoying users!

### A/B Testing

Create multiple popups for same trigger:

**Popup A** (Priority: 10):
- Title: "Get a Free Quote"
- Color: Blue
- CTA: "Compare Quotes"

**Popup B** (Priority: 5):
- Title: "Save Up to $500/Year!"
- Color: Orange
- CTA: "Get My Savings"

Higher priority shows first. Track performance in leads dashboard.

### MarketCall Optimization

1. **Use different numbers per state**:
   - Create multiple call offers
   - Assign different states to each
   - Track which states convert best

2. **Use different numbers per insurance type**:
   - Auto insurance: Campaign A
   - Home insurance: Campaign B
   - Track which types pay most per call

3. **Optimize sub-IDs**:
   - Add sub-ID tracking in MarketCall dashboard
   - Track popup vs inline vs template performance

---

## 🔧 Troubleshooting

### Popups Not Showing

1. **Check if popup is active**:
   - Go to `/admin/dashboard/popups`
   - Ensure "Active" toggle is ON
   - Check start/end dates

2. **Check targeting**:
   - Ensure insurance type matches page
   - Ensure state matches (if set)
   - Check "Exclude Slugs" field

3. **Check browser console**:
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Check if popup loaded in Network tab

### Leads Not Saving

1. **Check database migration**:
   ```bash
   cd packages/db
   npx prisma migrate status
   ```

2. **Check API endpoint**:
   - Go to Network tab in DevTools
   - Submit a form
   - Look for POST to `/api/leads`
   - Check response status

3. **Check Prisma client**:
   ```bash
   cd packages/db
   npx prisma generate
   ```

### Analytics Not Tracking

1. **Check GA4 ID**:
   - Go to `/admin/dashboard/settings/analytics`
   - Verify Measurement ID format: `G-XXXXXXXXXX`

2. **Check browser console**:
   - Look for `gtag` or `dataLayer` errors
   - Test with Google Analytics Debugger extension

3. **Verify GTM Data Layer**:
   ```javascript
   // Open browser console
   window.dataLayer
   // Should show array of events
   ```

---

## 📞 Campaign Examples

### Example 1: Auto Insurance - Aggressive

**Phone Popup**:
- Title: "Save $500+ on Auto Insurance!"
- Trigger: Exit Intent
- Phone: MarketCall campaign ID #12345
- States: CA, TX, FL, NY
- Priority: 10

**Form Popup**:
- Title: "Compare Auto Insurance Quotes"
- Trigger: 30s delay
- CTA URL: `/get-quote?type=auto`
- Priority: 5

### Example 2: Home Insurance - Educational

**Lead Form Popup**:
- Title: "Protect Your Home for Less"
- Trigger: 50% scroll
- Description: "Get personalized quotes from top-rated carriers"
- CTA: "See My Options"

**Phone CTA** (inline, not popup):
- Shown in template sidebar
- Always visible
- Less aggressive

---

## 🎯 Next Steps

1. ✅ **Complete database migration** (add Lead model)
2. ✅ **Set up Google Analytics** (optional but recommended)
3. ✅ **Create MarketCall account** and add first campaign
4. ✅ **Create 2 popups**: Phone call (exit-intent) + Form (timed)
5. ✅ **Test on live site** and verify leads appear in dashboard
6. ✅ **Monitor conversion rates** and optimize

---

## 🆘 Support & Resources

### Admin Dashboard Pages

- **Popups**: `/admin/dashboard/popups`
- **Call Offers**: `/admin/dashboard/call-offers`
- **Leads**: `/admin/dashboard/leads`
- **Analytics**: `/admin/dashboard/settings/analytics`
- **Affiliates**: `/admin/dashboard/affiliates`

### Key Files

- Lead Capture Form: `apps/web/components/LeadCaptureForm.tsx`
- Popup Modal: `apps/web/components/popups/PopupModal.tsx`
- MarketCall CTA: `apps/web/components/MarketcallCTA.tsx`
- GTM Tracking: `apps/web/components/GTMDataLayer.tsx`

### External Resources

- MarketCall: https://www.marketcall.com
- Google Analytics: https://analytics.google.com
- Google Tag Manager: https://tagmanager.google.com

---

## 💵 Revenue Projections

### Conservative Estimates (1,000 visitors/day)

**Phone Calls** (MarketCall):
- Conversion Rate: 0.5% = 5 calls/day
- Revenue per call: $10 average
- Monthly Revenue: $1,500

**Lead Forms**:
- Conversion Rate: 1% = 10 leads/day
- Revenue per lead: $5 average (selling to aggregators)
- Monthly Revenue: $1,500

**Total Potential**: **$3,000/month** from 1,000 daily visitors

### Aggressive Optimization (10,000 visitors/day)

With good popup optimization:
- Phone conversion: 0.8% = 80 calls/day
- Form conversion: 2% = 200 leads/day
- Monthly Revenue: **$54,000**

---

**Good luck with your campaigns! 🚀**

For questions or issues, check the troubleshooting section above or review the admin dashboard.
