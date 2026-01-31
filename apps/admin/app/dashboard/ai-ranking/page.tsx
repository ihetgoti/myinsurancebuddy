'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getApiUrl } from '@/lib/api';
import { 
  Trophy, 
  TrendingUp, 
  AlertCircle, 
  RefreshCw, 
  BarChart3,
  ArrowUp,
  ArrowDown,
  Target,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface RankingResult {
  pageId: string;
  slug: string;
  scores: {
    overall: number;
    readability: number;
    seoOptimization: number;
    comprehensiveness: number;
    userValue: number;
    originality: number;
    suggestions: string[];
    strengths: string[];
    weaknesses: string[];
  };
  rank: number;
  percentile: number;
  aiAnalysis: string;
}

interface ImprovementItem {
  pageId: string;
  slug: string;
  currentScore: number;
  priority: 'high' | 'medium' | 'low';
  suggestions: string[];
}

export default function AIRankingPage() {
  const [activeTab, setActiveTab] = useState<'rankings' | 'improvements'>('rankings');
  const [rankings, setRankings] = useState<RankingResult[]>([]);
  const [improvements, setImprovements] = useState<ImprovementItem[]>([]);
  const [stats, setStats] = useState({ totalRanked: 0, averageScore: 0 });
  const [loading, setLoading] = useState(false);
  const [scoringPage, setScoringPage] = useState<string | null>(null);

  useEffect(() => {
    fetchRankings();
    fetchImprovements();
  }, []);

  const fetchRankings = async () => {
    try {
      const res = await fetch(getApiUrl('/api/ai/rank'));
      const data = await res.json();
      if (data.success) {
        setRankings(data.topPages || []);
        setStats({
          totalRanked: data.totalRanked || 0,
          averageScore: data.averageScore || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch rankings:', error);
    }
  };

  const fetchImprovements = async () => {
    try {
      const res = await fetch(getApiUrl('/api/ai/rank?type=improvements&minScore=70'));
      const data = await res.json();
      if (data.success) {
        setImprovements(data.queue || []);
      }
    } catch (error) {
      console.error('Failed to fetch improvements:', error);
    }
  };

  const scorePage = async (pageId: string) => {
    setScoringPage(pageId);
    try {
      const res = await fetch(getApiUrl('/api/ai/rank'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scoreSpecificPage: pageId }),
      });
      
      if (res.ok) {
        await fetchRankings();
        await fetchImprovements();
      }
    } catch (error) {
      console.error('Failed to score page:', error);
    } finally {
      setScoringPage(null);
    }
  };

  const batchRank = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/ai/rank'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 50 }),
      });
      
      if (res.ok) {
        await fetchRankings();
      }
    } catch (error) {
      console.error('Failed to batch rank:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-500" />
              AI Content Ranking
            </h1>
            <p className="text-gray-600 mt-1">
              LLM-powered content quality analysis and ranking
            </p>
          </div>
          <button
            onClick={batchRank}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Ranking...
              </>
            ) : (
              <>
                <BarChart3 className="w-4 h-4" />
                Batch Rank Pages
              </>
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-blue-600">{stats.totalRanked}</div>
            <div className="text-gray-600 mt-1">Pages Ranked</div>
          </div>
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-green-600">{stats.averageScore}</div>
            <div className="text-gray-600 mt-1">Average Score</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-amber-600">{improvements.length}</div>
            <div className="text-gray-600 mt-1">Need Improvement</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('rankings')}
                className={`px-6 py-4 font-medium flex items-center gap-2 ${
                  activeTab === 'rankings'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Trophy className="w-4 h-4" />
                Top Rankings
              </button>
              <button
                onClick={() => setActiveTab('improvements')}
                className={`px-6 py-4 font-medium flex items-center gap-2 ${
                  activeTab === 'improvements'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Target className="w-4 h-4" />
                Improvement Queue
                {improvements.length > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                    {improvements.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'rankings' && (
              <div>
                {rankings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No pages ranked yet. Click &ldquo;Batch Rank Pages&rdquo; to start.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rankings.map((page) => (
                      <div
                        key={page.pageId}
                        className="border rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              page.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              #{page.rank}
                            </div>
                            <div>
                              <div className="font-medium">{page.slug}</div>
                              <div className="text-sm text-gray-500">{page.aiAnalysis}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-full font-bold ${getScoreColor(page.scores.overall)}`}>
                              {page.scores.overall}/100
                            </div>
                            <button
                              onClick={() => scorePage(page.pageId)}
                              disabled={scoringPage === page.pageId}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {scoringPage === page.pageId ? 'Scoring...' : 'Rescore'}
                            </button>
                          </div>
                        </div>

                        {/* Score Breakdown */}
                        <div className="grid grid-cols-5 gap-2 mt-3 pt-3 border-t">
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Readability</div>
                            <div className="font-medium">{page.scores.readability}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">SEO</div>
                            <div className="font-medium">{page.scores.seoOptimization}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Depth</div>
                            <div className="font-medium">{page.scores.comprehensiveness}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Value</div>
                            <div className="font-medium">{page.scores.userValue}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Original</div>
                            <div className="font-medium">{page.scores.originality}</div>
                          </div>
                        </div>

                        {/* Strengths & Weaknesses */}
                        {(page.scores.strengths?.length > 0 || page.scores.weaknesses?.length > 0) && (
                          <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t text-sm">
                            {page.scores.strengths?.length > 0 && (
                              <div>
                                <div className="flex items-center gap-1 text-green-600 font-medium mb-1">
                                  <CheckCircle className="w-4 h-4" />
                                  Strengths
                                </div>
                                <ul className="list-disc list-inside text-gray-600">
                                  {page.scores.strengths.slice(0, 3).map((s, i) => (
                                    <li key={i}>{s}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {page.scores.weaknesses?.length > 0 && (
                              <div>
                                <div className="flex items-center gap-1 text-red-600 font-medium mb-1">
                                  <XCircle className="w-4 h-4" />
                                  Weaknesses
                                </div>
                                <ul className="list-disc list-inside text-gray-600">
                                  {page.scores.weaknesses.slice(0, 3).map((w, i) => (
                                    <li key={i}>{w}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'improvements' && (
              <div>
                {improvements.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <p>All pages are scoring above 70! Great job!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {improvements.map((item) => (
                      <div
                        key={item.pageId}
                        className="border rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              item.priority === 'high' ? 'bg-red-100 text-red-700' :
                              item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {item.priority.toUpperCase()}
                            </span>
                            <span className="font-medium">{item.slug}</span>
                          </div>
                          <div className={`px-3 py-1 rounded-full font-bold ${getScoreColor(item.currentScore)}`}>
                            {item.currentScore}/100
                          </div>
                        </div>

                        {item.suggestions?.length > 0 && (
                          <div className="mt-2">
                            <div className="text-sm text-gray-500 mb-2">AI Suggestions:</div>
                            <ul className="space-y-1">
                              {item.suggestions.map((suggestion, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <ArrowUp className="w-4 h-4 text-green-500 mt-0.5" />
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="mt-3 flex gap-2">
                          <a
                            href={`/dashboard/pages/${item.pageId}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit Page →
                          </a>
                          <button
                            onClick={() => scorePage(item.pageId)}
                            disabled={scoringPage === item.pageId}
                            className="text-gray-600 hover:text-gray-800 text-sm"
                          >
                            {scoringPage === item.pageId ? 'Rescoring...' : 'Rescore'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            How AI Ranking Works
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Uses LLM-as-a-Judge pattern to evaluate content quality</li>
            <li>• Scores: Readability, SEO, Comprehensiveness, User Value, Originality</li>
            <li>• Identifies strengths and weaknesses for each page</li>
            <li>• Provides improvement queue prioritized by impact</li>
            <li>• Rescore pages after making improvements to track progress</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
