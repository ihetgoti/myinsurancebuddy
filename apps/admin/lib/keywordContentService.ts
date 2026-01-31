/**
 * Keyword-Based Content Generation Service
 * Generates SEO-optimized content with targeted keywords
 */

import { prisma } from '@/lib/prisma';

export interface KeywordConfig {
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  lsiKeywords: string[];
  targetDensity: number;
  maxDensity: number;
  requireInTitle: boolean;
  requireInH1: boolean;
  requireInH2: boolean;
  requireInFirst100: boolean;
  requireInMeta: boolean;
}

export interface KeywordAnalysis {
  primaryCount: number;
  secondaryCounts: Record<string, number>;
  totalWords: number;
  primaryDensity: number;
  avgSecondaryDensity: number;
  inTitle: boolean;
  inH1: boolean;
  inFirst100: boolean;
  score: number; // 0-100 SEO score
}

export class KeywordContentService {
  
  /**
   * Build keyword-optimized prompt
   * MAIN TARGET: "cheapest {niche} in {location}"
   */
  static buildKeywordPrompt(
    basePrompt: string,
    keywords: KeywordConfig,
    section: string,
    locationName: string,
    insuranceType: string
  ): string {
    const parts: string[] = [];
    
    // Base prompt
    parts.push(basePrompt);
    
    // Keyword instructions
    parts.push(`\n\n=== SEO KEYWORD REQUIREMENTS ===`);
    parts.push(`MAIN TARGET KEYWORD: "${keywords.primaryKeyword}"`);
    parts.push(`This is the #1 priority keyword. Use it ${keywords.targetDensity}% of the time (about ${Math.round(keywords.targetDensity * 2)} times per 100 words).`);
    parts.push(`MAXIMUM density: ${keywords.maxDensity}% (don't overuse!)`);
    
    if (keywords.secondaryKeywords.length > 0) {
      parts.push(`\nSupporting Keywords (use 1-2 times each):`);
      parts.push(keywords.secondaryKeywords.join(', '));
    }
    
    if (keywords.longTailKeywords.length > 0) {
      parts.push(`\nLong-tail Keywords (perfect for FAQs and questions):`);
      parts.push(keywords.longTailKeywords.join(', '));
    }
    
    if (keywords.lsiKeywords.length > 0) {
      parts.push(`\nLSI/Related Terms (for semantic SEO):`);
      parts.push(keywords.lsiKeywords.join(', '));
    }
    
    // Placement requirements
    parts.push(`\n=== MANDATORY PLACEMENTS ===`);
    if (keywords.requireInTitle) {
      parts.push(`✓ MUST start title with: "${keywords.primaryKeyword}" or similar`);
    }
    if (keywords.requireInH1) {
      parts.push(`✓ MUST include "${keywords.primaryKeyword}" in the main H1 heading`);
    }
    if (keywords.requireInH2) {
      parts.push(`✓ MUST include "${keywords.primaryKeyword}" or variation in at least one H2`);
    }
    if (keywords.requireInFirst100) {
      parts.push(`✓ MUST include "${keywords.primaryKeyword}" in the FIRST SENTENCE if possible, definitely in first paragraph`);
    }
    if (keywords.requireInMeta) {
      parts.push(`✓ MUST include "${keywords.primaryKeyword}" in meta description + mention savings/discounts`);
    }
    
    // Section-specific instructions
    parts.push(`\n=== SECTION-SPECIFIC SEO ===`);
    parts.push(this.getSectionKeywordInstructions(section, keywords));
    
    // Writing guidance
    parts.push(`\n=== WRITING GUIDANCE ===`);
    parts.push(`Opening Hook Ideas:`);
    parts.push(`- "Looking for ${keywords.primaryKeyword}? You're in the right place..."`);
    parts.push(`- "${keywords.primaryKeyword} doesn't have to be difficult to find..."`);
    parts.push(`- "Want to know how to get ${keywords.primaryKeyword}? Read on..."`);
    parts.push(`\nTone: Helpful, money-saving focused, authoritative but approachable`);
    parts.push(`Action Words: save, compare, find, get, reduce, lower, cut, slash`);
    parts.push(`\nRemember: Every section should help the reader SAVE MONEY on ${insuranceType}!`);
    
    return parts.join('\n');
  }
  
  /**
   * Get section-specific keyword instructions
   * FOCUS: "cheapest {niche} in {location}" pattern
   */
  private static getSectionKeywordInstructions(section: string, keywords: KeywordConfig): string {
    const primary = keywords.primaryKeyword; // "cheapest auto insurance in california"
    const shortPrimary = primary.replace('cheapest ', ''); // "auto insurance in california"
    
    switch (section) {
      case 'intro':
        return `INTRODUCTION - SEO Checklist:
✓ FIRST SENTENCE: Must include "${primary}" 
✓ Example: "Looking for ${primary}? We've got you covered..."
✓ Also mention: ${keywords.secondaryKeywords.slice(0, 2).join(', ')}
✓ Promise: Tell reader they'll learn how to save money
✓ Length: 150-200 words`;
        
      case 'requirements':
        return `REQUIREMENTS - Money-Saving Angle:
✓ Heading: Include "${primary} requirements" or "What do I need for ${shortPrimary}?"
✓ Focus: Minimum legal requirements = cheapest option
✓ Include: How to meet requirements for less money
✓ Mention: ${keywords.lsiKeywords.slice(0, 3).join(', ')}
✓ Format: Bullet points for easy scanning`;
        
      case 'faqs':
        return `FAQs - Question-Based Keywords:
✓ Q1: "How do I find ${primary}?" (use exact phrase)
✓ Q2: "${keywords.longTailKeywords[0] || 'What affects ' + shortPrimary + ' rates?'}"
✓ Q3: "Is ${shortPrimary} expensive?"
✓ Q4: "How can I lower my ${shortPrimary} cost?"
✓ Q5: "${keywords.longTailKeywords[1] || 'Where to get cheap ' + shortPrimary}"
✓ Each answer: 50-100 words with actionable advice`;
        
      case 'tips':
        return `TIPS - Action-Oriented:
✓ Title: "${primary} - 7 Money-Saving Tips" or "How to Find ${primary}"
✓ Each tip: Start with action verb (Compare, Ask, Bundle, Raise, Shop)
✓ Include: ${keywords.secondaryKeywords.slice(0, 3).join(', ')}
✓ Focus: Practical ways to reduce premiums
✓ End each tip with estimated savings if possible`;
        
      case 'costBreakdown':
        return `COST BREAKDOWN - Price Focus:
✓ Title: "${primary} - Cost Breakdown" or "How Much Does ${shortPrimary} Cost?"
✓ Include exact phrase: "${primary}" at least once
✓ Provide: Price ranges (cheap/average/expensive)
✓ Explain: What makes it cheaper or more expensive
✓ Mention: Minimum coverage costs vs full coverage
✓ Use: ${keywords.lsiKeywords.filter(k => ['premium', 'rate', 'cost', 'price'].some(p => k.includes(p))).slice(0, 3).join(', ')}`;
        
      case 'discounts':
        return `DISCOUNTS - Savings Focus:
✓ Title: "Discounts for ${shortPrimary}" or "Save on ${shortPrimary}"
✓ Include: All major discount types
✓ Mention: How much each saves (10%, 15%, etc.)
✓ Highlight: Stackable discounts (combine for maximum savings)
✓ Include: ${keywords.secondaryKeywords.find(k => k.includes('discount')) || 'discounts'}`;
        
      case 'metaTags':
        return `META TAGS - Critical for SEO:
✓ Title (60 chars): "${primary} | Compare & Save Today"
✓ Description (160 chars): "Find ${primary}. Compare quotes, get discounts, and save up to $XXX. Free guide to affordable coverage in [location]."
✓ Include: Primary keyword in BOTH title and description
✓ Add: Call-to-action like "Compare Now" or "Save Today"`;
        
      default:
        return `SEO Guidelines:
✓ Include "${primary}" at least once
✓ Use related terms: ${keywords.secondaryKeywords.slice(0, 3).join(', ')}
✓ Maintain natural, helpful tone
✓ Focus on helping reader save money`;
    }
  }
  
  /**
   * Analyze content for keyword usage
   */
  static analyzeKeywords(content: string, keywords: KeywordConfig): KeywordAnalysis {
    const words = content.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    
    // Count primary keyword
    const primaryRegex = new RegExp(keywords.primaryKeyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const primaryCount = (content.toLowerCase().match(primaryRegex) || []).length;
    
    // Count secondary keywords
    const secondaryCounts: Record<string, number> = {};
    keywords.secondaryKeywords.forEach(kw => {
      const regex = new RegExp(kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      secondaryCounts[kw] = (content.toLowerCase().match(regex) || []).length;
    });
    
    // Calculate densities
    const primaryDensity = totalWords > 0 ? (primaryCount / totalWords) * 100 : 0;
    const totalSecondary = Object.values(secondaryCounts).reduce((a, b) => a + b, 0);
    const avgSecondaryDensity = keywords.secondaryKeywords.length > 0 
      ? (totalSecondary / keywords.secondaryKeywords.length / totalWords) * 100 
      : 0;
    
    // Check placements
    const first100Words = words.slice(0, 100).join(' ');
    const inFirst100 = first100Words.includes(keywords.primaryKeyword.toLowerCase());
    
    // Simple checks for title and H1 (look for markdown/header patterns)
    const lines = content.split('\n');
    const inTitle = lines[0]?.toLowerCase().includes(keywords.primaryKeyword.toLowerCase());
    const inH1 = lines.some(line => 
      line.startsWith('# ') && line.toLowerCase().includes(keywords.primaryKeyword.toLowerCase())
    );
    
    // Calculate SEO score
    let score = 0;
    if (primaryDensity >= keywords.targetDensity && primaryDensity <= keywords.maxDensity) score += 30;
    else if (primaryDensity > 0) score += 15;
    
    if (inTitle) score += 20;
    if (inH1) score += 20;
    if (inFirst100) score += 15;
    if (avgSecondaryDensity > 0.5) score += 15;
    
    return {
      primaryCount,
      secondaryCounts,
      totalWords,
      primaryDensity,
      avgSecondaryDensity,
      inTitle,
      inH1,
      inFirst100,
      score: Math.min(100, score)
    };
  }
  
  /**
   * Get keyword config from database
   */
  static async getKeywordConfig(insuranceTypeId?: string): Promise<KeywordConfig | null> {
    const config = await prisma.keywordConfig.findFirst({
      where: {
        insuranceTypeId: insuranceTypeId || undefined,
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!config) return null;
    
    return {
      primaryKeyword: config.primaryKeyword,
      secondaryKeywords: config.secondaryKeywords,
      longTailKeywords: config.longTailKeywords,
      lsiKeywords: config.lsiKeywords,
      targetDensity: config.targetDensity,
      maxDensity: config.maxDensity,
      requireInTitle: config.requireInTitle,
      requireInH1: config.requireInH1,
      requireInH2: config.requireInH2,
      requireInFirst100: config.requireInFirst100,
      requireInMeta: config.requireInMeta
    };
  }
  
  /**
   * Generate default keyword config for insurance type
   * MAIN TARGET: "cheapest {niche} in {location}"
   */
  static generateDefaultKeywords(insuranceType: string, state?: string, city?: string): KeywordConfig {
    const location = city ? `${city}, ${state}` : state;
    
    // MAIN KEYWORD: cheapest {niche} in {location}
    const primaryKeyword = location 
      ? `cheapest ${insuranceType.toLowerCase()} in ${location.toLowerCase()}`
      : `cheapest ${insuranceType.toLowerCase()}`;
    
    return {
      primaryKeyword,
      secondaryKeywords: [
        `cheap ${insuranceType.toLowerCase()}`,
        `affordable ${insuranceType.toLowerCase()}`,
        `low cost ${insuranceType.toLowerCase()}`,
        `${insuranceType.toLowerCase()} deals`,
        `best ${insuranceType.toLowerCase()} rates`,
        `${insuranceType.toLowerCase()} quotes`,
        `discount ${insuranceType.toLowerCase()}`,
        `${insuranceType.toLowerCase()} savings`
      ],
      longTailKeywords: [
        `how to find cheapest ${insuranceType.toLowerCase()} in ${location?.toLowerCase() || 'your area'}`,
        `where to get cheap ${insuranceType.toLowerCase()}`,
        `most affordable ${insuranceType.toLowerCase()} providers`,
        `compare ${insuranceType.toLowerCase()} rates`,
        `${insuranceType.toLowerCase()} discounts and deals`
      ],
      lsiKeywords: [
        'cheap', 'affordable', 'low cost', 'budget-friendly', 'discount', 
        'savings', 'deals', 'rates', 'quotes', 'comparison',
        'premium', 'deductible', 'coverage', 'policy'
      ],
      targetDensity: 2.5,
      maxDensity: 4.0,
      requireInTitle: true,
      requireInH1: true,
      requireInH2: true,
      requireInFirst100: true,
      requireInMeta: true
    };
  }
}
