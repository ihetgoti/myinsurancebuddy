import { prisma } from '@/lib/prisma';

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
}

// OpenRouter API client with multi-account rotation
export class OpenRouterService {
  private static currentProviderIndex = 0;

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

    // Round-robin selection
    const provider = availableProviders[this.currentProviderIndex % availableProviders.length];
    this.currentProviderIndex = (this.currentProviderIndex + 1) % availableProviders.length;

    return provider;
  }

  /**
   * Generate AI content for a page
   */
  static async generateContent(request: AIContentRequest): Promise<AIContentResponse> {
    const provider = await this.getNextProvider();

    try {
      const prompt = this.buildPrompt(request);

      const response = await fetch(provider.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
          'HTTP-Referer': 'https://myinsurancebuddies.com',
          'X-Title': 'MyInsuranceBuddies Content Generator'
        },
        body: JSON.stringify({
          model: request.model || provider.preferredModel,
          messages: [
            {
              role: 'system',
              content: 'You are a professional insurance content writer. Create unique, SEO-optimized, and locally-relevant content for insurance pages. Write in a helpful, professional tone. Always include specific local details when available.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: provider.maxTokensPerRequest,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle rate limit gracefully - STOP, don't crash
        if (response.status === 429) {
          return {
            success: false,
            error: 'Rate limit reached. Wait a few minutes or add more API accounts.',
            tokensUsed: 0,
            cost: 0
          };
        }

        // Handle insufficient credits
        if (response.status === 402) {
          return {
            success: false,
            error: 'Insufficient credits. Add more credits or switch to free model.',
            tokensUsed: 0,
            cost: 0
          };
        }

        // Handle other errors gracefully
        return {
          success: false,
          error: errorData.error?.message || `API error ${response.status}`,
          tokensUsed: 0,
          cost: 0
        };
      }

      const data = await response.json();

      // Parse response
      const contentText = data.choices?.[0]?.message?.content;
      if (!contentText) {
        return {
          success: false,
          error: 'No content generated by AI model',
          tokensUsed: 0,
          cost: 0
        };
      }

      // Extract structured content
      const content = this.parseAIResponse(contentText, request.sections);

      // Track usage
      const tokensUsed = data.usage?.total_tokens || 0;
      const cost = this.calculateCost(tokensUsed, request.model || provider.preferredModel);

      await this.trackUsage(provider.id, tokensUsed, cost);

      return {
        success: true,
        content,
        tokensUsed,
        cost
      };
    } catch (error: any) {
      console.error('AI generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Build prompt based on page data and requested sections
   * Uses simple {{location}} and {{niche}} variables for clarity
   */
  private static buildPrompt(request: AIContentRequest): string {
    const { pageData, sections } = request;

    // Build location string - city, state or just state
    const location = pageData.city
      ? `${pageData.city}, ${pageData.state}`
      : pageData.state || 'the United States';

    // Niche is the insurance type
    const niche = pageData.insuranceType;

    let prompt = `You are writing content for a ${niche} page targeting ${location}.

VARIABLES:
- Location: ${location}
- Niche: ${niche}

Generate unique, SEO-optimized content. Make it specific to ${location} and relevant to ${niche}.

`;

    // Add context from customData if available
    if (pageData.customData) {
      const { avg_premium, min_coverage, population } = pageData.customData;
      if (avg_premium || min_coverage || population) {
        prompt += `LOCAL DATA:\n`;
        if (avg_premium) prompt += `- Average premium in ${location}: ${avg_premium}\n`;
        if (min_coverage) prompt += `- Minimum coverage: ${JSON.stringify(min_coverage)}\n`;
        if (population) prompt += `- Population: ${population}\n`;
        prompt += `\n`;
      }
    }

    prompt += `Generate the following in JSON format:\n\n`;

    if (sections.includes('intro')) {
      prompt += `"intro": Write 2-3 engaging paragraphs about ${niche} in ${location}. Include why residents need it, local factors that affect rates, and what makes ${location} unique for ${niche}.\n\n`;
    }

    if (sections.includes('requirements')) {
      prompt += `"requirements": Explain ${niche} requirements and laws specific to ${location}. Include minimum coverage, penalties, and compliance details.\n\n`;
    }

    if (sections.includes('faqs')) {
      prompt += `"faqs": Create 5-7 FAQs as array of {question, answer} objects. Questions should be specific to ${niche} in ${location}.\n\n`;
    }

    if (sections.includes('tips')) {
      prompt += `"tips": List 5-8 practical tips as string array for saving money on ${niche} in ${location}.\n\n`;
    }

    // NEW SEO SECTIONS
    if (sections.includes('costBreakdown')) {
      prompt += `"costBreakdown": Create a detailed cost breakdown for ${niche} in ${location}. Return array of 5-7 objects with: {"factor": "factor name", "impact": "increases/decreases by X%", "description": "brief explanation"}. Include local factors like crime rate, weather, traffic patterns.\n\n`;
    }

    if (sections.includes('comparison')) {
      prompt += `"comparison": Compare top 4-5 insurance providers for ${niche} in ${location}. Return array with: {"name": "provider name", "strengths": ["strength1", "strength2"], "weaknesses": ["weakness1"], "bestFor": "who this is best for", "priceRange": "$X-$Y/month"}.\n\n`;
    }

    if (sections.includes('discounts')) {
      prompt += `"discounts": List 6-8 available discounts for ${niche} in ${location}. Return array with: {"name": "discount name", "savings": "5-15%", "qualification": "how to qualify", "isLocal": true/false}.\n\n`;
    }

    if (sections.includes('localStats')) {
      prompt += `"localStats": Provide 5-6 location-specific statistics for ${niche} in ${location}. Return array with: {"stat": "statistic name", "value": "the value", "impact": "how it affects insurance", "comparison": "compared to state/national average"}.\n\n`;
    }

    if (sections.includes('coverageGuide')) {
      prompt += `"coverageGuide": Explain 4-6 coverage types for ${niche} in ${location}. Return array with: {"type": "coverage type", "description": "what it covers", "recommended": "recommended amount", "whenNeeded": "when to consider this"}.\n\n`;
    }

    if (sections.includes('claimsProcess')) {
      prompt += `"claimsProcess": Explain how to file a ${niche} claim in ${location}. Return object: {"steps": ["step1", "step2", ...], "documents": ["doc1", "doc2", ...], "timeline": "expected timeline", "resources": ["local resource 1", ...]}.\n\n`;
    }

    if (sections.includes('buyersGuide')) {
      prompt += `"buyersGuide": Create a buying guide for ${niche} in ${location}. Return object: {"steps": ["step1", "step2", ...], "lookFor": ["what to look for 1", ...], "redFlags": ["red flag 1", ...], "questions": ["question to ask 1", ...]}.\n\n`;
    }

    if (sections.includes('metaTags')) {
      prompt += `"metaTags": Generate SEO-optimized meta tags for this ${niche} page in ${location}. Return object: {"metaTitle": "compelling title 50-60 chars with location", "metaDescription": "engaging description 150-160 chars with CTA", "metaKeywords": ["keyword1", "keyword2", ...], "ogTitle": "social media title", "ogDescription": "social media description"}.\n\n`;
    }

    prompt += `Return ONLY valid JSON. No markdown, no code blocks.`;

    return prompt;
  }

  /**
   * Parse AI response into structured content
   */
  private static parseAIResponse(responseText: string, sections: string[]): any {
    try {
      // Remove markdown code blocks if present
      let cleaned = responseText.trim();
      cleaned = cleaned.replace(/^```json\n?/i, '').replace(/\n?```$/i, '');
      cleaned = cleaned.trim();

      const parsed = JSON.parse(cleaned);

      // Validate required sections
      const content: any = {};

      if (sections.includes('intro') && parsed.intro) {
        content.intro = parsed.intro;
      }

      if (sections.includes('requirements') && parsed.requirements) {
        content.requirements = parsed.requirements;
      }

      if (sections.includes('faqs') && Array.isArray(parsed.faqs)) {
        content.faqs = parsed.faqs;
      }

      if (sections.includes('tips') && Array.isArray(parsed.tips)) {
        content.tips = parsed.tips;
      }

      // NEW SEO SECTIONS
      if (sections.includes('costBreakdown') && Array.isArray(parsed.costBreakdown)) {
        content.costBreakdown = parsed.costBreakdown;
      }

      if (sections.includes('comparison') && Array.isArray(parsed.comparison)) {
        content.comparison = parsed.comparison;
      }

      if (sections.includes('discounts') && Array.isArray(parsed.discounts)) {
        content.discounts = parsed.discounts;
      }

      if (sections.includes('localStats') && Array.isArray(parsed.localStats)) {
        content.localStats = parsed.localStats;
      }

      if (sections.includes('coverageGuide') && Array.isArray(parsed.coverageGuide)) {
        content.coverageGuide = parsed.coverageGuide;
      }

      if (sections.includes('claimsProcess') && parsed.claimsProcess) {
        content.claimsProcess = parsed.claimsProcess;
      }

      if (sections.includes('buyersGuide') && parsed.buyersGuide) {
        content.buyersGuide = parsed.buyersGuide;
      }

      if (sections.includes('metaTags') && parsed.metaTags) {
        content.metaTags = parsed.metaTags;
      }

      return content;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Response text:', responseText);

      // Fallback: try to extract sections manually
      return this.fallbackParse(responseText, sections);
    }
  }

  /**
   * Fallback parsing if JSON fails
   */
  private static fallbackParse(text: string, sections: string[]): any {
    const content: any = {};

    // Try to extract intro
    if (sections.includes('intro')) {
      const introMatch = text.match(/"intro":\s*"([^"]+)"/);
      if (introMatch) content.intro = introMatch[1];
    }

    // Try to extract requirements
    if (sections.includes('requirements')) {
      const reqMatch = text.match(/"requirements":\s*"([^"]+)"/);
      if (reqMatch) content.requirements = reqMatch[1];
    }

    return content;
  }

  /**
   * Calculate cost based on tokens and model
   */
  private static calculateCost(tokens: number, model: string): number {
    // OpenRouter pricing (approximate - updated Jan 2026)
    const pricing: Record<string, number> = {
      // FREE MODELS (Xiaomi, DeepSeek, etc.)
      'xiaomi/mimo-v2-flash': 0.00, // FREE - HIGH QUALITY (deprecating Jan 26!)
      'deepseek/deepseek-chat': 0.00, // FREE
      'deepseek/deepseek-r1': 0.00, // FREE (Xiaomi's DeepSeek model)
      'qwen/qwen-2.5-72b-instruct': 0.00, // FREE
      'microsoft/phi-3-medium-128k-instruct': 0.00, // FREE
      'meta-llama/llama-3.2-3b-instruct': 0.00, // FREE

      // ULTRA CHEAP MODELS (<$0.10/M tokens)
      'google/gemini-flash-1.5': 0.075 / 1_000_000, // $0.075 per 1M
      'google/gemini-2.0-flash-exp': 0.00, // FREE (experimental)
      'openai/gpt-4o-mini': 0.15 / 1_000_000,
      'deepseek/deepseek-coder': 0.00, // FREE

      // CHEAP MODELS
      'anthropic/claude-haiku': 0.25 / 1_000_000,
      'anthropic/claude-haiku-3.5': 0.80 / 1_000_000,
      'openai/gpt-3.5-turbo': 0.50 / 1_000_000,
      'meta-llama/llama-3.1-70b-instruct': 0.20 / 1_000_000,
    };

    const rate = pricing[model.toLowerCase()] || pricing[model] || 0.00; // Default to free
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
}

/**
 * Batch process multiple pages
 */
export async function batchGenerateContent(
  pageIds: string[],
  sections: AIContentSection[],
  options: {
    batchSize?: number;
    delayBetweenBatches?: number;
    model?: string;
    onProgress?: (processed: number, total: number) => void;
  } = {}
): Promise<{ successful: number; failed: number; errors: any[] }> {
  const {
    batchSize = 10,
    delayBetweenBatches = 1000,
    model,
    onProgress
  } = options;

  const results = {
    successful: 0,
    failed: 0,
    errors: [] as any[],
    stopped: false,
    stopReason: ''
  };

  // Process in batches
  for (let i = 0; i < pageIds.length; i += batchSize) {
    const batch = pageIds.slice(i, i + batchSize);

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
          model
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
          // Check if it's a rate limit error
          if (response.error && response.error.includes('Rate limit')) {
            results.stopped = true;
            results.stopReason = 'RATE_LIMIT';
            results.errors.push({
              pageId: page.id,
              error: response.error,
              severity: 'CRITICAL'
            });
            // Don't count as failed, just stopped
            return; // Exit this promise early
          }

          results.failed++;
          results.errors.push({ pageId: page.id, error: response.error });
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push({ pageId: page.id, error: error.message });
      }
    });

    await Promise.all(promises);

    // Check if we hit rate limit and should STOP
    if (results.stopped) {
      console.warn(`⚠️ Batch generation stopped due to: ${results.stopReason}`);
      break; // Exit the for loop immediately
    }

    // Progress callback
    if (onProgress) {
      onProgress(Math.min(i + batchSize, pageIds.length), pageIds.length);
    }

    // Delay between batches
    if (i + batchSize < pageIds.length) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }

  return results;
}
