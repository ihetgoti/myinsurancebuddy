# Google Sheets Mass Generation Guide

## Overview
This guide shows you how to use Google Sheets to mass generate page data and import it into your website.

---

## Step 1: Create Your Google Sheets Template

### Required Columns (Minimum for Import)
```
slug | title | metaTitle | metaDescription | insuranceType | state | city
```

### Recommended Columns (For Better SEO)
```
slug | title | subtitle | excerpt | metaTitle | metaDescription | metaKeywords | 
ogTitle | ogDescription | insuranceType | state | stateCode | city | 
avg_premium | min_coverage | uninsured_rate | top_insurer_1 | top_insurer_1_rate | 
intro_paragraph | faq_q1 | faq_a1 | isPublished | showAds
```

### All Available Columns (Maximum Fields)
See `PAGE_IMPORT_TEMPLATE_GOOGLE_SHEETS.csv` for complete list of 50+ fields.

---

## Step 2: Google Sheets Formula Examples

### Auto-Generate Slug
```
=IF(AND(G2<>"",F2<>""),LOWER(C2)&"/"&LOWER(SUBSTITUTE(SUBSTITUTE(F2," ","-"),",",""))&"/"&LOWER(SUBSTITUTE(SUBSTITUTE(G2," ","-"),",","")),IF(F2<>"",LOWER(C2)&"/"&LOWER(SUBSTITUTE(SUBSTITUTE(F2," ","-"),",","")),""))
```

### Auto-Generate Title
```
=PROPER(C2)&" Insurance in "&IF(G2<>"",G2&", ","")&F2&" | Compare Cheap Rates"
```

### Auto-Generate Meta Title (60 chars max)
```
=LEFT("Cheapest "&PROPER(C2)&" Insurance in "&IF(G2<>"",G2&", ","")&F2&" | Save $500+",60)
```

### Auto-Generate Meta Description (160 chars max)
```
=LEFT("Find the cheapest "&LOWER(C2)&" insurance in "&IF(G2<>"",G2&", ","")&F2&". Compare quotes from top providers. Average rates from "&J2&". Get your free quote today!",160)
```

---

## Step 3: Bulk Formulas for Data Population

### Generate State Pages (50 states)
Create a sheet with all 50 states and use formulas to populate:

| Column | Formula |
|--------|---------|
| A (state) | California |
| B (stateCode) | CA |
| C (slug) | `="car-insurance/"&LOWER(SUBSTITUTE(A2," ","-"))` |
| D (title) | `="Cheapest Car Insurance in "&A2` |
| E (metaTitle) | `="Cheapest Car Insurance in "&A2&", "&B2&" (2024) \| Save $500+"` |

### Generate City Pages (Top 100 cities per state)
Use the state data and add city column:

| Column | Formula |
|--------|---------|
| A (state) | California |
| B (stateCode) | CA |
| C (city) | Los Angeles |
| D (slug) | `="car-insurance/"&LOWER(SUBSTITUTE(A2," ","-"))&"/"&LOWER(SUBSTITUTE(C2," ","-"))` |
| E (title) | `="Cheapest Car Insurance in "&C2&", "&A2` |

---

## Step 4: AI Content Generation via Google Apps Script

### Script 1: Generate Content with OpenAI
```javascript
function generateAIContent() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const apiKey = "your-openrouter-api-key"; // or OpenAI key
  
  for (let i = 1; i < data.length; i++) {
    const state = data[i][5]; // Column F
    const city = data[i][6];  // Column G
    const niche = data[i][4]; // Column E
    
    const prompt = `Write an introduction for cheapest ${niche} in ${city}, ${state}. 
    Focus on affordability and savings. Keep under 200 words.`;
    
    const content = callAIAPI(prompt, apiKey);
    sheet.getRange(i + 1, 20).setValue(content); // Column T for intro
  }
}

function callAIAPI(prompt, apiKey) {
  const response = UrlFetchApp.fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://myinsurancebuddies.com'
    },
    payload: JSON.stringify({
      model: 'deepseek/deepseek-r1:free',
      messages: [{role: 'user', content: prompt}]
    })
  });
  
  const json = JSON.parse(response.getContentText());
  return json.choices[0].message.content;
}
```

### Script 2: Batch Generate FAQs
```javascript
function generateFAQs() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < Math.min(data.length, 10); i++) { // Process 10 at a time
    const state = data[i][5];
    const city = data[i][6];
    const niche = data[i][4];
    
    const prompt = `Generate 5 FAQs about ${niche} in ${city}, ${state}.
    Format: Q: [question]\nA: [answer]\n\nFocus on cost and finding cheapest rates.`;
    
    const faqs = callAIAPI(prompt, API_KEY);
    
    // Parse and set Q1, A1, Q2, A2, etc.
    const parsed = parseFAQs(faqs);
    sheet.getRange(i + 1, 25).setValue(parsed.q1); // faq_q1 column
    sheet.getRange(i + 1, 26).setValue(parsed.a1); // faq_a1 column
    // ... etc
    
    Utilities.sleep(1000); // Rate limiting
  }
}
```

---

## Step 5: Export from Google Sheets

### Option A: Direct CSV Export
1. File → Download → CSV (comma-separated values)
2. Use the file with the bulk import API

### Option B: JSON Export (via Apps Script)
```javascript
function exportToJSON() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const jsonData = [];
  for (let i = 1; i < data.length; i++) {
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    jsonData.push(row);
  }
  
  // Save to Drive or send to API
  const jsonString = JSON.stringify(jsonData, null, 2);
  DriveApp.createFile('pages_export.json', jsonString, 'application/json');
}
```

---

## Step 6: Import to Website

### API Endpoint: POST /api/pages/bulk

#### Using cURL
```bash
curl -X POST https://myinsurancebuddies.com/api/pages/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d @your_exported_data.json
```

#### Using Python
```python
import requests
import json

url = "https://myinsurancebuddies.com/api/pages/bulk"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_TOKEN"
}

# Read CSV and convert
import pandas as pd
df = pd.read_csv('google_sheets_export.csv')
data = df.to_dict('records')

payload = {
    "templateId": "car",
    "data": data
}

response = requests.post(url, headers=headers, json=payload)
print(response.json())
```

#### Using Apps Script (Direct API Call)
```javascript
function importToWebsite() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const pages = [];
  for (let i = 1; i < data.length; i++) {
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    pages.push(row);
  }
  
  const response = UrlFetchApp.fetch('https://myinsurancebuddies.com/api/pages/bulk', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_TOKEN'
    },
    payload: JSON.stringify({
      templateId: 'car',
      data: pages
    })
  });
  
  Logger.log(response.getContentText());
}
```

---

## Step 7: Advanced - Dynamic Content Generation

### Template Variables System
Your CSV/JSON can use variables that get replaced:

```json
{
  "title": "{{insuranceType}} Insurance in {{city}}, {{state}}",
  "avg_premium": "{{avg_premium}}",
  "content": "The average cost of {{insuranceType}} insurance in {{city}} is {{avg_premium}} per year."
}
```

### Available Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `{{insuranceType}}` | Insurance type name | Car |
| `{{state}}` | Full state name | California |
| `{{stateCode}}` | State abbreviation | CA |
| `{{city}}` | City name | Los Angeles |
| `{{avg_premium}}` | Average premium | $1,847/year |
| `{{min_coverage}}` | Minimum coverage | 15/30/5 |
| `{{uninsured_rate}}` | Uninsured driver % | 15% |

---

## Sample Google Sheets Structure

### Sheet 1: States (50 rows)
| slug | title | metaTitle | metaDescription | insuranceType | state | stateCode | avg_premium | min_coverage | uninsured_rate | isPublished |
|------|-------|-----------|-----------------|---------------|-------|-----------|-------------|--------------|----------------|-------------|
| car-insurance/california | Cheapest Car Insurance in California | ... | ... | car-insurance | California | CA | $1,847/year | 15/30/5 | 15% | TRUE |
| car-insurance/texas | Cheapest Car Insurance in Texas | ... | ... | car-insurance | Texas | TX | $1,400/year | 30/60/25 | 8% | TRUE |

### Sheet 2: Cities (Top 100 per state)
| slug | title | metaTitle | state | stateCode | city | avg_premium | top_insurer | isPublished |
|------|-------|-----------|-------|-----------|------|-------------|-------------|-------------|
| car-insurance/california/los-angeles | Cheapest Car Insurance in Los Angeles... | ... | California | CA | Los Angeles | $1,923/year | State Farm | TRUE |
| car-insurance/california/san-diego | Cheapest Car Insurance in San Diego... | ... | California | CA | San Diego | $1,523/year | GEICO | TRUE |

---

## Tips for Maximum SEO Impact

### 1. Keyword Density
- Primary keyword: "cheapest {insurance} in {location}"
- Use in title, H1, first paragraph, and 2-3 times in content
- Secondary keywords: affordable, low cost, best rates, compare quotes

### 2. Local Signals
- Include city name 3-5 times per page
- Mention nearby landmarks or neighborhoods
- Use local statistics (accident rates, theft rates)

### 3. Content Length
- Minimum: 800 words
- Recommended: 1,500-2,500 words
- Use AI generation for intro, FAQs, tips sections

### 4. Rich Snippets
- Include FAQ schema (faq_q1, faq_a1 fields)
- Add HowTo schema for tips
- Use LocalBusiness schema with address

### 5. Internal Linking
Create a "related pages" field:
```
related_pages: "/car-insurance/california|California Car Insurance,/car-insurance|Compare All States"
```

---

## Validation Checklist

Before importing, verify:
- [ ] All slugs are unique
- [ ] Slug format: `{insurance-type}/{state}` or `{insurance-type}/{state}/{city}`
- [ ] Meta titles under 60 characters
- [ ] Meta descriptions under 160 characters
- [ ] No special characters in slugs (use only lowercase, hyphens)
- [ ] State names match database exactly
- [ ] isPublished is TRUE/FALSE
- [ ] All required fields have values

---

## Troubleshooting

### Issue: Slug already exists
**Solution**: Check for duplicates in your sheet or existing pages in database

### Issue: State/City not found
**Solution**: Ensure state/city names match exactly with database entries

### Issue: AI generation rate limited
**Solution**: Add `Utilities.sleep(1000)` between API calls in Apps Script

### Issue: Special characters breaking import
**Solution**: Use `encodeURIComponent()` or sanitize input before import
