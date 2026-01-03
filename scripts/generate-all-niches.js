/**
 * Advanced Multi-Niche AI Content Generator (OpenRouter + Dual Model)
 * 
 * Features:
 * - OpenRouter API with Free Tier Models
 * - Dual Model: SEO Model + Content Model
 * - Parallel Execution with Global Rate Limiting
 * - Separate CSV outputs for States and Cities
 * - Load Balancing across 2 API Keys
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
    // OpenRouter API Keys (Round Robin)
    apiKeys: [
        process.env.OPENROUTER_API_KEY_1,
        process.env.OPENROUTER_API_KEY_2
    ].filter(k => k),

    // Models (OpenRouter format)
    // SEO Model: Fast for metadata
    seoModel: process.env.SEO_MODEL || 'kwaipilot/kat-coder-pro:free',
    // Content Model: Creative for paragraphs/FAQs
    contentModel: process.env.CONTENT_MODEL || 'xiaomi/mimo-v2-flash:free',

    // Concurrency (Global Limit)
    // Gemini free tier: 15 req/min per key, sequential is safest
    maxConcurrentRequests: parseInt(process.env.MAX_CONCURRENT_REQUESTS || '1'),

    // Data Sources
    statesFile: './data/states.csv',
    citiesFile: './data/cities.csv',
    outputBaseDir: './output-all-niches',

    // Site Info
    siteUrl: 'https://myinsurancebuddies.com',
    siteName: 'MyInsuranceBuddies',

    // Niches to Generate
    niches: [
        {
            slug: 'health-insurance',
            name: 'Health Insurance',
            description: 'Essential coverage for medical expenses, from routine check-ups to surgeries and hospital stays. Most Americans have coverage through an employer, the federal Health Insurance Marketplace (found at HealthCare.gov), or government programs like Medicare and Medicaid. The most common plan types are Preferred Provider Organization (PPO) and Health Maintenance Organization (HMO) plans.'
        },
        {
            slug: 'auto-insurance',
            name: 'Auto Insurance',
            description: 'Mandatory in almost every state, this provides financial protection against accidents, theft, and damage to your vehicle or property and injuries you cause to others.'
        },
        {
            slug: 'homeowners-insurance',
            name: 'Homeowners Insurance',
            description: 'Protects your home and personal belongings from damage or loss due to fire, natural disasters, theft, or vandalism. Homeowners insurance is typically required by mortgage lenders.'
        },
        {
            slug: 'life-insurance',
            name: 'Life Insurance',
            description: 'A contract that provides a lump sum of money (death benefit) to designated beneficiaries upon the insured person\'s death. The two primary types are Term life insurance (specific period) and Permanent life insurance (whole life with cash value).'
        },
        {
            slug: 'disability-insurance',
            name: 'Disability Insurance',
            description: 'Replaces a portion of your income if you become temporarily or permanently unable to work due to illness or injury.'
        },
        {
            slug: 'long-term-care-insurance',
            name: 'Long-Term Care Insurance',
            description: 'Helps cover the costs of services like in-home assistance, assisted living, or nursing home stays, which can be very expensive and are typically not covered by standard health insurance.'
        }
    ]
};

// ============================================
// STATE & UTILS
// ============================================

let apiKeyIndex = 0;
let activeRequests = 0;
const queue = [];

function getNextApiKey() {
    if (CONFIG.apiKeys.length === 0) throw new Error('No API Keys! Set OPENROUTER_API_KEY_1 and _2 in .env');
    const key = CONFIG.apiKeys[apiKeyIndex];
    apiKeyIndex = (apiKeyIndex + 1) % CONFIG.apiKeys.length;
    return key;
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Global Semaphore
async function runWithLimit(fn) {
    return new Promise((resolve, reject) => {
        const execute = async () => {
            activeRequests++;
            try {
                const result = await fn();
                resolve(result);
            } catch (err) {
                reject(err);
            } finally {
                activeRequests--;
                if (queue.length > 0) {
                    const next = queue.shift();
                    next();
                }
            }
        };

        if (activeRequests < CONFIG.maxConcurrentRequests) {
            execute();
        } else {
            queue.push(execute);
        }
    });
}

// Rate Limiting: 15 requests per minute per key (Gemini free tier)
// With 2 keys = 30 req/min, but sequential is safer
const RATE_LIMIT_DELAY = 4000; // 4 seconds between calls = 15/min safe
let lastRequestTime = 0;

async function rateLimitedRequest(fn) {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
        await sleep(RATE_LIMIT_DELAY - timeSinceLastRequest);
    }

    lastRequestTime = Date.now();
    return fn();
}

// ============================================
// PROMPT ENGINEERING (RICH CONTEXT)
// ============================================

function getSeoPrompt(niche, location, isCity) {
    const context = isCity
        ? `City: ${location.name}, State: ${location.state_name}`
        : `State: ${location.name}`;

    return `You are an expert SEO specialist for insurance websites.
Topic: ${niche.name}
Description: ${niche.description}
Target Location: ${context}

Generate SEO metadata for a landing page. Output valid JSON only (no markdown).

Required keys:
{
  "page_title": "SEO title, max 60 chars, include location and insurance type",
  "meta_title": "Same as page_title",
  "meta_description": "Compelling 155 char max description with CTA",
  "h1_title": "Main heading for the page",
  "page_subtitle": "Hero tagline, 1 sentence",
  "hero_tagline": "Short punchy text",
  "hero_description": "1-2 sentences value proposition"
}

Make it specific to ${location.name}. Be compelling and SEO-optimized.`;
}

function getContentPrompt(niche, location, isCity) {
    const context = isCity
        ? `City: ${location.name}, State: ${location.state_name}, Population: ${location.population || 'Unknown'}`
        : `State: ${location.name}`;

    return `You are an expert insurance copywriter creating detailed, helpful content.
Topic: ${niche.name}
Description: ${niche.description}
Target Location: ${context}

Generate comprehensive content for a landing page. Output valid JSON only (no markdown).

Required keys:
{
  "intro_paragraph_1": "Hook paragraph about ${niche.name} in ${location.name}",
  "intro_paragraph_2": "Value proposition paragraph",
  "intro_paragraph_3": "Local context and call to action",
  "avg_premium": "Estimated monthly cost (e.g. '$120/mo')",
  "avg_savings": "Potential savings (e.g. '$450/year')",
  "min_coverage": "State minimum requirements summary",
  "coverage_format": "Same as min_coverage",
  "bodily_injury_per_person": "e.g. '$25,000'",
  "bodily_injury_per_accident": "e.g. '$50,000'",
  "property_damage": "e.g. '$25,000'",
  "is_no_fault": true/false,
  "pip_required": true/false,
  "um_required": true/false,
  "state_insights_uniqueChallenge": "Specific risk or challenge in this location",
  "state_insights_savingOpportunity": "How to save money locally",
  "state_insights_commonMistake": "What people do wrong",
  "cta_text": "Button text like 'Get Free Quotes'",
  "cta_subtext": "Text below button",
  "faqs": [
    {"question": "Question 1 about ${niche.name} in ${location.name}?", "answer": "Detailed answer"},
    {"question": "Question 2?", "answer": "Answer"},
    {"question": "Question 3?", "answer": "Answer"},
    {"question": "Question 4?", "answer": "Answer"},
    {"question": "Question 5?", "answer": "Answer"}
  ],
  "local_factors": [
    {"factor": "Traffic", "factor_slug": "traffic", "impact": "High/Med/Low", "tip": "Advice"},
    {"factor": "Weather", "factor_slug": "weather", "impact": "High/Med/Low", "tip": "Advice"},
    {"factor": "Crime Rate", "factor_slug": "crime-rate", "impact": "High/Med/Low", "tip": "Advice"}
  ],
  "coverage_tips": ["Tip 1", "Tip 2", "Tip 3"],
  "discounts_list": [
    {"name": "Bundle Discount", "description": "Combine policies", "savings": "Up to 25%"},
    {"name": "Good Driver", "description": "Clean record", "savings": "Up to 20%"}
  ],
  "top_insurers": [
    {"name": "State Farm", "rating": "4.8", "bestFor": "Families"},
    {"name": "Geico", "rating": "4.7", "bestFor": "Budget-conscious"},
    {"name": "Progressive", "rating": "4.6", "bestFor": "Online experience"}
  ]
}

Be specific to ${location.name}. Include local laws, weather patterns, and demographics if known.`;
}

// ============================================
// API CALLS (OpenRouter)
// ============================================

async function callOpenRouter(prompt, model) {
    const apiKey = getNextApiKey();

    for (let i = 0; i < 3; i++) {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': CONFIG.siteUrl,
                    'X-Title': 'Insurance Content Generator'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: 'You are a JSON generator. Output valid JSON only. No markdown, no code blocks.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 4000, // Use more context
                }),
            });

            if (!response.ok) {
                if (response.status === 429) {
                    console.log('⏳ Rate limited, waiting 10s...');
                    await sleep(10000);
                    continue;
                }
                const errorText = await response.text();
                throw new Error(`API Error: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            let content = data.choices[0].message.content.trim();
            // Clean markdown if present
            content = content.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
            content = content.replace(/^```\n?/, '').replace(/\n?```$/, '').trim();

            // JSON Repair: Fix common issues from free models
            // 1. Remove trailing commas before } or ]
            content = content.replace(/,\s*([\}\]])/g, '$1');
            // 2. Fix unquoted keys
            content = content.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
            // 3. Fix single quotes to double quotes
            content = content.replace(/'/g, '"');
            // 4. Remove any text before first { or after last }
            const firstBrace = content.indexOf('{');
            const lastBrace = content.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                content = content.substring(firstBrace, lastBrace + 1);
            }

            return JSON.parse(content);

        } catch (error) {
            console.error(`Attempt ${i + 1} failed for ${model}:`, error.message);
            if (i === 2) throw error;
            await sleep(3000);
        }
    }
}

// ============================================
// CORE LOGIC
// ============================================

async function generateRow(niche, location, isCity) {
    return runWithLimit(async () => {
        console.log(`Generating [${niche.slug}] for ${location.name}...`);

        // Call SEO Model (with rate limiting)
        const seoPrompt = getSeoPrompt(niche, location, isCity);
        const seoData = await rateLimitedRequest(() => callOpenRouter(seoPrompt, CONFIG.seoModel));

        // Call Content Model (with rate limiting)
        const contentPrompt = getContentPrompt(niche, location, isCity);
        const contentData = await rateLimitedRequest(() => callOpenRouter(contentPrompt, CONFIG.contentModel));

        // Build Row
        const now = new Date();
        const slug = isCity
            ? `${niche.slug}/us/${location.state_slug}/${location.slug}`
            : `${niche.slug}/us/${location.state_slug}`;

        const row = {
            // Context
            insurance_type: niche.name,
            insurance_type_slug: niche.slug,
            country: 'United States',
            country_code: 'US',
            state: location.state_name || location.name,
            state_code: location.state_code || location.code,
            state_slug: location.state_slug || location.slug,
            city: isCity ? location.name : '',
            city_slug: isCity ? location.slug : '',
            slug: slug,
            location: isCity ? `${location.name}, ${location.state_name}` : location.name,
            state_code_lower: (location.state_code || location.code || '').toLowerCase(),
            state_name: location.state_name || location.name,
            city_name: isCity ? location.name : '',

            // System
            current_year: now.getFullYear(),
            current_month: now.toLocaleString('default', { month: 'long' }),
            site_name: CONFIG.siteName,
            site_url: CONFIG.siteUrl,
            canonical_url: `${CONFIG.siteUrl}/${slug}`,
            cta_url: '/get-quote',
            population: location.population || '',

            generated_at: now.toISOString(),
            status: 'success',

            // SEO Data
            ...seoData,

            // Content Data
            ...contentData,
            is_tort: !contentData.is_no_fault,

            // Stringify JSON arrays
            faqs: JSON.stringify(contentData.faqs || []),
            local_factors: JSON.stringify(contentData.local_factors || []),
            coverage_tips: JSON.stringify(contentData.coverage_tips || []),
            discounts_list: JSON.stringify(contentData.discounts_list || []),
            top_insurers: JSON.stringify(contentData.top_insurers || [])
        };

        return row;
    });
}

async function processNiche(niche, states, rawCities, stateMap) {
    console.log(`\n📂 Queuing Niche: ${niche.name}`);
    const nicheDir = path.join(CONFIG.outputBaseDir, niche.slug);
    ensureDir(nicheDir);

    const statesFile = path.join(nicheDir, 'states_content.csv');
    const citiesFile = path.join(nicheDir, 'cities_content.csv');

    const statesStream = fs.createWriteStream(statesFile, { flags: 'w' });
    const citiesStream = fs.createWriteStream(citiesFile, { flags: 'w' });

    const headers = [
        'page_title', 'page_subtitle', 'insurance_type', 'insurance_type_slug',
        'country', 'country_code', 'state', 'state_code', 'state_slug',
        'city', 'city_slug', 'slug', 'location', 'avg_premium', 'avg_savings',
        'min_coverage', 'population', 'current_year', 'current_month',
        'site_name', 'site_url', 'meta_title', 'meta_description', 'canonical_url',
        'faqs', 'state_code_lower', 'state_name', 'city_name', 'h1_title',
        'hero_tagline', 'hero_description', 'cta_url', 'coverage_format',
        'bodily_injury_per_person', 'bodily_injury_per_accident', 'property_damage',
        'is_no_fault', 'pip_required', 'um_required', 'is_tort', 'intro_paragraph_1',
        'intro_paragraph_2', 'intro_paragraph_3', 'state_insights_uniqueChallenge',
        'state_insights_savingOpportunity', 'state_insights_commonMistake',
        'local_factors', 'coverage_tips', 'discounts_list', 'top_insurers',
        'cta_text', 'cta_subtext'
    ];

    statesStream.write(stringify([headers]));
    citiesStream.write(stringify([headers]));

    // State Jobs
    const stateJobs = states.map(state => generateRow(niche, state, false)
        .then(row => {
            const csvRow = headers.map(k => row[k] || '');
            statesStream.write(stringify([csvRow]));
        })
        .catch(err => console.error(`Failed [State] ${niche.slug}/${state.name}:`, err.message))
    );

    // City Jobs
    const cityJobs = rawCities.map(city => {
        const stateInfo = stateMap.get(city.state_slug) || { name: city.state_name || 'Unknown', code: city.state_code || '' };
        const standardizedCity = {
            name: city.name,
            slug: city.slug || city.name.toLowerCase().replace(/\s+/g, '-'),
            state_name: stateInfo.name,
            state_code: stateInfo.code,
            state_slug: city.state_slug,
            population: city.population
        };

        return generateRow(niche, standardizedCity, true)
            .then(row => {
                const csvRow = headers.map(k => row[k] || '');
                citiesStream.write(stringify([csvRow]));
            })
            .catch(err => console.error(`Failed [City] ${niche.slug}/${city.name}:`, err.message));
    });

    await Promise.all([...stateJobs, ...cityJobs]);

    statesStream.end();
    citiesStream.end();
    console.log(`✅ Completed Niche: ${niche.name}`);
}

async function main() {
    console.log('🚀 Starting OpenRouter Multi-Niche Generator...');
    console.log(`📌 SEO Model: ${CONFIG.seoModel}`);
    console.log(`📌 Content Model: ${CONFIG.contentModel}`);
    console.log(`📌 Concurrency: ${CONFIG.maxConcurrentRequests}`);
    ensureDir(CONFIG.outputBaseDir);

    // Load Data
    const rawStates = parse(fs.readFileSync(CONFIG.statesFile, 'utf8'), { columns: true });
    const states = rawStates.map(s => ({
        name: s.name,
        slug: s.slug || s.name.toLowerCase().replace(/\s+/g, '-'),
        code: s.code,
        country_code: 'US'
    }));

    let rawCities = [];
    if (fs.existsSync(CONFIG.citiesFile)) {
        rawCities = parse(fs.readFileSync(CONFIG.citiesFile, 'utf8'), { columns: true });
    } else {
        console.warn('⚠️ No cities.csv found, skipping cities.');
    }

    const stateMap = new Map();
    states.forEach(s => stateMap.set(s.slug, s));

    // Parallel Niche Execution
    const nichePromises = CONFIG.niches.map(niche => processNiche(niche, states, rawCities, stateMap));

    await Promise.all(nichePromises);
    console.log('\n🎉 ALL CONTENT GENERATED!');
}

main().catch(console.error);
