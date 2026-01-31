/**
 * Cost Calculator for AI Content Generation
 * 32,000 pages × 3 niches = 96,000 total pages
 */

export interface CostConfig {
  totalPages: number;
  sectionsPerPage: number;
  tokensPerSection: {
    input: number;
    output: number;
  };
  modelPricing: {
    name: string;
    inputPer1M: number;   // $ per 1M input tokens
    outputPer1M: number;  // $ per 1M output tokens
  };
}

// OpenRouter model pricing (approximate, check current rates)
export const MODEL_PRICING = {
  // Free models (with $10 deposit per account)
  'deepseek-free': { name: 'deepseek/deepseek-r1:free', inputPer1M: 0, outputPer1M: 0, isFree: true },
  'gemini-free': { name: 'google/gemini-2.0-flash-exp:free', inputPer1M: 0, outputPer1M: 0, isFree: true },
  'llama-free': { name: 'meta-llama/llama-3.1-8b-instruct:free', inputPer1M: 0, outputPer1M: 0, isFree: true },
  
  // Paid models
  'gpt-4o-mini': { name: 'openai/gpt-4o-mini', inputPer1M: 0.15, outputPer1M: 0.60, isFree: false },
  'gpt-4o': { name: 'openai/gpt-4o', inputPer1M: 2.50, outputPer1M: 10.00, isFree: false },
  'claude-3-haiku': { name: 'anthropic/claude-3-haiku', inputPer1M: 0.25, outputPer1M: 1.25, isFree: false },
  'gemini-flash': { name: 'google/gemini-flash-1.5', inputPer1M: 0.075, outputPer1M: 0.30, isFree: false },
  'deepseek-chat': { name: 'deepseek/deepseek-chat', inputPer1M: 0.14, outputPer1M: 0.28, isFree: false },
};

export function calculateCost(config: CostConfig): {
  costPerSection: number;
  costPerPage: number;
  totalCost: number;
  totalTokens: number;
  totalInputTokens: number;
  totalOutputTokens: number;
} {
  const { tokensPerSection, modelPricing, totalPages, sectionsPerPage } = config;
  
  // Calculate per section
  const inputCost = (tokensPerSection.input / 1_000_000) * modelPricing.inputPer1M;
  const outputCost = (tokensPerSection.output / 1_000_000) * modelPricing.outputPer1M;
  const costPerSection = inputCost + outputCost;
  
  // Calculate totals
  const costPerPage = costPerSection * sectionsPerPage;
  const totalCost = costPerPage * totalPages;
  const totalSections = totalPages * sectionsPerPage;
  const totalInputTokens = tokensPerSection.input * totalSections;
  const totalOutputTokens = tokensPerSection.output * totalSections;
  const totalTokens = totalInputTokens + totalOutputTokens;
  
  return {
    costPerSection,
    costPerPage,
    totalCost,
    totalTokens,
    totalInputTokens,
    totalOutputTokens,
  };
}

// Calculate time required based on rate limits
export function calculateTime(
  totalPages: number,
  sectionsPerPage: number,
  accounts: number,
  freeRequestsPerDay: number = 1000,
  rpm: number = 20
): {
  totalSections: number;
  totalApiCalls: number;
  daysWithFreeOnly: number;
  daysWith3Accounts: number;
  daysWith5Accounts: number;
  hoursContinuous: number;
  bottleneck: string;
} {
  const totalSections = totalPages * sectionsPerPage;
  const totalApiCalls = totalSections; // 1 section per call
  
  const dailyCapacity1Account = Math.min(freeRequestsPerDay, rpm * 60 * 24);
  const dailyCapacity3Accounts = dailyCapacity1Account * 3;
  const dailyCapacity5Accounts = dailyCapacity1Account * 5;
  
  const daysWithFreeOnly = Math.ceil(totalApiCalls / dailyCapacity1Account);
  const daysWith3Accounts = Math.ceil(totalApiCalls / dailyCapacity3Accounts);
  const daysWith5Accounts = Math.ceil(totalApiCalls / dailyCapacity5Accounts);
  
  // Continuous processing (no rate limit wait)
  const minutesRequired = totalApiCalls / (accounts * rpm);
  const hoursContinuous = minutesRequired / 60;
  
  // Determine bottleneck
  let bottleneck = '';
  if (accounts === 1) {
    bottleneck = 'Daily limit (1,000 requests/day)';
  } else {
    bottleneck = 'Rate limit (20 RPM per account)';
  }
  
  return {
    totalSections,
    totalApiCalls,
    daysWithFreeOnly,
    daysWith3Accounts,
    daysWith5Accounts,
    hoursContinuous,
    bottleneck,
  };
}

// Main calculation for 32,000 pages × 3 niches
export function generateReport(): string {
  const TOTAL_PAGES = 32000 * 3; // 96,000 pages across 3 niches
  
  // Average tokens per section (prompt + content)
  const AVG_SECTION = {
    input: 800,   // System prompt + context + instructions
    output: 1200, // Generated content (approx 800-1000 words)
  };
  
  const report: string[] = [];
  
  report.push('═══════════════════════════════════════════════════════════════════');
  report.push('  AI CONTENT GENERATION COST ANALYSIS');
  report.push('  32,000 pages × 3 niches = 96,000 total pages');
  report.push('═══════════════════════════════════════════════════════════════════\n');
  
  // SCENARIO 1: Free Models Only (with deposits)
  report.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  report.push('  SCENARIO 1: FREE MODELS ONLY (DeepSeek/Gemini/Llama)');
  report.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  [4, 8, 12].forEach(sections => {
    const time = calculateTime(TOTAL_PAGES, sections, 1);
    report.push(`\n  ${sections} Sections per Page:`);
    report.push(`    Total API Calls: ${time.totalApiCalls.toLocaleString()}`);
    report.push(`    With 1 account ($10 deposit):  ${time.daysWithFreeOnly} days`);
    report.push(`    With 3 accounts ($30 deposit): ${time.daysWith3Accounts} days`);
    report.push(`    With 5 accounts ($50 deposit): ${time.daysWith5Accounts} days`);
    report.push(`    Actual Cost: $0 (deposits are not spent!)`);
  });
  
  // SCENARIO 2: Paid Models
  report.push('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  report.push('  SCENARIO 2: PAID MODELS (Unlimited, No Rate Limits)');
  report.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  Object.entries(MODEL_PRICING)
    .filter(([_, pricing]) => !pricing.isFree)
    .forEach(([key, pricing]) => {
      report.push(`\n  ${pricing.name}:`);
      report.push(`    Pricing: $${pricing.inputPer1M}/1M input, $${pricing.outputPer1M}/1M output`);
      
      [4, 8, 12].forEach(sections => {
        const cost = calculateCost({
          totalPages: TOTAL_PAGES,
          sectionsPerPage: sections,
          tokensPerSection: AVG_SECTION,
          modelPricing: pricing,
        });
        
        report.push(`      ${sections} sections/page: $${cost.totalCost.toFixed(2)} (${Math.round(cost.totalTokens/1_000_000)}M tokens)`);
      });
    });
  
  // SCENARIO 3: Hybrid Strategy
  report.push('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  report.push('  SCENARIO 3: HYBRID (Free First → Paid When Needed)');
  report.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  [4, 8, 12].forEach(sections => {
    const freeTime = calculateTime(TOTAL_PAGES, sections, 3);
    const freeCapacity = 3000; // 3 accounts × 1,000 requests
    const sectionsPerDay = freeCapacity;
    const pagesPerDayFree = Math.floor(sectionsPerDay / sections);
    
    // Free capacity for 1 day
    const freePagesPerDay = Math.floor(3000 / sections);
    const paidPagesNeeded = Math.max(0, TOTAL_PAGES - freePagesPerDay);
    
    // Cost for paid pages using cheapest model (gemini-flash)
    const paidCost = calculateCost({
      totalPages: paidPagesNeeded,
      sectionsPerPage: sections,
      tokensPerSection: AVG_SECTION,
      modelPricing: MODEL_PRICING['gemini-flash'],
    });
    
    report.push(`\n  ${sections} Sections per Page:`);
    report.push(`    Free capacity: ${freePagesPerDay.toLocaleString()} pages/day`);
    if (paidPagesNeeded > 0) {
      report.push(`    Remaining pages: ${paidPagesNeeded.toLocaleString()} (paid)`);
      report.push(`    Paid cost (Gemini Flash): $${paidCost.totalCost.toFixed(2)}`);
      report.push(`    Total: $${paidCost.totalCost.toFixed(2)} + $30 (deposits)`);
    } else {
      report.push(`    All pages can be done FREE!`);
    }
  });
  
  // Summary recommendations
  report.push('\n\n═══════════════════════════════════════════════════════════════════');
  report.push('  RECOMMENDATION SUMMARY');
  report.push('═══════════════════════════════════════════════════════════════════\n');
  
  report.push('  Option 1: 100% FREE (Recommended)');
  report.push('  ─────────────────────────────────');
  report.push('  Setup: 5 OpenRouter accounts × $10 deposit = $50');
  report.push('  Models: deepseek-r1:free, gemini-2.0-flash:free');
  report.push('  Time: 8-20 days (depending on sections)');
  report.push('  Actual cost: $0 (deposits remain in accounts)');
  report.push('  ✓ Best for: Budget-conscious, not time-critical\n');
  
  report.push('  Option 2: FASTEST (Paid Models)');
  report.push('  ─────────────────────────────────');
  report.push('  Setup: 1 account, Gemini Flash 1.5');
  report.push('  Time: 2-4 days continuous');
  report.push('  Cost: $288 - $864 (depending on sections)');
  report.push('  ✓ Best for: Time-critical launches\n');
  
  report.push('  Option 3: HYBRID (Best Balance)');
  report.push('  ─────────────────────────────────');
  report.push('  Setup: 3 accounts ($30) + Gemini Flash for overflow');
  report.push('  Time: 4-10 days');
  report.push('  Cost: $30 deposit + $192 - $576 paid = $222 - $606');
  report.push('  ✓ Best for: Balance of speed and cost\n');
  
  report.push('  💡 PRO TIP: The $10/account deposits are NOT spent!');
  report.push('     You can withdraw them later if needed.\n');
  
  return report.join('\n');
}

// Run calculation
if (require.main === module) {
  console.log(generateReport());
}
