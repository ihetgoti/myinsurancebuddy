'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState, Suspense } from 'react';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface City {
    id: string;
    name: string;
    slug: string;
    population: number | null;
    isActive: boolean;
    state: {
        id: string;
        name: string;
        slug: string;
        country: { id: string; code: string; name: string };
    };
    _count: { pages: number };
}

interface State {
    id: string;
    name: string;
    slug: string;
    country: { id: string; code: string; name: string };
}

function CitiesContent() {
    const searchParams = useSearchParams();
    const stateIdFilter = searchParams.get('stateId');

    const [cities, setCities] = useState<City[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCity, setEditingCity] = useState<City | null>(null);
    const [formData, setFormData] = useState({ stateId: '', name: '', slug: '', population: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const limit = 50;

    useEffect(() => {
        fetchData();
    }, [stateIdFilter, page, search]);

    const fetchData = async () => {
        try {
            const params = new URLSearchParams();
            if (stateIdFilter) params.set('stateId', stateIdFilter);
            if (search) params.set('search', search);
            params.set('limit', limit.toString());
            params.set('offset', (page * limit).toString());

            const [citiesRes, statesRes] = await Promise.all([
                fetch(getApiUrl(`/api/cities?${params}`)),
                fetch(getApiUrl('/api/states')),
            ]);
            const citiesData = await citiesRes.json();
            const statesData = await statesRes.json();

            setCities(citiesData.cities || []);
            setTotal(citiesData.total || 0);
            setStates(Array.isArray(statesData) ? statesData : []);
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
            const url = editingCity
                ? getApiUrl(`/api/cities/${editingCity.id}`)
                : getApiUrl('/api/cities');

            const res = await fetch(url, {
                method: editingCity ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save');
            }

            setShowForm(false);
            setEditingCity(null);
            setFormData({ stateId: '', name: '', slug: '', population: '' });
            fetchData();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (city: City) => {
        setEditingCity(city);
        setFormData({
            stateId: city.state.id,
            name: city.name,
            slug: city.slug,
            population: city.population?.toString() || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will delete all associated pages.')) return;

        try {
            await fetch(getApiUrl(`/api/cities/${id}`), { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Cities</h1>
                    <p className="text-gray-600 mt-1">
                        {total.toLocaleString()} cities
                        {stateIdFilter && states.find(s => s.id === stateIdFilter) &&
                            ` in ${states.find(s => s.id === stateIdFilter)?.name}`
                        }
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/cities/import"
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                    >
                        📥 Import CSV
                    </Link>
                    <button
                        onClick={() => {
                            setEditingCity(null);
                            setFormData({ stateId: stateIdFilter || '', name: '', slug: '', population: '' });
                            setShowForm(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + Add City
                    </button>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="mb-6 flex gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search cities..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={stateIdFilter || ''}
                    onChange={(e) => {
                        const url = e.target.value
                            ? `/dashboard/cities?stateId=${e.target.value}`
                            : '/dashboard/cities';
                        window.location.href = url;
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All States</option>
                    {states.map((state) => (
                        <option key={state.id} value={state.id}>
                            {state.name} ({state.country.code.toUpperCase()})
                        </option>
                    ))}
                </select>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-4">
                            {editingCity ? 'Edit City' : 'Add City'}
                        </h2>

                        {error && (
                            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    State *
                                </label>
                                <select
                                    value={formData.stateId}
                                    onChange={(e) => setFormData({ ...formData, stateId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                    disabled={!!editingCity}
                                >
                                    <option value="">Select state</option>
                                    {states.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} ({s.country.code.toUpperCase()})
                                        </option>
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
                                            slug: editingCity ? formData.slug : generateSlug(name),
                                        });
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Los Angeles"
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
                                    placeholder="los-angeles"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Population
                                </label>
                                <input
                                    type="number"
                                    value={formData.population}
                                    onChange={(e) => setFormData({ ...formData, population: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="3900000"
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

            {/* Cities List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : cities.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500 mb-4">
                            {search ? 'No cities found' : 'No cities yet'}
                        </p>
                        {!search && (
                            <Link href="/dashboard/cities/import" className="text-blue-600 hover:text-blue-700">
                                Import from CSV →
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Population</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pages</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {cities.map((city) => (
                                    <tr key={city.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{city.name}</p>
                                            <code className="text-xs text-gray-500">{city.slug}</code>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {city.state.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {city.state.country.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {city.population?.toLocaleString() || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {city._count.pages}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleEdit(city)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(city.id)}
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
    );
}

export default function CitiesPage() {
    return (
        <AdminLayout>
            <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
                <CitiesContent />
            </Suspense>
        </AdminLayout>
    );
}
