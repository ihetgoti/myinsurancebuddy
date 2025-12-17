'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';

interface Region {
    id: string;
    type: 'STATE' | 'CITY';
    name: string;
    slug: string;
    stateCode: string | null;
    population: number | null;
    medianIncome: number | null;
    timezone: string | null;
    lat: number | null;
    lng: number | null;
    seoSummary: string | null;
    legalNotes: string | null;
    createdAt: string;
}

export default function RegionsManagement() {
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [editingRegion, setEditingRegion] = useState<Region | null>(null);

    useEffect(() => {
        fetchRegions();
    }, []);

    const fetchRegions = async () => {
        try {
            const res = await fetch(getApiUrl('/api/regions'));
            const data = await res.json();
            if (Array.isArray(data)) {
                setRegions(data);
            } else {
                setRegions([]);
            }
        } catch (error) {
            console.error('Failed to fetch regions:', error);
            setRegions([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredRegions = regions.filter(r => {
        const matchesType = filter === 'all' || r.type === filter;
        const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.slug.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });

    const states = filteredRegions.filter(r => r.type === 'STATE');
    const cities = filteredRegions.filter(r => r.type === 'CITY');

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Regions</h1>
                        <p className="text-gray-600 mt-1">Manage states and cities for programmatic pages</p>
                    </div>
                    <button
                        onClick={() => setShowNew(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        + Add Region
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-3xl font-bold text-blue-600">{regions.length}</p>
                        <p className="text-gray-600">Total Regions</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-3xl font-bold text-purple-600">{states.length}</p>
                        <p className="text-gray-600">States</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-3xl font-bold text-green-600">{cities.length}</p>
                        <p className="text-gray-600">Cities</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex gap-2">
                            {['all', 'STATE', 'CITY'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilter(type)}
                                    className={`px-4 py-2 rounded-md transition ${filter === type
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {type === 'all' ? 'All' : type === 'STATE' ? 'States' : 'Cities'}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Search regions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Regions Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-600">Loading regions...</div>
                    ) : filteredRegions.length === 0 ? (
                        <div className="p-8 text-center text-gray-600">
                            No regions found.
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Population</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredRegions.slice(0, 50).map((region) => (
                                    <tr key={region.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{region.name}</p>
                                            {region.stateCode && (
                                                <p className="text-sm text-gray-500">{region.stateCode}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${region.type === 'STATE'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {region.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            /{region.type.toLowerCase()}/{region.slug}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {region.population?.toLocaleString() || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm">
                                            <button
                                                onClick={() => setEditingRegion(region)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <a
                                                href={`/${region.type.toLowerCase()}/${region.slug}/insurance-guide`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                View →
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {filteredRegions.length > 50 && (
                        <div className="p-4 text-center text-gray-500 bg-gray-50 border-t">
                            Showing 50 of {filteredRegions.length} regions. Use search to filter.
                        </div>
                    )}
                </div>

                {/* New Region Modal */}
                {showNew && (
                    <RegionModal
                        onClose={() => setShowNew(false)}
                        onSuccess={() => {
                            setShowNew(false);
                            fetchRegions();
                        }}
                    />
                )}

                {/* Edit Region Modal */}
                {editingRegion && (
                    <RegionModal
                        region={editingRegion}
                        onClose={() => setEditingRegion(null)}
                        onSuccess={() => {
                            setEditingRegion(null);
                            fetchRegions();
                        }}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

function RegionModal({ region, onClose, onSuccess }: {
    region?: Region;
    onClose: () => void;
    onSuccess: () => void
}) {
    const [formData, setFormData] = useState({
        type: region?.type || 'STATE',
        name: region?.name || '',
        slug: region?.slug || '',
        stateCode: region?.stateCode || '',
        population: region?.population?.toString() || '',
        medianIncome: region?.medianIncome?.toString() || '',
        timezone: region?.timezone || '',
        seoSummary: region?.seoSummary || '',
        legalNotes: region?.legalNotes || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'name' && !region ? {
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            } : {})
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const url = region ? getApiUrl(`/api/regions/${region.id}`) : getApiUrl('/api/regions');
            const method = region ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    population: formData.population ? parseInt(formData.population) : null,
                    medianIncome: formData.medianIncome ? parseInt(formData.medianIncome) : null,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save region');
            }

            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">{region ? 'Edit Region' : 'Add New Region'}</h2>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                disabled={!!region}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                            >
                                <option value="STATE">State</option>
                                <option value="CITY">City</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State Code</label>
                            <input
                                type="text"
                                name="stateCode"
                                value={formData.stateCode}
                                onChange={handleChange}
                                maxLength={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="CA"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="California"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="california"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Population</label>
                            <input
                                type="number"
                                name="population"
                                value={formData.population}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Median Income</label>
                            <input
                                type="number"
                                name="medianIncome"
                                value={formData.medianIncome}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                        <input
                            type="text"
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="America/Los_Angeles"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SEO Summary</label>
                        <textarea
                            name="seoSummary"
                            value={formData.seoSummary}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Legal Notes</label>
                        <textarea
                            name="legalNotes"
                            value={formData.legalNotes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (region ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
