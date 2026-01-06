'use client';

import { useState, useEffect, useCallback } from 'react';
import { Filter, Eye, EyeOff, CheckSquare, Square, RefreshCw, Search } from 'lucide-react';

interface Page {
    id: string;
    title: string;
    slug: string;
    showAds: boolean;
    template?: { id: string; name: string };
    insuranceType?: { id: string; name: string };
    state?: { id: string; name: string };
    city?: { id: string; name: string };
}

interface Summary {
    total: number;
    adsEnabled: number;
    adsDisabled: number;
}

interface FilterOption {
    id: string;
    name: string;
}

export default function BulkAdsPage() {
    const [pages, setPages] = useState<Page[]>([]);
    const [summary, setSummary] = useState<Summary>({ total: 0, adsEnabled: 0, adsDisabled: 0 });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Filters
    const [templates, setTemplates] = useState<FilterOption[]>([]);
    const [insuranceTypes, setInsuranceTypes] = useState<FilterOption[]>([]);
    const [states, setStates] = useState<FilterOption[]>([]);

    const [filters, setFilters] = useState({
        templateId: '',
        insuranceTypeId: '',
        stateId: '',
        showAds: '', // '', 'true', 'false'
    });

    // Fetch filter options
    useEffect(() => {
        Promise.all([
            fetch('/api/templates').then(r => r.json()),
            fetch('/api/insurance-types').then(r => r.json()),
            fetch('/api/states').then(r => r.json()),
        ]).then(([temps, types, sts]) => {
            setTemplates(temps.map((t: any) => ({ id: t.id, name: t.name })));
            setInsuranceTypes(types.map((t: any) => ({ id: t.id, name: t.name })));
            setStates(sts.map((s: any) => ({ id: s.id, name: s.name })));
        });
    }, []);

    const fetchPages = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.templateId) params.append('templateId', filters.templateId);
            if (filters.insuranceTypeId) params.append('insuranceTypeId', filters.insuranceTypeId);
            if (filters.stateId) params.append('stateId', filters.stateId);
            if (filters.showAds) params.append('showAds', filters.showAds);

            const res = await fetch(`/api/pages/bulk-ads?${params.toString()}`);
            const data = await res.json();
            setPages(data.pages || []);
            setSummary(data.summary || { total: 0, adsEnabled: 0, adsDisabled: 0 });
            setSelectedIds(new Set());
        } catch (error) {
            console.error('Failed to fetch pages:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    const toggleSelectAll = () => {
        if (selectedIds.size === pages.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(pages.map(p => p.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const bulkUpdateAds = async (showAds: boolean) => {
        if (selectedIds.size === 0) return;
        setUpdating(true);
        try {
            await fetch('/api/pages/bulk-ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pageIds: Array.from(selectedIds),
                    showAds,
                }),
            });
            await fetchPages();
        } catch (error) {
            console.error('Failed to update:', error);
        } finally {
            setUpdating(false);
        }
    };

    const allSelected = pages.length > 0 && selectedIds.size === pages.length;
    const someSelected = selectedIds.size > 0;

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Bulk Ad Management</h1>
                    <p className="text-slate-500 mt-1">Control which pages show ads</p>
                </div>
                <button onClick={fetchPages} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border p-4">
                    <div className="text-2xl font-bold text-slate-900">{summary.total}</div>
                    <div className="text-sm text-slate-500">Total Pages</div>
                </div>
                <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                    <div className="text-2xl font-bold text-green-700">{summary.adsEnabled}</div>
                    <div className="text-sm text-green-600">Ads Enabled</div>
                </div>
                <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                    <div className="text-2xl font-bold text-red-700">{summary.adsDisabled}</div>
                    <div className="text-sm text-red-600">Ads Disabled</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border p-4 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-slate-700">Filters</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <select
                        value={filters.templateId}
                        onChange={(e) => setFilters({ ...filters, templateId: e.target.value })}
                        className="px-3 py-2 border rounded-lg text-sm"
                    >
                        <option value="">All Templates</option>
                        {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <select
                        value={filters.insuranceTypeId}
                        onChange={(e) => setFilters({ ...filters, insuranceTypeId: e.target.value })}
                        className="px-3 py-2 border rounded-lg text-sm"
                    >
                        <option value="">All Insurance Types</option>
                        {insuranceTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <select
                        value={filters.stateId}
                        onChange={(e) => setFilters({ ...filters, stateId: e.target.value })}
                        className="px-3 py-2 border rounded-lg text-sm"
                    >
                        <option value="">All States</option>
                        {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <select
                        value={filters.showAds}
                        onChange={(e) => setFilters({ ...filters, showAds: e.target.value })}
                        className="px-3 py-2 border rounded-lg text-sm"
                    >
                        <option value="">All Ad Status</option>
                        <option value="true">Ads Enabled</option>
                        <option value="false">Ads Disabled</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions */}
            {someSelected && (
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 mb-6 flex items-center justify-between">
                    <span className="text-blue-700 font-medium">{selectedIds.size} page(s) selected</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => bulkUpdateAds(true)}
                            disabled={updating}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            <Eye className="w-4 h-4" />
                            Enable Ads
                        </button>
                        <button
                            onClick={() => bulkUpdateAds(false)}
                            disabled={updating}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            <EyeOff className="w-4 h-4" />
                            Disable Ads
                        </button>
                    </div>
                </div>
            )}

            {/* Pages Table */}
            <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left">
                                <button onClick={toggleSelectAll} className="text-slate-500 hover:text-slate-700">
                                    {allSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Page</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Template</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">State</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Ads</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : pages.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                    No pages found matching filters
                                </td>
                            </tr>
                        ) : (
                            pages.map(page => (
                                <tr key={page.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <button onClick={() => toggleSelect(page.id)} className="text-slate-500 hover:text-slate-700">
                                            {selectedIds.has(page.id) ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-slate-900 truncate max-w-xs">{page.title || page.slug}</div>
                                        <div className="text-xs text-slate-400 truncate max-w-xs">/{page.slug}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{page.template?.name || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{page.insuranceType?.name || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{page.state?.name || '-'}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${page.showAds ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {page.showAds ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                            {page.showAds ? 'On' : 'Off'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
