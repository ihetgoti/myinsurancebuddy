# Google Sheets =AI() Template Guide - Using Range Parameter

## ✅ For Google Pro Users - Advanced =AI() Usage

Based on Google Sheets AI syntax:
```excel
=AI(prompt, [range])
```

The **range** parameter gives Gemini context from your data for better results.

---

## 🎯 Optimized Formulas with Range Parameter

### Basic Setup

Enter your data first:
- **A2**: City name (e.g., "Los Angeles")
- **B2**: State name (e.g., "California")

Then use =AI() with range A2:B2 for context:

---

## 📊 Column Formulas

### Formula Columns (No AI needed)

**Column C - state_code_lower:**
```excel
=LOWER(SUBSTITUTE(B2," ","-"))
```

**Column D - slug:**
```excel
="/car-insurance/"&C2&"/"&LOWER(SUBSTITUTE(A2," ","-"))
```

**Column E - meta_title:**
```excel
="Cheap Car Insurance in "&A2&", "&B2&" (2026) | Compare & Save"
```

**Column G - h1_title:**
```excel
="Cheap Car Insurance in "&A2
```

---

## 📝 Content Formulas Using =AI() with Range

### Meta Description (Column F)
```excel
=AI("Write a compelling meta description (155-160 characters) for car insurance. Include: cheap rates, comparison savings mentioning $500+, free quotes. Make it click-worthy.", A2:B2)
```

### Hero Tagline (Column H)
```excel
=AI("Write an attention-grabbing hero tagline (5-8 words) for car insurance. Focus on savings. Example: 'Save up to 40% today'", A2:B2)
```

### Hero Description (Column I)
```excel
=AI("Write a 15-20 word hero description for car insurance. Mention comparing quotes from top providers.", A2:B2)
```

### Intro Paragraph 1 (Column J)
```excel
=AI("Write paragraph 1 (80-100 words) about car insurance. Start with average rates, mention why this city has unique challenges (traffic, crime, weather), hook the reader.", A2:B2)
```

### Intro Paragraph 2 (Column K)
```excel
=AI("Write paragraph 2 (80-100 words) about factors affecting car insurance rates: local traffic patterns, accident hotspots, vehicle theft rates, weather risks, repair costs.", A2:B2)
```

### Intro Paragraph 3 (Column L)
```excel
=AI("Write paragraph 3 (80-100 words) as solution and call to action. Mention comparing quotes, finding discounts, average savings of $487/year, urgency to get free quote.", A2:B2)
```

---

## ❓ FAQ Formulas (Using Range A2:B2)

### FAQ 1 - Cheapest Company (Columns M,N)

**M2 - Question (Formula):**
```excel
="What is the cheapest car insurance company in "&A2&", "&B2&"?"
```

**N2 - Answer:**
```excel
=AI("Write a 50-60 word answer about the cheapest car insurance company. Mention that rates vary by driver profile, list 2-3 companies known for low rates, mention average starting rates around $85/month for good drivers.", A2:B2)
```

### FAQ 2 - Monthly Cost (Columns O,P)

**O2 - Question (Formula):**
```excel
="How much is car insurance per month in "&A2&", "&B2&"?"
```

**P2 - Answer:**
```excel
=AI("Write a 50-60 word answer about monthly car insurance costs. Include average for full coverage ($150-200/month) and minimum liability ($65-85/month). Mention if it's higher or lower than state average.", A2:B2)
```

### FAQ 3 - Minimum Requirements (Columns Q,R)

**Q2 - Question (Formula):**
```excel
="What is the minimum car insurance required in "&B2&"?"
```

**R2 - Answer:**
```excel
=AI("Write a 50-60 word answer about minimum car insurance requirements. List exact liability limits (like 15/30/5 or 25/50/25). Mention penalties for driving without insurance: fines, license suspension, vehicle impoundment.", A2:B2)
```

### FAQ 4 - Lower Rates (Columns S,T)

**S2 - Question (Formula):**
```excel
="How can I lower my car insurance rates in "&A2&"?"
```

**T2 - Answer:**
```excel
=AI("Write a 50-60 word answer with 5 specific ways to lower car insurance rates: 1) Bundle policies for 10-25% savings 2) Increase deductibles for 15-30% reduction 3) Maintain good credit 4) Take defensive driving for 5-10% off 5) Shop around every 6 months.", A2:B2)
```

### FAQ 5 - Full Coverage (Columns U,V)

**U2 - Question (Formula):**
```excel
="Is full coverage car insurance worth it in "&A2&"?"
```

**V2 - Answer:**
```excel
=AI("Write a 50-60 word answer about whether full coverage is worth it. Explain it's recommended for vehicles worth over $5,000, includes collision and comprehensive, required for loans/leases, and when to drop it (value under $3,000).", A2:B2)
```

### FAQ 6 - Rate Factors (Columns W,X)

**W2 - Question (Formula):**
```excel
="What factors affect car insurance rates the most in "&A2&"?"
```

**X2 - Answer:**
```excel
=AI("Write a 50-60 word answer listing the top 5 factors affecting car insurance rates: 1) Driving record 2) Credit score 3) Vehicle type 4) ZIP code/neighborhood 5) Annual mileage. Briefly explain each.", A2:B2)
```

### FAQ 7 - Bad Driving Record (Columns Y,Z)

**Y2 - Question (Formula):**
```excel
="Can I get car insurance with a bad driving record in "&A2&"?"
```

**Z2 - Answer:**
```excel
=AI("Write a 50-60 word answer about getting car insurance with a bad driving record. Mention high-risk insurers, expect 30-100% higher rates, possible SR-22 requirement, and maintaining clean record for 3 years to return to standard rates.", A2:B2)
```

### FAQ 8 - Time to Get Insurance (Columns AA,AB)

**AA2 - Question (Formula):**
```excel
="How long does it take to get car insurance in "&A2&"?"
```

**AB2 - Answer:**
```excel
=AI("Write a 50-60 word answer about how quickly drivers can get car insurance. Mention 10-15 minutes online, instant quotes, immediate coverage, proof via email/app, and same-day SR-22 filing availability.", A2:B2)
```

### FAQ 9 - SR-22 (Columns AC,AD)

**AC2 - Question (Formula):**
```excel
="What is SR-22 insurance and do I need it in "&A2&"?"
```

**AD2 - Answer:**
```excel
=AI("Write a 50-60 word answer explaining SR-22 insurance. Clarify it's a certificate not insurance, who needs it (DUI, no insurance, violations), costs $15-50 to file, 30-100% premium increase, must maintain 2-3 years with no lapses.", A2:B2)
```

### FAQ 10 - Teen Drivers (Columns AE,AF)

**AE2 - Question (Formula):**
```excel
="How much is teen car insurance in "&A2&"?"
```

**AF2 - Answer:**
```excel
=AI("Write a 50-60 word answer about teen car insurance costs. Include: $350-450/month on parent policy vs $500-650/month separate, good student discounts up to 25% for B average, driver's education savings of 10-15%.", A2:B2)
```

---

## 📝 Content Section Formulas (Using Range)

### Section 1: SR-22 (Columns AG,AH)

**AG2 - Title (Formula):**
```excel
="SR-22 Insurance in "&A2&": What You Need to Know"
```

**AH2 - Content:**
```excel
=AI("Write 100-120 words about SR-22 insurance. Explain: what it is (certificate not insurance), who needs it (DUI, no insurance, violations), filing costs ($15-50), premium increases (30-100%), duration (2-3 years), consequences of lapses, same-day filing availability, and returning to standard rates after completion.", A2:B2)
```

### Section 2: Teen Drivers (Columns AI,AJ)

**AI2 - Title (Formula):**
```excel
="Teen Driver Insurance in "&A2&": A Parent's Guide"
```

**AJ2 - Content:**
```excel
=AI("Write 100-120 words about teen driver insurance. Cover: why rates are high (inexperience), costs on parent policy vs separate, good student discounts (25% for B average), driver's education benefits (10-15% off), telematics programs (up to 40% savings), keeping teens on family policy, rate decreases at ages 19, 21, 25.", A2:B2)
```

### Section 3: High-Risk (Columns AK,AL)

**AK2 - Title (Formula):**
```excel
="High-Risk Car Insurance Options in "&A2
```

**AL2 - Content:**
```excel
=AI("Write 100-120 words about high-risk car insurance options. Explain: who qualifies as high-risk (accidents, tickets, DUI, lapses), companies that accept high-risk drivers, expected rate increases (30-100%), SR-22 requirements, path back to standard rates (3 years clean driving), and encouragement that improvement is possible.", A2:B2)
```

### Section 4: Minimum Coverage (Columns AM,AN)

**AM2 - Title (Formula):**
```excel
="Understanding Minimum Coverage in "&B2
```

**AN2 - Content:**
```excel
=AI("Write 100-120 words about minimum car insurance coverage requirements. Include: exact state minimum liability limits, why minimums may be insufficient for serious accidents, penalties for driving without insurance (fines, license suspension), and recommendation to increase limits to 100/300/100 for better protection.", A2:B2)
```

### Section 5: Full Coverage (Columns AO,AP)

**AO2 - Title (Formula):**
```excel
="Full Coverage Explained for "&A2&" Drivers"
```

**AP2 - Content:**
```excel
=AI("Write 100-120 words explaining full coverage car insurance. Cover: what's included (liability + collision + comprehensive), when it's required (loans, leases), recommended for cars worth over $5,000, deductible choices ($500 vs $1000), gap insurance for new cars, and when to drop full coverage (value under $3,000).", A2:B2)
```

---

## 🎯 State Insights (Using Range)

**AQ2 - uniqueChallenge:**
```excel
=AI("Generate one unique insurance challenge like 'High Uninsured Driver Rate' or 'Severe Weather Risk' or 'Expensive Medical Costs'. Return only 2-4 words.", A2:B2)
```

**AR2 - savingOpportunity:**
```excel
=AI("Generate one money-saving opportunity like 'Good Driver Discount' or 'Multi-Policy Savings' or 'Low Mileage Discount'. Return only 2-4 words.", A2:B2)
```

**AS2 - commonMistake:**
```excel
=AI("Generate one common mistake drivers make with car insurance like 'Skipping Uninsured Motorist' or 'Minimum Coverage Only'. Return only 2-5 words.", A2:B2)
```

**AT2 - neighborhood_guide:**
```excel
=AI("Write 2 sentences about how different neighborhoods have different car insurance rates due to crime, traffic, or claim frequency. Keep under 40 words.", A2:B2)
```

---

## 📦 JSON Arrays (No AI needed - Use Formulas)

These don't need AI since they're standard data:

**AU2 - local_factors_json:**
```excel
="[{ ""factor"": ""Traffic Congestion"", ""factor_slug"": ""traffic"", ""impact"": ""High"", ""tip"": ""Consider usage-based insurance if you drive less than 12000 miles/year"" }, { ""factor"": ""Vehicle Theft Rates"", ""factor_slug"": ""theft"", ""impact"": ""Medium"", ""tip"": ""Install anti-theft devices for 5-15% discounts"" }, { ""factor"": ""Weather Conditions"", ""factor_slug"": ""weather"", ""impact"": ""Medium"", ""tip"": ""Comprehensive coverage protects against weather damage"" }]"
```

**AV2 - coverage_tips_json:**
```excel
="[""Increase liability limits above state minimum for better protection"", ""Add uninsured motorist coverage - protects you from drivers with no insurance"", ""Bundle auto with renters/homeowners for multi-policy discounts"", ""Review coverage annually and compare quotes""]"
```

**AW2 - discounts_list_json:**
```excel
="[{ ""name"": ""Multi-Policy Bundle"", ""description"": ""Bundle auto + home/renters"", ""savings"": ""Up to 25%"" }, { ""name"": ""Safe Driver"", ""description"": ""No accidents in 3 years"", ""savings"": ""Up to 20%"" }, { ""name"": ""Good Student"", ""description"": ""B average or better"", ""savings"": ""Up to 15%"" }, { ""name"": ""Pay-in-Full"", ""description"": ""Pay annual premium upfront"", ""savings"": ""Up to 10%"" }, { ""name"": ""Low Mileage"", ""description"": ""Drive under 10000 miles/year"", ""savings"": ""Up to 15%"" }]"
```

**AX2 - top_insurers_json:**
```excel
="[{ ""name"": ""GEICO"", ""rating"": ""4.8"", ""bestFor"": ""Low Rates"", ""slug"": ""geico"" }, { ""name"": ""State Farm"", ""rating"": ""4.7"", ""bestFor"": ""Local Agents"", ""slug"": ""state-farm"" }, { ""name"": ""Progressive"", ""rating"": ""4.6"", ""bestFor"": ""Comparison Tools"", ""slug"": ""progressive"" }, { ""name"": ""Allstate"", ""rating"": ""4.5"", ""bestFor"": ""Coverage Options"", ""slug"": ""allstate"" }, { ""name"": ""Farmers"", ""rating"": ""4.4"", ""bestFor"": ""Claims Service"", ""slug"": ""farmers"" }]"
```

---

## 🔧 Technical Columns (Formulas - No AI)

**AY2 - canonical_url:**
```excel
="https://myinsurancebuddies.com/car-insurance/"&C2&"/"&LOWER(SUBSTITUTE(A2," ","-"))
```

**AZ2 - coverage_format (uses AI with State only):**
```excel
=AI("What is the minimum liability coverage format for car insurance? Just the numbers like 15/30/5 or 25/50/25. Only the format, nothing else.", B2)
```

**BA2 - bodily_injury_per_person:**
```excel
=VALUE(LEFT(AZ2,FIND("/",AZ2)-1))
```

**BB2 - bodily_injury_per_accident:**
```excel
=VALUE(MID(AZ2,FIND("/",AZ2)+1,FIND("/",AZ2,FIND("/",AZ2)+1)-FIND("/",AZ2)-1))
```

**BC2 - property_damage:**
```excel
=VALUE(RIGHT(AZ2,LEN(AZ2)-FIND("/",AZ2,FIND("/",AZ2)+1)))
```

**BD2 - is_no_fault:**
```excel
=IF(OR(B2="Florida",B2="New York",B2="Michigan",B2="New Jersey",B2="Pennsylvania",B2="Massachusetts",B2="Minnesota",B2="North Dakota",B2="Hawaii",B2="Kansas",B2="Kentucky",B2="Utah"),TRUE,FALSE)
```

**BE2 - pip_required:**
```excel
=BD2
```

**BF2 - um_required:**
```excel
="recommended"
```

**BG2 - cta_subtext:**
```excel
="Join 10,000+ drivers already saving money"
```

**BH2 - cta_text:**
```excel
="Get Free Quotes Now"
```

---

## 🚀 Quick Workflow for 100 Cities

1. **Enter data in A2:B101** (cities and states)
2. **Add formulas in Row 2:**
   - Columns C, D, E, G (basic formulas)
   - Columns F, H-BF (=AI() with range A2:B2)
3. **Fill down all formulas** (select row 2, drag to row 101)
4. **Wait for AI generation** (5-10 minutes)
5. **Review results**
6. **Copy-paste values** (Edit → Paste special → Values only) to freeze content
7. **Export CSV** and upload

---

## 💡 Tips for Better Results

1. **Use range A2:B2** - This gives Gemini the city and state context
2. **Be specific in prompts** - "Write 50-60 words" vs "Write a short answer"
3. **Avoid overly complex prompts** - Break into smaller cells if needed
4. **Use formula cells for questions** - Don't waste AI quota on simple concatenation
5. **Freeze content after generation** - Copy-paste values to prevent re-generation

---

**Ready to generate 30K cities with optimized =AI() formulas!** 🎉
