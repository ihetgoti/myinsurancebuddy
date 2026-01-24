'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';

interface Page {
    id: string;
    slug: string;
    geoLevel: string;
    heroTitle: string | null;
    isPublished: boolean;
    publishedAt: string | null;
    isAiGenerated: boolean;
    aiGeneratedAt: string | null;
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
        isAiGenerated: '',
    });
    const [page, setPage] = useState(0);
    const limit = 50;

    // Mass selection state
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [bulkAction, setBulkAction] = useState<'delete' | 'publish' | 'unpublish' | null>(null);
    const [bulkLoading, setBulkLoading] = useState(false);
    const [selectingAll, setSelectingAll] = useState(false);

    useEffect(() => {
        fetchData();
    }, [filters, page]);

    // Clear selection when filters/page change
    useEffect(() => {
        setSelectedIds(new Set());
    }, [filters, page]);

    const fetchData = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.insuranceTypeId) params.set('insuranceTypeId', filters.insuranceTypeId);
            if (filters.geoLevel) params.set('geoLevel', filters.geoLevel);
            if (filters.isPublished) params.set('isPublished', filters.isPublished);
            if (filters.isAiGenerated) params.set('isAiGenerated', filters.isAiGenerated);
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

    const handleBulkAction = async () => {
        if (!bulkAction || selectedIds.size === 0) return;

        setBulkLoading(true);
        try {
            const res = await fetch(getApiUrl('/api/pages/bulk'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ids: Array.from(selectedIds),
                    action: bulkAction,
                }),
            });

            const data = await res.json();
            if (data.success) {
                alert(data.message);
                setSelectedIds(new Set());
                fetchData();
            } else {
                alert('Error: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Bulk action failed:', error);
            alert('Bulk action failed');
        } finally {
            setBulkLoading(false);
            setShowConfirmModal(false);
            setBulkAction(null);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === pages.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(pages.map(p => p.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSelection = new Set(selectedIds);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedIds(newSelection);
    };

    const selectAllMatching = async () => {
        setSelectingAll(true);
        try {
            const params = new URLSearchParams();
            if (filters.insuranceTypeId) params.set('insuranceTypeId', filters.insuranceTypeId);
            if (filters.geoLevel) params.set('geoLevel', filters.geoLevel);
            if (filters.isPublished) params.set('isPublished', filters.isPublished);
            params.set('idsOnly', 'true');

            const res = await fetch(getApiUrl(`/api/pages?${params}`));
            const data = await res.json();

            if (data.ids && Array.isArray(data.ids)) {
                setSelectedIds(new Set(data.ids));
            }
        } catch (error) {
            console.error('Failed to select all:', error);
        } finally {
            setSelectingAll(false);
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

    const openConfirmModal = (action: 'delete' | 'publish' | 'unpublish') => {
        setBulkAction(action);
        setShowConfirmModal(true);
    };

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

                    <select
                        value={filters.isAiGenerated}
                        onChange={(e) => {
                            setFilters({ ...filters, isAiGenerated: e.target.value });
                            setPage(0);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Content Types</option>
                        <option value="true">AI Generated</option>
                        <option value="false">Manual/Template</option>
                    </select>

                    {/* Select All Matching Button */}
                    <button
                        onClick={selectAllMatching}
                        disabled={selectingAll || total === 0}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
                    >
                        {selectingAll ? 'Selecting...' : `Select All ${total.toLocaleString()} Matching`}
                    </button>

                    {selectedIds.size > 0 && (
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                        >
                            Clear Selection
                        </button>
                    )}
                </div>

                {/* Mass Actions Toolbar */}
                {selectedIds.size > 0 && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                        <span className="font-medium text-blue-800">
                            {selectedIds.size} page{selectedIds.size > 1 ? 's' : ''} selected
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => openConfirmModal('publish')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                            >
                                Publish Selected
                            </button>
                            <button
                                onClick={() => openConfirmModal('unpublish')}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm"
                            >
                                Unpublish Selected
                            </button>
                            <button
                                onClick={() => openConfirmModal('delete')}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                            >
                                Delete Selected
                            </button>
                        </div>
                    </div>
                )}

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
                                        <th className="px-4 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.size === pages.length && pages.length > 0}
                                                onChange={toggleSelectAll}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Insurance</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pages.map((pageDef) => (
                                        <tr key={pageDef.id} className={`hover:bg-gray-50 ${selectedIds.has(pageDef.id) ? 'bg-blue-50' : ''}`}>
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.has(pageDef.id)}
                                                    onChange={() => toggleSelect(pageDef.id)}
                                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                />
                                            </td>
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
                                                <a
                                                    href={`https://myinsurancebuddies.com/${pageDef.slug.replace(/^\//, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-700 transition inline-flex items-center gap-1"
                                                >
                                                    /{pageDef.slug.replace(/^\//, '')}
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${pageDef.isPublished
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {pageDef.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {pageDef.isAiGenerated ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700" title={`AI Generated on ${pageDef.aiGeneratedAt ? new Date(pageDef.aiGeneratedAt).toLocaleDateString() : 'Unknown'}`}>
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M13 7H7v6h6V7z" />
                                                            <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                                                        </svg>
                                                        AI
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                                        Manual
                                                    </span>
                                                )}
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

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            {bulkAction === 'delete' && '⚠️ Confirm Delete'}
                            {bulkAction === 'publish' && '✅ Confirm Publish'}
                            {bulkAction === 'unpublish' && '📝 Confirm Unpublish'}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {bulkAction === 'delete' && (
                                <>
                                    Are you sure you want to <strong className="text-red-600">permanently delete</strong> {selectedIds.size} page{selectedIds.size > 1 ? 's' : ''}?
                                    <br />
                                    <span className="text-red-600 text-sm">This action cannot be undone.</span>
                                </>
                            )}
                            {bulkAction === 'publish' && (
                                <>You are about to publish {selectedIds.size} page{selectedIds.size > 1 ? 's' : ''}. They will be visible to the public.</>
                            )}
                            {bulkAction === 'unpublish' && (
                                <>You are about to unpublish {selectedIds.size} page{selectedIds.size > 1 ? 's' : ''}. They will be set to Draft status.</>
                            )}
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setBulkAction(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                disabled={bulkLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkAction}
                                disabled={bulkLoading}
                                className={`px-4 py-2 text-white rounded-lg transition ${bulkAction === 'delete'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : bulkAction === 'publish'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-yellow-600 hover:bg-yellow-700'
                                    } disabled:opacity-50`}
                            >
                                {bulkLoading ? 'Processing...' : (
                                    bulkAction === 'delete' ? 'Yes, Delete' :
                                        bulkAction === 'publish' ? 'Yes, Publish' :
                                            'Yes, Unpublish'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
