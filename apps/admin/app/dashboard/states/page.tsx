'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, Suspense } from 'react';
import { getApiUrl } from '@/lib/api';
import { fetcher, swrConfig } from '@/lib/fetcher';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';

interface State {
    id: string;
    name: string;
    slug: string;
    code: string | null;
    isActive: boolean;
    country: { id: string; code: string; name: string };
    _count: { cities: number; pages: number };
}

interface Country {
    id: string;
    code: string;
    name: string;
}

function StatesContent() {
    const searchParams = useSearchParams();
    const countryIdFilter = searchParams.get('countryId');

    const [showForm, setShowForm] = useState(false);
    const [editingState, setEditingState] = useState<State | null>(null);
    const [formData, setFormData] = useState({ countryId: '', name: '', slug: '', code: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const limit = 50;

    // Selection state
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkLoading, setBulkLoading] = useState(false);

    // Build query params for states
    const statesParams = new URLSearchParams();
    if (countryIdFilter) statesParams.set('countryId', countryIdFilter);
    if (search) statesParams.set('search', search);
    statesParams.set('limit', limit.toString());
    statesParams.set('offset', (page * limit).toString());

    // SWR for caching - data persists when switching routes
    const { data: statesData, mutate: mutateStates, isLoading: loadingStates } = useSWR(
        getApiUrl(`/api/states?${statesParams}`),
        fetcher,
        swrConfig
    );

    const { data: countriesData } = useSWR(
        getApiUrl('/api/countries'),
        fetcher,
        swrConfig
    );

    const states: State[] = statesData?.states || [];
    const total = statesData?.total || 0;
    const countries: Country[] = Array.isArray(countriesData) ? countriesData : [];
    const totalPages = Math.ceil(total / limit);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const url = editingState
                ? getApiUrl(`/api/states/${editingState.id}`)
                : getApiUrl('/api/states');

            const res = await fetch(url, {
                method: editingState ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save');
            }

            setShowForm(false);
            setEditingState(null);
            setFormData({ countryId: '', name: '', slug: '', code: '' });
            mutateStates(); // Refresh the cache
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (state: State) => {
        setEditingState(state);
        setFormData({
            countryId: state.country.id,
            name: state.name,
            slug: state.slug,
            code: state.code || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will delete all cities and pages.')) return;

        try {
            await fetch(getApiUrl(`/api/states/${id}`), { method: 'DELETE' });
            mutateStates(); // Refresh the cache
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    // Selection handlers
    const toggleSelectAll = () => {
        if (selectedIds.size === states.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(states.map(s => s.id)));
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

    const handleBulkAction = async (action: string) => {
        if (selectedIds.size === 0) return;

        const count = selectedIds.size;

        if (action === 'delete') {
            if (!confirm(`Are you sure you want to delete ${count} states? This will also delete all their cities and pages.`)) {
                return;
            }
        }

        setBulkLoading(true);
        try {
            const res = await fetch(getApiUrl('/api/states/bulk'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: Array.from(selectedIds), action }),
            });

            const data = await res.json();
            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                alert(data.message || `${action} completed successfully`);
                setSelectedIds(new Set());
                mutateStates(); // Refresh the cache
            }
        } catch (error) {
            alert('Bulk action failed');
        } finally {
            setBulkLoading(false);
        }
    };

    const isAllSelected = states.length > 0 && selectedIds.size === states.length;
    const isSomeSelected = selectedIds.size > 0;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">States</h1>
                    <p className="text-gray-600 mt-1">
                        {total.toLocaleString()} states
                        {countryIdFilter && countries.find(c => c.id === countryIdFilter) &&
                            ` in ${countries.find(c => c.id === countryIdFilter)?.name}`
                        }
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/states/import"
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                    >
                        📥 Import CSV
                    </Link>
                    <button
                        onClick={() => {
                            setEditingState(null);
                            setFormData({ countryId: countryIdFilter || '', name: '', slug: '', code: '' });
                            setShowForm(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + Add State
                    </button>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="mb-6 flex gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search states..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={countryIdFilter || ''}
                    onChange={(e) => {
                        const url = e.target.value
                            ? `/dashboard/states?countryId=${e.target.value}`
                            : '/dashboard/states';
                        window.location.href = url;
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Countries</option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                            {country.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Bulk Actions Bar */}
            {isSomeSelected && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                    <span className="text-blue-800 font-medium">
                        {selectedIds.size} {selectedIds.size === 1 ? 'state' : 'states'} selected
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleBulkAction('activate')}
                            disabled={bulkLoading}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                        >
                            ✓ Activate
                        </button>
                        <button
                            onClick={() => handleBulkAction('deactivate')}
                            disabled={bulkLoading}
                            className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 text-sm"
                        >
                            ⏸ Deactivate
                        </button>
                        <button
                            onClick={() => handleBulkAction('delete')}
                            disabled={bulkLoading}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
                        >
                            🗑 Delete Selected
                        </button>
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-4">
                            {editingState ? 'Edit State' : 'Add State'}
                        </h2>

                        {error && (
                            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country *
                                </label>
                                <select
                                    value={formData.countryId}
                                    onChange={(e) => setFormData({ ...formData, countryId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                    disabled={!!editingState}
                                >
                                    <option value="">Select country</option>
                                    {countries.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setFormData({
                                            ...formData,
                                            name,
                                            slug: editingState ? formData.slug : generateSlug(name),
                                        });
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="California"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Slug *
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="california"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    State Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="CA"
                                    maxLength={3}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* States List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loadingStates && !states.length ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : states.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500 mb-4">
                            {search ? 'No states found' : 'No states yet'}
                        </p>
                        {!search && (
                            <Link href="/dashboard/states/import" className="text-blue-600 hover:text-blue-700">
                                Import from CSV →
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cities</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pages</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {states.map((state) => (
                                    <tr
                                        key={state.id}
                                        className={`hover:bg-gray-50 ${selectedIds.has(state.id) ? 'bg-blue-50' : ''}`}
                                    >
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(state.id)}
                                                onChange={() => toggleSelect(state.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{state.name}</p>
                                                {state.code && (
                                                    <p className="text-sm text-gray-500">{state.code}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                                {state.slug}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {state.country.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {state._count.cities}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {state._count.pages}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/dashboard/cities?stateId=${state.id}`}
                                                className="text-gray-600 hover:text-gray-800 mr-3"
                                            >
                                                Cities
                                            </Link>
                                            <button
                                                onClick={() => handleEdit(state)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(state.id)}
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
                                    Showing {page * limit + 1} - {Math.min((page + 1) * limit, total)} of {total.toLocaleString()}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(0, p - 1))}
                                        disabled={page === 0}
                                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1 text-gray-600">
                                        Page {page + 1} of {totalPages}
                                    </span>
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
    );
}

export default function StatesPage() {
    return (
        <AdminLayout>
            <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
                <StatesContent />
            </Suspense>
        </AdminLayout>
    );
}
