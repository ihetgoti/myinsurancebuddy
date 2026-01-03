/**
 * AI SEO Content Generator for Insurance Pages
 * 
 * This script generates unique, SEO-optimized content for location-based insurance pages
 * using AI APIs (OpenAI GPT or Google Gemini).
 * 
 * Features:
 * - Reads states and cities from CSV files
 * - Generates unique content for each location
 * - Creates meta titles, descriptions, H1s, and page content
 * - Exports results to CSV for easy import
 * - Supports rate limiting and retry logic
 * - Progress saving (can resume from where it stopped)
 * 
 * Usage:
 *   1. Create a .env file with your API key
 *   2. Place your states.csv and cities.csv in the same directory
 *   3. Run: node ai-seo-content-generator.js
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
    // AI Provider: 'openai', 'gemini', or 'openrouter'
    aiProvider: process.env.AI_PROVIDER || 'openrouter',

    // API Keys (from .env)
    openaiApiKey: process.env.OPENAI_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
    openrouterApiKey: process.env.OPENROUTER_API_KEY,

    // Models
    openaiModel: 'gpt-4o-mini', // Cost-effective and good quality
    geminiModel: 'gemini-1.5-flash', // Fast and cost-effective
    openrouterModel: process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free', // Free tier available

    // Input files (full data files for production)
    statesFile: './data/states.csv',
    citiesFile: './data/cities.csv',

    // Output files
    outputDir: './output',
    statesOutputFile: `./output/${(process.env.INSURANCE_TYPE || 'car insurance').replace(/ /g, '-')}/states_content.csv`,
    citiesOutputFile: `./output/${(process.env.INSURANCE_TYPE || 'car insurance').replace(/ /g, '-')}/cities_content.csv`,
    progressFile: `./output/${(process.env.INSURANCE_TYPE || 'car insurance').replace(/ /g, '-')}/progress.json`,

    // Rate limiting (increased for free tier)
    requestsPerMinute: 12, // Conservative for free tier
    delayBetweenRequests: 5000, // 5 seconds between requests for free tier

    // Retry settings
    maxRetries: 3,
    retryDelay: 5000,

    // Insurance type (customize for your niche)
    insuranceType: process.env.INSURANCE_TYPE || 'car insurance',
    brandName: 'MyInsuranceBuddies',

    // Content settings
    batchSize: 10, // Save progress every N items
};

// ============================================
// AI PROMPT TEMPLATES
// ============================================

const PROMPTS = {
    stateContent: (stateName, stateCode) => `
You are an SEO content expert for ${CONFIG.insuranceType}. Generate unique content for a ${CONFIG.insuranceType} page targeting ${stateName} (${stateCode}).

Generate the following in JSON format:
{
  "meta_title": "60 char max SEO title",
  "meta_description": "155 char max with CTA",
  "h1_title": "Main heading",
  "hero_tagline": "Short punchy text",
  "hero_description": "1-2 sentence value prop",
  "intro_paragraph_1": "Hook paragraph",
  "intro_paragraph_2": "Value proposition",
  "intro_paragraph_3": "Local context and CTA",
  "avg_premium": "Monthly cost estimate like $120/mo",
  "avg_savings": "Potential savings like $450/year",
  "min_coverage": "State minimum requirements summary",
  "coverage_format": "Same as min_coverage",
  "bodily_injury_per_person": "Like $25,000",
  "bodily_injury_per_accident": "Like $50,000",
  "property_damage": "Like $25,000",
  "is_no_fault": true or false,
  "pip_required": true or false,
  "um_required": true or false,
  "state_insights": {
    "uniqueChallenge": "Local risk",
    "savingOpportunity": "How to save",
    "commonMistake": "What not to do"
  },
  "cta_text": "Button text",
  "cta_subtext": "Text below button",
  "faqs": [{"question": "Q1", "answer": "A1"}, {"question": "Q2", "answer": "A2"}, {"question": "Q3", "answer": "A3"}, {"question": "Q4", "answer": "A4"}, {"question": "Q5", "answer": "A5"}],
  "local_factors": [{"factor": "Traffic", "factor_slug": "traffic", "impact": "High", "tip": "Advice"}],
  "coverage_tips": ["Tip 1", "Tip 2", "Tip 3"],
  "discounts_list": [{"name": "Bundle", "description": "Combine policies", "savings": "25%"}],
  "top_insurers": [{"name": "State Farm", "rating": "4.8", "bestFor": "Families"}]
}

Make content specific to ${stateName}. Return ONLY valid JSON.
`,

    cityContent: (cityName, stateName, stateCode, population) => `
You are an SEO content expert for ${CONFIG.insuranceType}. Generate unique, helpful content for a ${CONFIG.insuranceType} page targeting ${cityName}, ${stateName} (${stateCode}).

${population ? `The city has a population of approximately ${parseInt(population).toLocaleString()}.` : ''}

Generate the following in JSON format:
{
  "metaTitle": "60 character max SEO title including '${cityName}' and '${CONFIG.insuranceType}'",
  "metaDescription": "155 character max compelling meta description with CTA",
  "h1Title": "Engaging H1 heading for the page",
  "heroSubtitle": "Short 1-2 sentence subtitle for ${cityName} residents",
  "introContent": "2-3 paragraph introduction about ${CONFIG.insuranceType} in ${cityName}, ${stateName}, including city-specific insights",
  "keyPoints": ["Array of 4-5 key points about ${CONFIG.insuranceType} in ${cityName}"],
  "localFactors": ["Array of 3-4 local factors that affect rates in ${cityName} (traffic, crime, weather, etc.)"],
  "neighborhoodTips": "Brief tips about how neighborhoods affect insurance rates",
  "ctaText": "Compelling call-to-action text for ${cityName} residents",
  "faqQuestions": [
    {"question": "FAQ question 1 about ${CONFIG.insuranceType} in ${cityName}", "answer": "Detailed answer"},
    {"question": "FAQ question 2", "answer": "Detailed answer"},
    {"question": "FAQ question 3", "answer": "Detailed answer"}
  ]
}

Guidelines:
- Make content unique and specific to ${cityName}
- Reference local landmarks, neighborhoods, or characteristics if applicable
- Include city-specific factors (commute times, urban vs suburban, etc.)
- Make it helpful for ${cityName} residents looking for ${CONFIG.insuranceType}
- Include actionable advice

Return ONLY valid JSON, no markdown formatting.
`,
};

// ============================================
// AI API CALLS
// ============================================

async function callOpenAI(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.openaiApiKey}`,
        },
        body: JSON.stringify({
            model: CONFIG.openaiModel,
            messages: [
                { role: 'system', content: 'You are an SEO content expert. Always respond with valid JSON only.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API Error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function callGemini(prompt) {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.geminiModel}:generateContent?key=${CONFIG.geminiApiKey}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2000,
                },
            }),
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API Error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

async function callOpenRouter(prompt) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.openrouterApiKey}`,
            'HTTP-Referer': 'https://myinsurancebuddies.com',
            'X-Title': 'Insurance SEO Content Generator',
        },
        body: JSON.stringify({
            model: CONFIG.openrouterModel,
            messages: [
                { role: 'system', content: 'You are an SEO content expert. Always respond with valid JSON only. Do not include markdown code blocks.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API Error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function generateContent(prompt) {
    const provider = CONFIG.aiProvider.toLowerCase();

    if (provider === 'openai') {
        if (!CONFIG.openaiApiKey) {
            throw new Error('OpenAI API key not found. Set OPENAI_API_KEY in .env');
        }
        return await callOpenAI(prompt);
    } else if (provider === 'gemini') {
        if (!CONFIG.geminiApiKey) {
            throw new Error('Gemini API key not found. Set GEMINI_API_KEY in .env');
        }
        return await callGemini(prompt);
    } else if (provider === 'openrouter') {
        if (!CONFIG.openrouterApiKey) {
            throw new Error('OpenRouter API key not found. Set OPENROUTER_API_KEY in .env');
        }
        return await callOpenRouter(prompt);
    } else {
        throw new Error(`Unknown AI provider: ${provider}. Use 'openai', 'gemini', or 'openrouter'`);
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function parseJSON(text) {
    // Clean up the response - remove markdown code blocks if present
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
        cleaned = cleaned.slice(7);
    }
    if (cleaned.startsWith('```')) {
        cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
        cleaned = cleaned.slice(0, -3);
    }
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
    } catch (error) {
        console.warn('⚠️ Could not load progress file, starting fresh');
    }
    return { completedStates: [], completedCities: [] };
}

function saveProgress(progress) {
    fs.writeFileSync(CONFIG.progressFile, JSON.stringify(progress, null, 2));
}

function loadCSV(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ File not found: ${filePath}`);
        return [];
    }

    const content = fs.readFileSync(filePath, 'utf8');
    return parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function appendToCSV(filePath, data, headers) {
    const exists = fs.existsSync(filePath);

    const csvContent = stringify([data], {
        header: !exists,
        columns: headers,
    });

    fs.appendFileSync(filePath, csvContent);
}

// ============================================
// CONTENT GENERATION
// ============================================

async function generateStateContent(state, retryCount = 0) {
    const stateName = state.name;
    const stateCode = state.code || state.slug?.toUpperCase().slice(0, 2) || '';

    console.log(`\n📍 Generating content for state: ${stateName} (${stateCode})`);

    try {
        const prompt = PROMPTS.stateContent(stateName, stateCode);
        const response = await generateContent(prompt);
        const content = parseJSON(response);

        const stateSlug = state.slug || stateName.toLowerCase().replace(/\s+/g, '-');
        const insuranceSlug = CONFIG.insuranceType.toLowerCase().replace(/\s+/g, '-');
        const now = new Date();

        return {
            state_name: stateName,
            state_code: stateCode,
            state_slug: stateSlug,
            country_code: state.country_code || 'us',
            insurance_type: CONFIG.insuranceType,
            insurance_type_slug: insuranceSlug,
            slug: `${insuranceSlug}/us/${stateSlug}`,
            location: stateName,
            current_year: now.getFullYear(),
            current_month: now.toLocaleString('default', { month: 'long' }),
            site_name: CONFIG.brandName,
            site_url: 'https://myinsurancebuddies.com',
            canonical_url: `https://myinsurancebuddies.com/${insuranceSlug}/us/${stateSlug}`,
            cta_url: '/get-quote',
            meta_title: content.meta_title || '',
            meta_description: content.meta_description || '',
            h1_title: content.h1_title || '',
            page_title: content.meta_title || '',
            page_subtitle: content.hero_tagline || '',
            hero_tagline: content.hero_tagline || '',
            hero_description: content.hero_description || '',
            intro_paragraph_1: content.intro_paragraph_1 || '',
            intro_paragraph_2: content.intro_paragraph_2 || '',
            intro_paragraph_3: content.intro_paragraph_3 || '',
            avg_premium: content.avg_premium || '',
            avg_savings: content.avg_savings || '',
            min_coverage: content.min_coverage || '',
            coverage_format: content.coverage_format || content.min_coverage || '',
            bodily_injury_per_person: content.bodily_injury_per_person || '',
            bodily_injury_per_accident: content.bodily_injury_per_accident || '',
            property_damage: content.property_damage || '',
            is_no_fault: content.is_no_fault || false,
            pip_required: content.pip_required || false,
            um_required: content.um_required || false,
            is_tort: !content.is_no_fault,
            state_insights_uniqueChallenge: content.state_insights?.uniqueChallenge || '',
            state_insights_savingOpportunity: content.state_insights?.savingOpportunity || '',
            state_insights_commonMistake: content.state_insights?.commonMistake || '',
            cta_text: content.cta_text || 'Get Free Quotes',
            cta_subtext: content.cta_subtext || '',
            faqs: JSON.stringify(content.faqs || []),
            local_factors: JSON.stringify(content.local_factors || []),
            coverage_tips: JSON.stringify(content.coverage_tips || []),
            discounts_list: JSON.stringify(content.discounts_list || []),
            top_insurers: JSON.stringify(content.top_insurers || []),
            generated_at: now.toISOString(),
            status: 'success',
        };
    } catch (error) {
        console.error(`❌ Error generating content for ${stateName}:`, error.message);

        if (retryCount < CONFIG.maxRetries) {
            console.log(`🔄 Retrying in ${CONFIG.retryDelay / 1000}s... (attempt ${retryCount + 1}/${CONFIG.maxRetries})`);
            await sleep(CONFIG.retryDelay);
            return generateStateContent(state, retryCount + 1);
        }

        return {
            state_name: stateName,
            state_code: stateCode,
            state_slug: state.slug || stateName.toLowerCase().replace(/\s+/g, '-'),
            country_code: state.country_code || 'us',
            meta_title: '',
            meta_description: '',
            h1_title: '',
            hero_subtitle: '',
            intro_content: '',
            key_points: '[]',
            local_factors: '[]',
            cta_text: '',
            faq_questions: '[]',
            generated_at: new Date().toISOString(),
            status: `error: ${error.message}`,
        };
    }
}

async function generateCityContent(city, stateName, stateCode, retryCount = 0) {
    const cityName = city.name;
    const population = city.population;

    console.log(`\n🏙️ Generating content for city: ${cityName}, ${stateName}`);

    try {
        const prompt = PROMPTS.cityContent(cityName, stateName, stateCode, population);
        const response = await generateContent(prompt);
        const content = parseJSON(response);

        return {
            city_name: cityName,
            city_slug: city.slug || cityName.toLowerCase().replace(/\s+/g, '-'),
            state_name: stateName,
            state_code: stateCode,
            state_slug: city.state_slug || stateName.toLowerCase().replace(/\s+/g, '-'),
            country_code: city.country_code || 'us',
            population: population || '',
            meta_title: content.metaTitle || '',
            meta_description: content.metaDescription || '',
            h1_title: content.h1Title || '',
            hero_subtitle: content.heroSubtitle || '',
            intro_content: content.introContent || '',
            key_points: JSON.stringify(content.keyPoints || []),
            local_factors: JSON.stringify(content.localFactors || []),
            neighborhood_tips: content.neighborhoodTips || '',
            cta_text: content.ctaText || '',
            faq_questions: JSON.stringify(content.faqQuestions || []),
            generated_at: new Date().toISOString(),
            status: 'success',
        };
    } catch (error) {
        console.error(`❌ Error generating content for ${cityName}:`, error.message);

        if (retryCount < CONFIG.maxRetries) {
            console.log(`🔄 Retrying in ${CONFIG.retryDelay / 1000}s... (attempt ${retryCount + 1}/${CONFIG.maxRetries})`);
            await sleep(CONFIG.retryDelay);
            return generateCityContent(city, stateName, stateCode, retryCount + 1);
        }

        return {
            city_name: cityName,
            city_slug: city.slug || cityName.toLowerCase().replace(/\s+/g, '-'),
            state_name: stateName,
            state_code: stateCode,
            state_slug: city.state_slug || stateName.toLowerCase().replace(/\s+/g, '-'),
            country_code: city.country_code || 'us',
            population: population || '',
            meta_title: '',
            meta_description: '',
            h1_title: '',
            hero_subtitle: '',
            intro_content: '',
            key_points: '[]',
            local_factors: '[]',
            neighborhood_tips: '',
            cta_text: '',
            faq_questions: '[]',
            generated_at: new Date().toISOString(),
            status: `error: ${error.message}`,
        };
    }
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
    console.log('🚀 AI SEO Content Generator for Insurance Pages');
    console.log('================================================\n');
    console.log(`📌 AI Provider: ${CONFIG.aiProvider.toUpperCase()}`);
    console.log(`📌 Insurance Type: ${CONFIG.insuranceType}`);
    console.log(`📌 Brand: ${CONFIG.brandName}\n`);

    // Ensure output directory exists
    ensureDir(path.dirname(CONFIG.statesOutputFile));
    ensureDir('./data');

    // Load progress
    const progress = loadProgress();
    console.log(`📊 Progress: ${progress.completedStates.length} states, ${progress.completedCities.length} cities completed\n`);

    // Define CSV headers - EXPANDED for all template variables
    const stateHeaders = [
        'state_name', 'state_code', 'state_slug', 'country_code', 'insurance_type', 'insurance_type_slug',
        'slug', 'location', 'current_year', 'current_month', 'site_name', 'site_url', 'canonical_url', 'cta_url',
        'meta_title', 'meta_description', 'h1_title', 'page_title', 'page_subtitle',
        'hero_tagline', 'hero_description', 'intro_paragraph_1', 'intro_paragraph_2', 'intro_paragraph_3',
        'avg_premium', 'avg_savings', 'min_coverage', 'coverage_format',
        'bodily_injury_per_person', 'bodily_injury_per_accident', 'property_damage',
        'is_no_fault', 'pip_required', 'um_required', 'is_tort',
        'state_insights_uniqueChallenge', 'state_insights_savingOpportunity', 'state_insights_commonMistake',
        'cta_text', 'cta_subtext', 'faqs', 'local_factors', 'coverage_tips', 'discounts_list', 'top_insurers',
        'generated_at', 'status'
    ];

    const cityHeaders = [
        'city_name', 'city_slug', 'state_name', 'state_code', 'state_slug', 'country_code',
        'population', 'meta_title', 'meta_description', 'h1_title', 'hero_subtitle',
        'intro_content', 'key_points', 'local_factors', 'neighborhood_tips', 'cta_text',
        'faq_questions', 'generated_at', 'status'
    ];

    // Load data files
    const states = loadCSV(CONFIG.statesFile);
    const cities = loadCSV(CONFIG.citiesFile);

    console.log(`📁 Loaded ${states.length} states and ${cities.length} cities\n`);

    // Create state lookup for city processing
    const stateMap = new Map();
    states.forEach(state => {
        const key = state.slug || state.name?.toLowerCase().replace(/\s+/g, '-');
        stateMap.set(key, {
            name: state.name,
            code: state.code || key?.toUpperCase().slice(0, 2),
        });
    });

    // Process states
    if (states.length > 0) {
        console.log('\n📍 PROCESSING STATES');
        console.log('====================\n');

        // Clear previous output if starting fresh
        if (progress.completedStates.length === 0 && fs.existsSync(CONFIG.statesOutputFile)) {
            fs.unlinkSync(CONFIG.statesOutputFile);
        }

        for (let i = 0; i < states.length; i++) {
            const state = states[i];
            const stateKey = state.slug || state.name?.toLowerCase().replace(/\s+/g, '-');

            // Skip if already completed
            if (progress.completedStates.includes(stateKey)) {
                console.log(`⏭️ Skipping ${state.name} (already completed)`);
                continue;
            }

            const content = await generateStateContent(state);

            // Append to CSV
            appendToCSV(CONFIG.statesOutputFile, content, stateHeaders);
            console.log(`✅ Saved content for ${state.name}`);

            // Update progress
            progress.completedStates.push(stateKey);

            // Save progress periodically
            if ((i + 1) % CONFIG.batchSize === 0) {
                saveProgress(progress);
                console.log(`💾 Progress saved (${progress.completedStates.length} states completed)`);
            }

            // Rate limiting
            if (i < states.length - 1) {
                await sleep(CONFIG.delayBetweenRequests);
            }
        }

        saveProgress(progress);
        console.log(`\n✅ Completed processing ${progress.completedStates.length} states`);
    }

    // Process cities
    if (cities.length > 0) {
        console.log('\n\n🏙️ PROCESSING CITIES');
        console.log('====================\n');

        // Clear previous output if starting fresh
        if (progress.completedCities.length === 0 && fs.existsSync(CONFIG.citiesOutputFile)) {
            fs.unlinkSync(CONFIG.citiesOutputFile);
        }

        for (let i = 0; i < cities.length; i++) {
            const city = cities[i];
            const cityKey = `${city.state_slug || 'unknown'}-${city.slug || city.name?.toLowerCase().replace(/\s+/g, '-')}`;

            // Skip if already completed
            if (progress.completedCities.includes(cityKey)) {
                console.log(`⏭️ Skipping ${city.name} (already completed)`);
                continue;
            }

            // Get state info
            const stateInfo = stateMap.get(city.state_slug) || { name: city.state_slug, code: '' };

            const content = await generateCityContent(city, stateInfo.name, stateInfo.code);

            // Append to CSV
            appendToCSV(CONFIG.citiesOutputFile, content, cityHeaders);
            console.log(`✅ Saved content for ${city.name}, ${stateInfo.name}`);

            // Update progress
            progress.completedCities.push(cityKey);

            // Save progress periodically
            if ((i + 1) % CONFIG.batchSize === 0) {
                saveProgress(progress);
                console.log(`💾 Progress saved (${progress.completedCities.length} cities completed)`);
            }

            // Rate limiting
            if (i < cities.length - 1) {
                await sleep(CONFIG.delayBetweenRequests);
            }
        }

        saveProgress(progress);
        console.log(`\n✅ Completed processing ${progress.completedCities.length} cities`);
    }

    // Final summary
    console.log('\n\n🎉 GENERATION COMPLETE!');
    console.log('=======================');
    console.log(`📁 States output: ${path.resolve(CONFIG.statesOutputFile)}`);
    console.log(`📁 Cities output: ${path.resolve(CONFIG.citiesOutputFile)}`);
    console.log(`📊 Total states: ${progress.completedStates.length}`);
    console.log(`📊 Total cities: ${progress.completedCities.length}`);
}

// Run the script
main().catch(console.error);
