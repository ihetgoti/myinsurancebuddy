# Complete Page Import & Mass Generation Documentation

## 📚 Quick Navigation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[COMPLETE_PAGE_IMPORT_SCHEMA.json](COMPLETE_PAGE_IMPORT_SCHEMA.json)** | Full JSON schema with all 100+ fields | Reference for all available fields |
| **[PAGE_IMPORT_TEMPLATE_GOOGLE_SHEETS.csv](PAGE_IMPORT_TEMPLATE_GOOGLE_SHEETS.csv)** | Ready-to-use CSV template with sample data | Start your Google Sheets import |
| **[GOOGLE_SHEETS_MASS_GENERATION_GUIDE.md](GOOGLE_SHEETS_MASS_GENERATION_GUIDE.md)** | Step-by-step Google Sheets guide | Setting up mass generation workflow |
| **[AI_GENERATED_CONTENT_SECTIONS_REFERENCE.md](AI_GENERATED_CONTENT_SECTIONS_REFERENCE.md)** | All 12 AI content sections explained | Understanding what AI can generate |

---

## 🎯 What You Can Import

### Basic Page Info
- `slug` - URL path (auto-generated from state/city if empty)
- `title` - Page title (H1)
- `subtitle` - Subtitle under main title
- `excerpt` - Short description for listings

### SEO Fields (20+ fields)
- Meta tags: `metaTitle`, `metaDescription`, `metaKeywords`
- Open Graph: `ogTitle`, `ogDescription`, `ogImage`
- Twitter: `twitterTitle`, `twitterDesc`, `twitterImage`
- Advanced: `canonicalUrl`, `robots`, `hreflangTags`, `schemaMarkup`

### Custom Data Variables (50+ fields)
- Pricing: `avg_premium`, `min_premium`, `max_premium`
- Coverage: `min_coverage`, `full_coverage_avg`
- Statistics: `uninsured_rate`, `theft_rate`, `accident_rate`
- Top insurers: `top_insurer_1`, `top_insurer_1_rate`, etc.
- Location: `population`, `median_income`, `zip_codes`
- Discounts: Structured discount data

### AI-Generated Content (12 sections)
1. `intro` - Page introduction
2. `requirements` - Legal requirements
3. `faqs` - 5 Q&A pairs
4. `tips` - 7 money-saving tips
5. `costBreakdown` - Pricing factors
6. `comparison` - 3-5 provider comparisons
7. `discounts` - Available discounts
8. `localStats` - Location statistics
9. `coverageGuide` - Coverage types explained
10. `claimsProcess` - How to file claims
11. `buyersGuide` - Purchasing guide
12. `metaTags` - SEO meta information

### Page Builder Content
- 50+ component types (Hero, Content, CTA, Forms, etc.)
- Pre-configured section layouts
- Component props and styling

### Advanced Fields
- `customCss` - Page-specific CSS
- `customJs` - Page-specific JavaScript
- `schemaMarkup` - JSON-LD structured data
- `breadcrumbs` - Custom breadcrumb navigation
- `preloadImages` - Performance optimization
- `showAds` - Ad display control

---

## 🚀 Quick Start (3 Options)

### Option 1: Minimal Import (Fastest)
**Fields needed**: `slug`, `title`, `state`, `city`, `insuranceType`, `isPublished`

```csv
slug,title,state,city,insuranceType,isPublished
car-insurance/california/los-angeles,Cheapest Car Insurance in Los Angeles,California,Los Angeles,car-insurance,true
```

Then use Admin Panel → AI Content → Auto-Generate to fill the rest.

### Option 2: SEO-Ready Import (Recommended)
**Fields needed**: 15-20 fields including meta tags and custom data

Use template: [PAGE_IMPORT_TEMPLATE_GOOGLE_SHEETS.csv](PAGE_IMPORT_TEMPLATE_GOOGLE_SHEETS.csv)

### Option 3: Complete Custom Import (Maximum Control)
**Fields needed**: All 95+ fields for full customization

Use schema: [COMPLETE_PAGE_IMPORT_SCHEMA.json](COMPLETE_PAGE_IMPORT_SCHEMA.json)

---

## 📊 Google Sheets Workflow

### Step 1: Copy Template
1. Download [PAGE_IMPORT_TEMPLATE_GOOGLE_SHEETS.csv](PAGE_IMPORT_TEMPLATE_GOOGLE_SHEETS.csv)
2. Import to Google Sheets: File → Import → Upload

### Step 2: Generate Data
Use formulas to auto-generate content:
```excel
// Auto-generate slug
="car-insurance/"&LOWER(SUBSTITUTE(B2," ","-"))&"/"&LOWER(SUBSTITUTE(D2," ","-"))

// Auto-generate title
="Cheapest Car Insurance in "&D2&", "&B2

// Auto-generate meta title (60 chars max)
=LEFT("Cheapest Car Insurance in "&D2&", "&C2&" | Save $500+",60)
```

### Step 3: AI Generation (Optional)
Use Google Apps Script to generate AI content:
```javascript
// See GOOGLE_SHEETS_MASS_GENERATION_GUIDE.md for full script
function generateAIContent() {
  // Generates intro, FAQs, tips using OpenRouter API
}
```

### Step 4: Export & Import
1. File → Download → CSV
2. Import via Admin Panel or API

---

## 🔌 API Endpoints

### Create Single Page
```bash
POST /api/pages
Content-Type: application/json

{
  "insuranceTypeId": "uuid",
  "geoLevel": "CITY",
  "stateId": "uuid",
  "cityId": "uuid",
  "heroTitle": "...",
  "heroSubtitle": "...",
  "metaTitle": "...",
  "metaDescription": "...",
  "isPublished": true
}
```

### Bulk Create Pages (CSV/JSON)
```bash
POST /api/pages/bulk
Content-Type: application/json

{
  "templateId": "car",
  "data": [
    { "state": "California", "city": "Los Angeles", "avg_premium": "$1,847/year" },
    { "state": "California", "city": "San Diego", "avg_premium": "$1,523/year" }
  ]
}
```

### Bulk Update Pages
```bash
POST /api/pages/bulk-update
Content-Type: application/json

{
  "filters": { "state": "California" },
  "updates": { "avg_premium": "$1,900/year" }
}
```

### AI Generate Content
```bash
POST /api/ai-generate
Content-Type: application/json

{
  "pageData": {
    "slug": "car-insurance/california/los-angeles",
    "insuranceType": "car",
    "state": "California",
    "city": "Los Angeles"
  },
  "sections": ["intro", "faqs", "tips", "metaTags"],
  "forceFreeModels": true
}
```

---

## 📁 File Descriptions

### COMPLETE_PAGE_IMPORT_SCHEMA.json
Full JSON structure showing all available fields with examples:
- 19 main sections
- 100+ individual fields
- Sample data for Los Angeles car insurance page
- AI-generated content examples
- Schema markup examples

### PAGE_IMPORT_TEMPLATE_GOOGLE_SHEETS.csv
Ready-to-use CSV with:
- Header row with all column names
- 3 sample rows (Los Angeles, San Diego, San Francisco)
- Realistic sample data
- Import-ready format

### GOOGLE_SHEETS_MASS_GENERATION_GUIDE.md
Comprehensive guide covering:
- Setting up Google Sheets formulas
- Google Apps Script for AI generation
- Batch processing 1000s of pages
- Export to various formats
- Import to website

### AI_GENERATED_CONTENT_SECTIONS_REFERENCE.md
Detailed reference for AI content:
- All 12 AI section types explained
- Example outputs for each section
- CSV field mappings
- API usage examples
- Content quality scoring

---

## 💡 Best Practices

### For Slugs
- Format: `{insurance-type}/{state}` or `{insurance-type}/{state}/{city}`
- Lowercase only
- Use hyphens for spaces
- Example: `car-insurance/california/los-angeles`

### For SEO
- Meta title: 50-60 characters
- Meta description: 150-160 characters
- Include primary keyword: "cheapest {type} in {location}"
- Use unique content for each page

### For AI Generation
- Provide `avg_premium`, `min_coverage` for accurate content
- Include city name for local context
- Use `forceFreeModels: true` to save money
- Review AI output before publishing

### For Performance
- Batch imports in groups of 50-100 pages
- Use `isPublished: false` for draft review
- Enable `showAds: true` for monetization
- Add `preloadImages` for key assets

---

## 🎓 Example Workflows

### Workflow 1: 50 State Pages
1. Create Google Sheet with 50 states
2. Use formulas to generate titles, slugs, meta tags
3. Export to CSV
4. Import via `/api/pages/bulk`
5. Use AI Content → Bulk Generate for intros, FAQs

### Workflow 2: 500 City Pages
1. Get list of top 10 cities per state (500 total)
2. Create Google Sheet with city data
3. Use Apps Script to generate AI content
4. Import in batches of 100
5. Schedule regular AI content refreshes

### Workflow 3: Monthly Updates
1. Export existing pages via API
2. Update pricing data in spreadsheet
3. Use Bulk Update API to refresh all pages
4. Re-generate AI content for updated pages
5. Monitor rankings and adjust

---

## 🆘 Troubleshooting

### Slug Already Exists
- Check for duplicates in your CSV
- Verify no existing page has the same slug
- Use unique slugs for each page

### State/City Not Found
- Ensure exact name match with database
- Check spelling and capitalization
- Verify state/city exists in admin panel

### AI Generation Fails
- Check API key and rate limits
- Add delays between requests (1 second)
- Use `forceFreeModels: true`
- Retry failed pages individually

### Import Errors
- Validate JSON/CSV format
- Check required fields are present
- Verify data types match schema
- Review error messages in response

---

## 📞 Support Resources

- Admin Panel: `https://myinsurancebuddies.com:3002/dashboard`
- API Documentation: Check `/api/pages/bulk` GET endpoint
- AI Content Testing: Admin → AI Content → Test Generation
- Database Schema: See `packages/db/prisma/schema.prisma`

---

## 📝 License & Usage

These templates and schemas are for use with the myinsurancebuddies.com platform.
Modify and distribute as needed for your own projects.
