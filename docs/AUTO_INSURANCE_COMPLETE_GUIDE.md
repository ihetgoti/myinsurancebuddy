# Auto Insurance City Pages - Complete Template Guide

## 📋 Overview

This template generates comprehensive **auto insurance city pages** with:
- **10 FAQs** (including SR-22 and teen driver questions)
- **5 Content Sections** covering SR-22, teen drivers, high-risk, minimum coverage, and full coverage
- **Google Sheets formulas** for auto-generation
- **Matches your site's import format exactly**

---

## 🗂️ Template Files

| File | Description |
|------|-------------|
| `AUTO_INSURANCE_CITY_COMPLETE_TEMPLATE.csv` | **Main template** - 10 FAQs + 5 content sections + formulas |

---

## 📊 Column Structure (27 Columns)

### Input Columns (You Fill These):

| Column | Field Name | What to Enter |
|--------|-----------|---------------|
| A | `city_name` | City name (e.g., "Houston") |
| B | `state_name` | Full state name (e.g., "Texas") |
| C | `state_code_lower` | Auto-generates: ca, tx, fl, etc. |

### Auto-Generated Columns:

| Column | Field | Formula Generates |
|--------|-------|-------------------|
| D | `slug` | `/car-insurance/tx/houston` |
| E | `meta_title` | `Cheap Car Insurance in Houston, Texas (2026) \| Compare & Save` |
| AZ | `canonical_url` | `https://myinsurancebuddies.com/car-insurance/tx/houston` |

### Content Columns:

| Column | Field | Description |
|--------|-------|-------------|
| F | `meta_description` | SEO meta description (155-160 chars) |
| G | `h1_title` | Page H1 heading |
| H | `hero_tagline` | Hero section headline |
| I | `hero_description` | Hero section subtext |
| J | `intro_paragraph_1` | Intro paragraph 1 (80-100 words) |
| K | `intro_paragraph_2` | Intro paragraph 2 (80-100 words) |
| L | `intro_paragraph_3` | Intro paragraph 3 (80-100 words) |

### 10 FAQ Columns (Question + Answer pairs):

| Column | Field | Topic |
|--------|-------|-------|
| M,N | FAQ 1 | Cheapest car insurance company |
| O,P | FAQ 2 | Monthly cost of insurance |
| Q,R | FAQ 3 | Minimum required coverage |
| S,T | FAQ 4 | How to lower rates |
| U,V | FAQ 5 | Is full coverage worth it |
| W,X | FAQ 6 | Factors affecting rates |
| Y,Z | FAQ 7 | Bad driving record options |
| AA,AB | FAQ 8 | How long to get insurance |
| AC,AD | FAQ 9 | **SR-22 insurance explained** |
| AE,AF | FAQ 10 | **Teen driver insurance costs** |

### 5 Content Sections (100-120 words each):

| Column | Field | Content |
|--------|-------|---------|
| AG | `content_section_sr22_title` | "SR-22 Insurance in [City]: What You Need to Know" |
| AH | `content_section_sr22_content` | Full SR-22 explanation |
| AI | `content_section_teen_title` | "Teen Driver Insurance in [City]: A Parent's Guide" |
| AJ | `content_section_teen_content` | Teen insurance guide |
| AK | `content_section_high_risk_title` | "High-Risk Car Insurance Options in [City]" |
| AL | `content_section_high_risk_content` | High-risk driver options |
| AM | `content_section_minimum_coverage_title` | "Understanding Minimum Coverage in [State]" |
| AN | `content_section_minimum_coverage_content` | Minimum coverage explained |
| AO | `content_section_full_coverage_title` | "Full Coverage Explained for [City] Drivers" |
| AP | `content_section_full_coverage_content` | Full coverage details |

### State Insights:

| Column | Field | Example |
|--------|-------|---------|
| AQ | `state_insights_uniqueChallenge` | "High Uninsured Driver Rate" |
| AR | `state_insights_savingOpportunity` | "Good Driver Discount" |
| AS | `state_insights_commonMistake` | "Underinsuring Liability" |
| AT | `neighborhood_guide` | 2 sentences about rate variations |

### JSON Data Arrays:

| Column | Field | Content |
|--------|-------|---------|
| AU | `local_factors_json` | 3 local risk factors with tips |
| AV | `coverage_tips_json` | 4 coverage recommendations |
| AW | `discounts_list_json` | 5 discounts with savings % |
| AX | `top_insurers_json` | 5 insurers with ratings |

### State Requirements:

| Column | Field | Example |
|--------|-------|---------|
| AY | `coverage_format` | "15/30/5" or "30/60/25" |
| AZ | `bodily_injury_per_person` | 15, 25, 30, etc. |
| BA | `bodily_injury_per_accident` | 30, 50, 60, etc. |
| BB | `property_damage` | 5, 10, 20, 25, etc. |
| BC | `is_no_fault` | TRUE/FALSE |
| BD | `pip_required` | TRUE/FALSE |
| BE | `um_required` | "recommended" or "optional" |

### CTA:

| Column | Field | Default |
|--------|-------|---------|
| BF | `cta_subtext` | "Join 10,000+ drivers already saving money" |
| BG | `cta_text` | "Get Free Quotes Now" |

---

## 🚀 How to Use

### Step 1: Import to Google Sheets

1. Download `AUTO_INSURANCE_CITY_COMPLETE_TEMPLATE.csv`
2. Open Google Sheets
3. File → Import → Upload → Select CSV
4. Choose "Replace spreadsheet"

### Step 2: Enter Your Cities

In Row 2, enter:
- **Column A**: City name (e.g., "Miami")
- **Column B**: State name (e.g., "Florida")
- **Column C**: Will auto-fill with state code

### Step 3: Fill Down Formulas

1. Select Row 2
2. Drag down to create 100 rows (or however many cities)
3. Formulas will auto-generate content

### Step 4: Customize Content (Optional)

The template includes **AI prompts** that you can:
- Use with Google Sheets AI features
- Replace with ChatGPT/Claude generated content
- Manually edit for specific cities

### Step 5: Export and Upload

1. File → Download → Comma Separated Values (.csv)
2. Upload to your site's import tool

---

## 📝 Content Sections Explained

### Section 1: SR-22 Insurance (FAQ 9 + Content Block)

**FAQ Question**: "What is SR-22 insurance and do I need it in [City]?"

**FAQ Answer**: Explains SR-22 is a certificate not insurance, who needs it (DUI, no insurance, violations), costs, duration (2-3 years), and same-day filing availability.

**Content Section (100-120 words)**: Deeper dive into SR-22 requirements in the specific city, local insurers offering SR-22, and path back to standard rates.

### Section 2: Teen Driver Insurance (FAQ 10 + Content Block)

**FAQ Question**: "How much is teen car insurance in [City]?"

**FAQ Answer**: Monthly costs for added-to-policy vs separate policy, good student discounts (25% off), driver's ed benefits (10-15% off).

**Content Section (100-120 words)**: Parent's guide including why rates are high, telematics programs (Drivewise, Snapshot), and when rates decrease (ages 19, 21, 25).

### Section 3: High-Risk Insurance (Content Block)

Title: "High-Risk Car Insurance Options in [City]"

Content covers:
- Who qualifies as high-risk
- Which companies accept high-risk drivers
- Expected rate increases (30-100%)
- SR-22 requirements
- Path back to standard rates (3 years clean driving)

### Section 4: Minimum Coverage (Content Block)

Title: "Understanding Minimum Coverage in [State]"

Content covers:
- Exact state minimum liability limits
- Why minimums may be insufficient
- Penalties for no insurance
- Recommendation for higher limits (100/300/100)
- What's NOT covered (your own vehicle damage)

### Section 5: Full Coverage (Content Block)

Title: "Full Coverage Explained for [City] Drivers"

Content covers:
- What's included (collision + comprehensive)
- When it's required (loans, leases)
- Deductible choices ($500 vs $1000)
- Gap insurance for new cars
- When to drop full coverage (car value < $3,000)

---

## 🎯 The 10 FAQs

1. **What is the cheapest car insurance company in [City], [State]?**
2. **How much is car insurance per month in [City], [State]?**
3. **What is the minimum car insurance required in [State]?**
4. **How can I lower my car insurance rates in [City]?**
5. **Is full coverage car insurance worth it in [City]?**
6. **What factors affect car insurance rates the most in [City]?**
7. **Can I get car insurance with a bad driving record in [City]?**
8. **How long does it take to get car insurance in [City]?**
9. **What is SR-22 insurance and do I need it in [City]?** ⭐ Includes content section
10. **How much is teen car insurance in [City]?** ⭐ Includes content section

---

## 📦 JSON Array Formats

### Local Factors (3 Factors):
```json
[
  {
    "factor": "Traffic Congestion",
    "factor_slug": "traffic",
    "impact": "High",
    "tip": "Consider usage-based insurance if you drive less than 12,000 miles/year"
  },
  {
    "factor": "Vehicle Theft Rates",
    "factor_slug": "theft",
    "impact": "High",
    "tip": "Install anti-theft devices for 5-15% discounts"
  },
  {
    "factor": "Weather Conditions",
    "factor_slug": "weather",
    "impact": "Medium",
    "tip": "Comprehensive coverage protects against weather damage"
  }
]
```

### Discounts (5 Discounts):
```json
[
  {
    "name": "Multi-Policy Bundle",
    "description": "Bundle auto + home/renters",
    "savings": "Up to 25%"
  },
  {
    "name": "Safe Driver",
    "description": "No accidents in 3 years",
    "savings": "Up to 20%"
  }
]
```

### Top Insurers (5 Companies):
```json
[
  {
    "name": "GEICO",
    "rating": "4.8",
    "bestFor": "Low Rates",
    "slug": "geico"
  },
  {
    "name": "State Farm",
    "rating": "4.7",
    "bestFor": "Local Agents",
    "slug": "state-farm"
  }
]
```

### Coverage Tips (4 Tips):
```json
[
  "Increase liability limits above state minimum for better protection",
  "Add uninsured motorist coverage - protects you from drivers with no insurance",
  "Bundle auto with renters/homeowners for multi-policy discounts",
  "Review coverage annually and compare quotes"
]
```

---

## ⚠️ State Minimum Coverage Reference

| State | Format | BI/Person | BI/Accident | Property |
|-------|--------|-----------|-------------|----------|
| California | 15/30/5 | 15 | 30 | 5 |
| Texas | 30/60/25 | 30 | 60 | 25 |
| Florida | 10/20/10 | 10 | 20 | 10 |
| New York | 25/50/10 | 25 | 50 | 10 |
| Illinois | 25/50/20 | 25 | 50 | 20 |
| Pennsylvania | 15/30/5 | 15 | 30 | 5 |
| Ohio | 25/50/25 | 25 | 50 | 25 |
| Georgia | 25/50/25 | 25 | 50 | 25 |
| North Carolina | 30/60/25 | 30 | 60 | 25 |
| Michigan | 50/100/10 | 50 | 100 | 10 |
| Arizona | 25/50/15 | 25 | 50 | 15 |
| Colorado | 25/50/15 | 25 | 50 | 15 |
| Washington | 25/50/10 | 25 | 50 | 10 |
| Oregon | 25/50/20 | 25 | 50 | 20 |
| Virginia | 30/60/20 | 30 | 60 | 20 |

### No-Fault States (is_no_fault = TRUE):
Florida, New York, Michigan, New Jersey, Pennsylvania, Massachusetts, Minnesota, North Dakota, Hawaii, Kansas, Kentucky, Utah

---

## 🔧 Customization Tips

### To Remove "(2026)" from Meta Title:

Edit formula in Column E:
```excel
="Cheap Car Insurance in "&A2&", "&B2&" (2026) | Compare & Save"
```

Change to:
```excel
="Cheap Car Insurance in "&A2&", "&B2&" | Compare & Save"
```

### To Change Default CTAs:

Edit the default values in columns BF and BG:
- BF (cta_subtext): Change "Join 10,000+ drivers already saving money"
- BG (cta_text): Change "Get Free Quotes Now"

### To Add More Cities:

1. Select row 2 (the sample row)
2. Copy down to row 101 (for 100 cities)
3. Replace city names in column A
4. State names in column B will auto-generate codes

---

## ✅ Pre-Upload Checklist

- [ ] All city names entered correctly
- [ ] State names match exactly (e.g., "California" not "CA")
- [ ] No placeholder text like "City Name" remaining
- [ ] State minimum coverage verified for each state
- [ ] JSON arrays properly formatted (use JSON validator)
- [ ] Sample row deleted or kept as reference
- [ ] CSV exported with UTF-8 encoding
- [ ] File size under your site's upload limit

---

## 🎓 Sample Row Reference

The template includes a complete sample for **Los Angeles, California**. Use this as your reference for:
- Expected content length
- Tone and style
- JSON formatting
- Data accuracy

---

## 💡 Content Generation Options

### Option 1: Google Sheets AI (if available)
The template includes `=AI()` prompts that work with Google Sheets AI features.

### Option 2: ChatGPT/Claude
Replace AI prompts with manually generated content:
1. Copy the prompt text from formula bar
2. Paste into ChatGPT/Claude
3. Copy generated content back

### Option 3: Manual Writing
Write custom content for each city using the prompts as guides.

### Option 4: Hybrid
Use formulas for repetitive data (slugs, titles), manual for unique content.

---

**Ready to generate your 30K city pages with comprehensive auto insurance content!** 🎉
