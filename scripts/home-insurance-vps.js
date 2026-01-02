#!/usr/bin/env node

/**
 * VPS-Ready Home Insurance Content Generator
 * 
 * Same features as car insurance version:
 * - Runs unattended until complete
 * - Auto-retries with exponential backoff
 * - Progress saved after each item
 * - Logs to file for monitoring
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
    aiProvider: 'openrouter',
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
    openrouterModel: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',

    statesFile: './data/states.csv',
    citiesFile: './data/cities.csv',
    outputDir: './output/home-insurance',
    statesOutputFile: './output/home-insurance/states_content.csv',
    citiesOutputFile: './output/home-insurance/cities_content.csv',
    progressFile: './output/home-insurance/progress.json',
    logFile: './output/home-insurance/generator.log',

    baseDelay: 3000,
    maxDelay: 120000,
    maxRetries: 10,

    defaultAffiliateUrl: '/get-quote',
    brandName: 'MyInsuranceBuddies',
};

// ============================================
// LOGGING
// ============================================

function log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [${level}] ${message}`;
    console.log(logLine);
    try {
        fs.appendFileSync(CONFIG.logFile, logLine + '\n');
    } catch (e) { }
}

// ============================================
// HOME INSURANCE STATE DATA
// ============================================

const STATE_DATA = {
    'alabama': { avgPremium: '$1,800', naturalDisasters: 'Tornadoes, hurricanes, flooding', riskLevel: 'High' },
    'alaska': { avgPremium: '$1,100', naturalDisasters: 'Earthquakes, flooding, permafrost', riskLevel: 'Medium' },
    'arizona': { avgPremium: '$1,400', naturalDisasters: 'Wildfires, dust storms, flooding', riskLevel: 'Medium' },
    'arkansas': { avgPremium: '$2,100', naturalDisasters: 'Tornadoes, flooding, ice storms', riskLevel: 'High' },
    'california': { avgPremium: '$1,500', naturalDisasters: 'Earthquakes, wildfires, mudslides', riskLevel: 'High' },
    'colorado': { avgPremium: '$2,500', naturalDisasters: 'Hailstorms, wildfires, flooding', riskLevel: 'High' },
    'connecticut': { avgPremium: '$1,600', naturalDisasters: 'Hurricanes, flooding, winter storms', riskLevel: 'Medium' },
    'delaware': { avgPremium: '$900', naturalDisasters: 'Hurricanes, flooding', riskLevel: 'Medium' },
    'florida': { avgPremium: '$4,200', naturalDisasters: 'Hurricanes, flooding, sinkholes', riskLevel: 'Very High' },
    'georgia': { avgPremium: '$1,600', naturalDisasters: 'Tornadoes, hurricanes, flooding', riskLevel: 'Medium' },
    'hawaii': { avgPremium: '$1,200', naturalDisasters: 'Hurricanes, volcanic activity, flooding', riskLevel: 'Medium' },
    'idaho': { avgPremium: '$1,000', naturalDisasters: 'Wildfires, earthquakes', riskLevel: 'Low' },
    'illinois': { avgPremium: '$1,400', naturalDisasters: 'Tornadoes, flooding, winter storms', riskLevel: 'Medium' },
    'indiana': { avgPremium: '$1,200', naturalDisasters: 'Tornadoes, flooding', riskLevel: 'Medium' },
    'iowa': { avgPremium: '$1,400', naturalDisasters: 'Tornadoes, flooding, hail', riskLevel: 'Medium' },
    'kansas': { avgPremium: '$2,800', naturalDisasters: 'Tornadoes, hail, flooding', riskLevel: 'Very High' },
    'kentucky': { avgPremium: '$1,800', naturalDisasters: 'Tornadoes, flooding, ice storms', riskLevel: 'Medium' },
    'louisiana': { avgPremium: '$3,200', naturalDisasters: 'Hurricanes, flooding, tornadoes', riskLevel: 'Very High' },
    'maine': { avgPremium: '$1,000', naturalDisasters: 'Winter storms, flooding', riskLevel: 'Low' },
    'maryland': { avgPremium: '$1,300', naturalDisasters: 'Hurricanes, flooding', riskLevel: 'Medium' },
    'massachusetts': { avgPremium: '$1,600', naturalDisasters: 'Winter storms, hurricanes, flooding', riskLevel: 'Medium' },
    'michigan': { avgPremium: '$1,200', naturalDisasters: 'Winter storms, flooding, tornadoes', riskLevel: 'Medium' },
    'minnesota': { avgPremium: '$1,700', naturalDisasters: 'Winter storms, flooding, tornadoes', riskLevel: 'Medium' },
    'mississippi': { avgPremium: '$2,000', naturalDisasters: 'Hurricanes, tornadoes, flooding', riskLevel: 'High' },
    'missouri': { avgPremium: '$1,700', naturalDisasters: 'Tornadoes, flooding, earthquakes', riskLevel: 'Medium' },
    'montana': { avgPremium: '$1,500', naturalDisasters: 'Wildfires, winter storms', riskLevel: 'Medium' },
    'nebraska': { avgPremium: '$2,600', naturalDisasters: 'Tornadoes, hail, flooding', riskLevel: 'High' },
    'nevada': { avgPremium: '$1,000', naturalDisasters: 'Wildfires, earthquakes', riskLevel: 'Low' },
    'new-hampshire': { avgPremium: '$1,000', naturalDisasters: 'Winter storms, flooding', riskLevel: 'Low' },
    'new-jersey': { avgPremium: '$1,200', naturalDisasters: 'Hurricanes, flooding', riskLevel: 'Medium' },
    'new-mexico': { avgPremium: '$1,400', naturalDisasters: 'Wildfires, flooding', riskLevel: 'Medium' },
    'new-york': { avgPremium: '$1,400', naturalDisasters: 'Hurricanes, flooding, winter storms', riskLevel: 'Medium' },
    'north-carolina': { avgPremium: '$1,500', naturalDisasters: 'Hurricanes, flooding, tornadoes', riskLevel: 'Medium' },
    'north-dakota': { avgPremium: '$1,800', naturalDisasters: 'Flooding, winter storms, tornadoes', riskLevel: 'Medium' },
    'ohio': { avgPremium: '$1,100', naturalDisasters: 'Tornadoes, flooding', riskLevel: 'Medium' },
    'oklahoma': { avgPremium: '$3,500', naturalDisasters: 'Tornadoes, hail, earthquakes', riskLevel: 'Very High' },
    'oregon': { avgPremium: '$900', naturalDisasters: 'Earthquakes, wildfires, flooding', riskLevel: 'Medium' },
    'pennsylvania': { avgPremium: '$1,100', naturalDisasters: 'Flooding, winter storms', riskLevel: 'Low' },
    'rhode-island': { avgPremium: '$1,800', naturalDisasters: 'Hurricanes, flooding', riskLevel: 'Medium' },
    'south-carolina': { avgPremium: '$1,700', naturalDisasters: 'Hurricanes, flooding, tornadoes', riskLevel: 'High' },
    'south-dakota': { avgPremium: '$2,200', naturalDisasters: 'Tornadoes, hail, flooding', riskLevel: 'High' },
    'tennessee': { avgPremium: '$1,600', naturalDisasters: 'Tornadoes, flooding', riskLevel: 'Medium' },
    'texas': { avgPremium: '$2,400', naturalDisasters: 'Hurricanes, tornadoes, hail, flooding', riskLevel: 'High' },
    'utah': { avgPremium: '$900', naturalDisasters: 'Earthquakes, wildfires', riskLevel: 'Low' },
    'vermont': { avgPremium: '$900', naturalDisasters: 'Flooding, winter storms', riskLevel: 'Low' },
    'virginia': { avgPremium: '$1,200', naturalDisasters: 'Hurricanes, flooding', riskLevel: 'Medium' },
    'washington': { avgPremium: '$1,000', naturalDisasters: 'Earthquakes, wildfires, flooding', riskLevel: 'Medium' },
    'west-virginia': { avgPremium: '$1,200', naturalDisasters: 'Flooding, winter storms', riskLevel: 'Medium' },
    'wisconsin': { avgPremium: '$1,000', naturalDisasters: 'Tornadoes, flooding, winter storms', riskLevel: 'Low' },
    'wyoming': { avgPremium: '$1,400', naturalDisasters: 'Wildfires, hail', riskLevel: 'Low' },
    'district-of-columbia': { avgPremium: '$1,300', naturalDisasters: 'Flooding, hurricanes', riskLevel: 'Medium' },
};

const TOP_INSURERS = [
    { name: 'State Farm', slug: 'state-farm', bestFor: 'Overall coverage options', rating: '4.6' },
    { name: 'Allstate', slug: 'allstate', bestFor: 'Bundling discounts', rating: '4.3' },
    { name: 'USAA', slug: 'usaa', bestFor: 'Military families', rating: '4.8' },
    { name: 'Liberty Mutual', slug: 'liberty-mutual', bestFor: 'Customizable policies', rating: '4.2' },
    { name: 'Nationwide', slug: 'nationwide', bestFor: 'Discounts for smart homes', rating: '4.1' },
    { name: 'Travelers', slug: 'travelers', bestFor: 'Older homes', rating: '4.3' },
];

// ============================================
// PROMPTS
// ============================================

const PROMPTS = {
    state: (name, code, data) => `Generate home insurance content for ${name} (${code}). Natural disasters: ${data.naturalDisasters}. Risk level: ${data.riskLevel}.

Return JSON only:
{"metaTitle":"SEO title with ${name} Home Insurance","metaDescription":"155 chars about home insurance in ${name}","h1Title":"H1 for ${name} home insurance","heroTagline":"Short tagline","heroDescription":"2-3 sentences about protecting homes in ${name}","introParagraph1":"Unique intro about homeownership in ${name}","introParagraph2":"About coverage needs and local risks","introParagraph3":"About finding the best rates","stateInsights":{"uniqueRisk":"Specific risk for ${name} homes","savingOpportunity":"How to save on home insurance","commonMistake":"Mistake homeowners make"},"localFactors":[{"factor":"Weather","impact":"How ${name} weather affects premiums","tip":""},{"factor":"Crime","impact":"Property crime impact","tip":""},{"factor":"Home Age","impact":"Older vs newer homes","tip":""},{"factor":"Location","impact":"Urban vs rural rates","tip":""}],"coverageTips":["tip about dwelling coverage","tip about personal property","tip about liability","tip about additional coverages","tip about deductibles"],"discountsList":[{"name":"Bundling","description":"Combine with auto","savings":"Up to 25%"},{"name":"Security Systems","description":"Alarms and cameras","savings":"Up to 15%"},{"name":"New Home","description":"Homes under 10 years","savings":"Up to 20%"}],"faqs":[{"question":"What does home insurance cover in ${name}?","answer":""},{"question":"Is flood insurance included?","answer":""},{"question":"How to lower home insurance in ${name}?","answer":""}],"ctaText":"Compare ${name} Home Insurance"}`,

    city: (city, state, code, data) => `Generate home insurance content for ${city}, ${state} (${code}). State risks: ${data.naturalDisasters}.

Return JSON only:
{"metaTitle":"SEO title with ${city} Home Insurance","metaDescription":"155 chars for ${city} homeowners","h1Title":"H1 for ${city}","heroTagline":"Short tagline for ${city} homeowners","heroDescription":"2-3 sentences about home insurance in ${city}","introParagraph1":"Unique intro about ${city} housing market","introParagraph2":"About local factors affecting rates","introParagraph3":"About finding coverage in ${city}","cityInsights":{"uniqueRisk":"Specific risk in ${city}","localTip":"Insider tip for ${city} homeowners","areaToWatch":"High-risk area or factor"},"localFactors":[{"factor":"Neighborhoods","impact":"How different areas affect rates","tip":""},{"factor":"Home Values","impact":"Property value impact","tip":""},{"factor":"Crime Rate","impact":"Local crime statistics","tip":""},{"factor":"Fire Protection","impact":"Distance to fire station","tip":""}],"neighborhoodGuide":"How ${city} neighborhoods affect home insurance rates","coverageTips":["local tip 1","local tip 2","local tip 3"],"faqs":[{"question":"Why is home insurance expensive in ${city}?","answer":""},{"question":"What coverage do ${city} homeowners need?","answer":""},{"question":"Best home insurance for ${city}?","answer":""}],"ctaText":"Get ${city} Home Insurance Quote"}`
};

// ============================================
// API
// ============================================

async function callAPI(prompt, attempt = 1) {
    const delay = Math.min(CONFIG.baseDelay * Math.pow(1.5, attempt - 1), CONFIG.maxDelay);

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.openrouterApiKey}`,
                'HTTP-Referer': 'https://myinsurancebuddies.com',
                'X-Title': 'Home Insurance Generator',
            },
            body: JSON.stringify({
                model: CONFIG.openrouterModel,
                messages: [
                    { role: 'system', content: 'You are an SEO expert for home insurance. Return valid JSON only, no markdown.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 2500,
            }),
        });

        if (response.status === 429) {
            const waitTime = delay * 2;
            log(`Rate limited. Waiting ${waitTime / 1000}s...`, 'WARN');
            await sleep(waitTime);
            if (attempt < CONFIG.maxRetries) return callAPI(prompt, attempt + 1);
            throw new Error('Rate limit exceeded');
        }

        if (!response.ok) throw new Error(`API ${response.status}`);
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        if (attempt < CONFIG.maxRetries) {
            log(`Error: ${error.message}. Retry ${attempt}/${CONFIG.maxRetries}`, 'WARN');
            await sleep(delay);
            return callAPI(prompt, attempt + 1);
        }
        throw error;
    }
}

// ============================================
// HELPERS
// ============================================

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function parseJSON(text) {
    let s = text.trim();
    if (s.startsWith('```')) s = s.replace(/```json?\n?/g, '').replace(/```$/g, '');
    return JSON.parse(s);
}

function loadProgress() {
    try {
        if (fs.existsSync(CONFIG.progressFile)) return JSON.parse(fs.readFileSync(CONFIG.progressFile, 'utf8'));
    } catch (e) { }
    return { completedStates: [], completedCities: [], startTime: new Date().toISOString() };
}

function saveProgress(progress) {
    progress.lastUpdate = new Date().toISOString();
    fs.writeFileSync(CONFIG.progressFile, JSON.stringify(progress, null, 2));
}

function loadCSV(filePath) {
    if (!fs.existsSync(filePath)) return [];
    return parse(fs.readFileSync(filePath, 'utf8'), { columns: true, skip_empty_lines: true, trim: true });
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function appendCSV(filePath, data, headers) {
    const exists = fs.existsSync(filePath);
    fs.appendFileSync(filePath, stringify([data], { header: !exists, columns: headers }));
}

// ============================================
// GENERATORS
// ============================================

async function generateState(state) {
    const { name, code, slug } = state;
    const data = STATE_DATA[slug] || STATE_DATA['california'];

    log(`Generating: ${name} (${code})`);

    try {
        const response = await callAPI(PROMPTS.state(name, code, data));
        const content = parseJSON(response);

        return {
            state_name: name, state_code: code, state_slug: slug, country_code: 'us',
            insurance_type: 'home-insurance',
            avg_premium: data.avgPremium, natural_disasters: data.naturalDisasters, risk_level: data.riskLevel,
            meta_title: content.metaTitle || '', meta_description: content.metaDescription || '',
            h1_title: content.h1Title || '', hero_tagline: content.heroTagline || '',
            hero_description: content.heroDescription || '',
            intro_paragraph_1: content.introParagraph1 || '',
            intro_paragraph_2: content.introParagraph2 || '',
            intro_paragraph_3: content.introParagraph3 || '',
            state_insights: JSON.stringify(content.stateInsights || {}),
            local_factors: JSON.stringify(content.localFactors || []),
            coverage_tips: JSON.stringify(content.coverageTips || []),
            discounts_list: JSON.stringify(content.discountsList || []),
            top_insurers: JSON.stringify(TOP_INSURERS),
            faqs: JSON.stringify(content.faqs || []),
            cta_text: content.ctaText || `Compare ${name} Home Insurance`,
            cta_subtext: 'Find the best rates in minutes',
            cta_url: CONFIG.defaultAffiliateUrl,
            generated_at: new Date().toISOString(), status: 'success'
        };
    } catch (error) {
        log(`Failed: ${name} - ${error.message}`, 'ERROR');
        return { state_name: name, state_code: code, state_slug: slug, status: `error: ${error.message}`, generated_at: new Date().toISOString() };
    }
}

async function generateCity(city, stateMap) {
    const cityName = city.name;
    const citySlug = city.slug;
    const stateSlug = city.state_slug;
    const stateInfo = stateMap.get(stateSlug) || { name: stateSlug, code: '' };
    const data = STATE_DATA[stateSlug] || STATE_DATA['california'];

    log(`Generating: ${cityName}, ${stateInfo.name}`);

    try {
        const response = await callAPI(PROMPTS.city(cityName, stateInfo.name, stateInfo.code, data));
        const content = parseJSON(response);

        return {
            city_name: cityName, city_slug: citySlug,
            state_name: stateInfo.name, state_code: stateInfo.code, state_slug: stateSlug,
            country_code: 'us', insurance_type: 'home-insurance',
            meta_title: content.metaTitle || '', meta_description: content.metaDescription || '',
            h1_title: content.h1Title || '', hero_tagline: content.heroTagline || '',
            hero_description: content.heroDescription || '',
            intro_paragraph_1: content.introParagraph1 || '',
            intro_paragraph_2: content.introParagraph2 || '',
            intro_paragraph_3: content.introParagraph3 || '',
            city_insights: JSON.stringify(content.cityInsights || {}),
            local_factors: JSON.stringify(content.localFactors || []),
            neighborhood_guide: content.neighborhoodGuide || '',
            coverage_tips: JSON.stringify(content.coverageTips || []),
            top_insurers: JSON.stringify(TOP_INSURERS),
            faqs: JSON.stringify(content.faqs || []),
            cta_text: content.ctaText || `Get ${cityName} Quote`,
            cta_subtext: 'Compare rates from top insurers',
            cta_url: CONFIG.defaultAffiliateUrl,
            generated_at: new Date().toISOString(), status: 'success'
        };
    } catch (error) {
        log(`Failed: ${cityName} - ${error.message}`, 'ERROR');
        return { city_name: cityName, city_slug: citySlug, state_slug: stateSlug, status: `error: ${error.message}`, generated_at: new Date().toISOString() };
    }
}

// ============================================
// MAIN
// ============================================

let isShuttingDown = false;
process.on('SIGTERM', () => { log('SIGTERM received', 'WARN'); isShuttingDown = true; });
process.on('SIGINT', () => { log('SIGINT received', 'WARN'); isShuttingDown = true; });

async function main() {
    log('='.repeat(50));
    log('Home Insurance Content Generator - VPS Mode');
    log('='.repeat(50));

    if (!CONFIG.openrouterApiKey) {
        log('ERROR: OPENROUTER_API_KEY not set', 'ERROR');
        process.exit(1);
    }

    ensureDir(CONFIG.outputDir);

    const progress = loadProgress();
    const states = loadCSV(CONFIG.statesFile);
    const cities = loadCSV(CONFIG.citiesFile);

    log(`Loaded: ${states.length} states, ${cities.length} cities`);
    log(`Progress: ${progress.completedStates.length} states, ${progress.completedCities.length} cities done`);

    const stateHeaders = ['state_name', 'state_code', 'state_slug', 'country_code', 'insurance_type', 'avg_premium', 'natural_disasters', 'risk_level', 'meta_title', 'meta_description', 'h1_title', 'hero_tagline', 'hero_description', 'intro_paragraph_1', 'intro_paragraph_2', 'intro_paragraph_3', 'state_insights', 'local_factors', 'coverage_tips', 'discounts_list', 'top_insurers', 'faqs', 'cta_text', 'cta_subtext', 'cta_url', 'generated_at', 'status'];
    const cityHeaders = ['city_name', 'city_slug', 'state_name', 'state_code', 'state_slug', 'country_code', 'insurance_type', 'meta_title', 'meta_description', 'h1_title', 'hero_tagline', 'hero_description', 'intro_paragraph_1', 'intro_paragraph_2', 'intro_paragraph_3', 'city_insights', 'local_factors', 'neighborhood_guide', 'coverage_tips', 'top_insurers', 'faqs', 'cta_text', 'cta_subtext', 'cta_url', 'generated_at', 'status'];

    const stateMap = new Map();
    states.forEach(s => stateMap.set(s.slug, { name: s.name, code: s.code, slug: s.slug }));

    // States
    log('--- Processing States ---');
    for (const state of states) {
        if (isShuttingDown) break;
        if (progress.completedStates.includes(state.slug)) continue;

        const content = await generateState(state);
        appendCSV(CONFIG.statesOutputFile, content, stateHeaders);
        progress.completedStates.push(state.slug);
        saveProgress(progress);
        log(`✓ ${state.name} (${progress.completedStates.length}/${states.length})`);
        await sleep(CONFIG.baseDelay);
    }

    // Cities
    if (!isShuttingDown) {
        log('--- Processing Cities ---');
        for (const city of cities) {
            if (isShuttingDown) break;
            const key = `${city.state_slug}-${city.slug}`;
            if (progress.completedCities.includes(key)) continue;

            const content = await generateCity(city, stateMap);
            appendCSV(CONFIG.citiesOutputFile, content, cityHeaders);
            progress.completedCities.push(key);
            saveProgress(progress);
            log(`✓ ${city.name} (${progress.completedCities.length}/${cities.length})`);
            await sleep(CONFIG.baseDelay);
        }
    }

    const allDone = progress.completedStates.length === states.length && progress.completedCities.length === cities.length;
    log('='.repeat(50));
    log(allDone ? '🎉 COMPLETE!' : '⏸️ Paused. Run again to resume.');
    log(`States: ${progress.completedStates.length}/${states.length}`);
    log(`Cities: ${progress.completedCities.length}/${cities.length}`);
    log('='.repeat(50));
}

main().catch(err => { log(`Fatal: ${err.message}`, 'ERROR'); process.exit(1); });
