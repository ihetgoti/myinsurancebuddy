# Auto Insurance City Pages - Google Sheets Template Guide

## 📋 Overview

This template generates auto insurance city pages with **10 FAQs** using Google Sheets `=AI()` function. The output matches your site's import format exactly.

---

## 🗂️ Files Included

| File | Description |
|------|-------------|
| `AUTO_INSURANCE_CITY_TEMPLATE_WITH_AI_PROMPTS.csv` | Main template with AI prompts and formulas |

---

## 📊 Column Structure

### Required Input Columns (You Fill These):

| Column | Field Name | What to Enter |
|--------|-----------|---------------|
| A | `city_name` | City name (e.g., "Los Angeles") |
| B | `state_name` | Full state name (e.g., "California") |
| C | `state_code_lower` | State code formula (auto-generates) |

### Auto-Generated Formula Columns:

| Column | Field | Formula Generates |
|--------|-------|-------------------|
| D | `slug_formula` | `/car-insurance/ca/los-angeles` |
| E | `meta_title_formula` | `Cheap Car Insurance in Los Angeles, California (2026) \| Compare & Save` |
| AZ | `canonical_url_formula` | `https://myinsurancebuddies.com/car-insurance/ca/los-angeles` |
| BA | `h1_title_formula` | `Cheap Car Insurance in Los Angeles` |

### AI Prompt Columns (Generate Content):

| Column | Field | Prompt Type |
|--------|-------|-------------|
| F | `meta_description_ai` | Meta description (155-160 chars) |
| G | `hero_tagline_ai` | Hero tagline (5-8 words) |
| H | `hero_description_ai` | Hero description (15-20 words) |
| I | `intro_paragraph_1_ai` | Intro paragraph 1 (80-100 words) |
| J | `intro_paragraph_2_ai` | Intro paragraph 2 (80-100 words) |
| K | `intro_paragraph_3_ai` | Intro paragraph 3 (80-100 words) |
| L | `state_insights_uniqueChallenge_ai` | State challenge (2-4 words) |
| M | `state_insights_savingOpportunity_ai` | Saving opportunity (2-4 words) |
| N | `state_insights_commonMistake_ai` | Common mistake (2-5 words) |
| O | `neighborhood_guide_ai` | Neighborhood rate variations (40 words) |

### JSON Array Columns (10 FAQs + Data):

| Column | Field | Content |
|--------|-------|---------|
| P | `faqs_json_10` | 10 FAQs in JSON format |
| Q | `local_factors_json` | 3 local risk factors |
| R | `coverage_tips_json` | 4 coverage tips |
| S | `discounts_list_json` | 5 discounts with savings |
| T | `top_insurers_json` | 5 top insurers |

### State Requirements Columns:

| Column | Field | How It Works |
|--------|-------|--------------|
| U | `coverage_format` | AI generates state minimum (e.g., "15/30/5") |
| V | `bodily_injury_per_person` | AI generates minimum number |
| W | `bodily_injury_per_accident` | AI generates minimum number |
| X | `property_damage` | AI generates minimum number |
| Y | `is_no_fault` | TRUE for FL, NY, MI; FALSE otherwise |
| Z | `pip_required` | TRUE for no-fault states |
| AA | `um_required` | "recommended" or "optional" |

---

## 🚀 How to Use

### Step 1: Import Template to Google Sheets

1. Download `AUTO_INSURANCE_CITY_TEMPLATE_WITH_AI_PROMPTS.csv`
2. Open Google Sheets
3. File → Import → Upload → Select CSV
4. Choose "Replace spreadsheet"
5. Select "Yes" for "Convert text to numbers/dates"

### Step 2: Enter Your Cities

In **Row 2**, enter:
- **Column A**: City name (e.g., "Miami")
- **Column B**: State name (e.g., "Florida")
- **Column C**: Will auto-fill with state code

### Step 3: Generate AI Content

Google Sheets will automatically execute AI prompts. Wait 1-2 minutes for all cells to populate.

**Note**: If `=AI()` function isn't available, use these alternatives:

#### Option A: Use ChatGPT/Claude API
Replace `=AI("prompt")` with manual content generation:
```
=CONCATENATE("Write a compelling meta description for car insurance in ",A2,", ",B2)
```
Then copy-paste generated content.

#### Option B: Use Google Sheets AI Features
Enable "Help me write" in Google Workspace or use Gemini API integration.

### Step 4: Review and Edit

1. Check AI-generated content for accuracy
2. Verify state minimum coverage limits
3. Adjust insurer names/ratings if needed
4. Ensure FAQs are city-specific

### Step 5: Export for Upload

1. File → Download → Comma Separated Values (.csv)
2. Upload to your site's import tool

---

## 📝 Sample Data Row

The template includes a sample row for **Los Angeles, California**. Use this as reference for:

- Expected content length
- JSON formatting
- Tone and style
- Data accuracy

---

## 🎯 AI Prompt Examples

### Meta Description Prompt:
```
Write a compelling meta description (155-160 characters) for car insurance 
in [City], [State]. Include: cheap rates, comparison savings (mention $500+ 
savings), free quotes. Make it click-worthy. No year mentioned.
```

### FAQ Question/Answer Format:
```
Question: What is the cheapest car insurance company in [City], [State]?
Answer: Write a 40-50 word answer. Mention that rates vary by driver profile 
but list 2-3 companies known for low rates. Include average starting rates.
```

### Intro Paragraph Structure:
```
Paragraph 1 (80-100 words): Hook with average rates vs state average. 
Explain city-specific challenges (traffic, crime, weather).

Paragraph 2 (80-100 words): Factors affecting rates - traffic patterns, 
accident hotspots, theft rates, weather risks, repair costs.

Paragraph 3 (80-100 words): Solution - comparing quotes, hidden discounts, 
average savings, urgency, free quote benefit.
```

---

## 📦 JSON Array Formats

### FAQs Format (10 Questions):
```json
[
  {
    "question": "What is the cheapest car insurance company in [City]?",
    "answer": "40-50 word answer here..."
  },
  {
    "question": "How much is car insurance per month in [City]?",
    "answer": "40-50 word answer here..."
  }
  // ... 8 more FAQs
]
```

### Local Factors Format (3 Factors):
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
    "impact": "Medium",
    "tip": "Install anti-theft devices for 5-15% discounts"
  }
  // ... 1 more factor
]
```

### Discounts Format (5 Discounts):
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
  // ... 3 more discounts
]
```

### Top Insurers Format (5 Companies):
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
  // ... 3 more insurers
]
```

---

## ⚠️ Important Notes

### State Minimum Coverage Requirements

The template uses AI to generate state minimums, but verify these common ones:

| State | Format | BI/Person | BI/Accident | Property |
|-------|--------|-----------|-------------|----------|
| CA | 15/30/5 | 15 | 30 | 5 |
| TX | 30/60/25 | 30 | 60 | 25 |
| FL | 10/20/10 | 10 | 20 | 10 |
| NY | 25/50/10 | 25 | 50 | 10 |
| IL | 25/50/20 | 25 | 50 | 20 |
| PA | 15/30/5 | 15 | 30 | 5 |
| OH | 25/50/25 | 25 | 50 | 25 |
| GA | 25/50/25 | 25 | 50 | 25 |
| NC | 30/60/25 | 30 | 60 | 25 |
| MI | 50/100/10 | 50 | 100 | 10 |

### No-Fault States (TRUE for is_no_fault):
- Florida
- New York
- Michigan
- New Jersey
- Pennsylvania
- Massachusetts
- Minnesota
- North Dakota
- Hawaii
- Kansas
- Kentucky
- Utah

---

## 🔄 Bulk Generation Workflow

### For 100 Cities at Once:

1. **Create City List**: Enter 100 cities in Column A, states in Column B
2. **Fill Down Formulas**: Drag formulas from Row 2 down to Row 101
3. **AI Generation**: Wait for all AI cells to populate (may take 10-15 minutes)
4. **Review Batch**: Check 5-10 random rows for quality
5. **Export**: Download as CSV
6. **Upload**: Import to your site

### Managing AI Rate Limits:

If Google Sheets has AI rate limits:
- Generate in batches of 25 cities at a time
- Copy-paste values after generation to freeze content
- Use alternative AI tools (ChatGPT, Claude) for manual generation

---

## 🛠️ Troubleshooting

### Issue: Formulas showing as text
**Solution**: Format columns as "Plain text" or use `=VALUE()` wrapper

### Issue: AI prompts returning errors
**Solution**: Check AI function availability. Use manual generation with ChatGPT.

### Issue: JSON arrays not formatting correctly
**Solution**: Ensure proper quote escaping. Use `"""` for quotes inside JSON.

### Issue: State codes not generating
**Solution**: Verify state names match exactly (e.g., "California" not "CA")

---

## 📞 Quick Reference

### Meta Title Format:
```
Cheap Car Insurance in [City], [State] (2026) | Compare & Save
```

### Canonical URL Format:
```
https://myinsurancebuddies.com/car-insurance/[state-code]/[city-slug]
```

### 10 FAQs Included:
1. Cheapest car insurance company
2. Monthly cost of car insurance
3. Minimum required insurance
4. How to lower rates
5. Is full coverage worth it
6. Factors affecting rates
7. Insurance with bad driving record
8. How long to get insurance
9. Cheapest cars to insure
10. Credit score impact

---

## ✅ Pre-Upload Checklist

- [ ] All 100 cities have content
- [ ] State minimum coverage verified
- [ ] No placeholder text remaining
- [ ] JSON arrays properly formatted
- [ ] Sample row deleted or marked
- [ ] CSV exported with UTF-8 encoding
- [ ] File size under upload limit

---

**Questions?** Check the sample row for reference format.
