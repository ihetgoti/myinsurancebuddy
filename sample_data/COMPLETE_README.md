# Complete Sample Data for Bulk Page Generation

This folder contains **COMPLETE** sample data with **ALL POSSIBLE FIELDS** for each insurance type.

## Files Overview

### JSON Files (With Nested Objects/Arrays)
- `COMPLETE_AUTO_INSURANCE.json` - Car insurance with full details
- `COMPLETE_HOME_INSURANCE.json` - Homeowners insurance with full details

### CSV Files (Flat Structure - Easier for Excel)
- `COMPLETE_AUTO_INSURANCE.csv` - 16 states/cities
- `COMPLETE_HOME_INSURANCE.csv` - 16 states/cities
- `COMPLETE_HEALTH_INSURANCE.csv` - 16 states
- `COMPLETE_LIFE_INSURANCE.csv` - 11 states/cities
- `COMPLETE_MOTORCYCLE_INSURANCE.csv` - 10 states
- `COMPLETE_PET_INSURANCE.csv` - 10 states
- `COMPLETE_BUSINESS_INSURANCE.csv` - 10 states
- `COMPLETE_RENTER_INSURANCE.csv` - 12 states/cities
- `COMPLETE_UMBRELLA_INSURANCE.csv` - 10 states

## ALL Available Fields by Insurance Type

### AUTO INSURANCE Fields
```
slug                              - URL path (e.g., "auto-insurance/california")
state_name                        - Full state name (e.g., "California")
state_code                        - 2-letter code (e.g., "CA")
state_slug                        - URL-friendly (e.g., "california")
city_name                         - City name (leave empty for state pages)
city_slug                         - City slug (leave empty for state pages)
title                             - Page H1 title
subtitle                          - Subtitle below H1
excerpt                           - Short description
metaTitle                         - SEO title tag
metaDescription                   - SEO meta description
metaKeywords                      - Comma-separated keywords
ogTitle                           - Facebook/LinkedIn title
ogDescription                     - Facebook/LinkedIn description
ogImage                           - Social share image URL
avg_premium                       - Average cost (e.g., "$1,500/year")
min_coverage                      - Minimum required (e.g., "15/30/5")
bodily_per_person                 - BI per person (e.g., "15,000")
bodily_per_accident               - BI per accident (e.g., "30,000")
property_damage                   - PD limit (e.g., "5,000")
uninsured_rate                    - % uninsured drivers (e.g., "12%")
top_insurer                       - Market leader (e.g., "State Farm")
top_insurer_market_share          - % market share (e.g., "14.2%")
second_insurer                    - #2 insurer
third_insurer                     - #3 insurer
last_updated                      - Date (e.g., "2024-01-15")
is_no_fault_state                 - true/false
pip_required                      - true/false
dmv_registration_required         - true/false
state_laws_summary                - Brief legal summary
status                            - PUBLISHED or DRAFT
isPublished                       - true/false
showAds                           - true/false
```

### HOME INSURANCE Fields
```
slug
state_name, state_code, state_slug, city_name, city_slug
title, subtitle, excerpt
metaTitle, metaDescription, metaKeywords
avg_premium, avg_home_value, avg_rebuild_cost, median_home_age
top_insurer, top_insurer_market_share
last_updated
disaster_risk                     - Risk level (Low/Moderate/High/Very High)
primary_disaster_risk             - Main risk (wildfire/hurricane/tornado/flood)
flood_zone                        - true/false
hurricane_risk                    - true/false
earthquake_risk                   - true/false
wildfire_risk_level               - None/Low/Moderate/High/Very High
tornado_risk                      - true/false
mudslide_risk                     - true/false
avg_claim                         - Average claim amount
status, isPublished, showAds
```

### HEALTH INSURANCE Fields
```
slug
state_name, state_code, state_slug
avg_premium                       - Monthly cost (e.g., "$450/month")
uninsured_rate                    - % uninsured population
top_insurer                       - Largest health insurer
medicare_enrollment               - Number enrolled (e.g., "2.5M")
medicaid_expansion                - true/false
exchange_name                     - State exchange name (e.g., "Covered California")
title, subtitle, excerpt
metaTitle, metaDescription, metaKeywords
status, isPublished, showAds
```

### LIFE INSURANCE Fields
```
slug
state_name, state_code, state_slug, city_name, city_slug
avg_premium                       - Monthly cost (e.g., "$30/month")
avg_coverage                      - Average coverage (e.g., "$250,000")
top_insurer                       - Leading life insurer
avg_term_length                   - Common term (e.g., "20 years")
title, subtitle, excerpt
metaTitle, metaDescription, metaKeywords
status, isPublished, showAds
```

### MOTORCYCLE INSURANCE Fields
```
slug
state_name, state_code, state_slug
avg_premium                       - Annual cost (e.g., "$800/year")
min_coverage                      - Minimum required
helmet_law                        - Required/Optional
.top_insurer
title, subtitle, excerpt
metaTitle, metaDescription, metaKeywords
status, isPublished, showAds
```

### PET INSURANCE Fields
```
slug
state_name, state_code, state_slug
avg_premium                       - Monthly cost (e.g., "$45/month")
top_insurer
avg_vet_cost                      - Cost range (e.g., "$250-500/visit")
title, subtitle, excerpt
metaTitle, metaDescription, metaKeywords
status, isPublished, showAds
```

### BUSINESS INSURANCE Fields
```
slug
state_name, state_code, state_slug
avg_premium                       - Annual cost (e.g., "$1,800/year")
top_insurer
avg_claim                         - Average claim amount
title, subtitle, excerpt
metaTitle, metaDescription, metaKeywords
status, isPublished, showAds
```

### RENTERS INSURANCE Fields
```
slug
state_name, state_code, state_slug, city_name, city_slug
avg_premium                       - Annual cost (e.g., "$180/year")
avg_rent                          - Monthly rent (e.g., "$2,500/month")
top_insurer
avg_property_value                - Average property coverage needed
title, subtitle, excerpt
metaTitle, metaDescription, metaKeywords
status, isPublished, showAds
```

### UMBRELLA INSURANCE Fields
```
slug
state_name, state_code, state_slug
avg_premium                       - Annual cost (e.g., "$400/year")
coverage_limits                   - Range (e.g., "$1M - $5M")
top_insurer
avg_net_worth                     - Typical buyer net worth
title, subtitle, excerpt
metaTitle, metaDescription, metaKeywords
status, isPublished, showAds
```

## How to Create Your Own Data

### Step 1: Choose Template Type
Select the insurance type CSV file that matches your needs.

### Step 2: Copy and Edit
Open the CSV in Excel/Google Sheets and:
1. Keep the header row (first row)
2. Replace data with your own
3. Add more rows for additional states/cities

### Step 3: Upload
1. Go to Admin → Templates
2. Select insurance type
3. Click "Generate Pages"
4. Upload your CSV file
5. Review and generate

## URL Structure Generated

State pages:
- `/auto-insurance/california`
- `/home-insurance/texas`
- `/health-insurance/florida`

City pages:
- `/auto-insurance/california/los-angeles`
- `/home-insurance/texas/houston`
- `/renters-insurance/new-york/nyc`

## Tips for Bulk Generation

1. **Start Small**: Test with 5-10 entries first
2. **Use Real Data**: Research actual rates for accuracy
3. **Slug Format**: Use lowercase with hyphens (e.g., "los-angeles")
4. **State Codes**: Use standard 2-letter codes (CA, TX, FL, etc.)
5. **Images**: Update ogImage URLs to your CDN
6. **Status**: Set to "PUBLISHED" to go live immediately

## Creating Thousands of Pages

For large-scale generation:

1. **Create State Pages First** (50 states)
2. **Add Major Cities** (100+ cities)
3. **Use Data APIs** like Census or Insurance Department data
4. **Automate with Scripts** to generate from data sources

## Example: Creating 1000+ Pages

```javascript
// Pseudocode for generating thousands of pages
const states = [/* 50 states */];
const cities = [/* 1000 cities with state */];

// State pages - 50 pages
states.forEach(state => {
  createPage({
    slug: `auto-insurance/${state.slug}`,
    state_name: state.name,
    state_code: state.code,
    // ... other fields
  });
});

// City pages - 1000 pages
cities.forEach(city => {
  createPage({
    slug: `auto-insurance/${city.state_slug}/${city.slug}`,
    state_name: city.state_name,
    city_name: city.name,
    // ... other fields
  });
});
```

## Deploying to Production

After generating pages:

1. **Test Sample Pages** - Check 5-10 random pages
2. **Update Sitemap** - Regenerate XML sitemap
3. **Submit to Google** - Use Search Console
4. **Monitor Analytics** - Track traffic and rankings
5. **Build Links** - Internal linking between related pages

## Support

For questions about field formats or bulk generation, refer to the admin panel Templates section.
