# Google Sheets Field Categories - Quick Reference

## 📊 Total Fields: 195+ Columns

### Category 1: Basic Identity (7 fields)
| # | Field | Required | Auto-Generated |
|---|-------|----------|----------------|
| 1 | slug | ✅ | Formula |
| 2 | url_path | ✅ | Formula |
| 3 | title | ✅ | Formula |
| 4 | subtitle | ✅ | Formula |
| 5 | excerpt | ✅ | Formula |
| 6 | hero_title | ✅ | Formula |
| 7 | hero_subtitle | ✅ | Formula |

**Formula Pattern**:
```excel
slug: ="car-insurance/"&LOWER(SUBSTITUTE(state," ","-"))&"/"&LOWER(SUBSTITUTE(city," ","-"))
title: ="Cheapest Car Insurance in "&city&", "&state&" | Compare & Save $500+"
```

---

### Category 2: Hero Configuration (10 fields)
| # | Field | Required | Default Value |
|---|-------|----------|---------------|
| 8 | hero_cta_text | ✅ | Get Free Quotes |
| 9 | hero_cta_url | ✅ | /get-quote |
| 10 | hero_background_image | ❌ | URL to image |
| 11 | hero_background_type | ✅ | gradient |
| 12 | hero_gradient_from | ✅ | #0f172a |
| 13 | hero_gradient_to | ✅ | #1e3a5f |
| 14 | hero_overlay_opacity | ✅ | 50 |
| 15 | hero_show_rating | ✅ | true |
| 16 | hero_rating_value | ❌ | 4.8 |
| 17 | hero_rating_count | ❌ | 12500 |

---

### Category 3: SEO Meta Tags (15 fields) - ALL AUTO-GENERATED
| # | Field | Character Limit | Formula |
|---|-------|-----------------|---------|
| 18 | meta_title | 60 | `=LEFT("Cheapest..."&city&... ,60)` |
| 19 | meta_description | 160 | `=LEFT("Find cheapest..." ,160)` |
| 20 | meta_keywords | - | Comma-separated keywords |
| 21 | meta_robots | - | index,follow |
| 22 | canonical_url | - | Full URL |
| 23 | og_title | 70 | Open Graph title |
| 24 | og_description | 200 | Facebook description |
| 25 | og_image | - | 1200x630px image URL |
| 26 | og_type | - | website |
| 27 | og_url | - | Canonical URL |
| 28 | twitter_card | - | summary_large_image |
| 29 | twitter_title | - | Same as meta_title |
| 30 | twitter_description | - | Same as meta_description |
| 31 | twitter_image | - | 1200x600px image |
| 32 | schema_markup_json | - | Structured data JSON |

---

### Category 4: Location/Hierarchy (14 fields)
| # | Field | Required | Source |
|---|-------|----------|--------|
| 33 | insurance_type | ✅ | Manual/Template |
| 34 | insurance_type_id | ✅ | Database UUID |
| 35 | geo_level | ✅ | Formula: CITY/STATE |
| 36 | country | ✅ | United States |
| 37 | country_code | ✅ | US |
| 38 | state | ✅ | Manual |
| 39 | state_code | ✅ | CA, TX, etc. |
| 40 | state_slug | ✅ | Formula |
| 41 | city | ❌ | Manual |
| 42 | city_slug | ✅ | Formula |
| 43 | city_population | ❌ | Census data |
| 44 | city_median_income | ❌ | Census data |
| 45 | city_median_age | ❌ | Census data |
| 46 | zip_codes | ❌ | List of ZIPs |

---

### Category 5: Pricing & Statistics (18 fields) - DATA DRIVEN
| # | Field | Type | Example |
|---|-------|------|---------|
| 47 | avg_premium | Currency | $1847/year |
| 48 | avg_premium_national | Currency | $1565/year |
| 49 | premium_vs_national | Percentage | 18% above |
| 50 | min_premium | Currency | $892/year |
| 51 | max_premium | Currency | $3200/year |
| 52 | min_coverage | Text | 15/30/5 |
| 53 | min_coverage_explained | Text | $15k/$30k/$5k |
| 54 | full_coverage_avg | Currency | $2400/year |
| 55 | liability_only_avg | Currency | $892/year |
| 56 | uninsured_rate | Percentage | 15% |
| 57 | uninsured_rate_national | Percentage | 12.6% |
| 58 | accident_rate | Text | 12.3 per 100k |
| 59 | theft_rate_per_100k | Number | 425 |
| 60 | traffic_congestion_rank | Text | #1 Worst in US |
| 61 | avg_commute_time | Text | 31 minutes |
| 62 | weather_risk_factors | Text | Earthquakes, wildfires |
| 63 | population_density | Text | 8484 per sq mi |
| 64 | vehicle_count | Text | 2.1 million |

**Data Sources**: Census.gov, FBI Crime Data, NAIC, III.org

---

### Category 6: Top 5 Providers (20 fields)
| # | Field | Provider 1 | Provider 2 | Provider 3 | Provider 4 | Provider 5 |
|---|-------|------------|------------|------------|------------|------------|
| 65 | Name | State Farm | GEICO | Progressive | Allstate | Farmers |
| 66 | Avg Rate | $1650/year | $1520/year | $1780/year | $1920/year | $1850/year |
| 67 | Strengths | Local agents... | Low rates... | Name Your Price... | Extensive network... | Strong local... |
| 68 | Best For | Personal svc... | Tech-savvy... | High-risk... | Full svc... | Homeowners... |

**Columns**: 65-84 (20 fields total)

---

### Category 7: Content Sections (2 fields + 8 FAQs)
| # | Field | Type | AI Generated |
|---|-------|------|--------------|
| 85 | intro_paragraph | Text | ✅ Yes |
| 86 | requirements_paragraph | Text | ✅ Yes |
| 87 | req_min_liability | Text | Manual |
| 88 | req_bodily_injury_per_person | Currency | Manual |
| 89 | req_bodily_injury_per_accident | Currency | Manual |
| 90 | req_property_damage | Currency | Manual |
| 91 | req_fault_system | Text | Manual |
| 92 | req_uninsured_motorist | Text | Manual |
| 93-108 | faq_q1-a8 | Q&A pairs | ✅ Yes |

**8 FAQs = 16 fields (Questions + Answers)**

---

### Category 8: Tips (20 fields)
| # | Field | Format |
|---|-------|--------|
| 109 | tip_1_title | Action-oriented title |
| 110 | tip_1_desc | 1-2 sentence description |
| 111 | tip_2_title | ... |
| 112 | tip_2_desc | ... |
| ... | ... | Continue through tip_10 |

**10 Tips = 20 fields (Title + Description each)**

---

### Category 9: Cost Factors (15 fields)
| # | Field | Example |
|---|-------|---------|
| 129 | cost_factor_1_name | Minimum Coverage |
| 130 | cost_factor_1_impact | $892/year |
| 131 | cost_factor_1_desc | Meets legal requirements... |
| 132 | cost_factor_2_name | Full Coverage |
| 133 | cost_factor_2_impact | $2400/year |
| 134 | cost_factor_2_desc | Includes collision... |
| ... | ... | 5 factors total = 15 fields |

---

### Category 10: Discounts (40 fields)
| # | Field | Example 1 | Example 2 |
|---|-------|-----------|-----------|
| 144 | Name | Multi-Policy | Good Driver |
| 145 | Savings | 10-25% | 20% |
| 146 | Qualification | Bundle home+auto | Clean 3yr record |
| 147 | Is Local | false | true |

**10 Discounts × 4 fields = 40 fields**

---

### Category 11: Local Statistics (24 fields)
| # | Field | Stat 1 | Stat 2 |
|---|-------|--------|--------|
| 184 | Label | Avg Premium | Uninsured Rate |
| 185 | Value | $1847/year | 15% |
| 186 | Comparison | 18% above natl | Higher than natl |
| 187 | Impact | High traffic | Risk increase |

**6 Stats × 4 fields = 24 fields**

---

### Category 12: Coverage Types (20 fields)
| # | Field | Liability | Collision |
|---|-------|-----------|-----------|
| 208 | Name | Liability | Collision |
| 209 | Description | Covers others... | Your vehicle... |
| 210 | Recommended | 15/30/5 min | Up to value |
| 211 | When Needed | Budget/old cars | Required if financed |

**5 Coverage Types × 4 fields = 20 fields**

---

### Category 13: Claims Process (9 fields)
| # | Field | Example |
|---|-------|---------|
| 228 | claims_step_1 | Report to police |
| 229 | claims_step_2 | Document scene |
| 230 | claims_step_3 | Contact insurance |
| 231 | claims_step_4 | Get estimates |
| 232 | claims_step_5 | Review settlement |
| 233 | claims_step_6 | Complete paperwork |
| 234 | claims_documents_needed | List of docs |
| 235 | claims_timeline | 30-45 days |
| 236 | claims_phone_number | 1-800-XXX-XXXX |

---

### Category 14: Buyers Guide (14 fields)
| # | Field | Type |
|---|-------|------|
| 237 | buyers_guide_step_1-7 | 7 steps |
| 244 | buyers_guide_red_flag_1-4 | 4 red flags |
| 248 | buyers_guide_question_1-3 | 3 questions |

---

### Category 15: Provider Comparisons (25 fields)
| # | Field | P1 | P2 | P3 | P4 | P5 |
|---|-------|----|----|----|----|----|
| 251 | Name | State Farm | GEICO | etc. | etc. | etc. |
| 252 | Rating | A+ | A++ | A+ | A+ | A |
| 253 | Price Range | $1400-2100 | $1200-1900 | ... | ... | ... |
| 254 | Strengths | Text | Text | Text | Text | Text |
| 255 | Weaknesses | Text | Text | Text | Text | Text |

**5 Providers × 5 fields = 25 fields**

---

### Category 16: Keywords (3 fields)
| # | Field | Formula |
|---|-------|---------|
| 276 | primary_keyword | ="cheapest "&type&" "&city |
| 277 | secondary_keywords | List of 5-10 keywords |
| 278 | lsi_keywords | Related terms |

---

### Category 17: Links (8 fields)
| # | Field | Type |
|---|-------|------|
| 279 | internal_link_1_url | /car-insurance/california |
| 280 | internal_link_1_anchor | California Car Insurance |
| 281 | internal_link_2_url | /car-insurance |
| 282 | internal_link_2_anchor | Compare by State |
| 283 | internal_link_3_url | /blog/... |
| 284 | internal_link_3_anchor | How to Lower Rates |
| 285 | external_link_1_url | DMV website |
| 286 | external_link_2_url | State insurance dept |

---

### Category 18: Media (8 fields)
| # | Field | Type |
|---|-------|------|
| 287 | image_1_url | Hero image URL |
| 288 | image_1_alt | Alt text |
| 289 | image_2_url | Skyline image |
| 290 | image_2_alt | Alt text |
| 291 | image_3_url | Driving image |
| 292 | image_3_alt | Alt text |
| 293 | video_url | YouTube embed |
| 294 | video_title | Video title |

---

### Category 19: Custom Code (3 fields)
| # | Field | Type |
|---|-------|------|
| 295 | custom_css | CSS rules |
| 296 | custom_js | JavaScript |
| 297 | body_classes | HTML classes |

---

### Category 20: Breadcrumbs (6 fields)
| # | Field | Level 1 | Level 2 | Level 3 | Level 4 |
|---|-------|---------|---------|---------|---------|
| 298 | Label | Home | Car Insurance | California | Los Angeles |
| 299 | URL | / | /car-insurance | /car-insurance/CA | (empty) |

---

### Category 21: Performance (2 fields)
| # | Field | Purpose |
|---|-------|---------|
| 304 | preload_images | Comma-separated URLs |
| 305 | prefetch_pages | Comma-separated paths |

---

### Category 22: Publishing (7 fields)
| # | Field | Example |
|---|-------|---------|
| 306 | is_published | true |
| 307 | status | PUBLISHED |
| 308 | published_at | 2024-01-15T10:00:00Z |
| 309 | show_ads | true |
| 310 | ad_positions | header,sidebar,inline |
| 311 | content_score_target | 85 |
| 312 | version | 3 |

---

### Category 23: Metadata (3 fields)
| # | Field | Example |
|---|-------|---------|
| 313 | internal_notes | Updated 2024 rates |
| 314 | created_by | admin |
| 315 | created_at | 2024-01-15T10:00:00Z |

---

## 📈 Field Summary by Category

| Category | Fields | Auto-Generated | Manual Entry | AI-Generated |
|----------|--------|----------------|--------------|--------------|
| Basic Identity | 7 | 7 | 0 | 0 |
| Hero Config | 10 | 0 | 10 | 0 |
| SEO Meta | 15 | 15 | 0 | 0 |
| Location | 14 | 2 | 12 | 0 |
| Pricing/Stats | 18 | 1 | 17 | 0 |
| Top 5 Providers | 20 | 0 | 20 | 0 |
| Content/FAQs | 18 | 0 | 2 | 16 |
| Tips | 20 | 0 | 0 | 20 |
| Cost Factors | 15 | 0 | 5 | 10 |
| Discounts | 40 | 0 | 40 | 0 |
| Local Stats | 24 | 0 | 24 | 0 |
| Coverage Types | 20 | 0 | 20 | 0 |
| Claims Process | 9 | 0 | 9 | 0 |
| Buyers Guide | 14 | 0 | 14 | 0 |
| Provider Comparisons | 25 | 0 | 25 | 0 |
| Keywords | 3 | 3 | 0 | 0 |
| Links | 8 | 6 | 2 | 0 |
| Media | 8 | 6 | 2 | 0 |
| Custom Code | 3 | 1 | 2 | 0 |
| Breadcrumbs | 6 | 6 | 0 | 0 |
| Performance | 2 | 0 | 2 | 0 |
| Publishing | 7 | 0 | 7 | 0 |
| Metadata | 3 | 0 | 3 | 0 |
| **TOTAL** | **315** | **47** | **216** | **46** |

---

## 🎯 Minimum Required Fields (For Quick Start)

If you want to import quickly with just 10 fields:

1. `slug` - Auto-generated
2. `title` - Auto-generated
3. `state` - Manual
4. `city` - Manual
5. `insurance_type` - Manual
6. `avg_premium` - Manual
7. `min_coverage` - Manual
8. `uninsured_rate` - Manual
9. `is_published` - Manual (true/false)
10. `show_ads` - Manual (true/false)

Then use Admin Panel → AI Content → Bulk Generate to fill the rest!

---

## 🔗 Related Files

- [GOOGLE_SHEETS_COMPLETE_TEMPLATE.csv](GOOGLE_SHEETS_COMPLETE_TEMPLATE.csv) - Full CSV with all columns
- [GOOGLE_SHEETS_FORMULAS_REFERENCE.md](GOOGLE_SHEETS_FORMULAS_REFERENCE.md) - All formulas
- [AI_GENERATED_CONTENT_SECTIONS_REFERENCE.md](AI_GENERATED_CONTENT_SECTIONS_REFERENCE.md) - AI section details
