/**
 * LLM Content Ranker
 * Uses AI to evaluate, score, and rank content quality
 * Implements LLM-as-a-Judge pattern for content evaluation
 */

import { prisma } from './prisma';

export interface ContentScore {
  overall: number;        // 0-100
  readability: number;    // 0-100
  seoOptimization: number; // 0-100
  comprehensiveness: number; // 0-100
  userValue: number;      // 0-100
  originality: number;    // 0-100
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface RankingResult {
  pageId: string;
  slug: string;
  scores: ContentScore;
  rank: number;
  percentile: number;
  aiAnalysis: string;
}

export class LLMContentRanker {
  private static readonly SCORE_PROMPT = `You are an expert content evaluator for insurance websites. Analyze the following content and provide detailed scores.

Rate each category from 0-100:
1. **Readability**: Is it easy to read? Clear sentence structure? Appropriate for general audience?
2. **SEO Optimization**: Keyword usage, headings structure, meta relevance
3. **Comprehensiveness**: Does it cover the topic thoroughly? Missing information?
4. **User Value**: Does it help the reader make decisions? Actionable advice?
5. **Originality**: Unique insights? Not generic/template content?

Content to analyze:
Title: {{title}}
Meta Description: {{metaDescription}}
Content:
{{content}}

Respond in this exact JSON format:
{
  "overall": 85,
  "readability": 90,
  "seoOptimization": 80,
  "comprehensiveness": 85,
  "userValue": 88,
  "originality": 75,
  "strengths": ["Clear explanations", "Good structure"],
  "weaknesses": ["Could use more examples", "Missing local specifics"],
  "suggestions": ["Add FAQ section", "Include specific rates"]
}`;

  /**
   * Score a single page's content using AI
   */
  static async scorePage(pageId: string, model: string = 'anthropic/claude-haiku'): Promise<ContentScore | null> {
    try {
      const page = await prisma.page.findUnique({
        where: { id: pageId },
        select: {
          id: true,
          slug: true,
          title: true,
          metaTitle: true,
          metaDescription: true,
          content: true,
          aiGeneratedContent: true,
          insuranceType: { select: { name: true } },
          state: { select: { name: true } },
          city: { select: { name: true } },
        },
      });

      // Build content string from available fields
      let contentString = '';
      
      // Add AI-generated content if available
      if (page?.aiGeneratedContent) {
        const aiContent = page.aiGeneratedContent as Record<string, string>;
        contentString = Object.values(aiContent).join('\n\n');
      }
      
      // Add title/meta for context
      if (page?.title) contentString = page.title + '\n\n' + contentString;
      if (page?.metaDescription) contentString += '\n\n' + page.metaDescription;

      if (!page || contentString.length < 100) {
        return null;
      }

      // Clean content for analysis
      const plainContent = contentString
        .substring(0, 3000); // First 3000 chars for analysis

      const prompt = this.SCORE_PROMPT
        .replace('{{title}}', page.title || page.metaTitle || '')
        .replace('{{metaDescription}}', page.metaDescription || '')
        .replace('{{content}}', plainContent);

      // Call AI API
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Empty AI response');
      }

      const scores: ContentScore = JSON.parse(content);
      
      // Store scores in database
      await prisma.page.update({
        where: { id: pageId },
        data: {
          contentScores: scores as any,
          lastScoredAt: new Date(),
        },
      });

      return scores;
    } catch (error) {
      console.error('Content scoring error:', error);
      return null;
    }
  }

  /**
   * Rank multiple pages and return sorted results
   */
  static async rankPages(
    filters?: { insuranceTypeId?: string; stateId?: string; limit?: number }
  ): Promise<RankingResult[]> {
    const where: any = {
      isPublished: true,
      // Filter for pages with AI-generated content or substantial content
      OR: [
        { aiGeneratedContent: { not: null } },
        { isAiGenerated: true },
      ],
    };

    if (filters?.insuranceTypeId) {
      where.insuranceTypeId = filters.insuranceTypeId;
    }
    if (filters?.stateId) {
      where.stateId = filters.stateId;
    }

    const pages = await prisma.page.findMany({
      where,
      select: {
        id: true,
        slug: true,
        contentScores: true,
        lastScoredAt: true,
        viewCount: true,
      },
      take: filters?.limit || 100,
      orderBy: { lastScoredAt: 'asc' }, // Score oldest first
    });

    // Score pages without scores
    const results: RankingResult[] = [];
    
    for (const page of pages) {
      let scores = page.contentScores as unknown as ContentScore | null;
      
      // Rescore if never scored or scored > 30 days ago
      const needsScoring = !scores || !page.lastScoredAt || 
        (Date.now() - new Date(page.lastScoredAt).getTime()) > 30 * 24 * 60 * 60 * 1000;

      if (needsScoring) {
        scores = await this.scorePage(page.id);
        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 500));
      }

      if (scores) {
        results.push({
          pageId: page.id,
          slug: page.slug,
          scores,
          rank: 0, // Will be set after sorting
          percentile: 0, // Will be calculated
          aiAnalysis: this.generateAnalysis(scores),
        });
      }
    }

    // Sort by overall score and assign ranks
    results.sort((a, b) => b.scores.overall - a.scores.overall);
    
    results.forEach((result, index) => {
      result.rank = index + 1;
      result.percentile = Math.round(((results.length - index) / results.length) * 100);
    });

    return results;
  }

  /**
   * Compare two pages and determine which is better
   */
  static async comparePages(pageAId: string, pageBId: string): Promise<{
    winner: string;
    reasoning: string;
    comparison: Record<string, { winner: string; diff: number }>;
  } | null> {
    const [pageA, pageB] = await Promise.all([
      prisma.page.findUnique({ where: { id: pageAId }, select: { slug: true, contentScores: true } }),
      prisma.page.findUnique({ where: { id: pageBId }, select: { slug: true, contentScores: true } }),
    ]);

    if (!pageA?.contentScores || !pageB?.contentScores) {
      return null;
    }

    const scoresA = pageA.contentScores as unknown as ContentScore;
    const scoresB = pageB.contentScores as unknown as ContentScore;

    const comparison: Record<string, { winner: string; diff: number }> = {};
    let aWins = 0;
    let bWins = 0;

    const categories: (keyof ContentScore)[] = ['overall', 'readability', 'seoOptimization', 'comprehensiveness', 'userValue', 'originality'];
    
    for (const cat of categories) {
      const diff = (scoresA[cat] as number) - (scoresB[cat] as number);
      comparison[cat] = {
        winner: diff > 0 ? pageA.slug : pageB.slug,
        diff: Math.abs(diff),
      };
      if (diff > 0) aWins++;
      else if (diff < 0) bWins++;
    }

    const winner = aWins > bWins ? pageA.slug : pageB.slug;
    const reasoning = this.generateComparisonReasoning(scoresA, scoresB, pageA.slug, pageB.slug);

    return { winner, reasoning, comparison };
  }

  /**
   * Get improvement suggestions for low-scoring pages
   */
  static async getImprovementQueue(minScore: number = 70, limit: number = 20): Promise<{
    pageId: string;
    slug: string;
    currentScore: number;
    priority: 'high' | 'medium' | 'low';
    suggestions: string[];
  }[]> {
    const pages = await prisma.page.findMany({
      where: {
        isPublished: true,
        lastScoredAt: { not: null },
      },
      select: {
        id: true,
        slug: true,
        contentScores: true,
        viewCount: true,
      },
    });

    const lowScoring = pages
      .filter(p => {
        const scores = p.contentScores as unknown as ContentScore | null;
        return scores && scores.overall < minScore;
      })
      .map(p => {
        const scores = p.contentScores as unknown as ContentScore;
        // Priority based on score + traffic
        const priority = scores.overall < 50 || p.viewCount > 1000 ? 'high' :
                        scores.overall < 60 ? 'medium' : 'low';
        
        return {
          pageId: p.id,
          slug: p.slug,
          currentScore: scores.overall,
          priority: priority as 'high' | 'medium' | 'low',
          suggestions: scores.suggestions || [],
        };
      })
      .sort((a, b) => {
        // Sort by priority then score
        const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return a.currentScore - b.currentScore;
      })
      .slice(0, limit);

    return lowScoring;
  }

  private static generateAnalysis(scores: ContentScore): string {
    const parts: string[] = [];
    
    if (scores.overall >= 90) {
      parts.push('Exceptional content that stands out.');
    } else if (scores.overall >= 80) {
      parts.push('High-quality content with minor improvements possible.');
    } else if (scores.overall >= 70) {
      parts.push('Good content that could benefit from enhancements.');
    } else if (scores.overall >= 60) {
      parts.push('Average content needing significant improvements.');
    } else {
      parts.push('Below-average content requiring major revision.');
    }

    // Identify strongest area
    const categories = [
      { name: 'readability', score: scores.readability },
      { name: 'SEO', score: scores.seoOptimization },
      { name: 'comprehensiveness', score: scores.comprehensiveness },
      { name: 'user value', score: scores.userValue },
      { name: 'originality', score: scores.originality },
    ];
    
    const strongest = categories.reduce((a, b) => a.score > b.score ? a : b);
    const weakest = categories.reduce((a, b) => a.score < b.score ? a : b);

    parts.push(`Strongest in ${strongest.name} (${strongest.score}/100).`);
    parts.push(`Needs work on ${weakest.name} (${weakest.score}/100).`);

    return parts.join(' ');
  }

  private static generateComparisonReasoning(
    scoresA: ContentScore, 
    scoresB: ContentScore, 
    nameA: string, 
    nameB: string
  ): string {
    const diff = scoresA.overall - scoresB.overall;
    const winner = diff > 0 ? nameA : nameB;
    const loser = diff > 0 ? nameB : nameA;
    const absDiff = Math.abs(diff);

    if (absDiff < 5) {
      return `Both pages are very similar in quality. ${winner} has a slight edge overall.`;
    } else if (absDiff < 15) {
      return `${winner} is noticeably better than ${loser}, particularly in content depth.`;
    } else {
      return `${winner} significantly outperforms ${loser} across multiple quality dimensions.`;
    }
  }
}
