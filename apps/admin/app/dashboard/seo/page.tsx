'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';

interface SEOStats {
    totalPages: number;
    publishedPages: number;
    draftPages: number;
    pagesWithMeta: number;
    pagesWithoutMeta: number;
    pagesWithSchema: number;
    avgTitleLength: number;
    avgDescLength: number;
    sitemapLastGenerated: string | null;
    sitemapUrls: number;
}

interface SEOIssue {
    type: 'error' | 'warning' | 'info';
    category: string;
    message: string;
    count: number;
    pages?: string[];
}

export default function SEODashboardPage() {
    const [stats, setStats] = useState<SEOStats | null>(null);
    const [issues, setIssues] = useState<SEOIssue[]>([]);
    const [sitemaps, setSitemaps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'sitemaps' | 'settings'>('overview');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, issuesRes, sitemapsRes] = await Promise.all([
                fetch(getApiUrl('/api/seo/stats')),
                fetch(getApiUrl('/api/seo/issues')),
                fetch(getApiUrl('/api/seo/sitemaps')),
            ]);

            const [statsData, issuesData, sitemapsData] = await Promise.all([
                statsRes.json(),
                issuesRes.json(),
                sitemapsRes.json(),
            ]);

            setStats(statsData);
            setIssues(Array.isArray(issuesData) ? issuesData : []);
            setSitemaps(Array.isArray(sitemapsData) ? sitemapsData : []);
        } catch (error) {
            console.error('Failed to fetch SEO data:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateSitemaps = async () => {
        setGenerating(true);
        try {
            const res = await fetch(getApiUrl('/api/seo/sitemaps/generate'), {
                method: 'POST',
            });
            if (!res.ok) throw new Error('Failed to generate sitemaps');
            await fetchData();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setGenerating(false);
        }
    };

    const getSEOScore = () => {
        if (!stats) return 0;
        let score = 0;
        
        // Published pages (20 points)
        score += Math.min(20, (stats.publishedPages / Math.max(stats.totalPages, 1)) * 20);
        
        // Meta coverage (30 points)
        score += Math.min(30, (stats.pagesWithMeta / Math.max(stats.totalPages, 1)) * 30);
        
        // Schema markup (20 points)
        score += Math.min(20, (stats.pagesWithSchema / Math.max(stats.totalPages, 1)) * 20);
        
        // Title length (15 points) - optimal 50-60 chars
        if (stats.avgTitleLength >= 50 && stats.avgTitleLength <= 60) score += 15;
        else if (stats.avgTitleLength >= 40 && stats.avgTitleLength <= 70) score += 10;
        else score += 5;
        
        // Description length (15 points) - optimal 150-160 chars
        if (stats.avgDescLength >= 150 && stats.avgDescLength <= 160) score += 15;
        else if (stats.avgDescLength >= 120 && stats.avgDescLength <= 180) score += 10;
        else score += 5;

        return Math.round(score);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-green-100';
        if (score >= 60) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        );
    }

    const score = getSEOScore();

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">SEO Dashboard</h1>
                        <p className="text-gray-600 mt-1">Monitor and optimize your site's SEO performance</p>
                    </div>
                    <button
                        onClick={generateSitemaps}
                        disabled={generating}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {generating ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Generating...
                            </>
                        ) : (
                            '🔄 Regenerate Sitemaps'
                        )}
                    </button>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="border-b px-6">
                        <div className="flex gap-6">
                            {[
                                { id: 'overview', label: 'Overview', icon: '📊' },
                                { id: 'issues', label: 'Issues', icon: '⚠️', count: issues.length },
                                { id: 'sitemaps', label: 'Sitemaps', icon: '🗺️' },
                                { id: 'settings', label: 'Settings', icon: '⚙️' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-4 border-b-2 transition flex items-center gap-2 ${
                                        activeTab === tab.id
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.icon} {tab.label}
                                    {tab.count !== undefined && tab.count > 0 && (
                                        <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                {/* SEO Score */}
                                <div className="grid md:grid-cols-4 gap-6">
                                    <div className={`${getScoreBg(score)} rounded-xl p-6 text-center`}>
                                        <div className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</div>
                                        <div className="text-gray-600 mt-2">SEO Score</div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement'}
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 rounded-xl p-6 text-center">
                                        <div className="text-5xl font-bold text-blue-600">{stats?.publishedPages || 0}</div>
                                        <div className="text-gray-600 mt-2">Published Pages</div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {stats?.draftPages || 0} drafts
                                        </div>
                                    </div>

                                    <div className="bg-green-50 rounded-xl p-6 text-center">
                                        <div className="text-5xl font-bold text-green-600">{stats?.pagesWithMeta || 0}</div>
                                        <div className="text-gray-600 mt-2">With Meta Tags</div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {stats?.pagesWithoutMeta || 0} missing
                                        </div>
                                    </div>

                                    <div className="bg-purple-50 rounded-xl p-6 text-center">
                                        <div className="text-5xl font-bold text-purple-600">{stats?.sitemapUrls || 0}</div>
                                        <div className="text-gray-600 mt-2">Sitemap URLs</div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Last: {stats?.sitemapLastGenerated 
                                                ? new Date(stats.sitemapLastGenerated).toLocaleDateString() 
                                                : 'Never'}
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h3 className="font-semibold mb-4">Title Tag Analysis</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Average Length</span>
                                                <span className="font-medium">{stats?.avgTitleLength || 0} chars</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${
                                                        (stats?.avgTitleLength || 0) >= 50 && (stats?.avgTitleLength || 0) <= 60 
                                                            ? 'bg-green-500' 
                                                            : 'bg-yellow-500'
                                                    }`}
                                                    style={{ width: `${Math.min(100, ((stats?.avgTitleLength || 0) / 70) * 100)}%` }}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500">Optimal: 50-60 characters</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h3 className="font-semibold mb-4">Meta Description Analysis</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Average Length</span>
                                                <span className="font-medium">{stats?.avgDescLength || 0} chars</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${
                                                        (stats?.avgDescLength || 0) >= 150 && (stats?.avgDescLength || 0) <= 160 
                                                            ? 'bg-green-500' 
                                                            : 'bg-yellow-500'
                                                    }`}
                                                    style={{ width: `${Math.min(100, ((stats?.avgDescLength || 0) / 180) * 100)}%` }}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500">Optimal: 150-160 characters</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Coverage Chart */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="font-semibold mb-4">SEO Coverage</h3>
                                    <div className="grid md:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Meta Title', value: stats?.pagesWithMeta || 0, total: stats?.totalPages || 1, color: 'bg-blue-500' },
                                            { label: 'Meta Description', value: stats?.pagesWithMeta || 0, total: stats?.totalPages || 1, color: 'bg-green-500' },
                                            { label: 'Schema Markup', value: stats?.pagesWithSchema || 0, total: stats?.totalPages || 1, color: 'bg-purple-500' },
                                            { label: 'Published', value: stats?.publishedPages || 0, total: stats?.totalPages || 1, color: 'bg-emerald-500' },
                                        ].map((item) => (
                                            <div key={item.label}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>{item.label}</span>
                                                    <span>{Math.round((item.value / item.total) * 100)}%</span>
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${item.color}`}
                                                        style={{ width: `${(item.value / item.total) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Issues Tab */}
                        {activeTab === 'issues' && (
                            <div>
                                {issues.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-5xl mb-4">✅</div>
                                        <h3 className="text-xl font-semibold mb-2">No SEO Issues Found</h3>
                                        <p className="text-gray-500">Your site is looking great!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {issues.map((issue, i) => (
                                            <div 
                                                key={i}
                                                className={`p-4 rounded-lg border-l-4 ${
                                                    issue.type === 'error' 
                                                        ? 'bg-red-50 border-red-500' 
                                                        : issue.type === 'warning'
                                                            ? 'bg-yellow-50 border-yellow-500'
                                                            : 'bg-blue-50 border-blue-500'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                                            issue.type === 'error' 
                                                                ? 'bg-red-100 text-red-700' 
                                                                : issue.type === 'warning'
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {issue.category}
                                                        </span>
                                                        <p className="font-medium mt-2">{issue.message}</p>
                                                    </div>
                                                    <span className="text-gray-500 text-sm">{issue.count} pages</span>
                                                </div>
                                                {issue.pages && issue.pages.length > 0 && (
                                                    <div className="mt-3 text-sm">
                                                        <p className="text-gray-500">Affected pages:</p>
                                                        <ul className="mt-1 space-y-1">
                                                            {issue.pages.slice(0, 5).map((page, j) => (
                                                                <li key={j}>
                                                                    <a href={`/dashboard/pages?slug=${page}`} className="text-blue-600 hover:underline">
                                                                        {page}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                            {issue.pages.length > 5 && (
                                                                <li className="text-gray-400">...and {issue.pages.length - 5} more</li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Sitemaps Tab */}
                        {activeTab === 'sitemaps' && (
                            <div>
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-2">Sitemap Index</h3>
                                    <a 
                                        href="/sitemap-index.xml" 
                                        target="_blank"
                                        className="text-blue-600 hover:underline"
                                    >
                                        /sitemap-index.xml →
                                    </a>
                                </div>

                                <div className="space-y-4">
                                    {sitemaps.length === 0 ? (
                                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                                            <div className="text-5xl mb-4">🗺️</div>
                                            <h3 className="text-xl font-semibold mb-2">No Sitemaps Generated</h3>
                                            <p className="text-gray-500 mb-4">Generate sitemaps to help search engines discover your pages.</p>
                                            <button
                                                onClick={generateSitemaps}
                                                disabled={generating}
                                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                            >
                                                Generate Sitemaps
                                            </button>
                                        </div>
                                    ) : (
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left">Sitemap</th>
                                                    <th className="px-4 py-3 text-left">Type</th>
                                                    <th className="px-4 py-3 text-left">URLs</th>
                                                    <th className="px-4 py-3 text-left">Last Generated</th>
                                                    <th className="px-4 py-3 text-left">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {sitemaps.map((sitemap) => (
                                                    <tr key={sitemap.id}>
                                                        <td className="px-4 py-3">
                                                            <a 
                                                                href={`/${sitemap.slug}`} 
                                                                target="_blank"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                /{sitemap.slug}
                                                            </a>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="px-2 py-0.5 bg-gray-100 rounded text-sm">
                                                                {sitemap.type}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">{sitemap.urlCount}</td>
                                                        <td className="px-4 py-3 text-gray-500">
                                                            {sitemap.lastGenerated 
                                                                ? new Date(sitemap.lastGenerated).toLocaleString()
                                                                : 'Never'}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <a 
                                                                href={`/${sitemap.slug}`} 
                                                                target="_blank"
                                                                className="text-gray-500 hover:text-gray-700"
                                                            >
                                                                View →
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                {/* Submit to Search Engines */}
                                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                                    <h3 className="font-semibold mb-4">Submit to Search Engines</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <a 
                                            href="https://search.google.com/search-console" 
                                            target="_blank"
                                            className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:border-blue-300 transition"
                                        >
                                            <div className="text-2xl">🔍</div>
                                            <div>
                                                <div className="font-medium">Google Search Console</div>
                                                <div className="text-sm text-gray-500">Submit sitemap to Google</div>
                                            </div>
                                        </a>
                                        <a 
                                            href="https://www.bing.com/webmasters" 
                                            target="_blank"
                                            className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:border-blue-300 transition"
                                        >
                                            <div className="text-2xl">🅱️</div>
                                            <div>
                                                <div className="font-medium">Bing Webmaster Tools</div>
                                                <div className="text-sm text-gray-500">Submit sitemap to Bing</div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="max-w-2xl space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-4">Sitemap Settings</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Change Frequency</label>
                                            <select className="w-full px-4 py-2 border rounded-lg">
                                                <option value="daily">Daily</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Default Priority</label>
                                            <input 
                                                type="number" 
                                                min="0" 
                                                max="1" 
                                                step="0.1"
                                                defaultValue="0.8"
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Max URLs per Sitemap</label>
                                            <input 
                                                type="number" 
                                                defaultValue="50000"
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" defaultChecked className="rounded" />
                                            <span>Auto-generate sitemaps on page publish</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-4">robots.txt</h3>
                                    <textarea 
                                        className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
                                        rows={8}
                                        defaultValue={`User-agent: *
Allow: /

Sitemap: https://myinsurancebuddies.com/sitemap-index.xml`}
                                    />
                                </div>

                                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                                    Save Settings
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

