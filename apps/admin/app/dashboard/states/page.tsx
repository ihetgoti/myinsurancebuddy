'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState, Suspense } from 'react';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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

    const [states, setStates] = useState<State[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingState, setEditingState] = useState<State | null>(null);
    const [formData, setFormData] = useState({ countryId: '', name: '', slug: '', code: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, [countryIdFilter]);

    const fetchData = async () => {
        try {
            const [statesRes, countriesRes] = await Promise.all([
                fetch(getApiUrl(`/api/states${countryIdFilter ? `?countryId=${countryIdFilter}` : ''}`)),
                fetch(getApiUrl('/api/countries')),
            ]);
            const statesData = await statesRes.json();
            const countriesData = await countriesRes.json();

            setStates(Array.isArray(statesData) ? statesData : []);
            setCountries(Array.isArray(countriesData) ? countriesData : []);
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    };

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
            fetchData();
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
            fetchData();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">States</h1>
                    <p className="text-gray-600 mt-1">
                        {countryIdFilter
                            ? `States in ${countries.find(c => c.id === countryIdFilter)?.name || 'selected country'}`
                            : 'Manage states across all countries'
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

            {/* Filter */}
            {!countryIdFilter && countries.length > 0 && (
                <div className="mb-6 flex gap-2 flex-wrap">
                    <Link
                        href="/dashboard/states"
                        className={`px-3 py-1 rounded-full text-sm ${!countryIdFilter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All Countries
                    </Link>
                    {countries.map((country) => (
                        <Link
                            key={country.id}
                            href={`/dashboard/states?countryId=${country.id}`}
                            className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            {country.name}
                        </Link>
                    ))}
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
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : states.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500 mb-4">No states yet</p>
                        <Link href="/dashboard/states/import" className="text-blue-600 hover:text-blue-700">
                            Import from CSV →
                        </Link>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
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
                                <tr key={state.id} className="hover:bg-gray-50">
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
