import { prisma } from '@/lib/prisma';
import { KeywordContentService, KeywordConfig } from './keywordContentService';

// All available AI content sections
export type AIContentSection =
  | 'intro'
  | 'requirements'
  | 'faqs'
  | 'tips'
  | 'costBreakdown'
  | 'comparison'
  | 'discounts'
  | 'localStats'
  | 'coverageGuide'
  | 'claimsProcess'
  | 'buyersGuide'
  | 'metaTags';

// Hardcoded fallback lists (used if DB is unavailable)
// These are replaced by database values at runtime
export const FALLBACK_FREE_MODELS = [
  'deepseek/deepseek-r1:free',
  'google/gemini-2.0-flash-exp:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'huggingfaceh4/zephyr-7b-beta:free'
];

// Known PAID models - DANGER! Will spend your deposit
export const PAID_MODELS = [
  'openai/gpt-4o-mini', 'openai/gpt-4o',
  'anthropic/claude-3-haiku', 'anthropic/claude-3-sonnet',
  'google/gemini-flash-1.5', 'deepseek/deepseek-chat',
  'xiaomi/mimo-v2-flash', 'novita/r1', 'atlascloud/mimo-v2-flash'
];

// Cache for free models from DB
let cachedFreeModels: string[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60000; // 1 minute

/**
 * Get free models from database (with caching)
 */
async function getFreeModelsFromDB(): Promise<string[]> {
  const now = Date.now();

  // Return cached if still valid
  if (cachedFreeModels && (now - cacheTime) < CACHE_TTL) {
    return cachedFreeModels;
  }

  try {
    const models = await prisma.freeAIModel.findMany({
      where: { isActive: true },
      orderBy: { priority: 'asc' }
    });

    cachedFreeModels = models.map(m => m.modelId);
    cacheTime = now;

    return cachedFreeModels;
  } catch (e) {
    console.warn('Failed to fetch free models from DB, using fallback:', e);
    return FALLBACK_FREE_MODELS;
  }
}

/**
 * Clear the free models cache (call when models are updated)
 */
export function clearFreeModelsCache(): void {
  cachedFreeModels = null;
  cacheTime = 0;
}

export interface AIContentRequest {
  pageData: {
    id: string;
    slug: string;
    insuranceType: string;
    state?: string;
    city?: string;
    customData?: any;
  };
  sections: AIContentSection[];
  model?: string;
  forceFreeModels?: boolean; // If true, only use free models (protects deposit)
  keywordConfig?: KeywordConfig; // SEO keyword configuration
  templatePrompts?: {
    systemPrompt?: string;
    introPrompt?: string;
    requirementsPrompt?: string;
    faqsPrompt?: string;
    tipsPrompt?: string;
    costBreakdownPrompt?: string;
    comparisonPrompt?: string;
    discountsPrompt?: string;
    localStatsPrompt?: string;
    coverageGuidePrompt?: string;
    claimsProcessPrompt?: string;
    buyersGuidePrompt?: string;
    metaTagsPrompt?: string;
  };
}

export interface CostBreakdownItem {
  factor: string;
  impact: string;
  description: string;
}

export interface ComparisonItem {
  name: string;
  strengths: string[];
  weaknesses: string[];
  bestFor: string;
  priceRange: string;
}

export interface DiscountItem {
  name: string;
  savings: string;
  qualification: string;
  isLocal: boolean;
}

export interface LocalStatItem {
  stat: string;
  value: string;
  impact: string;
  comparison: string;
}

export interface CoverageGuideItem {
  type: string;
  description: string;
  recommended: string;
  whenNeeded: string;
}

export interface ClaimsProcessContent {
  steps: string[];
  documents: string[];
  timeline: string;
  resources: string[];
}

export interface BuyersGuideContent {
  steps: string[];
  lookFor: string[];
  redFlags: string[];
  questions: string[];
}

export interface MetaTagsContent {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogTitle: string;
  ogDescription: string;
}

export interface AIContentResponse {
  success: boolean;
  content?: {
    intro?: string;
    requirements?: string;
    faqs?: Array<{ question: string; answer: string }>;
    tips?: string[];
    costBreakdown?: CostBreakdownItem[];
    comparison?: ComparisonItem[];
    discounts?: DiscountItem[];
    localStats?: LocalStatItem[];
    coverageGuide?: CoverageGuideItem[];
    claimsProcess?: ClaimsProcessContent;
    buyersGuide?: BuyersGuideContent;
    metaTags?: MetaTagsContent;
  };
  error?: string;
  tokensUsed?: number;
  cost?: number;
  provider?: string; // Which provider was used (for tracking)
  rateLimited?: boolean; // Indicates if this was a rate limit error
}

// Custom error for rate limit exhaustion
export class AllProvidersRateLimitedError extends Error {
  constructor(message: string = 'All providers have hit their rate limits') {
    super(message);
    this.name = 'AllProvidersRateLimitedError';
  }
}

// OpenRouter API client with multi-account rotation
export class OpenRouterService {
  private static currentProviderIndex = 0;

  /**
   * Get a safe model name - ensures free models only if forceFree is true
   * This protects your deposit from accidental usage!
   */
  private static async getSafeModel(model: string | undefined, forceFree: boolean = true): Promise<string> {
    // Get current free models from DB
    const freeModels = await getFreeModelsFromDB();
    const defaultModel = freeModels[0] || FALLBACK_FREE_MODELS[0];

    // If not forcing free, return whatever was requested
    if (!forceFree) {
      return model || defaultModel;
    }

    // If no model specified, use first free model
    if (!model) {
      return defaultModel;
    }

    // STRICT CHECK: Model MUST end with ':free' to be considered free
    // This prevents accidental usage of paid models!
    if (model.endsWith(':free')) {
      // Check if it's in our approved list
      const isApproved = freeModels.some(free => model === free);
      if (isApproved) {
        return model;
      }
      console.warn(`⚠️ Model "${model}" ends with :free but not in approved list. Using fallback.`);

      // FALLBACK LOGIC: If specific free model not found, try to map to a known good one
      // This fixes "No endpoints found" when a specific provider/model is offline or removed
      if (model.includes('deepseek')) return freeModels.find(m => m.includes('deepseek')) || defaultModel;
      if (model.includes('gemini')) return freeModels.find(m => m.includes('gemini')) || defaultModel;
      if (model.includes('llama')) return freeModels.find(m => m.includes('llama')) || defaultModel;

      return defaultModel;
    }

    // Check if it's explicitly in our free list
    const isFree = freeModels.some(free => model === free);
    if (isFree) {
      return model;
    }

    // CHECK: Does it exist in free list if we add :free?
    // This handles cases where the suffix is missing in the request
    const modelWithSuffix = `${model}:free`;
    const isFreeWithSuffix = freeModels.some(free => modelWithSuffix === free);
    if (isFreeWithSuffix) {
      return modelWithSuffix;
    }

    // 🚨 PAID MODEL DETECTED! Block it!
    const isPaid = PAID_MODELS.some(paid => model.includes(paid) || paid.includes(model));
    if (isPaid) {
      console.error(`🚨 BLOCKED PAID MODEL: "${model}"`);
      console.error(`   This model costs money! Using free alternative.`);
    } else {
      console.warn(`⚠️ Unknown model "${model}" - treating as paid for safety.`);
    }

    // Default to first free model
    return defaultModel;
  }

  /**
   * Check if a model is free (synchronous - checks suffix)
   * STRICT: Model MUST end with ':free' to be considered free
   */
  static isFreeModel(model: string): boolean {
    // Strict check: must end with :free
    return model.endsWith(':free');
  }

  /**
   * Get all free models from DB
   */
  static async getFreeModels(): Promise<string[]> {
    return getFreeModelsFromDB();
  }

  /**
   * Get next available AI provider (round-robin with budget check)
   */
  static async getNextProvider() {
    // Get all active providers and filter in JavaScript for budget comparison
    const providers = await prisma.aIProvider.findMany({
      where: {
        isActive: true
      },
      orderBy: { priority: 'asc' }
    });

    // Filter providers that have budget available
    const availableProviders = providers.filter((provider: any) => {
      // No budget limit
      if (provider.totalBudget === null) return true;
      // Has budget remaining
      return provider.usedBudget < provider.totalBudget;
    });

    if (availableProviders.length === 0) {
      throw new Error('No AI providers available. Please add API keys in settings.');
    }

    // Get the next provider in rotation
    const provider = availableProviders[this.currentProviderIndex % availableProviders.length];

    // Move to next for subsequent calls
    this.currentProviderIndex = (this.currentProviderIndex + 1) % availableProviders.length;

    return provider;
  }

  /**
   * Try to generate content with a specific provider
   */
  private static async tryGenerateWithProvider(
    request: AIContentRequest,
    provider: any
  ): Promise<AIContentResponse> {
    try {
      // Build the prompt
      const prompt = this.buildPrompt(request);

      const response = await fetch(provider.apiEndpoint || 'https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Insurance Buddy AI Content Generator'
        },
        body: JSON.stringify({
          model: await this.getSafeModel(request.model || provider.preferredModel, request.forceFreeModels !== false),
          messages: [
            {
              role: 'system',
              content: request.templatePrompts?.systemPrompt || 'You are a helpful assistant that generates insurance content.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `HTTP ${response.status}`;

        // Check for rate limit errors
        if (response.status === 429 || errorMessage.includes('Rate limit') || errorMessage.includes('rate limit')) {
          return {
            success: false,
            error: `Rate limit exceeded: ${errorMessage}`,
            rateLimited: true
          };
        }

        // Check for insufficient credits
        if (response.status === 402 || errorMessage.includes('Insufficient credits')) {
          return {
            success: false,
            error: `Insufficient credits: ${errorMessage}`,
            rateLimited: true
          };
        }

        throw new Error(`API error: ${errorMessage}`);
      }

      const data = await response.json();

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }

      const content = data.choices[0].message.content;
      const tokensUsed = data.usage?.total_tokens || 0;
      const cost = this.estimateCost(tokensUsed, request.model || provider.preferredModel);

      // Parse the content based on sections
      const parsedContent = this.parseContent(content, request.sections);

      return {
        success: true,
        content: parsedContent,
        tokensUsed,
        cost,
        provider: provider.name
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Multi-provider failover - tries ALL providers before giving up
   * Throws AllProvidersRateLimitedError if all providers hit rate limits
   */
  static async generateContentWithFailover(
    request: AIContentRequest,
    maxRetries: number = 3
  ): Promise<AIContentResponse & { provider?: string; attempts?: number }> {
    // Get all active providers
    const providers = await prisma.aIProvider.findMany({
      where: { isActive: true },
      orderBy: { priority: 'asc' }
    });

    // Filter providers that have budget available
    const availableProviders = providers.filter(p =>
      p.totalBudget === null || p.usedBudget < p.totalBudget
    );

    if (availableProviders.length === 0) {
      return { success: false, error: 'No AI providers with available budget' };
    }

    const startIndex = this.currentProviderIndex % availableProviders.length;
    const triedProviders: string[] = [];
    let lastError = '';
    let allRateLimited = true;

    for (let i = 0; i < availableProviders.length; i++) {
      const providerIndex = (startIndex + i) % availableProviders.length;
      const provider = availableProviders[providerIndex];

      // Skip if already tried this provider in this round
      if (triedProviders.includes(provider.id)) continue;
      triedProviders.push(provider.id);

      try {
        const result = await this.tryGenerateWithProvider(request, provider);

        if (result.success) {
          // Update current index for next call
          this.currentProviderIndex = (providerIndex + 1) % availableProviders.length;
          // Track usage
          await this.trackUsage(provider.id, result.tokensUsed || 0, result.cost || 0);
          return { ...result, provider: provider.name, attempts: triedProviders.length };
        }

        lastError = result.error || 'Unknown error';

        // Check if this was a rate limit error
        if (result.rateLimited) {
          // Mark this provider as rate limited and continue
          await this.markProviderRateLimited(provider.id);
          continue;
        }

        // Not a rate limit error, don't retry with other providers
        allRateLimited = false;
        return { ...result, attempts: triedProviders.length };

      } catch (error: any) {
        lastError = error.message;
        allRateLimited = false;
        continue;
      }
    }

    // All providers failed
    if (allRateLimited) {
      throw new AllProvidersRateLimitedError(
        `All ${availableProviders.length} providers have hit rate limits. Last error: ${lastError}`
      );
    }

    return {
      success: false,
      error: `All ${availableProviders.length} providers failed. Last error: ${lastError}`,
      attempts: triedProviders.length
    };
  }

  /**
   * Mark a provider as rate limited with timestamp
   */
  private static async markProviderRateLimited(providerId: string) {
    try {
      await prisma.aIProvider.update({
        where: { id: providerId },
        data: {
          lastError: 'RATE_LIMITED',
          lastErrorAt: new Date(),
          // Store when it will reset (24 hours from now for OpenRouter)
          metadata: {
            rateLimitResetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }
        }
      });
    } catch (e) {
      // Non-critical error
      console.warn('Failed to mark provider as rate limited:', e);
    }
  }

  /**
   * Generate AI content for a page
   */
  static async generateContent(request: AIContentRequest): Promise<AIContentResponse> {
    return this.generateContentWithFailover(request);
  }

  /**
   * Build prompt from request
   */
  private static buildPrompt(request: AIContentRequest): string {
    const { pageData, sections, templatePrompts, keywordConfig } = request;
    const locationName = pageData.city
      ? `${pageData.city}, ${pageData.state || ''}`
      : pageData.state || pageData.insuranceType;

    const prompts: string[] = [];

    // Main instruction - FOCUS ON "cheapest {niche} in {location}"
    prompts.push(`Generate SEO-optimized content targeting "cheapest ${pageData.insuranceType.toLowerCase()} in ${locationName}".`);
    prompts.push(`\nGenerate the following sections: ${sections.join(', ')}`);
    prompts.push(`\n\n=== CONTENT FOCUS ===`);
    prompts.push(`The MAIN GOAL is to help readers find the CHEAPEST, most AFFORDABLE ${pageData.insuranceType} options in ${locationName}.`);
    prompts.push(`Every section should provide value toward saving money and finding low-cost options.`);

    // Add keyword-optimized prompts if keywordConfig is provided
    if (keywordConfig) {
      prompts.push(`\n\n=== SEO KEYWORD OPTIMIZATION ===`);
      prompts.push(`MAIN TARGET: "${keywordConfig.primaryKeyword}" (MUST use ${keywordConfig.targetDensity}% density, max ${keywordConfig.maxDensity}%)`);

      if (keywordConfig.secondaryKeywords.length > 0) {
        prompts.push(`Supporting Keywords: ${keywordConfig.secondaryKeywords.join(', ')}`);
      }

      // Add keyword requirements
      const requirements: string[] = [];
      if (keywordConfig.requireInTitle) requirements.push(`MUST include "${keywordConfig.primaryKeyword}" in the first 60 characters`);
      if (keywordConfig.requireInH1) requirements.push(`MUST include "${keywordConfig.primaryKeyword}" in the main heading (H1)`);
      if (keywordConfig.requireInFirst100) requirements.push(`MUST include "${keywordConfig.primaryKeyword}" within first 100 words`);
      if (keywordConfig.requireInMeta) requirements.push(`MUST include "${keywordConfig.primaryKeyword}" in meta description`);

      if (requirements.length > 0) {
        prompts.push(`\nCRITICAL Keyword Placement Requirements:`);
        requirements.forEach(r => prompts.push(`- ${r}`));
      }

      prompts.push(`\nWriting Style:`);
      prompts.push(`- Start sentences with the main keyword when natural: "${keywordConfig.primaryKeyword} is..." or "Finding ${keywordConfig.primaryKeyword} can..."`);
      prompts.push(`- Use action words: save, compare, find, get, lower, reduce`);
      prompts.push(`- Focus on VALUE and SAVINGS throughout`);
      prompts.push(`- Write for humans first, but ensure main keyword appears naturally`);
    } else {
      // Default keyword guidance
      prompts.push(`\n\n=== DEFAULT KEYWORD TARGET ===`);
      prompts.push(`Main Keyword: "cheapest ${pageData.insuranceType.toLowerCase()} in ${locationName}"`);
      prompts.push(`Use this phrase naturally 2-3 times in the content.`);
      prompts.push(`Also use variations: "cheap ${pageData.insuranceType.toLowerCase()}", "affordable ${pageData.insuranceType.toLowerCase()}", "low cost ${pageData.insuranceType.toLowerCase()}"`);
    }

    // Add section-specific prompts from template if available
    sections.forEach(section => {
      const templatePrompt = this.getTemplatePromptForSection(section, templatePrompts);

      // Build base section prompt
      let sectionPrompt = templatePrompt || this.getDefaultSectionPrompt(section, pageData.insuranceType, locationName);

      // Enhance with keyword optimization if available
      if (keywordConfig) {
        sectionPrompt = KeywordContentService.buildKeywordPrompt(
          sectionPrompt,
          keywordConfig,
          section,
          locationName,
          pageData.insuranceType
        );
      }

      prompts.push(`\n${section.toUpperCase()}:`);
      prompts.push(sectionPrompt.replace(/\{\{location\}\}/g, locationName).replace(/\{\{niche\}\}/g, pageData.insuranceType));
    });

    prompts.push(`\nReturn the content in JSON format with the following structure:`);
    prompts.push(JSON.stringify(this.getExpectedStructure(sections), null, 2));

    return prompts.join('\n');
  }

  /**
   * Get default prompt for a section
   * FOCUS: "cheapest {niche} in {location}" as main keyword
   */
  private static getDefaultSectionPrompt(section: AIContentSection, insuranceType: string, location: string): string {
    const mainKeyword = `cheapest ${insuranceType.toLowerCase()} in ${location.toLowerCase()}`;

    switch (section) {
      case 'intro':
        return `Write an engaging introduction targeting "${mainKeyword}". 
Focus on helping readers find the most affordable ${insuranceType} options in {{location}}. 
Hook: Start with "Looking for ${mainKeyword}?" or similar.
Explain why finding cheap ${insuranceType} matters and what money-saving tips they'll learn.`;

      case 'requirements':
        return `List the minimum requirements for ${insuranceType} in {{location}}.
Focus on: What coverage is legally required vs optional (cheaper options).
Explain how meeting minimum requirements can lower costs.
Include: Documentation needed, state-specific requirements, how to get the cheapest legal coverage.`;

      case 'faqs':
        return `Create 5 FAQs focused on finding cheapest ${insuranceType} in {{location}}:
1. "How do I find ${mainKeyword}?"
2. "What factors affect ${insuranceType} rates in {{location}}?"
3. "How can I lower my ${insuranceType} premiums?"
4. "What discounts are available for ${insuranceType} in {{location}}?"
5. "Is minimum coverage enough or should I get more?"
Each answer should provide actionable money-saving advice.`;

      case 'tips':
        return `Provide 7 money-saving tips for ${insuranceType} in {{location}}:
- How to compare quotes effectively
- Discounts to ask for
- Coverage levels that save money
- When to shop around
- Bundle options
- Deductible strategies
- Credit score impact
Title each tip with action words like "Save", "Compare", "Find".`;

      case 'costBreakdown':
        return `Explain ${insuranceType} costs in {{location}} with focus on finding cheapest options:
- Average cost range (cheap vs expensive)
- What makes rates higher or lower
- Minimum coverage costs
- Money-saving factors (good driving record, bundles, etc.)
- How to get quotes and compare
- Hidden fees to avoid
Include realistic dollar amounts where possible.`;

      case 'discounts':
        return `List all available ${insuranceType} discounts in {{location}}:
- Safe driver discounts
- Multi-policy/bundle discounts
- Good student discounts
- Low mileage discounts
- Defensive driving course discounts
- Loyalty discounts
- Payment method discounts (pay in full, auto-pay)
- Occupation/membership discounts
Include how much each can save (percentages if known).`;

      case 'comparison':
        return `Compare ${insuranceType} options in {{location}} focusing on value and price:
- Minimum coverage (cheapest option)
- Standard coverage (best value)
- Full coverage (most protection)
Compare 3-5 top providers known for competitive rates.
For each: Price range, coverage highlights, best for (who should choose this).`;

      case 'localStats':
        return `Provide ${insuranceType} statistics for {{location}} relevant to saving money:
- Average premium costs (vs national average)
- What percentage of drivers choose minimum coverage
- Most common discounts used
- How rates compare to neighboring areas
- Best times to shop for quotes
- Local factors that affect pricing`;

      case 'buyersGuide':
        return `Create a step-by-step guide: "How to Find ${mainKeyword}"
Steps should include:
1. Assess your coverage needs
2. Gather your information
3. Get multiple quotes (how many, where)
4. Compare apples to apples
5. Ask about ALL discounts
6. Review the policy before buying
7. Re-shop every 6-12 months
Make it actionable and focused on saving money.`;

      case 'coverageGuide':
        return `Explain ${insuranceType} coverage types with focus on cost vs protection:
- Liability only (cheapest)
- Minimum required coverage
- Recommended coverage levels
- Full coverage (most expensive but most protection)
Help readers choose the right balance of cost and protection for their budget.`;

      case 'metaTags':
        return `Generate SEO meta tags targeting "${mainKeyword}":
- Title: Include "${mainKeyword}" or variation (under 60 chars)
- Description: Include "cheap", "affordable", "save", "compare" + location (under 160 chars)
- Keywords: Focus on cost-saving terms`;

      default:
        return `Write about ${section} for ${insuranceType} in {{location}} with focus on finding cheapest options and saving money.`;
    }
  }

  /**
   * Get template prompt for a section
   */
  private static getTemplatePromptForSection(
    section: AIContentSection,
    templatePrompts?: AIContentRequest['templatePrompts']
  ): string | undefined {
    if (!templatePrompts) return undefined;

    switch (section) {
      case 'intro': return templatePrompts.introPrompt;
      case 'requirements': return templatePrompts.requirementsPrompt;
      case 'faqs': return templatePrompts.faqsPrompt;
      case 'tips': return templatePrompts.tipsPrompt;
      case 'costBreakdown': return templatePrompts.costBreakdownPrompt;
      case 'comparison': return templatePrompts.comparisonPrompt;
      case 'discounts': return templatePrompts.discountsPrompt;
      case 'localStats': return templatePrompts.localStatsPrompt;
      case 'coverageGuide': return templatePrompts.coverageGuidePrompt;
      case 'claimsProcess': return templatePrompts.claimsProcessPrompt;
      case 'buyersGuide': return templatePrompts.buyersGuidePrompt;
      case 'metaTags': return templatePrompts.metaTagsPrompt;
      default: return undefined;
    }
  }

  /**
   * Get expected JSON structure for sections
   */
  private static getExpectedStructure(sections: AIContentSection[]): any {
    const structure: any = {};

    sections.forEach(section => {
      switch (section) {
        case 'intro':
          structure.intro = 'string';
          break;
        case 'requirements':
          structure.requirements = 'string';
          break;
        case 'faqs':
          structure.faqs = [{ question: 'string', answer: 'string' }];
          break;
        case 'tips':
          structure.tips = ['string'];
          break;
        case 'costBreakdown':
          structure.costBreakdown = [{ factor: 'string', impact: 'string', description: 'string' }];
          break;
        case 'comparison':
          structure.comparison = [{ name: 'string', strengths: ['string'], weaknesses: ['string'], bestFor: 'string', priceRange: 'string' }];
          break;
        case 'discounts':
          structure.discounts = [{ name: 'string', savings: 'string', qualification: 'string', isLocal: true }];
          break;
        case 'localStats':
          structure.localStats = [{ stat: 'string', value: 'string', impact: 'string', comparison: 'string' }];
          break;
        case 'coverageGuide':
          structure.coverageGuide = [{ type: 'string', description: 'string', recommended: 'string', whenNeeded: 'string' }];
          break;
        case 'claimsProcess':
          structure.claimsProcess = { steps: ['string'], documents: ['string'], timeline: 'string', resources: ['string'] };
          break;
        case 'buyersGuide':
          structure.buyersGuide = { steps: ['string'], lookFor: ['string'], redFlags: ['string'], questions: ['string'] };
          break;
        case 'metaTags':
          structure.metaTags = {
            metaTitle: 'string',
            metaDescription: 'string',
            metaKeywords: ['string'],
            ogTitle: 'string',
            ogDescription: 'string'
          };
          break;
      }
    });

    return structure;
  }

  /**
   * Parse content from API response
   */
  private static parseContent(content: string, sections: AIContentSection[]): any {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(content);
      return parsed;
    } catch (e) {
      // If not valid JSON, try to extract sections manually
      const result: any = {};

      sections.forEach(section => {
        const regex = new RegExp(`##?\\s*${section}[:\s]*([^#]+)`, 'i');
        const match = content.match(regex);
        if (match) {
          result[section] = match[1].trim();
        }
      });

      return result;
    }
  }

  /**
   * Estimate cost based on tokens used
   * Returns 0 for free models (protects your deposit!)
   */
  private static estimateCost(tokens: number, model?: string): number {
    // Free models cost $0!
    if (model && this.isFreeModel(model)) {
      return 0;
    }

    // Paid models - rough estimate
    // GPT-4o-mini: $0.15/1M input + $0.60/1M output ≈ $0.000375 per 1K tokens avg
    const rate = 0.000000375;
    return tokens * rate;
  }

  /**
   * Track provider usage
   */
  private static async trackUsage(providerId: string, tokens: number, cost: number) {
    await prisma.aIProvider.update({
      where: { id: providerId },
      data: {
        usedBudget: { increment: cost },
        requestCount: { increment: 1 },
        lastUsedAt: new Date()
      }
    });
  }

  /**
   * Check if any providers have available capacity (not rate limited)
   */
  static async hasAvailableProviders(): Promise<boolean> {
    const providers = await prisma.aIProvider.findMany({
      where: { isActive: true }
    });

    for (const provider of providers) {
      // Check budget
      if (provider.totalBudget !== null && provider.usedBudget >= provider.totalBudget) {
        continue;
      }

      // Check if rate limited
      const metadata = provider.metadata as any;
      if (metadata?.rateLimitResetAt) {
        const resetAt = new Date(metadata.rateLimitResetAt);
        if (resetAt > new Date()) {
          continue; // Still rate limited
        }
      }

      // Check last error
      if (provider.lastError === 'RATE_LIMITED' && provider.lastErrorAt) {
        const errorAge = Date.now() - new Date(provider.lastErrorAt).getTime();
        if (errorAge < 24 * 60 * 60 * 1000) {
          continue; // Error less than 24 hours ago
        }
      }

      return true; // Found at least one available provider
    }

    return false;
  }

  /**
   * Clear rate limit status for all providers (call when resuming after 24 hours)
   */
  static async clearRateLimitStatus(): Promise<void> {
    await prisma.aIProvider.updateMany({
      where: { lastError: 'RATE_LIMITED' },
      data: {
        lastError: null,
        lastErrorAt: null,
        metadata: {}
      }
    });
  }

  /**
   * Get when the next provider will be available
   */
  static async getNextAvailableTime(): Promise<Date | null> {
    const providers = await prisma.aIProvider.findMany({
      where: {
        isActive: true,
        lastError: 'RATE_LIMITED'
      }
    });

    let earliestReset: Date | null = null;

    for (const provider of providers) {
      const metadata = provider.metadata as any;
      if (metadata?.rateLimitResetAt) {
        const resetAt = new Date(metadata.rateLimitResetAt);
        if (!earliestReset || resetAt < earliestReset) {
          earliestReset = resetAt;
        }
      } else if (provider.lastErrorAt) {
        // Default to 24 hours after last error
        const resetAt = new Date(new Date(provider.lastErrorAt).getTime() + 24 * 60 * 60 * 1000);
        if (!earliestReset || resetAt < earliestReset) {
          earliestReset = resetAt;
        }
      }
    }

    return earliestReset;
  }
}

/**
 * Batch process multiple pages with pause/resume support
 */
export interface BatchProgress {
  processed: number;
  total: number;
  successful: number;
  failed: number;
  paused?: boolean;
  resumeAt?: Date;
  lastProcessedIndex?: number;
}

export async function batchGenerateContent(
  pageIds: string[],
  sections: AIContentSection[],
  options: {
    batchSize?: number;
    delayBetweenBatches?: number;
    model?: string;
    forceFreeModels?: boolean; // Default: true (protects deposit!)
    templatePrompts?: AIContentRequest['templatePrompts'];
    keywordConfig?: AIContentRequest['keywordConfig'];
    onProgress?: (progress: BatchProgress) => void;
    startIndex?: number; // For resuming
  } = {}
): Promise<{
  successful: number;
  failed: number;
  errors: any[];
  paused?: boolean;
  resumeAt?: Date;
  lastProcessedIndex?: number;
}> {
  const {
    batchSize = 10,
    delayBetweenBatches = 1000,
    model,
    forceFreeModels = true, // Default to true to protect your deposit!
    templatePrompts,
    keywordConfig,
    onProgress,
    startIndex = 0
  } = options;

  const results = {
    successful: 0,
    failed: 0,
    errors: [] as any[],
    paused: false,
    resumeAt: undefined as Date | undefined,
    lastProcessedIndex: startIndex
  };

  // Process in batches starting from startIndex
  for (let i = startIndex; i < pageIds.length; i += batchSize) {
    const batch = pageIds.slice(i, i + batchSize);
    results.lastProcessedIndex = i;

    // Check if any providers are available before starting batch
    const hasProviders = await OpenRouterService.hasAvailableProviders();
    if (!hasProviders) {
      // All providers rate limited - pause the job
      const resumeAt = await OpenRouterService.getNextAvailableTime();
      results.paused = true;
      results.resumeAt = resumeAt || new Date(Date.now() + 24 * 60 * 60 * 1000);

      console.warn(`⏸️ All providers rate limited. Pausing job. Will resume at ${results.resumeAt}`);

      if (onProgress) {
        onProgress({
          processed: i,
          total: pageIds.length,
          successful: results.successful,
          failed: results.failed,
          paused: true,
          resumeAt: results.resumeAt,
          lastProcessedIndex: i
        });
      }

      break;
    }

    // Fetch page data
    const pages = await prisma.page.findMany({
      where: { id: { in: batch } },
      include: {
        insuranceType: true,
        state: true,
        city: true
      }
    });

    // Process batch in parallel
    const promises = pages.map(async (page) => {
      try {
        const response = await OpenRouterService.generateContent({
          pageData: {
            id: page.id,
            slug: page.slug,
            insuranceType: page.insuranceType?.name || 'Insurance',
            state: page.state?.name,
            city: page.city?.name,
            customData: page.customData
          },
          sections,
          model,
          forceFreeModels,
          templatePrompts,
          keywordConfig
        });

        if (response.success && response.content) {
          // Build update data
          const updateData: any = {
            aiGeneratedContent: response.content,
            aiGeneratedAt: new Date(),
            aiModel: model || 'xiaomi/mimo-v2-flash',
            isAiGenerated: true
          };

          // If meta tags were generated, also update the Page model SEO fields
          if (response.content.metaTags) {
            const { metaTitle, metaDescription, metaKeywords, ogTitle, ogDescription } = response.content.metaTags;
            if (metaTitle) updateData.metaTitle = metaTitle;
            if (metaDescription) updateData.metaDescription = metaDescription;
            if (metaKeywords && Array.isArray(metaKeywords)) updateData.metaKeywords = metaKeywords;
            if (ogTitle) updateData.ogTitle = ogTitle;
            if (ogDescription) updateData.ogDescription = ogDescription;
            // Also set Twitter tags to match OG tags
            if (ogTitle) updateData.twitterTitle = ogTitle;
            if (ogDescription) updateData.twitterDesc = ogDescription;
          }

          // Update page with AI content
          await prisma.page.update({
            where: { id: page.id },
            data: updateData
          });

          results.successful++;
        } else {
          results.failed++;
          results.errors.push({ pageId: page.id, error: response.error });
        }
      } catch (error: any) {
        // Check if this is an AllProvidersRateLimitedError
        if (error.name === 'AllProvidersRateLimitedError') {
          // Re-throw to be caught at batch level
          throw error;
        }

        results.failed++;
        results.errors.push({ pageId: page.id, error: error.message });
      }
    });

    try {
      await Promise.all(promises);
    } catch (error: any) {
      if (error.name === 'AllProvidersRateLimitedError') {
        // Pause the job
        const resumeAt = await OpenRouterService.getNextAvailableTime();
        results.paused = true;
        results.resumeAt = resumeAt || new Date(Date.now() + 24 * 60 * 60 * 1000);
        results.lastProcessedIndex = i;

        console.warn(`⏸️ All providers rate limited during batch. Pausing at index ${i}. Will resume at ${results.resumeAt}`);

        if (onProgress) {
          onProgress({
            processed: i,
            total: pageIds.length,
            successful: results.successful,
            failed: results.failed,
            paused: true,
            resumeAt: results.resumeAt,
            lastProcessedIndex: i
          });
        }

        break;
      }

      // Other error, log but continue
      console.error('Batch processing error:', error);
      results.errors.push({ batchIndex: i, error: error.message });
    }

    // Progress callback
    if (onProgress) {
      onProgress({
        processed: Math.min(i + batchSize, pageIds.length),
        total: pageIds.length,
        successful: results.successful,
        failed: results.failed,
        lastProcessedIndex: i + batch.length
      });
    }

    // Delay between batches (skip if paused)
    if (!results.paused && i + batchSize < pageIds.length) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }

  return results;
}
