# Insurance SEO Content Generator

AI-powered tool to generate unique, SEO-optimized content for location-based insurance pages.

## Features

- 🤖 **Multi-AI Support**: Works with OpenRouter (access to 100+ models), OpenAI GPT, and Google Gemini
- 📍 **Location-Specific**: Generates unique content for each state and city
- 💾 **Resume Support**: Can resume from where it stopped if interrupted
- ⏱️ **Rate Limiting**: Built-in delays to avoid API limits
- 📊 **CSV Output**: Ready for import into your admin panel

## Quick Start

### 1. Install Dependencies

```bash
cd scripts
npm install
```

### 2. Configure API Key

The `.env` file has been created with your OpenRouter API key. You can modify it to use different models:

```bash
# Available free models on OpenRouter:
# - meta-llama/llama-3.3-70b-instruct:free (currently configured)
# - google/gemini-2.0-flash-exp:free
# - mistralai/mistral-7b-instruct:free
```

### 3. Run the Generator

```bash
# Generate content for all states and cities
npm run generate

# Or run directly
node ai-seo-content-generator.js
```

### 4. Output

Generated content is saved to:
- `output/states_content.csv` - Content for all states
- `output/cities_content.csv` - Content for all cities
- `output/progress.json` - Progress tracking (for resume support)

## Input Data

Place your location data in the `data/` directory:

### states.csv
```csv
country_code,name,slug,code
us,California,california,CA
us,Texas,texas,TX
```

### cities.csv
```csv
country_code,state_slug,name,slug,population
us,california,Los Angeles,los-angeles,3900000
us,texas,Houston,houston,2320000
```

## Generated Content

For each location, the script generates:

| Field | Description |
|-------|-------------|
| `meta_title` | 60 char SEO title |
| `meta_description` | 155 char meta description |
| `h1_title` | Page heading |
| `hero_subtitle` | Hero section subtitle |
| `intro_content` | 2-3 paragraph introduction |
| `key_points` | 4-5 bullet points |
| `local_factors` | Location-specific factors |
| `neighborhood_tips` | (Cities only) Neighborhood advice |
| `cta_text` | Call-to-action text |
| `faq_questions` | 3 FAQs with answers |

## Resume from Interruption

If the script is interrupted, just run it again. It will:
1. Check `output/progress.json` for completed items
2. Skip already-generated content
3. Continue from where it stopped

To start fresh, delete the progress file:
```bash
rm output/progress.json
```

## Rate Limits

The script uses 5-second delays between requests for the free tier. For faster processing:

1. Get a paid API tier
2. Update `.env` with your preferred model
3. Reduce `delayBetweenRequests` in the script

## Customization

Edit the script to customize:
- `CONFIG.insuranceType` - Change from "car insurance" to any type
- `CONFIG.brandName` - Your brand name
- Prompt templates in `PROMPTS` object

## Scripts Reference

```bash
npm run generate        # Run AI content generator
npm run generate:openai # Use OpenAI
npm run generate:gemini # Use Gemini directly
npm run scrape          # Original chatbot scraper
```
