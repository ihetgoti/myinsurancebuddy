'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState, useCallback } from 'react';
import { getApiUrl } from '@/lib/api';

interface Page {
    id: string;
    slug: string;
    title: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    geoLevel: string | null;
    isPublished: boolean;
    publishedAt: string | null;
    customData: Record<string, any> | null;
    templateId: string | null;
    template: { id: string; name: string; slug: string } | null;
    insuranceType: { id: string; name: string; slug: string } | null;
    country: { id: string; code: string; name: string } | null;
    state: { id: string; code: string; name: string; slug: string } | null;
    city: { id: string; name: string; slug: string } | null;
    createdAt: string;
    updatedAt: string;
}

interface InsuranceType {
    id: string;
    name: string;
    slug: string;
}

interface State {
    id: string;
    name: string;
    code: string;
    slug: string;
}

interface Template {
    id: string;
    name: string;
    slug: string;
}

export default function PageDataManagerPage() {
    const [pages, setPages] = useState<Page[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);

    // Filters
    const [filters, setFilters] = useState({
        insuranceTypeId: '',
        geoLevel: '',
        stateId: '',
        templateId: '',
        isPublished: '',
        search: '',
        hasCustomData: '',
    });

    // Pagination
    const [page, setPage] = useState(0);
    const limit = 25;

    // Selected for bulk operations
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Edit modal
    const [editingPage, setEditingPage] = useState<Page | null>(null);
    const [editData, setEditData] = useState<Record<string, any>>({});
    const [saving, setSaving] = useState(false);

    // View customData modal
    const [viewingPage, setViewingPage] = useState<Page | null>(null);

    // Bulk edit modal
    const [showBulkEdit, setShowBulkEdit] = useState(false);
    const [bulkField, setBulkField] = useState('');
    const [bulkValue, setBulkValue] = useState('');

    const fetchReferences = useCallback(async () => {
        try {
            const [typesRes, statesRes, templatesRes] = await Promise.all([
                fetch(getApiUrl('/api/insurance-types')),
                fetch(getApiUrl('/api/states?limit=100')),
                fetch(getApiUrl('/api/templates')),
            ]);

            const types = await typesRes.json();
            const statesData = await statesRes.json();
            const temps = await templatesRes.json();

            setInsuranceTypes(Array.isArray(types) ? types : []);
            setStates(Array.isArray(statesData.states) ? statesData.states : statesData);
            setTemplates(Array.isArray(temps) ? temps : []);
        } catch (error) {
            console.error('Failed to fetch references:', error);
        }
    }, []);

    const fetchPages = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.insuranceTypeId) params.set('insuranceTypeId', filters.insuranceTypeId);
            if (filters.geoLevel) params.set('geoLevel', filters.geoLevel);
            if (filters.stateId) params.set('stateId', filters.stateId);
            if (filters.templateId) params.set('templateId', filters.templateId);
            if (filters.isPublished) params.set('isPublished', filters.isPublished);
            if (filters.search) params.set('search', filters.search);
            params.set('limit', limit.toString());
            params.set('offset', (page * limit).toString());
            params.set('includeCustomData', 'true');

            const res = await fetch(getApiUrl(`/api/pages?${params}`));
            const data = await res.json();

            setPages(data.pages || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('Failed to fetch pages:', error);
        } finally {
            setLoading(false);
        }
    }, [filters, page]);

    useEffect(() => {
        fetchReferences();
    }, [fetchReferences]);

    useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    useEffect(() => {
        setSelectedIds(new Set());
    }, [filters, page]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters({ ...filters, [key]: value });
        setPage(0);
    };

    const clearFilters = () => {
        setFilters({
            insuranceTypeId: '',
            geoLevel: '',
            stateId: '',
            templateId: '',
            isPublished: '',
            search: '',
            hasCustomData: '',
        });
        setPage(0);
    };

    const openEditModal = (p: Page) => {
        setEditingPage(p);
        setEditData({
            title: p.title || '',
            metaTitle: p.metaTitle || '',
            metaDescription: p.metaDescription || '',
            customData: p.customData || {},
        });
    };

    const handleSave = async () => {
        if (!editingPage) return;
        setSaving(true);

        try {
            const res = await fetch(getApiUrl(`/api/pages/${editingPage.id}`), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editData.title,
                    metaTitle: editData.metaTitle,
                    metaDescription: editData.metaDescription,
                    customData: editData.customData,
                }),
            });

            if (res.ok) {
                setEditingPage(null);
                fetchPages();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleBulkUpdate = async () => {
        if (!bulkField || selectedIds.size === 0) return;

        const confirm = window.confirm(`Update ${selectedIds.size} pages?`);
        if (!confirm) return;

        setSaving(true);
        let updated = 0;

        for (const id of Array.from(selectedIds)) {
            try {
                const page = pages.find(p => p.id === id);
                if (!page) continue;

                const newCustomData = { ...(page.customData || {}), [bulkField]: bulkValue };

                await fetch(getApiUrl(`/api/pages/${id}`), {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ customData: newCustomData }),
                });
                updated++;
            } catch (error) {
                console.error(`Failed to update ${id}:`, error);
            }
        }

        alert(`Updated ${updated} pages`);
        setSaving(false);
        setShowBulkEdit(false);
        setBulkField('');
        setBulkValue('');
        setSelectedIds(new Set());
        fetchPages();
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

    const toggleSelectAll = () => {
        if (selectedIds.size === pages.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(pages.map(p => p.id)));
        }
    };

    const getCustomDataKeys = (): string[] => {
        const keys = new Set<string>();
        pages.forEach(p => {
            if (p.customData) {
                Object.keys(p.customData).forEach(k => keys.add(k));
            }
        });
        return Array.from(keys).sort();
    };

    const totalPages = Math.ceil(total / limit);
    const customDataKeys = getCustomDataKeys();

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Page Data Manager</h1>
                        <p className="text-gray-600 mt-1">
                            {total.toLocaleString()} pages · Advanced CRUD for customData
                        </p>
                    </div>
                    {selectedIds.size > 0 && (
                        <button
                            onClick={() => setShowBulkEdit(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Bulk Edit {selectedIds.size} Pages
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
                    <div className="flex flex-wrap gap-3 items-end">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                placeholder="Slug, title..."
                                className="px-3 py-2 border rounded-lg text-sm w-48"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Insurance Type</label>
                            <select
                                value={filters.insuranceTypeId}
                                onChange={(e) => handleFilterChange('insuranceTypeId', e.target.value)}
                                className="px-3 py-2 border rounded-lg text-sm"
                            >
                                <option value="">All Types</option>
                                {insuranceTypes.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Geo Level</label>
                            <select
                                value={filters.geoLevel}
                                onChange={(e) => handleFilterChange('geoLevel', e.target.value)}
                                className="px-3 py-2 border rounded-lg text-sm"
                            >
                                <option value="">All Levels</option>
                                <option value="NICHE">Niche</option>
                                <option value="COUNTRY">Country</option>
                                <option value="STATE">State</option>
                                <option value="CITY">City</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
                            <select
                                value={filters.stateId}
                                onChange={(e) => handleFilterChange('stateId', e.target.value)}
                                className="px-3 py-2 border rounded-lg text-sm"
                            >
                                <option value="">All States</option>
                                {states.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Template</label>
                            <select
                                value={filters.templateId}
                                onChange={(e) => handleFilterChange('templateId', e.target.value)}
                                className="px-3 py-2 border rounded-lg text-sm"
                            >
                                <option value="">All Templates</option>
                                {templates.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                            <select
                                value={filters.isPublished}
                                onChange={(e) => handleFilterChange('isPublished', e.target.value)}
                                className="px-3 py-2 border rounded-lg text-sm"
                            >
                                <option value="">All</option>
                                <option value="true">Published</option>
                                <option value="false">Draft</option>
                            </select>
                        </div>

                        <button
                            onClick={clearFilters}
                            className="px-3 py-2 text-gray-600 hover:text-gray-900 text-sm"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Custom Data Keys Legend */}
                {customDataKeys.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <span className="text-xs font-medium text-blue-900 mr-2">Custom Data Fields:</span>
                        <div className="inline-flex flex-wrap gap-1 mt-1">
                            {customDataKeys.slice(0, 15).map(key => (
                                <span key={key} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                    {key}
                                </span>
                            ))}
                            {customDataKeys.length > 15 && (
                                <span className="text-xs text-blue-600">+{customDataKeys.length - 15} more</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : pages.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No pages found</div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-3 py-3 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.size === pages.length && pages.length > 0}
                                                    onChange={toggleSelectAll}
                                                    className="w-4 h-4"
                                                />
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Geo</th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Custom Data</th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {pages.map(p => (
                                            <tr key={p.id} className={`hover:bg-gray-50 ${selectedIds.has(p.id) ? 'bg-blue-50' : ''}`}>
                                                <td className="px-3 py-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.has(p.id)}
                                                        onChange={() => toggleSelect(p.id)}
                                                        className="w-4 h-4"
                                                    />
                                                </td>
                                                <td className="px-3 py-3">
                                                    <a
                                                        href={`https://myinsurancebuddies.com/${p.slug.replace(/^\//, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline font-mono text-xs"
                                                    >
                                                        /{p.slug.replace(/^\//, '').slice(0, 35)}...
                                                    </a>
                                                </td>
                                                <td className="px-3 py-3 text-gray-600">
                                                    {p.insuranceType?.name || '-'}
                                                </td>
                                                <td className="px-3 py-3">
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${p.geoLevel === 'CITY' ? 'bg-purple-100 text-purple-700' :
                                                        p.geoLevel === 'STATE' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {p.geoLevel || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3 text-gray-600 text-xs">
                                                    {p.state?.code || '-'}
                                                </td>
                                                <td className="px-3 py-3">
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${p.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {p.isPublished ? 'Live' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3">
                                                    {p.customData ? (
                                                        <button
                                                            onClick={() => setViewingPage(p)}
                                                            className="text-xs text-blue-600 hover:underline"
                                                        >
                                                            {Object.keys(p.customData).length} fields
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">-</span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-3 text-right">
                                                    <button
                                                        onClick={() => openEditModal(p)}
                                                        className="text-blue-600 hover:text-blue-800 text-xs mr-2"
                                                    >
                                                        Edit
                                                    </button>
                                                    <a
                                                        href={`/dashboard/pages/${p.id}`}
                                                        className="text-gray-600 hover:text-gray-800 text-xs"
                                                    >
                                                        Full
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-4 py-3 border-t flex items-center justify-between bg-gray-50">
                                    <span className="text-sm text-gray-500">
                                        {page * limit + 1} - {Math.min((page + 1) * limit, total)} of {total}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPage(p => Math.max(0, p - 1))}
                                            disabled={page === 0}
                                            className="px-3 py-1 border rounded text-sm hover:bg-white disabled:opacity-50"
                                        >
                                            Prev
                                        </button>
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                            disabled={page >= totalPages - 1}
                                            className="px-3 py-1 border rounded text-sm hover:bg-white disabled:opacity-50"
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

            {/* View Custom Data Modal */}
            {viewingPage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <h2 className="font-bold">Custom Data: {viewingPage.slug}</h2>
                            <button onClick={() => setViewingPage(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto">
                                {JSON.stringify(viewingPage.customData, null, 2)}
                            </pre>
                        </div>
                        <div className="px-6 py-4 border-t flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setViewingPage(null);
                                    openEditModal(viewingPage);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingPage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b">
                            <h2 className="font-bold">Edit Page Data</h2>
                            <p className="text-sm text-gray-500">{editingPage.slug}</p>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title (H1)</label>
                                <input
                                    type="text"
                                    value={editData.title || ''}
                                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Meta Title</label>
                                <input
                                    type="text"
                                    value={editData.metaTitle || ''}
                                    onChange={(e) => setEditData({ ...editData, metaTitle: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Meta Description</label>
                                <textarea
                                    value={editData.metaDescription || ''}
                                    onChange={(e) => setEditData({ ...editData, metaDescription: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    rows={2}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Custom Data (JSON)</label>
                                <textarea
                                    value={JSON.stringify(editData.customData, null, 2)}
                                    onChange={(e) => {
                                        try {
                                            const parsed = JSON.parse(e.target.value);
                                            setEditData({ ...editData, customData: parsed });
                                        } catch (err) {
                                            // Invalid JSON, keep current
                                        }
                                    }}
                                    className="w-full px-4 py-2 border rounded-lg font-mono text-xs"
                                    rows={12}
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t flex justify-end gap-3">
                            <button
                                onClick={() => setEditingPage(null)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Edit Modal */}
            {showBulkEdit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="font-bold text-lg mb-4">Bulk Edit {selectedIds.size} Pages</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Field Name</label>
                                <input
                                    type="text"
                                    value={bulkField}
                                    onChange={(e) => setBulkField(e.target.value)}
                                    placeholder="e.g., avg_premium"
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">New Value</label>
                                <input
                                    type="text"
                                    value={bulkValue}
                                    onChange={(e) => setBulkValue(e.target.value)}
                                    placeholder="e.g., $200"
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowBulkEdit(false)}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkUpdate}
                                disabled={saving || !bulkField}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving ? 'Updating...' : 'Update All'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
