# AI Auto-Generated Content Sections Reference

## Available AI Content Sections

The AI auto-generation system can generate the following sections for maximum SEO coverage:

---

## 1. INTRO
**Purpose**: Hook readers and introduce the topic  
**AI Prompt Focus**: "cheapest {niche} in {location}"  
**Output**: 150-250 words  
**Best For**: Page introduction, setting context  

**Example Output**:
```
Looking for cheapest car insurance in Los Angeles? You're in the right place. 
California's unique driving conditions - from heavy traffic on the 405 to coastal 
fog in the mornings - make finding affordable coverage essential...
```

**CSV Field**: `intro` or `intro_paragraph`

---

## 2. REQUIREMENTS
**Purpose**: Explain legal requirements and minimum coverage  
**AI Prompt Focus**: State-specific requirements vs optional coverage  
**Output**: Structured content with bullet points  
**Best For**: Building trust, legal compliance info  

**Example Output**:
```
### California Minimum Requirements
California requires all drivers to carry minimum liability coverage of 15/30/5:
- $15,000 for injury/death to one person
- $30,000 for injury/death to multiple people  
- $5,000 for property damage

This is a fault state, meaning the at-fault driver's insurance pays for damages...
```

**CSV Fields**: 
- `requirements` (full content)
- `min_coverage` (shorthand: 15/30/5)
- `min_coverage_explained` (detailed)

---

## 3. FAQS (5 Questions)
**Purpose**: Target long-tail keywords via Q&A format  
**AI Prompt Focus**: Money-saving questions  
**Output**: Array of 5 question/answer objects  
**Best For**: Featured snippets, voice search, long-tail SEO  

**Example Questions Generated**:
1. "How do I find cheapest car insurance in {location}?"
2. "What is the average car insurance cost in {location}?"
3. "Is minimum coverage enough in {state}?"
4. "How can I lower my car insurance premiums?"
5. "What discounts are available for car insurance in {location}?"

**CSV Fields**:
```
faq_q1, faq_a1
faq_q2, faq_a2
faq_q3, faq_a3
faq_q4, faq_a4
faq_q5, faq_a5
```

---

## 4. TIPS (7 Money-Saving Tips)
**Purpose**: Actionable advice for saving money  
**AI Prompt Focus**: Practical, implementable strategies  
**Output**: Array of 7 tip strings  
**Best For**: User engagement, social sharing, featured snippets  

**Example Tips**:
```
1. Compare quotes from at least 5-7 different insurance companies
2. Ask about all available discounts including safe driver and good student
3. Consider raising your deductible to $1,000 to lower premiums significantly
4. Bundle your auto insurance with home or renters insurance
5. Maintain a clean driving record - accidents increase rates 30-50%
6. Take defensive driving courses to qualify for 5-15% discount
7. Install anti-theft devices to reduce comprehensive costs
```

**CSV Fields**:
```
tip_1, tip_2, tip_3, tip_4, tip_5, tip_6, tip_7
tips_section (combined as single field)
```

---

## 5. COST_BREAKDOWN
**Purpose**: Explain pricing factors with dollar amounts  
**AI Prompt Focus**: What affects rates and how much  
**Output**: Array of factors with impact and description  
**Best For**: Comparison tables, pricing transparency  

**Example Output**:
```json
[
  { "factor": "Minimum Coverage", "impact": "$892/year", "description": "State required liability only" },
  { "factor": "Full Coverage", "impact": "$2,400/year", "description": "Includes collision and comprehensive" },
  { "factor": "Good Credit", "impact": "Save 15-25%", "description": "Better credit scores get lower rates" },
  { "factor": "Clean Record", "impact": "Save 20-40%", "description": "No accidents in 3 years" },
  { "factor": "Young Driver", "impact": "+50-100%", "description": "Drivers under 25 pay more" }
]
```

**CSV Fields**:
```
cost_factor_1, cost_impact_1, cost_desc_1
cost_factor_2, cost_impact_2, cost_desc_2
avg_premium, min_premium, max_premium
```

---

## 6. COMPARISON (3-5 Providers)
**Purpose**: Compare top insurance companies  
**AI Prompt Focus**: Value and price comparison  
**Output**: Array of provider objects  
**Best For**: Decision-making, provider showcase  

**Example Output**:
```json
[
  {
    "name": "State Farm",
    "strengths": ["Local agents", "Strong financial rating", "Good customer service"],
    "weaknesses": ["Higher rates for some drivers"],
    "bestFor": "Drivers who want personal service",
    "priceRange": "$1,400-$2,100/year"
  },
  {
    "name": "GEICO", 
    "strengths": ["Low rates", "Excellent mobile app"],
    "weaknesses": ["Limited local agents"],
    "bestFor": "Tech-savvy drivers seeking lowest rates",
    "priceRange": "$1,200-$1,900/year"
  }
]
```

**CSV Fields**:
```
top_insurer_1, top_insurer_1_rate, top_insurer_1_best_for
top_insurer_2, top_insurer_2_rate, top_insurer_2_best_for
top_insurer_3, top_insurer_3_rate
```

---

## 7. DISCOUNTS (8+ Discounts)
**Purpose**: List all available discounts  
**AI Prompt Focus**: Savings opportunities  
**Output**: Array of discount objects  
**Best For**: Conversion optimization, savings emphasis  

**Example Output**:
```json
[
  { "name": "Multi-Policy Bundle", "savings": "10-25%", "qualification": "Combine auto with home", "isLocal": false },
  { "name": "Safe Driver", "savings": "10-20%", "qualification": "Clean record 3+ years", "isLocal": false },
  { "name": "California Good Driver", "savings": "20%", "qualification": "Prop 103 requirement", "isLocal": true },
  { "name": "Good Student", "savings": "8-15%", "qualification": "B average or better", "isLocal": false }
]
```

**CSV Fields**:
```
discount_1_name, discount_1_savings, discount_1_qualification
discount_2_name, discount_2_savings, discount_2_qualification
discounts_json (full array as JSON string)
```

---

## 8. LOCAL_STATS (5-6 Statistics)
**Purpose**: Location-specific data for local SEO  
**AI Prompt Focus**: Statistics relevant to saving money  
**Output**: Array of stat objects  
**Best For**: Local relevance, data-driven content  

**Example Output**:
```json
[
  { "stat": "Average Premium", "value": "$1,847/year", "impact": "Higher than national average", "comparison": "18% above $1,565 national avg" },
  { "stat": "Uninsured Drivers", "value": "15%", "impact": "Increases costs for insured", "comparison": "Higher than 12.6% national avg" },
  { "stat": "Vehicle Theft Rate", "value": "425 per 100k", "impact": "Affects comprehensive rates", "comparison": "Among highest in CA" },
  { "stat": "Traffic Congestion", "value": "#1 Worst in US", "impact": "Higher accident risk", "comparison": "119 hrs/year lost" }
]
```

**CSV Fields**:
```
uninsured_rate, uninsured_rate_national
avg_premium, avg_premium_national, premium_comparison
theft_rate, accident_rate
traffic_congestion_rank, avg_commute_time
```

---

## 9. COVERAGE_GUIDE
**Purpose**: Explain coverage types and recommendations  
**AI Prompt Focus**: Cost vs protection balance  
**Output**: Array of coverage type objects  
**Best For**: Education, upselling appropriate coverage  

**Example Output**:
```json
[
  {
    "type": "Liability Only",
    "description": "Covers damage you cause to others",
    "recommended": "15/30/5 minimum",
    "whenNeeded": "Budget-conscious with older vehicles"
  },
  {
    "type": "Full Coverage",
    "description": "Liability + collision + comprehensive", 
    "recommended": "100/300/100 + $500 deductibles",
    "whenNeeded": "Newer vehicles, financed/leased cars"
  }
]
```

**CSV Fields**:
```
coverage_liability_desc, coverage_liability_recommended
coverage_full_desc, coverage_full_avg_price
coverage_uninsured_recommended
```

---

## 10. CLAIMS_PROCESS
**Purpose**: Explain how to file a claim  
**AI Prompt Focus**: Step-by-step guide  
**Output**: Object with steps, documents, timeline  
**Best For**: Trust building, user preparation  

**Example Output**:
```json
{
  "steps": [
    "Report the accident to police and exchange information",
    "Document the scene with photos and witness contact info",
    "Contact your insurance company within 24 hours",
    "Get repair estimates from approved shops",
    "Review settlement offer and negotiate if needed"
  ],
  "documents": ["Police report", "Photos of damage", "Medical records", "Repair estimates"],
  "timeline": "Most claims resolved within 30-45 days",
  "resources": ["California Department of Insurance", "DMV accident guide"]
}
```

---

## 11. BUYERS_GUIDE
**Purpose**: Step-by-step purchasing guide  
**AI Prompt Focus**: "How to Find {main keyword}"  
**Output**: Object with steps, lookFor, redFlags, questions  
**Best For**: First-time buyers, conversion funnel  

**Example Output**:
```json
{
  "steps": [
    "Assess your coverage needs based on vehicle value",
    "Gather driving history and vehicle information",
    "Get quotes from at least 5 different insurers",
    "Compare coverage limits and deductibles",
    "Ask about all available discounts"
  ],
  "lookFor": ["A-rated financial strength", "24/7 claims service", "Local agent availability"],
  "redFlags": ["Unusually low quotes", "High complaint ratios", "Pressure to buy immediately"],
  "questions": ["What discounts do I qualify for?", "How does deductible affect premium?"]
}
```

---

## 12. META_TAGS
**Purpose**: SEO-optimized meta information  
**AI Prompt Focus**: Include main keyword naturally  
**Output**: Object with meta title, description, keywords  
**Best For**: Search engine optimization  

**Example Output**:
```json
{
  "metaTitle": "Cheapest Car Insurance in Los Angeles, CA (2024) | Save $500+",
  "metaDescription": "Find the cheapest car insurance in Los Angeles. Compare quotes from top providers. Average rates from $1,200/year. Get your free quote today!",
  "metaKeywords": ["cheap car insurance los angeles", "affordable auto insurance", "LA car insurance rates"],
  "ogTitle": "Cheapest Car Insurance in Los Angeles | Save $500/Year",
  "ogDescription": "Compare affordable car insurance rates in LA from 50+ providers. Average savings $487/year."
}
```

**CSV Fields**:
```
metaTitle, metaDescription
metaKeywords (comma-separated)
ogTitle, ogDescription
twitterTitle, twitterDesc
```

---

## Complete CSV Header for All AI Sections

```csv
slug,title,subtitle,excerpt,metaTitle,metaDescription,metaKeywords,ogTitle,ogDescription,ogImage,twitterTitle,twitterDesc,canonicalUrl,robots,insuranceType,state,stateCode,city,avg_premium,min_premium,max_premium,min_coverage,min_coverage_explained,full_coverage_avg,uninsured_rate,uninsured_rate_national,avg_premium_national,premium_comparison,accident_rate,theft_rate,traffic_congestion_rank,avg_commute_time,top_insurer_1,top_insurer_1_rate,top_insurer_1_best_for,top_insurer_2,top_insurer_2_rate,top_insurer_2_best_for,top_insurer_3,top_insurer_3_rate,intro,requirements,faq_q1,faq_a1,faq_q2,faq_a2,faq_q3,faq_a3,faq_q4,faq_a4,faq_q5,faq_a5,tip_1,tip_2,tip_3,tip_4,tip_5,tip_6,tip_7,cost_factor_1,cost_impact_1,cost_desc_1,cost_factor_2,cost_impact_2,cost_desc_2,cost_factor_3,cost_impact_3,cost_desc_3,discount_1_name,discount_1_savings,discount_1_qualification,discount_2_name,discount_2_savings,discount_2_qualification,discount_3_name,discount_3_savings,discount_3_qualification,local_stat_1,local_stat_1_value,local_stat_1_impact,local_stat_2,local_stat_2_value,local_stat_2_impact,coverage_liability_desc,coverage_liability_recommended,coverage_full_desc,coverage_full_recommended,claims_steps,claims_documents,claims_timeline,buyers_guide_steps,buyers_guide_redflags,isPublished,showAds,hero_cta_text
```

**Total Fields**: 95+ columns for maximum customization

---

## Recommended Minimum Set for Quick Import

If you want to import quickly and let AI fill the rest:

```csv
slug,title,state,city,avg_premium,min_coverage,uninsured_rate,isPublished
```

Then use the admin panel's "Auto-Generate with AI" feature to fill in:
- intro
- requirements  
- faqs
- tips
- metaTags

---

## AI Generation API Usage

### Single Page Generation
```bash
curl -X POST https://myinsurancebuddies.com/api/ai-generate \
  -H "Content-Type: application/json" \
  -d '{
    "pageData": {
      "slug": "car-insurance/california/los-angeles",
      "insuranceType": "car",
      "state": "California",
      "city": "Los Angeles"
    },
    "sections": ["intro", "faqs", "tips", "metaTags"],
    "forceFreeModels": true
  }'
```

### Bulk Generation (Batch)
```bash
curl -X POST https://myinsurancebuddies.com/api/ai-generate/batch \
  -H "Content-Type: application/json" \
  -d '{
    "pageIds": ["page-id-1", "page-id-2", "page-id-3"],
    "sections": ["intro", "requirements", "faqs", "tips", "discounts", "localStats", "metaTags"],
    "batchSize": 10,
    "delayBetweenBatches": 2000
  }'
```

---

## Content Quality Scores

After AI generation, content is automatically scored on:

| Metric | Weight | Good Score |
|--------|--------|------------|
| Readability | 20% | 80+ |
| SEO Optimization | 25% | 85+ |
| Comprehensiveness | 20% | 80+ |
| User Value | 20% | 85+ |
| Originality | 15% | 75+ |

**Overall Score Target**: 80+ for best search performance

---

## Tips for Best AI Output

1. **Provide Data**: Include `avg_premium`, `min_coverage` in your CSV for accurate AI content
2. **Specify Location**: City + State gives better local context
3. **Use Free Models**: `forceFreeModels: true` saves money
4. **Review & Edit**: AI content should be reviewed before publishing
5. **Update Regularly**: Refresh AI content every 6-12 months with new data
