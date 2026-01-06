'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';

interface AffiliatePartner {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    description: string | null;
    affiliateUrl: string | null;
    affiliateId: string | null;
    displayOrder: number;
    isActive: boolean;
    isFeatured: boolean;
    insuranceTypes: string[];
    ctaText: string;
    notes: string | null;
}

const INSURANCE_TYPE_OPTIONS = [
    { value: 'car', label: 'Car Insurance' },
    { value: 'home', label: 'Home Insurance' },
    { value: 'life', label: 'Life Insurance' },
    { value: 'health', label: 'Health Insurance' },
    { value: 'business', label: 'Business Insurance' },
    { value: 'motorcycle', label: 'Motorcycle Insurance' },
    { value: 'pet', label: 'Pet Insurance' },
];

export default function AffiliatesPage() {
    const [affiliates, setAffiliates] = useState<AffiliatePartner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAffiliate, setEditingAffiliate] = useState<AffiliatePartner | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        logo: '',
        description: '',
        affiliateUrl: '',
        affiliateId: '',
        displayOrder: 0,
        isActive: true,
        isFeatured: false,
        insuranceTypes: [] as string[],
        ctaText: 'Get Quote',
        notes: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAffiliates();
    }, []);

    const fetchAffiliates = async () => {
        try {
            const res = await fetch(getApiUrl('/api/affiliates'));
            const data = await res.json();
            setAffiliates(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch affiliates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const url = editingAffiliate
                ? getApiUrl(`/api/affiliates/${editingAffiliate.id}`)
                : getApiUrl('/api/affiliates');

            const res = await fetch(url, {
                method: editingAffiliate ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save');
            }

            setShowForm(false);
            setEditingAffiliate(null);
            resetForm();
            fetchAffiliates();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            logo: '',
            description: '',
            affiliateUrl: '',
            affiliateId: '',
            displayOrder: 0,
            isActive: true,
            isFeatured: false,
            insuranceTypes: [],
            ctaText: 'Get Quote',
            notes: '',
        });
    };

    const handleEdit = (affiliate: AffiliatePartner) => {
        setEditingAffiliate(affiliate);
        setFormData({
            name: affiliate.name,
            slug: affiliate.slug,
            logo: affiliate.logo || '',
            description: affiliate.description || '',
            affiliateUrl: affiliate.affiliateUrl || '',
            affiliateId: affiliate.affiliateId || '',
            displayOrder: affiliate.displayOrder,
            isActive: affiliate.isActive,
            isFeatured: affiliate.isFeatured,
            insuranceTypes: affiliate.insuranceTypes || [],
            ctaText: affiliate.ctaText,
            notes: affiliate.notes || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this affiliate partner?')) return;

        try {
            await fetch(getApiUrl(`/api/affiliates/${id}`), { method: 'DELETE' });
            fetchAffiliates();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const toggleInsuranceType = (type: string) => {
        setFormData(prev => ({
            ...prev,
            insuranceTypes: prev.insuranceTypes.includes(type)
                ? prev.insuranceTypes.filter(t => t !== type)
                : [...prev.insuranceTypes, type]
        }));
    };

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Affiliate Partners</h1>
                        <p className="text-gray-600 mt-1">Manage insurance carrier affiliate links</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingAffiliate(null);
                            resetForm();
                            setShowForm(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + Add Partner
                    </button>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-1">💡 How Affiliate Links Work</h3>
                    <p className="text-sm text-blue-700">
                        Add your affiliate partners here. Leave the &quot;Affiliate URL&quot; empty as a placeholder,
                        then update it when you sign up for their affiliate program. The links will appear
                        on your website&apos;s comparison pages.
                    </p>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">
                                {editingAffiliate ? 'Edit Affiliate Partner' : 'Add Affiliate Partner'}
                            </h2>

                            {error && (
                                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Partner Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            setFormData({
                                                ...formData,
                                                name,
                                                slug: editingAffiliate ? formData.slug : generateSlug(name),
                                            });
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Progressive, GEICO, State Farm..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Logo URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.logo}
                                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://example.com/logo.png"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        rows={2}
                                        placeholder="A leading car insurance provider..."
                                    />
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="font-medium text-gray-900 mb-3">Affiliate Settings</h3>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Affiliate URL <span className="text-gray-400">(leave empty for placeholder)</span>
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.affiliateUrl}
                                                onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="https://affiliate.example.com/?ref=YOUR_ID"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Your Affiliate ID
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.affiliateId}
                                                onChange={(e) => setFormData({ ...formData, affiliateId: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="Your affiliate/partner ID"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                CTA Button Text
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.ctaText}
                                                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="Get Quote"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Insurance Types Offered
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {INSURANCE_TYPE_OPTIONS.map(option => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => toggleInsuranceType(option.value)}
                                                className={`px-3 py-1.5 text-sm rounded-full border transition ${formData.insuranceTypes.includes(option.value)
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 border-t pt-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="rounded border-gray-300"
                                        />
                                        <span className="text-sm">Active</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.isFeatured}
                                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                            className="rounded border-gray-300"
                                        />
                                        <span className="text-sm">Featured</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Internal Notes
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        rows={2}
                                        placeholder="Notes about this affiliate program..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                                    >
                                        {saving ? 'Saving...' : 'Save Partner'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Affiliates List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : affiliates.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 mb-4">No affiliate partners yet</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                Add your first affiliate partner →
                            </button>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Types</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Affiliate URL</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {affiliates.map((affiliate) => (
                                    <tr key={affiliate.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                    {affiliate.logo ? (
                                                        <img src={affiliate.logo} alt={affiliate.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <span className="text-gray-400 text-xs font-bold">{affiliate.name[0]}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{affiliate.name}</p>
                                                    {affiliate.isFeatured && (
                                                        <span className="text-xs text-amber-600">⭐ Featured</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {affiliate.insuranceTypes.slice(0, 3).map(type => (
                                                    <span key={type} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                        {type}
                                                    </span>
                                                ))}
                                                {affiliate.insuranceTypes.length > 3 && (
                                                    <span className="text-xs text-gray-400">+{affiliate.insuranceTypes.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {affiliate.affiliateUrl ? (
                                                <span className="text-green-600 text-sm">✓ Configured</span>
                                            ) : (
                                                <span className="text-amber-600 text-sm">⏳ Placeholder</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${affiliate.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {affiliate.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleEdit(affiliate)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(affiliate.id)}
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
