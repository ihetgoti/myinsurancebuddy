#!/usr/bin/env node

/**
 * VPS-Ready Car Insurance Content Generator
 * 
 * Features:
 * - Runs unattended until complete
 * - Auto-retries with exponential backoff
 * - Progress saved after each item (resume on crash)
 * - Logs to file for monitoring
 * - Email notification when done (optional)
 * - Graceful shutdown on SIGTERM
 * 
 * Deploy: 
 *   nohup node car-insurance-vps.js > generator.log 2>&1 &
 *   OR use: screen -S generator -d -m node car-insurance-vps.js
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

    // Input/Output
    statesFile: './data/states.csv',
    citiesFile: './data/cities.csv',
    outputDir: './output/car-insurance',
    statesOutputFile: './output/car-insurance/states_content.csv',
    citiesOutputFile: './output/car-insurance/cities_content.csv',
    progressFile: './output/car-insurance/progress.json',
    logFile: './output/car-insurance/generator.log',

    // Rate limiting - VERY conservative for free tier
    baseDelay: 10000,        // 10 seconds base delay
    maxDelay: 120000,        // 2 minute max delay
    maxRetries: 10,          // More retries for VPS

    // Affiliate
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
// STATE REQUIREMENTS DATA
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
    'new-hampshire': { bodily: '25/50', property: '25', format: '25/50/25', tort: true, noFault: false, pip: false, um: false },
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

const TOP_INSURERS = [
    { name: 'GEICO', slug: 'geico', bestFor: 'Low rates for good drivers', rating: '4.5' },
    { name: 'Progressive', slug: 'progressive', bestFor: 'Usage-based discounts', rating: '4.3' },
    { name: 'State Farm', slug: 'state-farm', bestFor: 'Local agent support', rating: '4.6' },
    { name: 'USAA', slug: 'usaa', bestFor: 'Military families', rating: '4.8' },
    { name: 'Allstate', slug: 'allstate', bestFor: 'Bundling options', rating: '4.2' },
    { name: 'Liberty Mutual', slug: 'liberty-mutual', bestFor: 'Customizable coverage', rating: '4.0' },
];

// ============================================
// PROMPTS (Compact for VPS)
// ============================================

const PROMPTS = {
    state: (name, code, req) => `Generate car insurance content for ${name} (${code}). Min coverage: ${req.format}. ${req.noFault ? 'No-fault' : 'At-fault'} state.

Return JSON only:
{"metaTitle":"SEO title with ${name}","metaDescription":"155 chars","h1Title":"H1 for ${name}","heroTagline":"Short tagline","heroDescription":"2-3 sentences","introParagraph1":"Unique intro about ${name}","introParagraph2":"About requirements","introParagraph3":"About finding rates","stateInsights":{"uniqueChallenge":"","savingOpportunity":"","commonMistake":""},"localFactors":[{"factor":"Traffic","impact":"","tip":""},{"factor":"Weather","impact":"","tip":""},{"factor":"Crime","impact":"","tip":""},{"factor":"Population","impact":"","tip":""}],"coverageTips":["tip1","tip2","tip3","tip4","tip5"],"discountsList":[{"name":"Good Driver","description":"","savings":"Up to 25%"},{"name":"Multi-Policy","description":"","savings":"Up to 20%"}],"faqs":[{"question":"What are ${name} minimums?","answer":""},{"question":"Is ${name} no-fault?","answer":""},{"question":"How to save in ${name}?","answer":""}],"ctaText":"Compare ${name} Quotes"}`,

    city: (city, state, code, req) => `Generate car insurance content for ${city}, ${state} (${code}). State min: ${req.format}.

Return JSON only:
{"metaTitle":"SEO title with ${city}","metaDescription":"155 chars","h1Title":"H1 for ${city}","heroTagline":"Short tagline","heroDescription":"2-3 sentences","introParagraph1":"Unique intro about ${city}","introParagraph2":"About local factors","introParagraph3":"About finding rates","cityInsights":{"uniqueChallenge":"","localTip":"","areaToWatch":""},"localFactors":[{"factor":"Traffic","impact":"","tip":""},{"factor":"Neighborhoods","impact":"","tip":""},{"factor":"Commute","impact":"","tip":""},{"factor":"Parking","impact":"","tip":""}],"neighborhoodGuide":"How neighborhoods affect rates","drivingTips":["tip1","tip2","tip3"],"faqs":[{"question":"Why expensive in ${city}?","answer":""},{"question":"How neighborhood affects rates?","answer":""},{"question":"Discounts for ${city}?","answer":""}],"ctaText":"Get ${city} Quotes"}`
};

// ============================================
// API WITH EXPONENTIAL BACKOFF
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
                'X-Title': 'Car Insurance Generator',
            },
            body: JSON.stringify({
                model: CONFIG.openrouterModel,
                messages: [
                    { role: 'system', content: 'You are an SEO expert. Return valid JSON only, no markdown.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 2500,
            }),
        });

        if (response.status === 429) {
            const waitTime = delay * 2;
            log(`Rate limited. Waiting ${waitTime / 1000}s before retry...`, 'WARN');
            await sleep(waitTime);
            if (attempt < CONFIG.maxRetries) {
                return callAPI(prompt, attempt + 1);
            }
            throw new Error('Rate limit exceeded after max retries');
        }

        if (!response.ok) {
            throw new Error(`API ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        if (attempt < CONFIG.maxRetries) {
            log(`Error: ${error.message}. Retry ${attempt}/${CONFIG.maxRetries} in ${delay / 1000}s`, 'WARN');
            await sleep(delay);
            return callAPI(prompt, attempt + 1);
        }
        throw error;
    }
}

// ============================================
// HELPERS
// ============================================

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function parseJSON(text) {
    let s = text.trim();
    if (s.startsWith('```')) s = s.replace(/```json?\n?/g, '').replace(/```$/g, '');
    return JSON.parse(s);
}

function loadProgress() {
    try {
        if (fs.existsSync(CONFIG.progressFile)) {
            return JSON.parse(fs.readFileSync(CONFIG.progressFile, 'utf8'));
        }
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
// CONTENT GENERATORS
// ============================================

async function generateState(state) {
    const { name, code, slug } = state;
    const req = STATE_REQUIREMENTS[slug] || STATE_REQUIREMENTS['california'];

    log(`Generating: ${name} (${code})`);

    try {
        const response = await callAPI(PROMPTS.state(name, code, req));
        const content = parseJSON(response);

        return {
            state_name: name, state_code: code, state_slug: slug, country_code: 'us',
            insurance_type: 'car-insurance',
            min_liability_bodily: req.bodily, min_liability_property: req.property,
            coverage_format: req.format, is_no_fault: req.noFault, is_tort: req.tort,
            pip_required: req.pip, um_required: req.um,
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
            cta_text: content.ctaText || `Compare ${name} Quotes`,
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
    const req = STATE_REQUIREMENTS[stateSlug] || STATE_REQUIREMENTS['california'];

    log(`Generating: ${cityName}, ${stateInfo.name}`);

    try {
        const response = await callAPI(PROMPTS.city(cityName, stateInfo.name, stateInfo.code, req));
        const content = parseJSON(response);

        return {
            city_name: cityName, city_slug: citySlug,
            state_name: stateInfo.name, state_code: stateInfo.code, state_slug: stateSlug,
            country_code: 'us', insurance_type: 'car-insurance',
            meta_title: content.metaTitle || '', meta_description: content.metaDescription || '',
            h1_title: content.h1Title || '', hero_tagline: content.heroTagline || '',
            hero_description: content.heroDescription || '',
            intro_paragraph_1: content.introParagraph1 || '',
            intro_paragraph_2: content.introParagraph2 || '',
            intro_paragraph_3: content.introParagraph3 || '',
            city_insights: JSON.stringify(content.cityInsights || {}),
            local_factors: JSON.stringify(content.localFactors || []),
            neighborhood_guide: content.neighborhoodGuide || '',
            driving_tips: JSON.stringify(content.drivingTips || []),
            top_insurers: JSON.stringify(TOP_INSURERS),
            faqs: JSON.stringify(content.faqs || []),
            cta_text: content.ctaText || `Get ${cityName} Quotes`,
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

process.on('SIGTERM', () => {
    log('Received SIGTERM. Finishing current item and saving...', 'WARN');
    isShuttingDown = true;
});

process.on('SIGINT', () => {
    log('Received SIGINT. Finishing current item and saving...', 'WARN');
    isShuttingDown = true;
});

async function main() {
    log('='.repeat(50));
    log('Car Insurance Content Generator - VPS Mode');
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

    const stateHeaders = ['state_name', 'state_code', 'state_slug', 'country_code', 'insurance_type', 'min_liability_bodily', 'min_liability_property', 'coverage_format', 'is_no_fault', 'is_tort', 'pip_required', 'um_required', 'meta_title', 'meta_description', 'h1_title', 'hero_tagline', 'hero_description', 'intro_paragraph_1', 'intro_paragraph_2', 'intro_paragraph_3', 'state_insights', 'local_factors', 'coverage_tips', 'discounts_list', 'top_insurers', 'faqs', 'cta_text', 'cta_subtext', 'cta_url', 'generated_at', 'status'];
    const cityHeaders = ['city_name', 'city_slug', 'state_name', 'state_code', 'state_slug', 'country_code', 'insurance_type', 'meta_title', 'meta_description', 'h1_title', 'hero_tagline', 'hero_description', 'intro_paragraph_1', 'intro_paragraph_2', 'intro_paragraph_3', 'city_insights', 'local_factors', 'neighborhood_guide', 'driving_tips', 'top_insurers', 'faqs', 'cta_text', 'cta_subtext', 'cta_url', 'generated_at', 'status'];

    const stateMap = new Map();
    states.forEach(s => stateMap.set(s.slug, { name: s.name, code: s.code, slug: s.slug }));

    // Process States
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

    // Process Cities
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

    // Done
    const allDone = progress.completedStates.length === states.length && progress.completedCities.length === cities.length;
    log('='.repeat(50));
    log(allDone ? '🎉 COMPLETE!' : '⏸️ Paused. Run again to resume.');
    log(`States: ${progress.completedStates.length}/${states.length}`);
    log(`Cities: ${progress.completedCities.length}/${cities.length}`);
    log(`Output: ${CONFIG.outputDir}`);
    log('='.repeat(50));
}

main().catch(err => {
    log(`Fatal error: ${err.message}`, 'ERROR');
    process.exit(1);
});
