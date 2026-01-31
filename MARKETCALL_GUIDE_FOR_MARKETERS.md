# Marketcall Integration Guide for Performance Marketers

## What is Marketcall?

**Marketcall** is a pay-per-call network. They give you:
- **Phone numbers** - Unique tracking numbers for each state/niche
- **Form URLs** - Landing pages where users fill out forms
- **Money** - You get paid when someone calls or fills a form

## How It Works (Simple Version)

```
1. Marketcall gives you phone numbers for each state
   Example: California = (555) 123-4567, Texas = (555) 987-6543

2. Your website shows the RIGHT number based on location
   User in California → Sees California number
   User in Texas → Sees Texas number

3. When user calls → Marketcall tracks it → You get paid
```

## Setting Up (Step-by-Step)

### Step 1: Get Your Marketcall API Key

1. Login to your Marketcall account
2. Go to **Profile** or **API** section
3. Copy your **API Key** (long string of letters/numbers)
4. Save it somewhere safe

### Step 2: Sync Your Data

1. Go to your Admin Panel → **Marketing → Marketcall Sync**
2. Paste your API Key
3. Click **"Sync Now"**
4. Wait 1-2 minutes

**What happens during sync:**
- ✅ We fetch all your phone numbers from Marketcall
- ✅ We fetch all your offers (niches + states)
- ✅ We match them to your website
- ✅ Phone numbers now show automatically on pages

### Step 3: Verify It's Working

1. Visit a state page on your website
   Example: `yoursite.com/car-insurance/california`

2. You should see:
   - A phone number specific to California
   - Or a fallback number if no California number exists

3. Click to call (or write down the number)

## How Phone Numbers Show on Your Website

### Example: Car Insurance in California

**What user sees:**
```
┌─────────────────────────────────────┐
│  Get Car Insurance in California    │
│                                     │
│  📞 Call Now: (555) 123-4567        │
│                                     │
│  [Get Free Quote]                   │
└─────────────────────────────────────┘
```

**Behind the scenes:**
1. User visits `/car-insurance/california`
2. System checks: "Do I have a Car Insurance offer for California?"
3. YES → Shows California phone number
4. NO → Shows fallback/default number

### Matching Logic

The system tries to match in this order:

1. **Exact Match** (BEST)
   - Insurance Type: Car Insurance
   - State: California
   - Result: Shows California phone number

2. **Insurance Match Only**
   - Insurance Type: Car Insurance
   - State: Any (or not specified)
   - Result: Shows general Car Insurance number

3. **Fallback** (LAST RESORT)
   - Any active offer
   - Result: Shows whatever number is available

## Managing Offers

### View All Offers

Go to: **Admin → Marketing → Call Offers**

You'll see a table with:
- Offer name
- Phone number
- States it works in
- Status (Active/Inactive)

### Understanding the Columns

| Column | What It Means |
|--------|---------------|
| **Status** | Is this offer active? (Green = Yes) |
| **Offer Name** | Description like "Car Insurance - CA, TX" |
| **Phone Number** | The tracking number from Marketcall |
| **States** | Which states this offer works in |
| **Price** | Display price (if you set one) |

### Adding Display Prices (Optional)

Display prices like "Starting from $59" increase form fills.

**To add:**
1. Go to **Marketing → Pricing Manager**
2. Click on an offer
3. Set:
   - Display Price: $59
   - Regular Price: $150 (for comparison)
   - Promo text: "Limited Time: Save 60%"
4. Save

**Result on website:**
```
Starting from $59/month
~~$150~~ Save $91
```

## Understanding Marketcall Offers vs. Your Website

### Marketcall Side

In Marketcall, you have:
- **Offers** - Car Insurance, Home Insurance, etc.
- **Regions** - California, Texas, Florida, etc.
- **Programs** - Your active campaigns
- **Phone Numbers** - Assigned to programs

### Your Website Side

On your website, you have:
- **Pages** - Car Insurance California, Home Insurance Texas, etc.
- **Call Offers** - Copied from Marketcall during sync
- **States** - Linked to offers

### The Connection

```
Marketcall Offer          Your Website
─────────────────         ────────────
Car Insurance      →      Car Insurance Page
  + California            + California
  = Phone: 555-1234       = Shows: 555-1234
```

## Common Questions

### Q: Why isn't my phone number showing?

**Check:**
1. Did you sync with Marketcall? (Admin → Marketcall Sync)
2. Is the offer active? (Check Call Offers page)
3. Does the offer have the right state? (Check stateIds column)
4. Is there a phone number in the offer? (Check phoneNumber field)

### Q: Can I have different numbers for different states?

**YES!** That's the whole point.

- Set up separate offers in Marketcall for each state
- Sync them to your website
- System automatically shows the right number

### Q: What if a state doesn't have a number?

System uses **fallback logic**:
1. Try exact state match
2. Try "all states" offer
3. Use any available offer

### Q: How do I add a new state?

1. In Marketcall: Create offer for new state
2. On Website: Go to Marketcall Sync → Click Sync
3. New offer appears automatically
4. Verify on the state page

### Q: What's the difference between Phone Numbers and Forms?

| Feature | Phone Numbers | Forms |
|---------|--------------|-------|
| **User Action** | Calls number | Clicks button → fills form |
| **Tracking** | Marketcall tracks call | Marketcall tracks form fill |
| **Payment** | Pay-per-call | Pay-per-lead |
| **Setup** | Auto-synced | Add formRedirectUrl manually |

### Q: How do I track which leads came from which page?

**Automatic!** The system adds:
- `subId` - Tracks which page generated the lead
- `campaignId` - Marketcall campaign
- UTM parameters - For Google Analytics

## Troubleshooting

### Problem: Sync fails

**Check:**
- Is your API key correct?
- Does your API key have the right permissions?
- Try generating a new API key in Marketcall

### Problem: Wrong number showing

**Check:**
1. Go to Call Offers page
2. Find the offer
3. Check if `stateIds` has the right state
4. Check if `phoneNumber` is filled

### Problem: No number showing at all

**Check:**
1. Is there ANY active offer? (Call Offers page)
2. Set a fallback number in environment variables
3. Check browser console for errors

## Best Practices

### 1. Regular Syncing

**Do this weekly:**
1. Go to Marketcall Sync
2. Click Sync Now
3. Check for new offers/numbers

### 2. Set Display Prices

Increases conversion by 40-60%:
- "Starting from $59" (instead of no price)
- Show savings: "Save $91"
- Add urgency: "Limited Time"

### 3. Monitor Performance

Check these metrics:
- Calls per day (in Marketcall dashboard)
- Which states perform best
- Which insurance types convert

### 4. State-Specific Offers

If California performs well:
- Create California-specific landing page
- Set California-specific price
- Highlight California benefits

## Quick Reference

| What You Want | Where To Go | What To Do |
|--------------|-------------|------------|
| Add phone numbers | Marketcall Sync | Paste API key → Sync |
| Change prices | Pricing Manager | Edit offer → Set display price |
| View all offers | Call Offers | See table of all offers |
| Check if working | Any state page | Look for phone number |
| Fix wrong number | Call Offers | Edit offer → Change stateIds |
| Add new state | Marketcall first | Create offer → Sync |

## Need Help?

**For technical issues:** Check the browser console (F12) for errors
**For Marketcall issues:** Contact Marketcall support with your API key
**For website issues:** Check the Admin → Audit Logs

---

**Remember:** The system is designed to be automatic. Once set up, it shows the right phone number to the right user without you doing anything!
