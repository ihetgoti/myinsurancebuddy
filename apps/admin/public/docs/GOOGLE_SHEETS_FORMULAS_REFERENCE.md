# Google Sheets Formulas Reference - Complete Template

This document contains all formulas you need to auto-generate content in Google Sheets.

---

## 📋 Column Structure (195+ Fields)

### Columns A-G: Basic Identity & URL
| Column | Field | Example Formula |
|--------|-------|-----------------|
| A | slug | `="car-insurance/"&LOWER(SUBSTITUTE(B2," ","-"))&"/"&LOWER(SUBSTITUTE(D2," ","-"))` |
| B | url_path | `="https://myinsurancebuddies.com/"&A2` |
| C | title | `="Cheapest "&PROPER($K2)&" Insurance in "&D2&", "&B2&" | Compare & Save $500+"` |
| D | subtitle | `="Compare affordable "&LOWER($K2)&" insurance rates in "&LEFT(D2,3)&" from 50+ top providers. Average savings of $487/year."` |
| E | excerpt | `="Find the best "&LOWER($K2)&" insurance rates in "&D2&". Compare quotes from top providers. Average savings $487/year. Free comparison tool."` |
| F | hero_title | `="Cheapest "&PROPER($K2)&" Insurance in "&D2` |
| G | hero_subtitle | `="Compare rates from 50+ insurance providers and save up to $500/year on your "&LOWER($K2)&" insurance"` |

### Columns H-N: Hero Configuration
| Column | Field | Example Value |
|--------|-------|---------------|
| H | hero_cta_text | `Get Free Quotes` |
| I | hero_cta_url | `/get-quote` |
| J | hero_background_image | `https://cdn.../hero-[city].jpg` |
| K | hero_background_type | `gradient` |
| L | hero_gradient_from | `#0f172a` |
| M | hero_gradient_to | `#1e3a5f` |
| N | hero_overlay_opacity | `50` |

### Columns O-R: Hero Rating
| Column | Field | Example Formula |
|--------|-------|-----------------|
| O | hero_show_rating | `true` |
| P | hero_rating_value | `4.8` |
| Q | hero_rating_count | `12500` |

### Columns S-AF: SEO Meta Tags
| Column | Field | Formula (Auto-Generated) |
|--------|-------|--------------------------|
| R | meta_title | `=LEFT("Cheapest "&PROPER($K2)&" Insurance in "&D2&", "&$C2&" (2024) | Save $500+",60)` |
| S | meta_description | `=LEFT("Find the cheapest "&LOWER($K2)&" insurance in "&D2&", "&$C2&". Compare quotes from top providers. Average rates from "&$AV2&". Get your free quote today!",160)` |
| T | meta_keywords | `="cheap "&LOWER($K2)&" insurance "&LOWER(D2)&", affordable "&LOWER($K2)&" insurance "&LOWER($C2)&", lowest "&LOWER($K2)&" rates "&LEFT(D2,2)` |
| U | meta_robots | `index,follow` |
| V | canonical_url | `="https://myinsurancebuddies.com/"&A2` |
| W | og_title | `="Cheapest "&PROPER($K2)&" Insurance in "&D2&" | Save Up to $500/Year"` |
| X | og_description | `="Compare affordable "&LOWER($K2)&" insurance rates in "&D2&" from 50+ top providers. Average savings of $487/year."` |
| Y | og_image | `="https://cdn.myinsurancebuddies.com/images/og-"&LOWER($K2)&"-"&LOWER(D2)&".jpg"` |
| Z | og_type | `website` |
| AA | og_url | `=V2` |
| AB | twitter_card | `summary_large_image` |
| AC | twitter_title | `=LEFT(W2,70)` |
| AD | twitter_description | `=LEFT(X2,200)` |
| AE | twitter_image | `="https://cdn.myinsurancebuddies.com/images/twitter-"&LOWER($K2)&"-"&LOWER(D2)&".jpg"` |
| AF | schema_markup_json | `See Schema Formula Section Below` |

### Columns AG-AW: Location & Hierarchy
| Column | Field | Formula |
|--------|-------|---------|
| AG | insurance_type | `car-insurance` |
| AH | insurance_type_id | `uuid-car` (manual or lookup) |
| AI | geo_level | `=IF(D2<>"","CITY","STATE")` |
| AJ | country | `United States` |
| AK | country_code | `US` |
| AL | state | `California` |
| AM | state_code | `CA` |
| AN | state_slug | `=LOWER(SUBSTITUTE(AL2," ","-"))` |
| AO | city | `Los Angeles` |
| AP | city_slug | `=LOWER(SUBSTITUTE(AO2," ","-"))` |
| AQ | city_population | `3898747` |
| AR | city_median_income | `65290` |
| AS | city_median_age | `35.8` |
| AT | zip_codes | `90001,90002,90003...` |

### Columns AX-BM: Pricing & Statistics
| Column | Field | Example | Formula |
|--------|-------|---------|---------|
| AU | avg_premium | `$1847/year` | Manual or API lookup |
| AV | avg_premium_national | `$1565/year` | Reference value |
| AW | premium_vs_national | `18% above` | `=ROUND((VALUE(SUBSTITUTE(AU2,"/year",""))-VALUE(SUBSTITUTE(AV2,"/year","")))/VALUE(SUBSTITUTE(AV2,"/year",""))*100,0)&"% above"` |
| AX | min_premium | `$892/year` | Manual or calculated |
| AY | max_premium | `$3200/year` | Manual or calculated |
| AZ | min_coverage | `15/30/5` | State-specific |
| BA | min_coverage_explained | `$15,000/$30,000/$5,000` | Explanation |
| BB | full_coverage_avg | `$2400/year` | Manual or API |
| BC | liability_only_avg | `$892/year` | Manual or API |
| BD | uninsured_rate | `15%` | State statistic |
| BE | uninsured_rate_national | `12.6%` | Reference |
| BF | accident_rate | `12.3 per 100k` | City/State stat |
| BG | theft_rate_per_100k | `425` | City statistic |
| BH | traffic_congestion_rank | `#1 Worst in US` | City ranking |
| BI | avg_commute_time | `31 minutes` | City data |
| BJ | weather_risk_factors | `Earthquakes, wildfires` | Climate factors |
| BK | population_density | `8484 per sq mi` | Geographic data |
| BL | vehicle_count | `2.1 million` | DMV statistics |

### Columns BN-CF: Top 5 Insurance Providers
| Column | Field | Example |
|--------|-------|---------|
| BM | top_insurer_1_name | `State Farm` |
| BN | top_insurer_1_avg_rate | `$1650/year` |
| BO | top_insurer_1_strengths | `Local agents, Strong rating` |
| BP | top_insurer_1_best_for | `Drivers wanting personal service` |
| BQ | top_insurer_2_name | `GEICO` |
| BR | top_insurer_2_avg_rate | `$1520/year` |
| BS | top_insurer_2_strengths | `Low rates, Great app` |
| BT | top_insurer_2_best_for | `Tech-savvy drivers` |
| BU | top_insurer_3_name | `Progressive` |
| BV | top_insurer_3_avg_rate | `$1780/year` |
| BW | top_insurer_3_strengths | `Name Your Price tool` |
| BX | top_insurer_3_best_for | `High-risk drivers` |
| BY | top_insurer_4_name | `Allstate` |
| BZ | top_insurer_4_avg_rate | `$1920/year` |
| CA | top_insurer_4_strengths | `Extensive agent network` |
| CB | top_insurer_5_name | `Farmers` |
| CC | top_insurer_5_avg_rate | `$1850/year` |
| CD | top_insurer_5_strengths | `Strong local presence` |

### Columns CG-CT: Content Paragraphs
| Column | Field | AI Generation Formula Hint |
|--------|-------|---------------------------|
| CE | intro_paragraph | Generate via API: "Write intro targeting 'cheapest [type] in [city]'" |
| CF | requirements_paragraph | Generate via API: "List requirements for [type] in [state]" |
| CG | req_min_liability | `15/30/5` |
| CH | req_bodily_injury_per_person | `$15,000` |
| CI | req_bodily_injury_per_accident | `$30,000` |
| CJ | req_property_damage | `$5,000` |
| CK | req_fault_system | `Fault State` |
| CL | req_uninsured_motorist | `Required at 15/30/5` |

### Columns CU-DH: 8 FAQs
| Column | Field | AI Generation Prompt |
|--------|-------|---------------------|
| CM | faq_q1 | "How do I find cheapest [type] in [city]?" |
| CN | faq_a1 | Generate 100-word answer |
| CO | faq_q2 | "What is average cost in [city]?" |
| CP | faq_a2 | Generate with $ amounts |
| CQ | faq_q3 | "Is minimum coverage enough?" |
| CR | faq_a3 | Generate legal + practical answer |
| CS | faq_q4 | "How can I lower premiums?" |
| CT | faq_a4 | Generate 10 tips summary |
| CU | faq_q5 | "What discounts are available?" |
| CV | faq_a5 | List local + national discounts |
| CW | faq_q6 | "Which companies are cheapest?" |
| CX | faq_a6 | Generate provider comparison |
| CY | faq_q7 | "How does ZIP affect rates?" |
| CZ | faq_a7 | Explain location factors |
| DA | faq_q8 | "Do I need full coverage?" |
| DB | faq_a8 | Generate coverage guidance |

### Columns DI-DY: 10 Tips
| Column | Field | Example Content |
|--------|-------|-----------------|
| DC | tip_1_title | `Compare Quotes from Multiple Companies` |
| DD | tip_1_desc | `Get quotes from 5-7 different companies...` |
| DE | tip_2_title | `Ask About All Available Discounts` |
| DF | tip_2_desc | `Insurance companies offer dozens...` |
| DG | tip_3_title | `Raise Your Deductible to $1,000` |
| DH | tip_3_desc | `Increasing deductible lowers premiums...` |
| ... | ... | Continue through tip_10 |

### Columns DZ-EN: 5 Cost Factors
| Column | Field | Example |
|--------|-------|---------|
| DZ | cost_factor_1_name | `Minimum Coverage (Liability Only)` |
| EA | cost_factor_1_impact | `$892/year` |
| EB | cost_factor_1_desc | `Meets legal requirements...` |
| EC | cost_factor_2_name | `Full Coverage with $500 Deductible` |
| ED | cost_factor_2_impact | `$2400/year` |
| EE | cost_factor_2_desc | `Includes collision/comprehensive...` |
| ... | ... | Continue through factor 5 |

### Columns EO-FJ: 10 Discounts
| Column | Field | Example |
|--------|-------|---------|
| EF | discount_1_name | `Multi-Policy Bundle` |
| EG | discount_1_savings | `10-25%` |
| EH | discount_1_qualification | `Combine auto with home/renters` |
| EI | discount_1_is_local | `false` |
| EJ | discount_2_name | `California Good Driver` |
| EK | discount_2_savings | `20%` |
| EL | discount_2_qualification | `Prop 103 - clean record 3+ years` |
| EM | discount_2_is_local | `true` |
| ... | ... | Continue through discount 10 |

### Columns FK-FQ: 6 Local Statistics
| Column | Field | Example |
|--------|-------|---------|
| FN | local_stat_1_label | `Average Annual Premium` |
| FO | local_stat_1_value | `$1847/year` |
| FP | local_stat_1_comparison | `18% above national avg` |
| FQ | local_stat_1_impact | `Higher due to traffic/density` |
| ... | ... | Continue through stat 6 |

### Columns FR-GG: 5 Coverage Types
| Column | Field | Description |
|--------|-------|-------------|
| FR | coverage_liability_name | `Liability Coverage (15/30/5)` |
| FS | coverage_liability_desc | `Covers damage you cause...` |
| FT | coverage_liability_recommended | `15/30/5 minimum` |
| FU | coverage_liability_when_needed | `Budget drivers with old cars` |
| FV | coverage_collision_name | `Collision Coverage` |
| FW | coverage_collision_desc | `Pays for YOUR vehicle damage...` |
| FX | coverage_collision_recommended | `Up to vehicle value` |
| FY | coverage_collision_when_needed | `Required if financed` |
| ... | ... | Comprehensive, Uninsured, PIP |

### Columns GH-GP: Claims Process
| Column | Field | Example |
|--------|-------|---------|
| GZ | claims_step_1 | `Report accident to police` |
| HA | claims_step_2 | `Document scene with photos` |
| HB | claims_step_3 | `Contact insurance within 24hrs` |
| HC | claims_step_4 | `Get repair estimates` |
| HD | claims_step_5 | `Review settlement offer` |
| HE | claims_step_6 | `Complete paperwork` |
| HF | claims_documents_needed | `Police report, photos, medical...` |
| HG | claims_timeline | `30-45 days average` |
| HH | claims_phone_number | `1-800-XXX-XXXX` |

### Columns HQ-IF: Buyers Guide
| Column | Field | Example |
|--------|-------|---------|
| HI | buyers_guide_step_1 | `Assess coverage needs` |
| HJ | buyers_guide_step_2 | `Gather driving history` |
| HK | buyers_guide_step_3 | `Get 5+ quotes` |
| HL | buyers_guide_step_4 | `Compare coverage limits` |
| HM | buyers_guide_step_5 | `Ask about discounts` |
| HN | buyers_guide_step_6 | `Check financial ratings` |
| HO | buyers_guide_step_7 | `Review policy before signing` |
| HP | buyers_guide_red_flag_1 | `Unusually low quotes` |
| HQ | buyers_guide_red_flag_2 | `High complaint ratios` |
| HR | buyers_guide_red_flag_3 | `Pressure to buy immediately` |
| HS | buyers_guide_red_flag_4 | `Unclear coverage terms` |
| HT | buyers_guide_question_1 | `What discounts do I qualify for?` |
| HU | buyers_guide_question_2 | `How does deductible affect premium?` |
| HV | buyers_guide_question_3 | `What is claims process?` |

### Columns IG-JA: 5 Provider Comparisons
| Column | Field | Example |
|--------|-------|---------|
| HW | comparison_provider_1_name | `State Farm` |
| HX | comparison_provider_1_rating | `A+` |
| HY | comparison_provider_1_price_range | `$1400-$2100/year` |
| HZ | comparison_provider_1_strengths | `Local agents, Strong rating...` |
| IA | comparison_provider_1_weaknesses | `Higher rates, Limited online...` |
| IB | comparison_provider_1_best_for | `Drivers wanting personal service` |
| ... | ... | Continue through provider 5 |

### Columns JB-JN: Keywords & Links
| Column | Field | Formula |
|--------|-------|---------|
| JB | primary_keyword | `="cheapest "&LOWER($K2)&" insurance "&LOWER(AO2)` |
| JC | secondary_keywords | `="affordable "&LOWER($K2)&" insurance "&LOWER(AL2)&", low cost "&LOWER($K2)&" "&LOWER(AO2)` |
| JD | lsi_keywords | `=LOWER($K2)&" rates, auto coverage, vehicle insurance, premium costs"` |
| JE | internal_link_1_url | `="/"&$K2&"/"&AN2` |
| JF | internal_link_1_anchor | `=AL2&" "&PROPER($K2)&" Insurance"` |
| JG | internal_link_2_url | `="/"&$K2` |
| JH | internal_link_2_anchor | `="Compare "&PROPER($K2)&" by State"` |
| JI | internal_link_3_url | `/blog/how-to-lower-premiums` |
| JJ | internal_link_3_anchor | `How to Lower Your Insurance` |
| JK | external_link_1_url | `https://www.dmv.ca.gov/...` |
| JL | external_link_1_anchor | `DMV Insurance Requirements` |
| JM | external_link_2_url | `https://www.insurance.ca.gov/...` |
| JN | external_link_2_anchor | `CA Dept of Insurance` |

### Columns JO-JU: Media
| Column | Field | Formula |
|--------|-------|---------|
| JO | image_1_url | `="https://cdn.myinsurancebuddies.com/images/"&LOWER(D2)&"-freeway.jpg"` |
| JP | image_1_alt | `=D2&" freeway traffic"` |
| JQ | image_2_url | `="https://cdn.myinsurancebuddies.com/images/"&LOWER(D2)&"-skyline.jpg"` |
| JR | image_2_alt | `=D2&" skyline"` |
| JS | image_3_url | `="https://cdn.myinsurancebuddies.com/images/"&LOWER($C2)&"-driving.jpg"` |
| JT | image_3_alt | `="Driving in "&$C2` |
| JU | video_url | `https://youtube.com/embed/...` |

### Columns JV-KA: Custom Code
| Column | Field | Example |
|--------|-------|---------|
| JV | video_title | `Complete Guide to Insurance` |
| JW | custom_css | `.hero{background:linear-gradient(...)}` |
| JX | custom_js | `console.log('Page loaded');` |
| JY | body_classes | `=LOWER(SUBSTITUTE("page-"&$K2&" state-"&AN2&" city-"&AP2," ","-"))` |

### Columns KB-KG: Breadcrumbs
| Column | Field | Value |
|--------|-------|-------|
| JZ | breadcrumb_1_label | `Home` |
| KA | breadcrumb_1_url | `/` |
| KB | breadcrumb_2_label | `PROPER($K2)` |
| KC | breadcrumb_2_url | `="/"&$K2` |
| KD | breadcrumb_3_label | `AL2` |
| KE | breadcrumb_3_url | `="/"&$K2&"/"&AN2` |
| KF | breadcrumb_4_label | `AO2` |

### Columns KH-KN: Performance & Publishing
| Column | Field | Value |
|--------|-------|-------|
| KG | preload_images | `image_1_url,logo_url` |
| KH | prefetch_pages | `/get-quote,/contact` |
| KI | is_published | `true` |
| KJ | status | `PUBLISHED` |
| KK | published_at | `2024-01-15T10:00:00Z` |
| KL | show_ads | `true` |
| KM | ad_positions | `header,sidebar,inline,footer` |
| KN | content_score_target | `85` |

### Columns KO-KQ: Metadata
| Column | Field | Value |
|--------|-------|-------|
| KO | version | `3` |
| KP | internal_notes | `Updated 2024 rates` |
| KQ | created_by | `admin` |
| KR | created_at | `2024-01-15T10:00:00Z` |

---

## 🔥 Essential Formulas

### 1. Auto-Generate Slug (Column A)
```excel
=IF(AO2<>"", 
   LOWER($K2)&"/"&LOWER(SUBSTITUTE(AL2," ","-"))&"/"&LOWER(SUBSTITUTE(AO2," ","-")),
   LOWER($K2)&"/"&LOWER(SUBSTITUTE(AL2," ","-")))
```

### 2. Title Formula (60 char limit for meta)
```excel
=LEFT("Cheapest "&PROPER($K2)&" Insurance in "&AO2&", "&AL2&" | Save $500+",60)
```

### 3. Meta Description (160 char limit)
```excel
=LEFT("Find the cheapest "&LOWER($K2)&" insurance in "&AO2&", "&AL2&". Compare quotes from top providers. Average rates from "&AU2&". Get your free quote today!",160)
```

### 4. Dynamic Image URLs
```excel
="https://cdn.myinsurancebuddies.com/images/"&LOWER($K2)&"-"&LOWER(AO2)&"-hero.jpg"
```

### 5. Content Score Calculator
```excel
=IF(AND(CE2<>"",CM2<>"",DC2<>"",JB2<>""),85,70)
```

---

## 🤖 Google Apps Script for AI Generation

### Generate Intro Paragraph
```javascript
function generateIntro() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    const city = rows[i][40]; // Column AO - city
    const state = rows[i][37]; // Column AL - state
    const type = rows[i][32]; // Column AG - insurance_type
    
    const prompt = `Write an SEO-optimized introduction paragraph (150-200 words) for "cheapest ${type} insurance in ${city}, ${state}". Focus on affordability and local factors.`;
    
    // Call your AI API here
    const content = callAIAPI(prompt);
    sheet.getRange(i + 1, 83).setValue(content); // Column CE
    
    Utilities.sleep(1000); // Rate limiting
  }
}
```

### Generate All FAQs at Once
```javascript
function generateAllFAQs() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  for (let i = 2; i <= lastRow; i++) {
    const city = sheet.getRange(i, 41).getValue();
    const state = sheet.getRange(i, 38).getValue();
    
    const prompt = `Generate 8 FAQs about car insurance in ${city}, ${state} with detailed answers. Include questions about cost, coverage, discounts, and cheapest providers.`;
    
    const faqs = callAIAPI(prompt);
    const parsed = parseFAQs(faqs);
    
    // Set Q1-A1 through Q8-A8
    sheet.getRange(i, 81).setValue(parsed.q1);
    sheet.getRange(i, 82).setValue(parsed.a1);
    // ... continue for all 8
    
    Utilities.sleep(1500);
  }
}
```

---

## 📤 Export Formulas

### Export to JSON
```javascript
function exportToJSON() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const jsonData = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  
  const jsonString = JSON.stringify(jsonData, null, 2);
  DriveApp.createFile('pages_export.json', jsonString, 'application/json');
}
```

### Export to API
```javascript
function importToWebsite() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = getSheetDataAsJSON();
  
  const response = UrlFetchApp.fetch('https://myinsurancebuddies.com/api/pages/bulk', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_TOKEN'
    },
    payload: JSON.stringify({
      templateId: 'car',
      data: data
    })
  });
  
  Logger.log(response.getContentText());
}
```

---

## 💡 Pro Tips

1. **Use ARRAYFORMULA** for applying formulas to entire columns:
   ```excel
   =ARRAYFORMULA(IF(ROW(A2:A)>1, "car-insurance/"&LOWER(B2:B), "slug"))
   ```

2. **Data Validation** for dropdowns:
   - Select column → Data → Data Validation
   - Criteria: List of items
   - Items: `car-insurance, home-insurance, life-insurance`

3. **Conditional Formatting** for quality checks:
   - Select meta_title column
   - Format → Conditional Formatting
   - Rule: Text length > 60 → Red background

4. **VLOOKUP** for state data:
   ```excel
   =VLOOKUP(AL2, States!A:F, 3, false)
   ```

5. **IMPORTRANGE** for external data:
   ```excel
   =IMPORTRANGE("spreadsheet_url", "Sheet1!A:Z")
   ```
