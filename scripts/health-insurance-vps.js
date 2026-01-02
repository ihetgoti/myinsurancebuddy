#!/usr/bin/env node

/**
 * VPS-Ready Health Insurance Content Generator
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
    outputDir: './output/health-insurance',
    statesOutputFile: './output/health-insurance/states_content.csv',
    citiesOutputFile: './output/health-insurance/cities_content.csv',
    progressFile: './output/health-insurance/progress.json',
    logFile: './output/health-insurance/generator.log',

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
    try { fs.appendFileSync(CONFIG.logFile, logLine + '\n'); } catch (e) { }
}

// ============================================
// HEALTH INSURANCE STATE DATA
// ============================================

const STATE_DATA = {
    'alabama': { exchangeType: 'FFM', medicaidExpanded: false, avgPremium: '$450/mo', uninsuredRate: '10%' },
    'alaska': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$720/mo', uninsuredRate: '12%' },
    'arizona': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$420/mo', uninsuredRate: '9%' },
    'arkansas': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$380/mo', uninsuredRate: '8%' },
    'california': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$520/mo', uninsuredRate: '7%' },
    'colorado': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$430/mo', uninsuredRate: '7%' },
    'connecticut': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$580/mo', uninsuredRate: '5%' },
    'delaware': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$490/mo', uninsuredRate: '6%' },
    'florida': { exchangeType: 'FFM', medicaidExpanded: false, avgPremium: '$480/mo', uninsuredRate: '13%' },
    'georgia': { exchangeType: 'FFM', medicaidExpanded: false, avgPremium: '$450/mo', uninsuredRate: '14%' },
    'hawaii': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$400/mo', uninsuredRate: '4%' },
    'idaho': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$430/mo', uninsuredRate: '9%' },
    'illinois': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$420/mo', uninsuredRate: '7%' },
    'indiana': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$400/mo', uninsuredRate: '8%' },
    'iowa': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$450/mo', uninsuredRate: '5%' },
    'kansas': { exchangeType: 'FFM', medicaidExpanded: false, avgPremium: '$420/mo', uninsuredRate: '10%' },
    'kentucky': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$400/mo', uninsuredRate: '6%' },
    'louisiana': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$480/mo', uninsuredRate: '8%' },
    'maine': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$500/mo', uninsuredRate: '6%' },
    'maryland': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$450/mo', uninsuredRate: '6%' },
    'massachusetts': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$480/mo', uninsuredRate: '3%' },
    'michigan': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$380/mo', uninsuredRate: '6%' },
    'minnesota': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$320/mo', uninsuredRate: '5%' },
    'mississippi': { exchangeType: 'FFM', medicaidExpanded: false, avgPremium: '$450/mo', uninsuredRate: '12%' },
    'missouri': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$480/mo', uninsuredRate: '10%' },
    'montana': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$520/mo', uninsuredRate: '8%' },
    'nebraska': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$500/mo', uninsuredRate: '8%' },
    'nevada': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$420/mo', uninsuredRate: '11%' },
    'new-hampshire': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$380/mo', uninsuredRate: '6%' },
    'new-jersey': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$480/mo', uninsuredRate: '7%' },
    'new-mexico': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$350/mo', uninsuredRate: '9%' },
    'new-york': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$600/mo', uninsuredRate: '5%' },
    'north-carolina': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$530/mo', uninsuredRate: '11%' },
    'north-dakota': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$420/mo', uninsuredRate: '7%' },
    'ohio': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$400/mo', uninsuredRate: '6%' },
    'oklahoma': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$480/mo', uninsuredRate: '14%' },
    'oregon': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$450/mo', uninsuredRate: '6%' },
    'pennsylvania': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$450/mo', uninsuredRate: '6%' },
    'rhode-island': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$380/mo', uninsuredRate: '4%' },
    'south-carolina': { exchangeType: 'FFM', medicaidExpanded: false, avgPremium: '$480/mo', uninsuredRate: '11%' },
    'south-dakota': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$500/mo', uninsuredRate: '9%' },
    'tennessee': { exchangeType: 'FFM', medicaidExpanded: false, avgPremium: '$450/mo', uninsuredRate: '10%' },
    'texas': { exchangeType: 'FFM', medicaidExpanded: false, avgPremium: '$450/mo', uninsuredRate: '18%' },
    'utah': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$400/mo', uninsuredRate: '10%' },
    'vermont': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$550/mo', uninsuredRate: '4%' },
    'virginia': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$450/mo', uninsuredRate: '8%' },
    'washington': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$420/mo', uninsuredRate: '6%' },
    'west-virginia': { exchangeType: 'FFM', medicaidExpanded: true, avgPremium: '$520/mo', uninsuredRate: '6%' },
    'wisconsin': { exchangeType: 'FFM', medicaidExpanded: false, avgPremium: '$450/mo', uninsuredRate: '5%' },
    'wyoming': { exchangeType: 'FFM', medicaidExpanded: false, avgPremium: '$600/mo', uninsuredRate: '12%' },
    'district-of-columbia': { exchangeType: 'SBM', medicaidExpanded: true, avgPremium: '$420/mo', uninsuredRate: '4%' },
};

const TOP_INSURERS = [
    { name: 'Blue Cross Blue Shield', slug: 'bcbs', bestFor: 'Wide network coverage', rating: '4.5' },
    { name: 'UnitedHealthcare', slug: 'unitedhealthcare', bestFor: 'Large employer plans', rating: '4.3' },
    { name: 'Aetna', slug: 'aetna', bestFor: 'Preventive care', rating: '4.2' },
    { name: 'Cigna', slug: 'cigna', bestFor: 'Mental health coverage', rating: '4.1' },
    { name: 'Kaiser Permanente', slug: 'kaiser', bestFor: 'Integrated care', rating: '4.6' },
    { name: 'Humana', slug: 'humana', bestFor: 'Medicare Advantage', rating: '4.0' },
];

// ============================================
// PROMPTS
// ============================================

const PROMPTS = {
    state: (name, code, data) => `Generate health insurance content for ${name} (${code}). Exchange: ${data.exchangeType}. Medicaid expanded: ${data.medicaidExpanded ? 'Yes' : 'No'}. Uninsured rate: ${data.uninsuredRate}.

Return JSON only:
{"metaTitle":"SEO title with ${name} Health Insurance","metaDescription":"155 chars about health insurance in ${name}","h1Title":"H1 for ${name} health insurance","heroTagline":"Short tagline","heroDescription":"2-3 sentences about finding health coverage in ${name}","introParagraph1":"Unique intro about healthcare in ${name}","introParagraph2":"About coverage options and marketplace","introParagraph3":"About finding affordable plans","stateInsights":{"uniqueFactor":"Specific healthcare factor for ${name}","savingOpportunity":"How to save on health insurance","commonMistake":"Mistake people make"},"localFactors":[{"factor":"Marketplace","impact":"${data.exchangeType === 'SBM' ? 'State-based marketplace' : 'Federal marketplace (healthcare.gov)'}","tip":""},{"factor":"Medicaid","impact":"${data.medicaidExpanded ? 'Expanded Medicaid available' : 'Limited Medicaid eligibility'}","tip":""},{"factor":"Subsidies","impact":"Premium tax credits availability","tip":""},{"factor":"Providers","impact":"Network availability in ${name}","tip":""}],"coverageTips":["tip about enrollment periods","tip about plan tiers","tip about subsidies","tip about preventive care","tip about prescription coverage"],"planTypes":[{"name":"Bronze","description":"60% coverage, lowest premium","bestFor":"Healthy, low usage"},{"name":"Silver","description":"70% coverage, CSR eligible","bestFor":"Moderate healthcare needs"},{"name":"Gold","description":"80% coverage","bestFor":"Regular medical care"},{"name":"Platinum","description":"90% coverage, highest premium","bestFor":"Frequent healthcare users"}],"faqs":[{"question":"When is open enrollment in ${name}?","answer":""},{"question":"Do I qualify for Medicaid in ${name}?","answer":""},{"question":"How to get subsidies in ${name}?","answer":""}],"ctaText":"Compare ${name} Health Plans"}`,

    city: (city, state, code, data) => `Generate health insurance content for ${city}, ${state} (${code}). State exchange: ${data.exchangeType}.

Return JSON only:
{"metaTitle":"SEO title with ${city} Health Insurance","metaDescription":"155 chars for ${city} residents","h1Title":"H1 for ${city}","heroTagline":"Short tagline for ${city} residents","heroDescription":"2-3 sentences about health insurance in ${city}","introParagraph1":"Unique intro about healthcare in ${city}","introParagraph2":"About local coverage options","introParagraph3":"About finding affordable plans in ${city}","cityInsights":{"uniqueFactor":"Specific healthcare factor in ${city}","localTip":"Insider tip for ${city} residents","areaToWatch":"Healthcare consideration for area"},"localFactors":[{"factor":"Hospitals","impact":"Major hospitals and health systems","tip":""},{"factor":"Specialists","impact":"Specialist availability","tip":""},{"factor":"Urgent Care","impact":"Walk-in clinic options","tip":""},{"factor":"Telehealth","impact":"Virtual care availability","tip":""}],"providerGuide":"How to find in-network providers in ${city}","coverageTips":["local tip 1","local tip 2","local tip 3"],"faqs":[{"question":"Best health insurance in ${city}?","answer":""},{"question":"Where to find affordable coverage in ${city}?","answer":""},{"question":"What hospitals are covered in ${city}?","answer":""}],"ctaText":"Get ${city} Health Insurance Quote"}`
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
                'X-Title': 'Health Insurance Generator',
            },
            body: JSON.stringify({
                model: CONFIG.openrouterModel,
                messages: [
                    { role: 'system', content: 'You are an SEO expert for health insurance. Return valid JSON only, no markdown.' },
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
            insurance_type: 'health-insurance',
            exchange_type: data.exchangeType, medicaid_expanded: data.medicaidExpanded,
            avg_premium: data.avgPremium, uninsured_rate: data.uninsuredRate,
            meta_title: content.metaTitle || '', meta_description: content.metaDescription || '',
            h1_title: content.h1Title || '', hero_tagline: content.heroTagline || '',
            hero_description: content.heroDescription || '',
            intro_paragraph_1: content.introParagraph1 || '',
            intro_paragraph_2: content.introParagraph2 || '',
            intro_paragraph_3: content.introParagraph3 || '',
            state_insights: JSON.stringify(content.stateInsights || {}),
            local_factors: JSON.stringify(content.localFactors || []),
            coverage_tips: JSON.stringify(content.coverageTips || []),
            plan_types: JSON.stringify(content.planTypes || []),
            top_insurers: JSON.stringify(TOP_INSURERS),
            faqs: JSON.stringify(content.faqs || []),
            cta_text: content.ctaText || `Compare ${name} Health Plans`,
            cta_subtext: 'Find affordable coverage today',
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
            country_code: 'us', insurance_type: 'health-insurance',
            meta_title: content.metaTitle || '', meta_description: content.metaDescription || '',
            h1_title: content.h1Title || '', hero_tagline: content.heroTagline || '',
            hero_description: content.heroDescription || '',
            intro_paragraph_1: content.introParagraph1 || '',
            intro_paragraph_2: content.introParagraph2 || '',
            intro_paragraph_3: content.introParagraph3 || '',
            city_insights: JSON.stringify(content.cityInsights || {}),
            local_factors: JSON.stringify(content.localFactors || []),
            provider_guide: content.providerGuide || '',
            coverage_tips: JSON.stringify(content.coverageTips || []),
            top_insurers: JSON.stringify(TOP_INSURERS),
            faqs: JSON.stringify(content.faqs || []),
            cta_text: content.ctaText || `Get ${cityName} Quote`,
            cta_subtext: 'Compare health plans today',
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
    log('Health Insurance Content Generator - VPS Mode');
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

    const stateHeaders = ['state_name', 'state_code', 'state_slug', 'country_code', 'insurance_type', 'exchange_type', 'medicaid_expanded', 'avg_premium', 'uninsured_rate', 'meta_title', 'meta_description', 'h1_title', 'hero_tagline', 'hero_description', 'intro_paragraph_1', 'intro_paragraph_2', 'intro_paragraph_3', 'state_insights', 'local_factors', 'coverage_tips', 'plan_types', 'top_insurers', 'faqs', 'cta_text', 'cta_subtext', 'cta_url', 'generated_at', 'status'];
    const cityHeaders = ['city_name', 'city_slug', 'state_name', 'state_code', 'state_slug', 'country_code', 'insurance_type', 'meta_title', 'meta_description', 'h1_title', 'hero_tagline', 'hero_description', 'intro_paragraph_1', 'intro_paragraph_2', 'intro_paragraph_3', 'city_insights', 'local_factors', 'provider_guide', 'coverage_tips', 'top_insurers', 'faqs', 'cta_text', 'cta_subtext', 'cta_url', 'generated_at', 'status'];

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
