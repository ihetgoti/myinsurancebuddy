/**
 * Enhanced Car Insurance SEO Content Generator
 * 
 * Generates unique, informative car insurance content for each US state and city.
 * Features:
 * - State-specific minimum requirements
 * - Top insurers with placeholder rates
 * - Local factors (traffic, weather, crime, etc.)
 * - Unique FAQs per location
 * - Maximum content uniqueness
 * 
 * Usage: node car-insurance-generator.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    aiProvider: process.env.AI_PROVIDER || 'openrouter',
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
    openrouterModel: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',

    // Input files
    statesFile: './data/states.csv',
    citiesFile: './data/cities.csv',

    // Output files
    outputDir: './output/car-insurance',
    statesOutputFile: './output/car-insurance/states_content.csv',
    citiesOutputFile: './output/car-insurance/cities_content.csv',
    progressFile: './output/car-insurance/progress.json',

    // Rate limiting (increased for free tier)
    delayBetweenRequests: 8000, // 8 seconds to avoid rate limits
    maxRetries: 3,
    retryDelay: 10000, // 10 second retry delay
    batchSize: 5,

    // Fixed affiliate fallback URL
    defaultAffiliateUrl: '/get-quote',

    // Brand
    brandName: 'MyInsuranceBuddies',
};

// ============================================
// TOP INSURERS DATA (Static, used across all pages)
// ============================================

const TOP_INSURERS = [
    { name: 'GEICO', slug: 'geico', bestFor: 'Low rates for good drivers', rating: '4.5' },
    { name: 'Progressive', slug: 'progressive', bestFor: 'Usage-based discounts', rating: '4.3' },
    { name: 'State Farm', slug: 'state-farm', bestFor: 'Local agent support', rating: '4.6' },
    { name: 'USAA', slug: 'usaa', bestFor: 'Military families', rating: '4.8' },
    { name: 'Allstate', slug: 'allstate', bestFor: 'Bundling options', rating: '4.2' },
    { name: 'Liberty Mutual', slug: 'liberty-mutual', bestFor: 'Customizable coverage', rating: '4.0' },
    { name: 'Nationwide', slug: 'nationwide', bestFor: 'Accident forgiveness', rating: '4.1' },
    { name: 'Farmers', slug: 'farmers', bestFor: 'New drivers', rating: '4.0' },
];

// ============================================
// STATE MINIMUM REQUIREMENTS (Factual Data)
// ============================================

const STATE_REQUIREMENTS = {
    'alabama': { bodily: '25/50', property: '25', format: '25/50/25', tort: true, noFault: false, pip: false, um: false },
    'alaska': { bodily: '50/100', property: '25', format: '50/100/25', tort: true, noFault: false, pip: false, um: false },
    'arizona': { bodily: '25/50', property: '15', format: '25/50/15', tort: true, noFault: false, pip: false, um: false },
    'arkansas': { bodily: '25/50', property: '25', format: '25/50/25', tort: true, noFault: false, pip: false, um: false },
    'california': { bodily: '15/30', property: '5', format: '15/30/5', tort: true, noFault: false, pip: false, um: false },
    'colorado': { bodily: '25/50', property: '15', format: '25/50/15', tort: true, noFault: false, pip: false, um: false },
    'connecticut': { bodily: '25/50', property: '25', format: '25/50/25', tort: true, noFault: false, pip: false, um: true },
    'delaware': { bodily: '25/50', property: '10', format: '25/50/10', tort: true, noFault: false, pip: true, um: false },
    'florida': { bodily: '25/50', property: '10', format: '25/50/10', tort: false, noFault: true, pip: true, um: false },
    'georgia': { bodily: '25/50', property: '25', format: '25/50/25', tort: true, noFault: false, pip: false, um: false },
    'hawaii': { bodily: '20/40', property: '10', format: '20/40/10', tort: false, noFault: true, pip: true, um: false },
    'idaho': { bodily: '25/50', property: '15', format: '25/50/15', tort: true, noFault: false, pip: false, um: false },
    'illinois': { bodily: '25/50', property: '20', format: '25/50/20', tort: true, noFault: false, pip: false, um: true },
    'indiana': { bodily: '25/50', property: '25', format: '25/50/25', tort: true, noFault: false, pip: false, um: false },
    'iowa': { bodily: '20/40', property: '15', format: '20/40/15', tort: true, noFault: false, pip: false, um: false },
    'kansas': { bodily: '25/50', property: '25', format: '25/50/25', tort: false, noFault: true, pip: true, um: false },
    'kentucky': { bodily: '25/50', property: '25', format: '25/50/25', tort: false, noFault: true, pip: true, um: false },
    'louisiana': { bodily: '15/30', property: '25', format: '15/30/25', tort: true, noFault: false, pip: false, um: false },
    'maine': { bodily: '50/100', property: '25', format: '50/100/25', tort: true, noFault: false, pip: false, um: true },
    'maryland': { bodily: '30/60', property: '15', format: '30/60/15', tort: true, noFault: false, pip: true, um: true },
    'massachusetts': { bodily: '20/40', property: '5', format: '20/40/5', tort: false, noFault: true, pip: true, um: true },
    'michigan': { bodily: '50/100', property: '10', format: '50/100/10', tort: false, noFault: true, pip: true, um: false },
    'minnesota': { bodily: '30/60', property: '10', format: '30/60/10', tort: false, noFault: true, pip: true, um: true },
    'mississippi': { bodily: '25/50', property: '25', format: '25/50/25', tort: true, noFault: false, pip: false, um: false },
    'missouri': { bodily: '25/50', property: '25', format: '25/50/25', tort: true, noFault: false, pip: false, um: true },
    'montana': { bodily: '25/50', property: '20', format: '25/50/20', tort: true, noFault: false, pip: false, um: false },
    'nebraska': { bodily: '25/50', property: '25', format: '25/50/25', tort: true, noFault: false, pip: false, um: true },
    'nevada': { bodily: '25/50', property: '20', format: '25/50/20', tort: true, noFault: false, pip: false, um: false },
    'new-hampshire': { bodily: '25/50', property: '25', format: '25/50/25', tort: true, noFault: false, pip: false, um: false, noRequirement: true },
    'new-jersey': { bodily: '15/30', property: '5', format: '15/30/5', tort: false, noFault: true, pip: true, um: false },
    'new-mexico': { bodily: '25/50', property: '10', format: '25/50/10', tort: true, noFault: false, pip: false, um: false },
    'new-york': { bodily: '25/50', property: '10', format: '25/50/10', tort: false, noFault: true, pip: true, um: true },
    'north-carolina': { bodily: '30/60', property: '25', format: '30/60/25', tort: true, noFault: false, pip: false, um: false },
    'north-dakota': { bodily: '25/50', property: '25', format: '25/50/25', tort: false, noFault: true, pip: true, um: true },
    'ohio': { bodily: '25/50', property: '25', format: '25/50/25', tort: true, noFault: false, pip: false, um: false },
    'oklahoma': { bodily: '25/50', property: '25', format: '25/50/25', tort: true, noFault: false, pip: false, um: true },
    'oregon': { bodily: '25/50', property: '20', format: '25/50/20', tort: true, noFault: false, pip: true, um: true },
    'pennsylvania': { bodily: '15/30', property: '5', format: '15/30/5', tort: false, noFault: true, pip: true, um: false },
    'rhode-island': { bodily: '25/50', property: '25', format: '25/50/25', tort: true, noFault: false, pip: false, um: false },
    'south-carolina': { bodily: '25/50', property: '25', format: '25/50/25', tort: true, noFault: false, pip: false, um: true },
    'south-dakota': { bodily: '25/50', property: '25', format: '25/50/25', tort: true, noFault: false, pip: false, um: true },
    'tennessee': { bodily: '25/50', property: '15', format: '25/50/15', tort: true, noFault: false, pip: false, um: false },
    'texas': { bodily: '30/60', property: '25', format: '30/60/25', tort: true, noFault: false, pip: false, um: false },
    'utah': { bodily: '25/65', property: '15', format: '25/65/15', tort: false, noFault: true, pip: true, um: false },
    'vermont': { bodily: '25/50', property: '10', format: '25/50/10', tort: true, noFault: false, pip: false, um: true },
    'virginia': { bodily: '30/60', property: '20', format: '30/60/20', tort: true, noFault: false, pip: false, um: true },
    'washington': { bodily: '25/50', property: '10', format: '25/50/10', tort: true, noFault: false, pip: true, um: false },
    'west-virginia': { bodily: '25/50', property: '25', format: '25/50/25', tort: true, noFault: false, pip: false, um: true },
    'wisconsin': { bodily: '25/50', property: '10', format: '25/50/10', tort: true, noFault: false, pip: false, um: true },
    'wyoming': { bodily: '25/50', property: '20', format: '25/50/20', tort: true, noFault: false, pip: false, um: false },
    'district-of-columbia': { bodily: '25/50', property: '10', format: '25/50/10', tort: true, noFault: false, pip: false, um: true },
};

// ============================================
// AI PROMPTS
// ============================================

const PROMPTS = {
    stateContent: (stateName, stateCode, requirements) => `
You are an expert car insurance content writer. Generate unique, helpful content for a car insurance page targeting ${stateName} (${stateCode}).

FACTUAL DATA TO INCLUDE (use exactly):
- Minimum liability: $${requirements.bodily.split('/')[0]},000 per person / $${requirements.bodily.split('/')[1]},000 per accident
- Property damage: $${requirements.property},000
- Coverage format: ${requirements.format}
- System: ${requirements.noFault ? 'No-fault state' : 'At-fault (tort) state'}
${requirements.pip ? '- PIP coverage: Required' : ''}
${requirements.um ? '- Uninsured motorist coverage: Required' : ''}

Generate UNIQUE content in this JSON format:
{
  "metaTitle": "60 char max, include '${stateName}' and 'Car Insurance'",
  "metaDescription": "155 char max, compelling with CTA",
  "h1Title": "Engaging H1 for ${stateName} car insurance page",
  "heroTagline": "Short benefit-focused tagline (8-12 words)",
  "heroDescription": "2-3 sentences about finding car insurance in ${stateName}",
  
  "introParagraph1": "Opening paragraph about car insurance landscape in ${stateName}, mention unique state characteristics",
  "introParagraph2": "Paragraph about state requirements and why coverage matters in ${stateName}",
  "introParagraph3": "Paragraph about how to find the best rates in ${stateName}",
  
  "stateInsights": {
    "uniqueChallenge": "One unique driving/insurance challenge in ${stateName}",
    "savingOpportunity": "One specific way ${stateName} drivers can save",
    "commonMistake": "One mistake ${stateName} drivers make with insurance"
  },
  
  "localFactors": [
    {"factor": "Traffic", "impact": "How ${stateName} traffic affects rates", "tip": "Actionable tip"},
    {"factor": "Weather", "impact": "Weather-related risks in ${stateName}", "tip": "Actionable tip"},
    {"factor": "Crime", "impact": "Vehicle theft/vandalism rates", "tip": "Actionable tip"},
    {"factor": "Population", "impact": "Urban/rural rate differences", "tip": "Actionable tip"}
  ],
  
  "coverageTips": [
    "Specific tip 1 for ${stateName} drivers",
    "Specific tip 2 for ${stateName} drivers",
    "Specific tip 3 for ${stateName} drivers",
    "Specific tip 4 for ${stateName} drivers",
    "Specific tip 5 for ${stateName} drivers"
  ],
  
  "discountsList": [
    {"name": "Good Driver", "description": "How to qualify in ${stateName}", "savings": "Up to 25%"},
    {"name": "Multi-Policy", "description": "Bundle home/auto savings", "savings": "Up to 20%"},
    {"name": "Safety Features", "description": "Airbags, anti-theft, etc.", "savings": "Up to 15%"},
    {"name": "Low Mileage", "description": "For drivers under 10,000 miles/year", "savings": "Up to 10%"}
  ],
  
  "faqs": [
    {"question": "What are ${stateName}'s minimum car insurance requirements?", "answer": "Detailed answer with the exact minimums"},
    {"question": "How much does car insurance cost in ${stateName}?", "answer": "Answer about factors affecting cost, avoid specific dollar amounts"},
    {"question": "Is ${stateName} a no-fault or at-fault state?", "answer": "Explain what this means for ${stateName} drivers"},
    {"question": "What discounts are available for ${stateName} drivers?", "answer": "List common discounts"},
    {"question": "How can I lower my car insurance in ${stateName}?", "answer": "Practical tips"}
  ],
  
  "ctaText": "Compare ${stateName} Car Insurance Quotes",
  "ctaSubtext": "Find the best rates from top insurers in minutes"
}

IMPORTANT:
- Make ALL content unique to ${stateName} - reference local characteristics
- Include state-specific insights, not generic advice
- Be informative and helpful, not salesy
- Return ONLY valid JSON, no markdown
`,

    cityContent: (cityName, stateName, stateCode, population, requirements) => `
You are an expert car insurance content writer. Generate unique, helpful content for a car insurance page targeting ${cityName}, ${stateName} (${stateCode}).

${population ? `City population: approximately ${parseInt(population).toLocaleString()}` : ''}

STATE CONTEXT:
- State minimum liability: ${requirements.format}
- System: ${requirements.noFault ? 'No-fault' : 'At-fault'} state

Generate UNIQUE content in this JSON format:
{
  "metaTitle": "60 char max, include '${cityName}' and 'Car Insurance'",
  "metaDescription": "155 char max, compelling with CTA for ${cityName} residents",
  "h1Title": "Engaging H1 for ${cityName} car insurance page",
  "heroTagline": "Short benefit-focused tagline for ${cityName} drivers (8-12 words)",
  "heroDescription": "2-3 sentences about finding car insurance in ${cityName}",
  
  "introParagraph1": "Opening paragraph about driving and insurance in ${cityName}, mention local characteristics",
  "introParagraph2": "Paragraph about local factors that affect insurance rates in ${cityName}",
  "introParagraph3": "Paragraph about finding the best coverage for ${cityName} residents",
  
  "cityInsights": {
    "uniqueChallenge": "One unique driving challenge specific to ${cityName}",
    "localTip": "One insider tip for ${cityName} drivers",
    "areaToWatch": "High-rate area or factor to be aware of"
  },
  
  "localFactors": [
    {"factor": "Traffic Corridors", "impact": "Specific roads/areas with heavy traffic in ${cityName}", "tip": "How this affects rates"},
    {"factor": "Neighborhoods", "impact": "How different ${cityName} neighborhoods affect rates", "tip": "What to consider"},
    {"factor": "Commute", "impact": "Average commute impact on insurance", "tip": "Mileage-based savings"},
    {"factor": "Parking", "impact": "Street vs garage parking differences", "tip": "How to reduce risk"}
  ],
  
  "neighborhoodGuide": "2-3 sentences about how different neighborhoods in ${cityName} can affect your car insurance rates",
  
  "drivingTips": [
    "Specific driving tip 1 for ${cityName}",
    "Specific driving tip 2 for ${cityName}",
    "Specific driving tip 3 for ${cityName}"
  ],
  
  "faqs": [
    {"question": "Why is car insurance expensive in ${cityName}?", "answer": "Explain local factors"},
    {"question": "What's the best car insurance for ${cityName} drivers?", "answer": "Criteria to consider, not specific companies"},
    {"question": "How does my ${cityName} neighborhood affect rates?", "answer": "Explain ZIP code rating"},
    {"question": "Are there discounts for ${cityName} commuters?", "answer": "Mileage and usage discounts"}
  ],
  
  "ctaText": "Get Your ${cityName} Car Insurance Quote",
  "ctaSubtext": "Compare rates from top insurers in ${cityName}"
}

IMPORTANT:
- Make ALL content unique to ${cityName} - reference local landmarks, roads, neighborhoods if possible
- Include city-specific insights, not generic state-level advice
- Be informative and helpful
- Return ONLY valid JSON, no markdown
`,
};

// ============================================
// API CALL
// ============================================

async function callOpenRouter(prompt) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.openrouterApiKey}`,
            'HTTP-Referer': 'https://myinsurancebuddies.com',
            'X-Title': 'Car Insurance Content Generator',
        },
        body: JSON.stringify({
            model: CONFIG.openrouterModel,
            messages: [
                { role: 'system', content: 'You are an SEO content expert specializing in car insurance. Always respond with valid JSON only. Do not include markdown code blocks.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 3000,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// ============================================
// HELPERS
// ============================================

function parseJSON(text) {
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
    if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
    if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
    return JSON.parse(cleaned.trim());
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function loadProgress() {
    try {
        if (fs.existsSync(CONFIG.progressFile)) {
            return JSON.parse(fs.readFileSync(CONFIG.progressFile, 'utf8'));
        }
    } catch (e) { }
    return { completedStates: [], completedCities: [] };
}

function saveProgress(progress) {
    fs.writeFileSync(CONFIG.progressFile, JSON.stringify(progress, null, 2));
}

function loadCSV(filePath) {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf8');
    return parse(content, { columns: true, skip_empty_lines: true, trim: true });
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function appendToCSV(filePath, data, headers) {
    const exists = fs.existsSync(filePath);
    const csvContent = stringify([data], { header: !exists, columns: headers });
    fs.appendFileSync(filePath, csvContent);
}

// ============================================
// CONTENT GENERATION
// ============================================

async function generateStateContent(state, retryCount = 0) {
    const stateName = state.name;
    const stateCode = state.code || '';
    const stateSlug = state.slug || stateName.toLowerCase().replace(/\s+/g, '-');
    const requirements = STATE_REQUIREMENTS[stateSlug] || STATE_REQUIREMENTS['california'];

    console.log(`\n📍 Generating: ${stateName} (${stateCode})`);

    try {
        const prompt = PROMPTS.stateContent(stateName, stateCode, requirements);
        const response = await callOpenRouter(prompt);
        const content = parseJSON(response);

        return {
            // Identifiers
            state_name: stateName,
            state_code: stateCode,
            state_slug: stateSlug,
            country_code: 'us',
            insurance_type: 'car-insurance',

            // Requirements (factual)
            min_liability_bodily: requirements.bodily,
            min_liability_property: requirements.property,
            coverage_format: requirements.format,
            is_no_fault: requirements.noFault,
            is_tort: requirements.tort,
            pip_required: requirements.pip,
            um_required: requirements.um,

            // SEO
            meta_title: content.metaTitle || '',
            meta_description: content.metaDescription || '',

            // Hero
            h1_title: content.h1Title || '',
            hero_tagline: content.heroTagline || '',
            hero_description: content.heroDescription || '',

            // Content
            intro_paragraph_1: content.introParagraph1 || '',
            intro_paragraph_2: content.introParagraph2 || '',
            intro_paragraph_3: content.introParagraph3 || '',

            // State Insights
            state_insights: JSON.stringify(content.stateInsights || {}),

            // Local Factors
            local_factors: JSON.stringify(content.localFactors || []),

            // Tips & Discounts
            coverage_tips: JSON.stringify(content.coverageTips || []),
            discounts_list: JSON.stringify(content.discountsList || []),

            // Top Insurers (static)
            top_insurers: JSON.stringify(TOP_INSURERS.slice(0, 6)),

            // FAQs
            faqs: JSON.stringify(content.faqs || []),

            // CTA
            cta_text: content.ctaText || `Compare ${stateName} Car Insurance`,
            cta_subtext: content.ctaSubtext || 'Find the best rates in minutes',
            cta_url: CONFIG.defaultAffiliateUrl,

            // Meta
            generated_at: new Date().toISOString(),
            status: 'success',
        };
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        if (retryCount < CONFIG.maxRetries) {
            console.log(`🔄 Retry ${retryCount + 1}/${CONFIG.maxRetries}...`);
            await sleep(CONFIG.retryDelay);
            return generateStateContent(state, retryCount + 1);
        }
        return createErrorRecord(stateName, stateCode, stateSlug, error.message);
    }
}

async function generateCityContent(city, stateInfo, retryCount = 0) {
    const cityName = city.name;
    const citySlug = city.slug || cityName.toLowerCase().replace(/\s+/g, '-');
    const stateSlug = city.state_slug || '';
    const requirements = STATE_REQUIREMENTS[stateSlug] || STATE_REQUIREMENTS['california'];

    console.log(`\n🏙️ Generating: ${cityName}, ${stateInfo.name}`);

    try {
        const prompt = PROMPTS.cityContent(cityName, stateInfo.name, stateInfo.code, city.population, requirements);
        const response = await callOpenRouter(prompt);
        const content = parseJSON(response);

        return {
            // Identifiers
            city_name: cityName,
            city_slug: citySlug,
            state_name: stateInfo.name,
            state_code: stateInfo.code,
            state_slug: stateSlug,
            country_code: 'us',
            insurance_type: 'car-insurance',
            population: city.population || '',

            // SEO
            meta_title: content.metaTitle || '',
            meta_description: content.metaDescription || '',

            // Hero
            h1_title: content.h1Title || '',
            hero_tagline: content.heroTagline || '',
            hero_description: content.heroDescription || '',

            // Content
            intro_paragraph_1: content.introParagraph1 || '',
            intro_paragraph_2: content.introParagraph2 || '',
            intro_paragraph_3: content.introParagraph3 || '',

            // City Insights
            city_insights: JSON.stringify(content.cityInsights || {}),

            // Local Factors
            local_factors: JSON.stringify(content.localFactors || []),

            // Neighborhood Guide
            neighborhood_guide: content.neighborhoodGuide || '',

            // Tips
            driving_tips: JSON.stringify(content.drivingTips || []),

            // Top Insurers (static)
            top_insurers: JSON.stringify(TOP_INSURERS.slice(0, 6)),

            // FAQs
            faqs: JSON.stringify(content.faqs || []),

            // CTA
            cta_text: content.ctaText || `Get ${cityName} Car Insurance Quotes`,
            cta_subtext: content.ctaSubtext || 'Compare rates from top insurers',
            cta_url: CONFIG.defaultAffiliateUrl,

            // Meta
            generated_at: new Date().toISOString(),
            status: 'success',
        };
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        if (retryCount < CONFIG.maxRetries) {
            console.log(`🔄 Retry ${retryCount + 1}/${CONFIG.maxRetries}...`);
            await sleep(CONFIG.retryDelay);
            return generateCityContent(city, stateInfo, retryCount + 1);
        }
        return createCityErrorRecord(cityName, citySlug, stateInfo, error.message);
    }
}

function createErrorRecord(stateName, stateCode, stateSlug, errorMsg) {
    return {
        state_name: stateName, state_code: stateCode, state_slug: stateSlug,
        country_code: 'us', insurance_type: 'car-insurance',
        status: `error: ${errorMsg}`, generated_at: new Date().toISOString(),
    };
}

function createCityErrorRecord(cityName, citySlug, stateInfo, errorMsg) {
    return {
        city_name: cityName, city_slug: citySlug,
        state_name: stateInfo.name, state_code: stateInfo.code, state_slug: stateInfo.slug,
        country_code: 'us', insurance_type: 'car-insurance',
        status: `error: ${errorMsg}`, generated_at: new Date().toISOString(),
    };
}

// ============================================
// MAIN
// ============================================

async function main() {
    console.log('🚗 Car Insurance Content Generator');
    console.log('===================================\n');

    if (!CONFIG.openrouterApiKey) {
        console.error('❌ OPENROUTER_API_KEY not set in .env');
        process.exit(1);
    }

    ensureDir(CONFIG.outputDir);

    const progress = loadProgress();
    const states = loadCSV(CONFIG.statesFile);
    const cities = loadCSV(CONFIG.citiesFile);

    console.log(`📁 Loaded ${states.length} states, ${cities.length} cities`);
    console.log(`📊 Progress: ${progress.completedStates.length} states, ${progress.completedCities.length} cities done\n`);

    // Headers
    const stateHeaders = [
        'state_name', 'state_code', 'state_slug', 'country_code', 'insurance_type',
        'min_liability_bodily', 'min_liability_property', 'coverage_format',
        'is_no_fault', 'is_tort', 'pip_required', 'um_required',
        'meta_title', 'meta_description', 'h1_title', 'hero_tagline', 'hero_description',
        'intro_paragraph_1', 'intro_paragraph_2', 'intro_paragraph_3',
        'state_insights', 'local_factors', 'coverage_tips', 'discounts_list',
        'top_insurers', 'faqs', 'cta_text', 'cta_subtext', 'cta_url',
        'generated_at', 'status'
    ];

    const cityHeaders = [
        'city_name', 'city_slug', 'state_name', 'state_code', 'state_slug', 'country_code',
        'insurance_type', 'population',
        'meta_title', 'meta_description', 'h1_title', 'hero_tagline', 'hero_description',
        'intro_paragraph_1', 'intro_paragraph_2', 'intro_paragraph_3',
        'city_insights', 'local_factors', 'neighborhood_guide', 'driving_tips',
        'top_insurers', 'faqs', 'cta_text', 'cta_subtext', 'cta_url',
        'generated_at', 'status'
    ];

    // State map
    const stateMap = new Map();
    states.forEach(s => {
        stateMap.set(s.slug, { name: s.name, code: s.code, slug: s.slug });
    });

    // Process States
    if (states.length > 0) {
        console.log('\n📍 GENERATING STATE CONTENT\n');
        if (progress.completedStates.length === 0 && fs.existsSync(CONFIG.statesOutputFile)) {
            fs.unlinkSync(CONFIG.statesOutputFile);
        }

        for (let i = 0; i < states.length; i++) {
            const state = states[i];
            if (progress.completedStates.includes(state.slug)) {
                console.log(`⏭️ Skip: ${state.name}`);
                continue;
            }

            const content = await generateStateContent(state);
            appendToCSV(CONFIG.statesOutputFile, content, stateHeaders);
            console.log(`✅ Saved: ${state.name}`);

            progress.completedStates.push(state.slug);
            if ((i + 1) % CONFIG.batchSize === 0) saveProgress(progress);
            if (i < states.length - 1) await sleep(CONFIG.delayBetweenRequests);
        }
        saveProgress(progress);
    }

    // Process Cities
    if (cities.length > 0) {
        console.log('\n\n🏙️ GENERATING CITY CONTENT\n');
        if (progress.completedCities.length === 0 && fs.existsSync(CONFIG.citiesOutputFile)) {
            fs.unlinkSync(CONFIG.citiesOutputFile);
        }

        for (let i = 0; i < cities.length; i++) {
            const city = cities[i];
            const cityKey = `${city.state_slug}-${city.slug}`;
            if (progress.completedCities.includes(cityKey)) {
                console.log(`⏭️ Skip: ${city.name}`);
                continue;
            }

            const stateInfo = stateMap.get(city.state_slug) || { name: city.state_slug, code: '', slug: city.state_slug };
            const content = await generateCityContent(city, stateInfo);
            appendToCSV(CONFIG.citiesOutputFile, content, cityHeaders);
            console.log(`✅ Saved: ${city.name}, ${stateInfo.name}`);

            progress.completedCities.push(cityKey);
            if ((i + 1) % CONFIG.batchSize === 0) saveProgress(progress);
            if (i < cities.length - 1) await sleep(CONFIG.delayBetweenRequests);
        }
        saveProgress(progress);
    }

    console.log('\n\n🎉 COMPLETE!');
    console.log(`📁 States: ${CONFIG.statesOutputFile}`);
    console.log(`📁 Cities: ${CONFIG.citiesOutputFile}`);
}

main().catch(console.error);
