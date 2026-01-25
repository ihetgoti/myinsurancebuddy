'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Search, FileText, Globe, Zap } from 'lucide-react';

interface PageItem {
    id: string;
    slug: string;
    title: string;
    category: string;
    type: 'static' | 'dynamic';
    isPublished: boolean;
    isAiGenerated?: boolean;
    aiGeneratedAt?: string;
    publishedAt?: string;
    insuranceType?: string;
    state?: string;
    city?: string;
    geoLevel?: string;
    url: string;
}

interface CategoryCounts {
    all: number;
    main: number;
    insurance: number;
    tools: number;
    resources: number;
    guides: number;
    location: number;
    legal: number;
    user: number;
}

export default function AllPagesPage() {
    const [pages, setPages] = useState<PageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [staticCount, setStaticCount] = useState(0);
    const [dynamicCount, setDynamicCount] = useState(0);
    const [categoryCounts, setCategoryCounts] = useState<CategoryCounts | null>(null);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const limit = 50;

    const siteUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://myinsurancebuddies.com';

    useEffect(() => {
        fetchPages();
    }, [selectedCategory, selectedType, search, page]);

    const fetchPages = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory !== 'all') params.set('category', selectedCategory);
            if (selectedType !== 'all') params.set('type', selectedType);
            if (search) params.set('search', search);
            params.set('limit', limit.toString());
            params.set('offset', (page * limit).toString());

            const res = await fetch(`/api/all-pages?${params}`);
            const data = await res.json();

            setPages(data.pages || []);
            setTotal(data.total || 0);
            setStaticCount(data.staticCount || 0);
            setDynamicCount(data.dynamicCount || 0);
            setCategoryCounts(data.categoryCounts || null);
        } catch (error) {
            console.error('Failed to fetch pages:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: 'all', label: 'All Categories' },
        { id: 'main', label: 'Main Pages' },
        { id: 'insurance', label: 'Insurance' },
        { id: 'tools', label: 'Tools' },
        { id: 'resources', label: 'Resources' },
        { id: 'guides', label: 'Guides' },
        { id: 'location', label: 'Location' },
        { id: 'legal', label: 'Legal' },
        { id: 'user', label: 'User' },
        { id: 'dynamic', label: 'AI Generated' },
    ];

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'main': return '🏠';
            case 'insurance': return '🛡️';
            case 'tools': return '🔧';
            case 'resources': return '📚';
            case 'guides': return '📖';
            case 'location': return '📍';
            case 'legal': return '⚖️';
            case 'user': return '👤';
            case 'dynamic': return '🤖';
            default: return '📄';
        }
    };

    const getTypeColor = (type: string) => {
        return type === 'static'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-purple-100 text-purple-800';
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <AdminLayout>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">All Site Pages</h1>
                    <p className="text-gray-600 mt-1">
                        View and manage all pages across the website
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4 border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Static Pages</p>
                                <p className="text-2xl font-bold text-gray-900">{staticCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Dynamic Pages</p>
                                <p className="text-2xl font-bold text-gray-900">{dynamicCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Globe className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Pages</p>
                                <p className="text-2xl font-bold text-gray-900">{staticCount + dynamicCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search pages..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(0);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Type Filter */}
                        <select
                            value={selectedType}
                            onChange={(e) => {
                                setSelectedType(e.target.value);
                                setPage(0);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Types</option>
                            <option value="static">Static Only</option>
                            <option value="dynamic">Dynamic Only</option>
                        </select>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setPage(0);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.label} {categoryCounts && cat.id !== 'dynamic' && cat.id !== 'all' ? `(${categoryCounts[cat.id as keyof CategoryCounts] || 0})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Pages Table */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Page
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pages.map((pageItem) => (
                                        <tr key={pageItem.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {pageItem.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {pageItem.slug}
                                                    </div>
                                                    {pageItem.type === 'dynamic' && (
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            {pageItem.insuranceType && <span className="mr-2">{pageItem.insuranceType}</span>}
                                                            {pageItem.state && <span className="mr-2">• {pageItem.state}</span>}
                                                            {pageItem.city && <span>• {pageItem.city}</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-lg mr-2">{getCategoryIcon(pageItem.category)}</span>
                                                <span className="text-sm text-gray-700 capitalize">{pageItem.category}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(pageItem.type)}`}>
                                                    {pageItem.type === 'static' ? 'Static' : 'Dynamic'}
                                                </span>
                                                {pageItem.isAiGenerated && (
                                                    <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                        AI
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${pageItem.isPublished
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {pageItem.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={`${siteUrl}${pageItem.url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        View
                                                    </a>
                                                    {pageItem.type === 'dynamic' && (
                                                        <Link
                                                            href={`/dashboard/pages/${pageItem.id}`}
                                                            className="text-gray-600 hover:text-gray-800 ml-2"
                                                        >
                                                            Edit
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {pages.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No pages found matching your criteria.</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 border-t flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Showing {page * limit + 1} to {Math.min((page + 1) * limit, total)} of {total} pages
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPage(p => Math.max(0, p - 1))}
                                            disabled={page === 0}
                                            className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPage(p => p + 1)}
                                            disabled={page >= totalPages - 1}
                                            className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Quick Links */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <Link
                        href="/dashboard/pages"
                        className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
                    >
                        <h3 className="font-semibold text-gray-900">Manage Dynamic Pages</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Publish, unpublish, or delete AI-generated pages
                        </p>
                    </Link>
                    <Link
                        href="/dashboard/ai-content"
                        className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
                    >
                        <h3 className="font-semibold text-gray-900">Generate New Pages</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Use AI to create new insurance pages
                        </p>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
