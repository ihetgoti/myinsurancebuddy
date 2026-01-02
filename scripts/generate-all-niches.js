/**
 * Advanced Multi-Niche AI Content Generator (Parallel Optimized)
 * 
 * Features:
 * - Parallel Execution of ALL Niches simultaneously
 * - Global Rate Limiting across all parallel jobs
 * - Separate CSV outputs for States and Cities
 * - Dual API Keys with Round Robin
 * - Full Variable Generation
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
    // API Keys (Round Robin)
    apiKeys: [
        process.env.OPENAI_API_KEY_1,
        process.env.OPENAI_API_KEY_2
    ].filter(k => k),

    // Models
    seoModel: process.env.SEO_MODEL || 'gpt-4o-mini',
    contentModel: process.env.CONTENT_MODEL || 'gpt-4o',

    // Concurrency (Global Limit)
    // Running multiple niches parallel means high influx of jobs.
    // Keep this safe to avoid 429 errors.
    maxConcurrentRequests: parseInt(process.env.MAX_CONCURRENT_REQUESTS || '5'),

    // Data Sources
    statesFile: './data/states.csv',
    citiesFile: './data/cities.csv',
    outputBaseDir: './output-all-niches',

    // Niches to Generate
    niches: [
        {
            slug: 'health-insurance',
            name: 'Health Insurance',
            description: 'Essential coverage for medical expenses, from routine check-ups to surgeries and hospital stays.'
        },
        {
            slug: 'auto-insurance',
            name: 'Auto Insurance',
            description: 'Mandatory financial protection against accidents, theft, and damage to your vehicle.'
        },
        {
            slug: 'homeowners-insurance',
            name: 'Homeowners Insurance',
            description: 'Protects your home and personal belongings from damage or loss due to fire, natural disasters, theft.'
        },
        {
            slug: 'life-insurance',
            name: 'Life Insurance',
            description: 'Provides a lump sum death benefit to beneficiaries. Includes Term and Permanent/Whole life.'
        },
        {
            slug: 'disability-insurance',
            name: 'Disability Insurance',
            description: 'Replaces income if you become unable to work due to illness or injury.'
        },
        {
            slug: 'long-term-care-insurance',
            name: 'Long-Term Care Insurance',
            description: 'Covers services like nursing homes, assisted living, and home health care.'
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
    if (CONFIG.apiKeys.length === 0) throw new Error('No API Keys provided! Set OPENAI_API_KEY_1 and _2 in .env');
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

// ============================================
// PROMPT ENGINEERING
// ============================================

function generatePrompt(niche, location, isCity) {
    const context = isCity
        ? `City: ${location.name}, State: ${location.state_name}`
        : `State: ${location.name}`;

    return `
You are an expert Insurance Copywriter. 
Topic: ${niche.name} (${niche.description}).
Target Location: ${context}.

Generate a complete, data-rich dataset for a landing page.
Output MUST be valid JSON matching exactly the structure below. Do not include markdown formatting.

Keys required:
- page_title (SEO title, max 60 chars)
- page_subtitle (Compelling hero tagline)
- h1_title (Main heading)
- meta_title (Same as page_title)
- meta_description (SEO desc, max 155 chars)
- hero_tagline (Short punchy text)
- hero_description (1-2 sentences)
- intro_paragraph_1 (Hook)
- intro_paragraph_2 (Value prop)
- intro_paragraph_3 (Local context/Call to match)
- avg_premium (Estimated monthly cost string, e.g. "$120/mo")
- avg_savings (Estimated savings, e.g. "$450/year")
- min_coverage (State minimum requirements text)
- coverage_format (Same as min_coverage)
- bodily_injury_per_person (e.g. "$25,000")
- bodily_injury_per_accident (e.g. "$50,000")
- property_damage (e.g. "$25,000")
- is_no_fault (boolean)
- pip_required (boolean)
- um_required (boolean)
- state_insights_uniqueChallenge (Specific local risk)
- state_insights_savingOpportunity (How to save locally)
- state_insights_commonMistake (What not to do)
- cta_text (Button text)
- cta_subtext (Below button text)
- faqs (Array of objects: {question, answer}) - Generate 5 relevant FAQs
- local_factors (Array of objects: {factor: "Traffic/Weather/Crime", factor_slug, impact: "High/Med/Low", tip: "Advice"})
- coverage_tips (Array of strings)
- discounts_list (Array of objects: {name, description, savings})
- top_insurers (Array of objects: {rating: "4.8", bestFor: "Students/Families", neighborhood_guide: "Optional text"})

Make the content specific to ${location.name}. Mention local landmarks or laws if known.
`;
}

// ============================================
// API CALLS
// ============================================

async function callOpenAI(prompt, model) {
    const apiKey = getNextApiKey();

    // Retry logic
    for (let i = 0; i < 3; i++) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: 'You are a JSON generator. Output valid JSON only.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                }),
            });

            if (!response.ok) {
                if (response.status === 429) {
                    console.log('⏳ Rate limited, waiting...');
                    await sleep(5000);
                    continue;
                }
                throw new Error(`API Error: ${response.status} ${await response.text()}`);
            }

            const data = await response.json();
            let content = data.choices[0].message.content.trim();
            content = content.replace(/^```json/, '').replace(/```$/, '').trim();
            return JSON.parse(content);

        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error.message);
            if (i === 2) throw error;
            await sleep(2000);
        }
    }
}

// ============================================
// CORE LOGIC
// ============================================

async function generateRow(niche, location, isCity) {
    return runWithLimit(async () => {
        console.log(`Generating [${niche.slug}] for ${location.name}...`);

        const prompt = generatePrompt(niche, location, isCity);
        const data = await callOpenAI(prompt, CONFIG.contentModel);

        const now = new Date();
        const siteUrl = 'https://myinsurancebuddies.com';
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
            site_name: 'MyInsuranceBuddies',
            site_url: siteUrl,
            canonical_url: `${siteUrl}/${slug}`,
            cta_url: '/get-quote',
            population: location.population || '',

            generated_at: now.toISOString(),
            status: 'success',

            // AI Generated
            ...data,
            is_tort: !data.is_no_fault,

            // Stringify JSON arrays for CSV
            faqs: JSON.stringify(data.faqs || []),
            local_factors: JSON.stringify(data.local_factors || []),
            coverage_tips: JSON.stringify(data.coverage_tips || []),
            discounts_list: JSON.stringify(data.discounts_list || []),
            top_insurers: JSON.stringify(data.top_insurers || [])
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

    // Generate State Jobs
    // We launch them all, but global semaphore restricts concurrency
    const stateJobs = states.map(state => generateRow(niche, state, false)
        .then(row => {
            const csvRow = headers.map(outputKey => row[outputKey] || '');
            statesStream.write(stringify([csvRow]));
        })
        .catch(err => console.error(`Failed [State] ${niche.slug}/${state.name}:`, err.message))
    );

    // Generate City Jobs
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
                const csvRow = headers.map(outputKey => row[outputKey] || '');
                citiesStream.write(stringify([csvRow]));
            })
            .catch(err => console.error(`Failed [City] ${niche.slug}/${city.name}:`, err.message));
    });

    // Wait for all to finish
    await Promise.all([...stateJobs, ...cityJobs]);

    statesStream.end();
    citiesStream.end();
    console.log(`✅ Completed Niche: ${niche.name}`);
}

async function main() {
    console.log('🚀 Starting Parallel Multi-Niche Generator...');
    ensureDir(CONFIG.outputBaseDir);

    // Load Data
    const rawStates = parse(fs.readFileSync(CONFIG.statesFile, 'utf8'), { columns: true });
    const states = rawStates.map(s => ({
        name: s.name,
        slug: s.slug || s.name.toLowerCase().replace(/\s+/g, '-'),
        code: s.code,
        country_code: 'US'
    }));

    // City Data
    let rawCities = [];
    if (fs.existsSync(CONFIG.citiesFile)) {
        rawCities = parse(fs.readFileSync(CONFIG.citiesFile, 'utf8'), { columns: true });
    } else {
        console.warn('⚠️ No cities.csv found, skipping cities.');
    }

    // State Map
    const stateMap = new Map();
    states.forEach(s => stateMap.set(s.slug, s));

    // Parallel Niche Execution
    const nichePromises = CONFIG.niches.map(niche => processNiche(niche, states, rawCities, stateMap));

    await Promise.all(nichePromises);
    console.log('\n🎉 ALL CONTENT GENERATED!');
}

main().catch(console.error);
