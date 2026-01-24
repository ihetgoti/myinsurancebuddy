# MarketCall Offer Management - Complete Guide

## 🎯 Your Use Case

You will get offers from MarketCall for:
- **Auto Insurance**
- **Health Insurance**
- **Home Insurance**

Each offer includes:
- 📞 **Phone Number** - For pay-per-call tracking
- 📝 **Form Link** - For lead generation redirect

## ✨ How The System Works

### Automatic Matching

When you add an offer in the admin panel, the system **automatically**:

1. ✅ Shows the offer on **STATE pages** (e.g., `/car-insurance/california`)
2. ✅ Shows the offer on all **CITY pages** within that state (e.g., `/car-insurance/california/los-angeles`)
3. ✅ Matches by **insurance type** (auto, health, home)
4. ✅ Injects into **templates** automatically
5. ✅ Populates **popups** automatically
6. ✅ Uses **priority** when multiple offers match

You **don't need** to manually configure each page or popup!

---

## 🚀 Quick Setup (Step-by-Step)

### Step 1: Run Database Migration

First, update your database to support form redirect URLs:

```bash
cd packages/db
npx prisma migrate dev --name add_form_redirect_url
npx prisma generate
```

### Step 2: Add Your First Offer

1. Go to Admin Panel: **`/admin/dashboard/call-offers`**

2. Click **"+ Add Offer"**

3. Fill in the form:

   **Basic Info:**
   - **Name**: `Auto Insurance - California` (for your reference)
   - **Campaign ID**: `330575` (from MarketCall dashboard)

   **Phone Tracking:**
   - **Phone Mask**: `1-855-205-2412` (your MarketCall phone number)
   - **Sub ID**: `ca-auto` (optional tracking reference)

   **Form Redirect (NEW!):**
   - **Form Redirect URL**: `https://example.marketcall.com/form/12345`
     (Your MarketCall form link)

   **Targeting:**
   - **Insurance Type**: Select "Auto Insurance"
   - **States**: Click on California, Texas, Florida, etc.
   - **Priority**: Set to `10` (higher = shows first)

   **Notes:**
   - Add internal notes like "Q1 2026 campaign"

4. Click **"Save"**

### Step 3: Repeat for Other Insurance Types

Create separate offers:
- ✅ Auto Insurance + your states
- ✅ Health Insurance + your states
- ✅ Home Insurance + your states

---

## 📋 Example Configuration

### Example 1: Auto Insurance - California Only

```
Name: Auto Insurance - California
Campaign ID: 330575
Phone: 1-855-205-2412
Form URL: https://marketcall.com/form/auto-ca
Insurance Type: Auto Insurance
States: CA
Priority: 10
```

**Result:** Shows on:
- `/car-insurance/california`
- `/car-insurance/california/los-angeles`
- `/car-insurance/california/san-francisco`
- All other CA cities

### Example 2: Health Insurance - Multi-State

```
Name: Health Insurance - Western States
Campaign ID: 330576
Phone: 1-855-205-2413
Form URL: https://marketcall.com/form/health-west
Insurance Type: Health Insurance
States: CA, NV, AZ, OR, WA
Priority: 10
```

**Result:** Shows on all health insurance pages in 5 states!

### Example 3: Home Insurance - Nationwide

```
Name: Home Insurance - All States
Campaign ID: 330577
Phone: 1-855-205-2414
Form URL: https://marketcall.com/form/home-all
Insurance Type: Home Insurance
States: (leave empty for ALL states)
Priority: 5
```

**Result:** Shows on ALL home insurance pages across the country

---

## 🎯 How Offers Appear on Pages

### Automatic Phone Display

The `MarketCallCTA` component automatically:
1. Fetches the matching offer based on page's insurance type + state
2. Displays the phone number
3. Displays the form button (if form URL is set)
4. Tracks clicks via MarketCall

**Example on California Auto Insurance Page:**
```
┌─────────────────────────────────────────┐
│  📞 Get Your Free Quote                 │
│  Speak with a Licensed Agent            │
│  ┌───────────────────────────────────┐  │
│  │ 📞 1-855-205-2412                 │  │ ← Automatic!
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ 📄 Complete Online Form →         │  │ ← Automatic!
│  └───────────────────────────────────┘  │
│  ✓ 100% Free  ✓ 2-Min  ✓ No Obligation │
└─────────────────────────────────────────┘
```

### Automatic Popup Integration

Popups can also use MarketCall offers automatically!

**How to set up:**
1. Go to `/admin/dashboard/popups`
2. Create a new popup
3. Select phone number display
4. Target by insurance type + states
5. The system automatically uses your MarketCall offer!

---

## 🔧 Advanced Features

### Priority System

When multiple offers match the same page:
- Higher priority wins
- Example: Priority 10 beats Priority 5

**Use Case:**
- Priority 10: Special high-paying campaigns
- Priority 5: General fallback campaigns

### State Targeting

**Empty States = All States**
- Leave states empty to show nationwide
- Or select specific states for targeted campaigns

**City Pages Inherit State Offers**
- California offer → Shows on all CA cities
- No need to configure cities separately!

### Insurance Type Targeting

**Empty Insurance Type = All Types**
- Leave empty to show on all insurance pages
- Or select specific type for targeted campaigns

---

## 📊 Tracking & Analytics

### Automatic Event Tracking

The system automatically tracks:

**Phone Clicks:**
```javascript
event: 'phone_click'
phone_number: '1-855-205-2412'
campaign_id: '330575'
insurance_type_id: 'auto'
state_id: 'CA'
```

**Form Clicks:**
```javascript
event: 'form_redirect_click'
form_url: 'https://marketcall.com/form/12345'
campaign_id: '330575'
insurance_type_id: 'auto'
state_id: 'CA'
```

All events push to:
- Google Analytics (if configured)
- Google Tag Manager Data Layer
- MarketCall tracking system

### View in MarketCall Dashboard

1. Go to your MarketCall dashboard
2. Use Campaign ID to filter
3. See calls and form submissions
4. Track revenue per campaign

---

## 💰 Revenue Tracking

### Phone Calls
- MarketCall pays per qualified call
- Typical: $5-$50 per call
- Check your MarketCall dashboard for rates

### Form Leads
- MarketCall pays per submitted form
- Typical: $2-$20 per lead
- Check your MarketCall dashboard for rates

### Calculate ROI

**Example:**
- 1,000 visitors/day to CA auto insurance pages
- 0.5% click phone = 5 calls/day
- $15 per call = $75/day
- **$2,250/month** from one state!

Multiply by all states and insurance types! 🚀

---

## 🔍 Testing Your Setup

### Step 1: Check Admin Panel

1. Go to `/admin/dashboard/call-offers`
2. Verify your offers are **Active** (green badge)
3. Check insurance types and states are correct

### Step 2: Test on a Page

1. Visit a matching page (e.g., `/car-insurance/california`)
2. Scroll down to find the MarketCall CTA component
3. You should see:
   - Your phone number
   - Your form button (if configured)
4. In **development mode**, you'll see debug info at the bottom

### Step 3: Test Phone Tracking

1. Click the phone number
2. Check your browser console (F12)
3. Look for `phone_click` event in dataLayer
4. Verify it appears in MarketCall dashboard

### Step 4: Test Form Redirect

1. Click "Complete Online Form" button
2. Should redirect to your MarketCall form
3. Check browser console for `form_redirect_click` event
4. Verify it appears in MarketCall dashboard

---

## 🎨 Customization Options

### Display Variants

The MarketCallCTA component supports 3 modes:

```tsx
<MarketCallCTA
  insuranceTypeId={insuranceType.id}
  stateId={state.id}
  variant="both"  // Options: 'phone', 'form', 'both'
/>
```

**Variants:**
- `phone` - Only show phone number
- `form` - Only show form button
- `both` - Show both (default)

### Manual Override

If you want to override for a specific page:

```tsx
<MarketCallCTA
  insuranceTypeId={insuranceType.id}
  stateId={state.id}
  phoneNumber="1-800-CUSTOM"  // Override phone
/>
```

---

## 🛠️ Troubleshooting

### Offer Not Showing on Page

**Check:**
1. ✅ Offer is **Active** in admin panel
2. ✅ Insurance type matches page
3. ✅ State is in selected states (or states is empty)
4. ✅ Database migration was run
5. ✅ Prisma client was regenerated

**Solution:**
```bash
cd packages/db
npx prisma generate
```

### Wrong Offer Showing

**Check:**
1. Priority settings (higher wins)
2. Multiple offers might match
3. Check targeting settings

**Solution:**
- Increase priority of preferred offer
- Make targeting more specific

### Phone Number Not Updating

**Check:**
1. Cache might be stale
2. Phone mask format in admin

**Solution:**
- Hard refresh page (Cmd+Shift+R)
- Clear browser cache
- Check admin panel for correct phone format

### Form Link Not Working

**Check:**
1. Form Redirect URL is complete (https://)
2. URL is correct in admin panel
3. MarketCall form is active

**Solution:**
- Test the URL directly in browser
- Check MarketCall dashboard
- Verify URL format

---

## 📱 Mobile Optimization

The MarketCallCTA component is fully responsive:
- ✅ Click-to-call on mobile (auto-detects)
- ✅ Touch-friendly buttons
- ✅ Optimized layout for small screens

---

## 🎯 Best Practices

### ✅ DO:

1. **Create separate offers per insurance type**
   - Better tracking
   - Better optimization
   - Clearer revenue attribution

2. **Use descriptive names**
   - "Auto - CA - Q1 2026"
   - Easier to manage

3. **Set priorities strategically**
   - High-value campaigns: Priority 10
   - Standard campaigns: Priority 5
   - Fallback: Priority 1

4. **Test before going live**
   - Click phone numbers
   - Test form redirects
   - Verify tracking

5. **Monitor MarketCall dashboard**
   - Check conversion rates
   - Optimize based on performance

### ❌ DON'T:

1. **Don't use the same campaign ID for everything**
   - Makes tracking impossible
   - Can't optimize per insurance type

2. **Don't forget to set priorities**
   - Default (0) might not show first
   - Could miss conversions

3. **Don't leave forms misconfigured**
   - Test URLs before saving
   - Broken links = lost revenue

4. **Don't forget to run migrations**
   - New features require database updates
   - Always run migrations after pulling changes

---

## 📞 Support

### Admin Panel
- **Manage Offers**: `/admin/dashboard/call-offers`
- **View Leads**: `/admin/dashboard/leads`
- **Analytics**: `/admin/dashboard/settings/analytics`

### Documentation
- This guide: `MARKETCALL_SETUP_GUIDE.md`
- Lead generation guide: `LEAD_GENERATION_SETUP_GUIDE.md`

### External Resources
- MarketCall Dashboard: https://www.marketcall.com/login
- MarketCall Support: support@marketcall.com

---

## 🚀 Quick Reference

### Adding a New Offer

1. **Go to** `/admin/dashboard/call-offers`
2. **Click** "+ Add Offer"
3. **Fill in:**
   - Name (internal reference)
   - Campaign ID (from MarketCall)
   - Phone number
   - Form URL (optional)
   - Insurance type
   - States
   - Priority
4. **Save**

### Where Offers Appear

- ✅ State pages (e.g., `/car-insurance/california`)
- ✅ City pages (e.g., `/car-insurance/california/los-angeles`)
- ✅ All matching pages automatically
- ✅ Popups (when configured)

### Tracking Events

- `phone_click` - Phone number clicked
- `form_redirect_click` - Form button clicked
- Available in Google Analytics + MarketCall

---

**You're all set! 🎉**

Your MarketCall offers will now automatically appear on the right pages based on insurance type and geography. No manual configuration needed per page!

For questions, check the admin panel or MarketCall dashboard.
