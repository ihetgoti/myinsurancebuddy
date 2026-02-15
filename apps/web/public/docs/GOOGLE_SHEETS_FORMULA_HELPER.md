# Google Sheets Formula Helper - Auto Insurance Template

## ⚠️ Important: Formula Issues Fixed!

The previous template had complex formulas that caused #REF! and #ERROR! in Google Sheets. Use these **simplified formulas** instead.

---

## 📋 Simple Working Formulas

### 1. State Code (Column C)
```excel
=LOWER(SUBSTITUTE(B2," ","-"))
```
Converts "New York" → "new-york"

### 2. Slug (Column D)
```excel
="/car-insurance/"&C2&"/"&LOWER(SUBSTITUTE(A2," ","-"))
```
Result: `/car-insurance/ca/los-angeles`

### 3. Meta Title (Column E)
```excel
="Cheap Car Insurance in "&A2&", "&B2&" (2026) | Compare & Save"
```
Result: `Cheap Car Insurance in Los Angeles, California (2026) | Compare & Save`

To remove (2026):
```excel
="Cheap Car Insurance in "&A2&", "&B2&" | Compare & Save"
```

### 4. H1 Title (Column G)
```excel
="Cheap Car Insurance in "&A2
```
Result: `Cheap Car Insurance in Los Angeles`

### 5. Canonical URL (Column BF - use simple concat)
```excel
="https://myinsurancebuddies.com/car-insurance/"&C2&"/"&LOWER(SUBSTITUTE(A2," ","-"))
```

---

## 🔄 How to Use These Formulas

### Step 1: Set Up Your Sheet
1. Download `AUTO_INSURANCE_TEMPLATE_CLEAN.csv`
2. Import to Google Sheets
3. Delete the placeholder row (Row 2)

### Step 2: Add Formulas
In Row 2, enter these formulas:

| Column | Formula |
|--------|---------|
| C | `=LOWER(SUBSTITUTE(B2," ","-"))` |
| D | `="/car-insurance/"&C2&"/"&LOWER(SUBSTITUTE(A2," ","-"))` |
| E | `="Cheap Car Insurance in "&A2&", "&B2&" (2026) \| Compare & Save"` |
| G | `="Cheap Car Insurance in "&A2` |
| BF | `="https://myinsurancebuddies.com/car-insurance/"&C2&"/"&LOWER(SUBSTITUTE(A2," ","-"))` |

### Step 3: Fill Down
1. Enter your cities in Column A
2. Enter states in Column B
3. Select cells C2, D2, E2, G2, BF2
4. Drag down to fill all rows

---

## 📝 Content Strategy (No Complex Formulas)

Since Google Sheets AI may not be available, use this **manual content approach**:

### Option 1: Use ChatGPT/Claude for Content

For each city, use these prompts:

**Intro Paragraph 1:**
```
Write an 80-100 word intro paragraph for car insurance in [CITY], [STATE]. 
Start with average rates and why this city has unique insurance challenges.
```

**FAQ 1 (Cheapest Company):**
```
Write a 40-50 word answer: What is the cheapest car insurance company 
in [CITY], [STATE]? Mention 2-3 companies and average starting rates.
```

### Option 2: Use Generic Content with City Name Replacement

Use the sample Los Angeles row as a template:
1. Copy the LA row
2. Replace "Los Angeles" with your city name
3. Replace "California" with your state name
4. Adjust rates and details slightly

---

## 🎯 Bulk Generation Workflow (100+ Cities)

### Method 1: Formula + Manual Content
1. Create spreadsheet with formulas in C, D, E, G, BF
2. List 100 cities in Column A
3. List states in Column B
4. Copy-paste generic content for all rows
5. Customize 5-10 high-priority cities manually

### Method 2: Use Python Script
```python
# cities.csv contains city,state pairs
import csv

template = {
    "intro_1": "[CITY] drivers face some of the highest car insurance rates in [STATE]...",
    "faq_1_answer": "The cheapest car insurance company in [CITY] varies by driver profile..."
}

with open('cities.csv') as f:
    reader = csv.reader(f)
    for city, state in reader:
        content = template["intro_1"].replace("[CITY]", city).replace("[STATE]", state)
        # Save to output
```

### Method 3: Hire Content Writers
Provide writers with:
- Template CSV
- City list
- Rate ranges by state
- Writing guidelines

---

## 📊 JSON Column Formats (Copy-Paste Ready)

### Local Factors (Column BI)
```json
[{"factor": "Traffic Congestion", "factor_slug": "traffic", "impact": "High", "tip": "Consider usage-based insurance if you drive less than 12000 miles/year"}, {"factor": "Vehicle Theft Rates", "factor_slug": "theft", "impact": "Medium", "tip": "Install anti-theft devices for 5-15% discounts"}, {"factor": "Weather Conditions", "factor_slug": "weather", "impact": "Medium", "tip": "Comprehensive coverage protects against weather damage"}]
```

### Coverage Tips (Column BJ)
```json
["Increase liability limits above state minimum for better protection", "Add uninsured motorist coverage - protects you from drivers with no insurance", "Bundle auto with renters/homeowners for multi-policy discounts", "Review coverage annually and compare quotes"]
```

### Discounts (Column BK)
```json
[{"name": "Multi-Policy Bundle", "description": "Bundle auto + home/renters", "savings": "Up to 25%"}, {"name": "Safe Driver", "description": "No accidents in 3 years", "savings": "Up to 20%"}, {"name": "Good Student", "description": "B average or better", "savings": "Up to 15%"}, {"name": "Pay-in-Full", "description": "Pay annual premium upfront", "savings": "Up to 10%"}, {"name": "Low Mileage", "description": "Drive under 10000 miles/year", "savings": "Up to 15%"}]
```

### Top Insurers (Column BL)
```json
[{"name": "GEICO", "rating": "4.8", "bestFor": "Low Rates", "slug": "geico"}, {"name": "State Farm", "rating": "4.7", "bestFor": "Local Agents", "slug": "state-farm"}, {"name": "Progressive", "rating": "4.6", "bestFor": "Comparison Tools", "slug": "progressive"}, {"name": "Allstate", "rating": "4.5", "bestFor": "Coverage Options", "slug": "allstate"}, {"name": "Farmers", "rating": "4.4", "bestFor": "Claims Service", "slug": "farmers"}]
```

---

## ✅ Recommended Approach for 30K Pages

### Phase 1: Template Cities (First 100)
1. Manually write content for 50-100 major cities
2. Use ChatGPT to generate unique content per city
3. Full quality control

### Phase 2: Bulk Cities (Remaining 29,900)
1. Create generic template content
2. Use find-replace to insert city names
3. Adjust rates by state/region
4. Spot-check 5% of pages

### Phase 3: State Pages (Manual)
As you mentioned - create state-level pages manually with human-written content

---

## 🚀 Quick Start (No Formula Errors)

1. Download: `AUTO_INSURANCE_TEMPLATE_CLEAN.csv`
2. Import to Google Sheets
3. Add simple formulas (C, D, E, G, BF columns only)
4. Enter city names in A, states in B
5. Copy content from sample row and customize
6. Export and upload

---

## 📞 Troubleshooting

### #REF! Error
- Check if referenced cell exists
- Ensure no circular references

### #ERROR! in JSON columns
- Use straight quotes (") not curly quotes
- Ensure no line breaks in cells
- Validate JSON at jsonlint.com

### Formula not calculating
- Check cell format is "Automatic" not "Plain text"
- Try re-entering the formula
- Use `Ctrl+Shift+Enter` for array formulas

---

**Use the CLEAN template - it has no complex formulas, just copy-paste ready content!**
