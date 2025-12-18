'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';

interface Page {
    id: string;
    geoLevel: string;
    heroTitle: string | null;
    isPublished: boolean;
    publishedAt: string | null;
    insuranceType: { id: string; name: string; slug: string; icon: string | null };
    country: { id: string; code: string; name: string } | null;
    state: { id: string; slug: string; name: string } | null;
    city: { id: string; slug: string; name: string } | null;
}

interface InsuranceType {
    id: string;
    name: string;
    slug: string;
}

export default function PagesAdminPage() {
    const [pages, setPages] = useState<Page[]>([]);
    const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        insuranceTypeId: '',
        geoLevel: '',
        isPublished: '',
    });
    const [page, setPage] = useState(0);
    const limit = 50;

    useEffect(() => {
        fetchData();
    }, [filters, page]);

    const fetchData = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.insuranceTypeId) params.set('insuranceTypeId', filters.insuranceTypeId);
            if (filters.geoLevel) params.set('geoLevel', filters.geoLevel);
            if (filters.isPublished) params.set('isPublished', filters.isPublished);
            params.set('limit', limit.toString());
            params.set('offset', (page * limit).toString());

            const [pagesRes, typesRes] = await Promise.all([
                fetch(getApiUrl(`/api/pages?${params}`)),
                fetch(getApiUrl('/api/insurance-types')),
            ]);

            const pagesData = await pagesRes.json();
            const typesData = await typesRes.json();

            setPages(pagesData.pages || []);
            setTotal(pagesData.total || 0);
            setInsuranceTypes(Array.isArray(typesData) ? typesData : []);
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this page?')) return;

        try {
            await fetch(getApiUrl(`/api/pages/${id}`), { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const getPageUrl = (pageDef: Page) => {
        const parts = [pageDef.insuranceType.slug];
        if (pageDef.country) parts.push(pageDef.country.code);
        if (pageDef.state) parts.push(pageDef.state.slug);
        if (pageDef.city) parts.push(pageDef.city.slug);
        return `/${parts.join('/')}`;
    };

    const getPageTitle = (pageDef: Page) => {
        if (pageDef.heroTitle) return pageDef.heroTitle;

        const parts = [pageDef.insuranceType.name];
        if (pageDef.city) parts.push(`in ${pageDef.city.name}`);
        else if (pageDef.state) parts.push(`in ${pageDef.state.name}`);
        else if (pageDef.country) parts.push(`in ${pageDef.country.name}`);

        return parts.join(' ');
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
                        <p className="text-gray-600 mt-1">{total.toLocaleString()} pages</p>
                    </div>
                    <Link
                        href="/dashboard/pages/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + Create Page
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-6 flex gap-4 flex-wrap">
                    <select
                        value={filters.insuranceTypeId}
                        onChange={(e) => {
                            setFilters({ ...filters, insuranceTypeId: e.target.value });
                            setPage(0);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Insurance Types</option>
                        {insuranceTypes.map((type) => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>

                    <select
                        value={filters.geoLevel}
                        onChange={(e) => {
                            setFilters({ ...filters, geoLevel: e.target.value });
                            setPage(0);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Geo Levels</option>
                        <option value="NICHE">Niche Homepage</option>
                        <option value="COUNTRY">Country</option>
                        <option value="STATE">State</option>
                        <option value="CITY">City</option>
                    </select>

                    <select
                        value={filters.isPublished}
                        onChange={(e) => {
                            setFilters({ ...filters, isPublished: e.target.value });
                            setPage(0);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Status</option>
                        <option value="true">Published</option>
                        <option value="false">Draft</option>
                    </select>
                </div>

                {/* Pages List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : pages.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 mb-4">No pages yet</p>
                            <Link href="/dashboard/pages/new" className="text-blue-600 hover:text-blue-700">
                                Create your first page →
                            </Link>
                        </div>
                    ) : (
                        <>
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Insurance</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pages.map((pageDef) => (
                                        <tr key={pageDef.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{getPageTitle(pageDef)}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1">
                                                    <span>{pageDef.insuranceType.icon || '📋'}</span>
                                                    <span className="text-gray-600">{pageDef.insuranceType.name}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${pageDef.geoLevel === 'CITY' ? 'bg-purple-100 text-purple-700' :
                                                        pageDef.geoLevel === 'STATE' ? 'bg-blue-100 text-blue-700' :
                                                            pageDef.geoLevel === 'COUNTRY' ? 'bg-green-100 text-green-700' :
                                                                'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {pageDef.geoLevel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                    {getPageUrl(pageDef)}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${pageDef.isPublished
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {pageDef.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/dashboard/pages/${pageDef.id}`}
                                                    className="text-blue-600 hover:text-blue-800 mr-3"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(pageDef.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 border-t flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Showing {page * limit + 1} - {Math.min((page + 1) * limit, total)} of {total}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPage(p => Math.max(0, p - 1))}
                                            disabled={page === 0}
                                            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                            disabled={page >= totalPages - 1}
                                            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
