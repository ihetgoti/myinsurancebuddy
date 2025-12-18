'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';

interface Country {
    id: string;
    code: string;
    name: string;
    isActive: boolean;
    _count: { states: number; pages: number };
}

export default function CountriesPage() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCountry, setEditingCountry] = useState<Country | null>(null);
    const [formData, setFormData] = useState({ code: '', name: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const res = await fetch(getApiUrl('/api/countries'));
            const data = await res.json();
            setCountries(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch countries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const url = editingCountry
                ? getApiUrl(`/api/countries/${editingCountry.id}`)
                : getApiUrl('/api/countries');

            const res = await fetch(url, {
                method: editingCountry ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save');
            }

            setShowForm(false);
            setEditingCountry(null);
            setFormData({ code: '', name: '' });
            fetchCountries();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (country: Country) => {
        setEditingCountry(country);
        setFormData({ code: country.code, name: country.name });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will delete all states, cities, and pages.')) return;

        try {
            await fetch(getApiUrl(`/api/countries/${id}`), { method: 'DELETE' });
            fetchCountries();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Countries</h1>
                        <p className="text-gray-600 mt-1">Manage countries for geo targeting</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/dashboard/countries/import"
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                        >
                            📥 Import CSV
                        </Link>
                        <button
                            onClick={() => {
                                setEditingCountry(null);
                                setFormData({ code: '', name: '' });
                                setShowForm(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            + Add Country
                        </button>
                    </div>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                            <h2 className="text-xl font-bold mb-4">
                                {editingCountry ? 'Edit Country' : 'Add Country'}
                            </h2>

                            {error && (
                                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Country Code *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="us"
                                        maxLength={3}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        2-3 letter code (e.g., us, in, uk)
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="United States"
                                        required
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

                {/* Countries List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : countries.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 mb-4">No countries yet</p>
                            <div className="flex justify-center gap-4">
                                <Link
                                    href="/dashboard/countries/import"
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Import from CSV →
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">States</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pages</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {countries.map((country) => (
                                    <tr key={country.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <code className="text-sm bg-gray-100 px-2 py-1 rounded font-medium">
                                                {country.code.toUpperCase()}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {country.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {country._count.states}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {country._count.pages}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${country.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {country.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/dashboard/states?countryId=${country.id}`}
                                                className="text-gray-600 hover:text-gray-800 mr-3"
                                            >
                                                States
                                            </Link>
                                            <button
                                                onClick={() => handleEdit(country)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(country.id)}
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
        </AdminLayout>
    );
}
