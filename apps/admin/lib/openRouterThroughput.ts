/**
 * OpenRouter Throughput Calculator
 * Helps estimate pages per day with parallel processing
 */

export interface OpenRouterConfig {
  // Account settings
  accounts: number;              // Number of OpenRouter accounts (each with $10+)
  
  // Rate limits per account (with $10+ deposit)
  requestsPerDay: number;        // 1000 for free models with $10+
  requestsPerMinute: number;     // 20 RPM
  
  // Content generation settings
  sectionsPerPage: number;       // How many sections per page (e.g., 3-5)
  avgRequestsPerSection: number; // Usually 1, but could be more for long content
  
  // Parallel processing settings
  parallelAccounts: number;      // How many accounts to use simultaneously
  batchSize: number;             // Pages per batch
  delayBetweenBatches: number;   // ms delay between batches
}

export interface ThroughputEstimate {
  // Per account
  maxRequestsPerDay: number;
  maxRequestsPerMinute: number;
  
  // Per section/page calculation
  requestsPerPage: number;
  
  // Total capacity
  totalDailyRequests: number;
  totalPagesPerDay: number;
  
  // Time-based
  pagesPerHour: number;
  timeToComplete100Pages: string;
  timeToComplete1000Pages: string;
  
  // Optimal batching
  optimalBatchSize: number;
  batchesPerDay: number;
  
  // Warnings
  warnings: string[];
}

export function calculateThroughput(config: OpenRouterConfig): ThroughputEstimate {
  const warnings: string[] = [];
  
  // Base calculations
  const requestsPerPage = config.sectionsPerPage * config.avgRequestsPerSection;
  const totalDailyRequests = config.accounts * config.requestsPerDay;
  const totalPagesPerDay = Math.floor(totalDailyRequests / requestsPerPage);
  
  // Per-minute capacity across all accounts
  const totalRPM = config.accounts * config.requestsPerMinute;
  const pagesPerMinute = totalRPM / requestsPerPage;
  const pagesPerHour = Math.floor(pagesPerMinute * 60);
  
  // Time estimates
  const minutesFor100 = 100 / pagesPerMinute;
  const hoursFor1000 = 1000 / pagesPerHour;
  
  // Optimal batching (respect RPM limits)
  const optimalBatchSize = Math.min(
    config.batchSize,
    Math.floor(totalRPM * 0.8) // Use 80% of RPM to be safe
  );
  const batchesPerDay = Math.ceil(totalPagesPerDay / optimalBatchSize);
  
  // Warnings
  if (config.accounts === 1) {
    warnings.push('Using only 1 account. Consider adding more accounts for higher throughput.');
  }
  if (config.delayBetweenBatches < 1000) {
    warnings.push('Very short delay between batches may hit rate limits.');
  }
  
  return {
    maxRequestsPerDay: config.requestsPerDay,
    maxRequestsPerMinute: config.requestsPerMinute,
    requestsPerPage,
    totalDailyRequests,
    totalPagesPerDay,
    pagesPerHour,
    timeToComplete100Pages: `${Math.ceil(minutesFor100)} minutes`,
    timeToComplete1000Pages: `${Math.ceil(hoursFor1000)} hours`,
    optimalBatchSize,
    batchesPerDay,
    warnings
  };
}

// Pre-configured scenarios
export const SCENARIOS = {
  // Single account with $10 deposit
  singleAccount: {
    accounts: 1,
    requestsPerDay: 1000,
    requestsPerMinute: 20,
    sectionsPerPage: 3,
    avgRequestsPerSection: 1,
    parallelAccounts: 1,
    batchSize: 10,
    delayBetweenBatches: 3000
  },
  
  // 3 accounts for parallel processing
  threeAccounts: {
    accounts: 3,
    requestsPerDay: 1000,
    requestsPerMinute: 20,
    sectionsPerPage: 3,
    avgRequestsPerSection: 1,
    parallelAccounts: 3,
    batchSize: 15,
    delayBetweenBatches: 2000
  },
  
  // 5 accounts for high throughput
  fiveAccounts: {
    accounts: 5,
    requestsPerDay: 1000,
    requestsPerMinute: 20,
    sectionsPerPage: 3,
    avgRequestsPerSection: 1,
    parallelAccounts: 5,
    batchSize: 25,
    delayBetweenBatches: 1500
  }
} as const;

// Print all scenarios
export function printScenarios(): void {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('    OPENROUTER PARALLEL PROCESSING SCENARIOS');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('Rate Limits (with $10+ deposit per account):');
  console.log('  • Free models: 1000 requests/day per account');
  console.log('  • Rate limit: 20 requests/minute (RPM)');
  console.log('  • Key point: Each account needs $10 balance (not spent!)\n');
  
  Object.entries(SCENARIOS).forEach(([name, config]) => {
    const estimate = calculateThroughput(config as OpenRouterConfig);
    
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  SCENARIO: ${name.toUpperCase().replace(/([A-Z])/g, ' $1').trim()}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  Accounts:              ${config.accounts}`);
    console.log(`  Total Investment:      $${config.accounts * 10} (deposited, not spent)`);
    console.log(`  `);
    console.log(`  Daily Capacity:`);
    console.log(`    - Total requests:    ${estimate.totalDailyRequests.toLocaleString()}`);
    console.log(`    - Pages generated:   ${estimate.totalPagesPerDay.toLocaleString()}`);
    console.log(`    - Pages/hour:        ${estimate.pagesPerHour}`);
    console.log(`  `);
    console.log(`  Speed Estimates:`);
    console.log(`    - 100 pages:         ${estimate.timeToComplete100Pages}`);
    console.log(`    - 1,000 pages:       ${estimate.timeToComplete1000Pages}`);
    console.log(`    - Optimal batch:     ${estimate.optimalBatchSize} pages`);
    console.log(`  `);
    if (estimate.warnings.length > 0) {
      console.log(`  ⚠️  Warnings:`);
      estimate.warnings.forEach(w => console.log(`     • ${w}`));
    }
    console.log('');
  });
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  RECOMMENDED APPROACH');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('For maximum throughput with FREE models:\n');
  console.log('1. Create 3-5 OpenRouter accounts');
  console.log('2. Deposit $10 in each (remains as balance)');
  console.log('3. Use ONLY free models (deepseek, gemini, etc.)');
  console.log('4. Set up round-robin provider rotation');
  console.log('5. Process in batches respecting 20 RPM per account\n');
  console.log('Expected: 1,000-3,000+ pages/day completely FREE! 🚀\n');
}

// Calculate for custom scenario
export function calculateCustom(
  accounts: number,
  sectionsPerPage: number = 3
): ThroughputEstimate {
  return calculateThroughput({
    accounts,
    requestsPerDay: 1000,
    requestsPerMinute: 20,
    sectionsPerPage,
    avgRequestsPerSection: 1,
    parallelAccounts: accounts,
    batchSize: Math.min(accounts * 5, 25),
    delayBetweenBatches: 2000
  });
}

// Run if called directly
if (require.main === module) {
  printScenarios();
  
  // Show custom calculation
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  CUSTOM: 10 ACCOUNTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const custom = calculateCustom(10, 4);
  console.log(`  Investment: $100 (10 accounts × $10)`);
  console.log(`  Daily Pages: ${custom.totalPagesPerDay.toLocaleString()}`);
  console.log(`  Pages/Hour: ${custom.pagesPerHour}`);
  console.log(`  Time for 10K pages: ~${Math.ceil(10000 / custom.pagesPerHour)} hours\n`);
}
