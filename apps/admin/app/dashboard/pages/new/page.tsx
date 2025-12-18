'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface InsuranceType {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
}

interface Country {
    id: string;
    code: string;
    name: string;
}

interface State {
    id: string;
    name: string;
    slug: string;
}

interface City {
    id: string;
    name: string;
    slug: string;
}

type GeoLevel = 'NICHE' | 'COUNTRY' | 'STATE' | 'CITY';

export default function NewPagePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        insuranceTypeId: '',
        geoLevel: '' as GeoLevel | '',
        countryId: '',
        stateId: '',
        cityId: '',
        heroTitle: '',
        heroSubtitle: '',
        metaTitle: '',
        metaDescription: '',
        isPublished: false,
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (formData.countryId) {
            fetchStates(formData.countryId);
        } else {
            setStates([]);
            setFormData(prev => ({ ...prev, stateId: '', cityId: '' }));
        }
    }, [formData.countryId]);

    useEffect(() => {
        if (formData.stateId) {
            fetchCities(formData.stateId);
        } else {
            setCities([]);
            setFormData(prev => ({ ...prev, cityId: '' }));
        }
    }, [formData.stateId]);

    const fetchInitialData = async () => {
        try {
            const [typesRes, countriesRes] = await Promise.all([
                fetch(getApiUrl('/api/insurance-types')),
                fetch(getApiUrl('/api/countries')),
            ]);
            const typesData = await typesRes.json();
            const countriesData = await countriesRes.json();

            setInsuranceTypes(Array.isArray(typesData) ? typesData : []);
            setCountries(Array.isArray(countriesData) ? countriesData : []);
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStates = async (countryId: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/states?countryId=${countryId}`));
            const data = await res.json();
            setStates(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch states:', error);
        }
    };

    const fetchCities = async (stateId: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/cities?stateId=${stateId}&limit=500`));
            const data = await res.json();
            setCities(data.cities || []);
        } catch (error) {
            console.error('Failed to fetch cities:', error);
        }
    };

    const handleSubmit = async () => {
        setError('');
        setSaving(true);

        try {
            const res = await fetch(getApiUrl('/api/pages'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    sections: getDefaultSections(),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create page');
            }

            const page = await res.json();
            router.push(`/dashboard/pages/${page.id}`);
        } catch (err: any) {
            setError(err.message);
            setSaving(false);
        }
    };

    const getDefaultSections = () => {
        return [
            { type: 'overview', title: 'Overview', content: '' },
            { type: 'why', title: 'Why This Insurance Matters', content: '' },
            { type: 'costs', title: 'Cost Factors', content: '' },
            { type: 'choosing', title: 'How to Choose', content: '' },
            { type: 'faq', title: 'FAQs', items: [] },
        ];
    };

    const getPreviewUrl = () => {
        const parts = [];
        const selectedType = insuranceTypes.find(t => t.id === formData.insuranceTypeId);
        if (selectedType) parts.push(selectedType.slug);

        const selectedCountry = countries.find(c => c.id === formData.countryId);
        if (selectedCountry && formData.geoLevel !== 'NICHE') parts.push(selectedCountry.code);

        const selectedState = states.find(s => s.id === formData.stateId);
        if (selectedState && ['STATE', 'CITY'].includes(formData.geoLevel)) parts.push(selectedState.slug);

        const selectedCity = cities.find(c => c.id === formData.cityId);
        if (selectedCity && formData.geoLevel === 'CITY') parts.push(selectedCity.slug);

        return parts.length > 0 ? `/${parts.join('/')}` : '/...';
    };

    const canProceed = () => {
        if (step === 1) return !!formData.insuranceTypeId;
        if (step === 2) {
            if (!formData.geoLevel) return false;
            if (formData.geoLevel === 'NICHE') return true;
            if (formData.geoLevel === 'COUNTRY') return !!formData.countryId;
            if (formData.geoLevel === 'STATE') return !!formData.countryId && !!formData.stateId;
            if (formData.geoLevel === 'CITY') return !!formData.countryId && !!formData.stateId && !!formData.cityId;
        }
        return true;
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="p-8 text-center text-gray-500">Loading...</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link href="/dashboard/pages" className="text-blue-600 hover:text-blue-700 text-sm">
                        ← Back to Pages
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Page</h1>
                <p className="text-gray-600 mb-8">Follow the steps to create a new insurance landing page.</p>

                {/* Progress */}
                <div className="flex items-center gap-4 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                {s}
                            </div>
                            <span className={step >= s ? 'text-gray-900' : 'text-gray-500'}>
                                {s === 1 ? 'Insurance Type' : s === 2 ? 'Location' : 'Details'}
                            </span>
                            {s < 3 && <div className="w-8 h-0.5 bg-gray-200"></div>}
                        </div>
                    ))}
                </div>

                {/* Preview URL */}
                <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6">
                    <p className="text-sm text-gray-500">Page URL Preview:</p>
                    <code className="text-blue-600 font-medium">{getPreviewUrl()}</code>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Step 1: Insurance Type */}
                {step === 1 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-semibold mb-4">Select Insurance Type</h2>

                        {insuranceTypes.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">No insurance types defined yet.</p>
                                <Link href="/dashboard/insurance-types" className="text-blue-600 hover:text-blue-700">
                                    Add insurance types first →
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {insuranceTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setFormData({ ...formData, insuranceTypeId: type.id })}
                                        className={`p-4 border rounded-xl text-left transition ${formData.insuranceTypeId === type.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <span className="text-2xl">{type.icon || '📋'}</span>
                                        <p className="font-medium text-gray-900 mt-2">{type.name}</p>
                                        <code className="text-xs text-gray-500">/{type.slug}</code>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Location */}
                {step === 2 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-semibold mb-4">Select Geographic Level</h2>

                        <div className="space-y-4 mb-6">
                            {[
                                { value: 'NICHE', label: 'Niche Homepage', desc: 'Main page for this insurance type' },
                                { value: 'COUNTRY', label: 'Country Level', desc: 'Country-specific page' },
                                { value: 'STATE', label: 'State Level', desc: 'State-specific page' },
                                { value: 'CITY', label: 'City Level', desc: 'City-specific page (recommended)' },
                            ].map((opt) => (
                                <label
                                    key={opt.value}
                                    className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition ${formData.geoLevel === opt.value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="geoLevel"
                                        value={opt.value}
                                        checked={formData.geoLevel === opt.value}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            geoLevel: e.target.value as GeoLevel,
                                            countryId: '',
                                            stateId: '',
                                            cityId: '',
                                        })}
                                        className="mt-1"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">{opt.label}</p>
                                        <p className="text-sm text-gray-500">{opt.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {formData.geoLevel && formData.geoLevel !== 'NICHE' && (
                            <div className="space-y-4 border-t pt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <select
                                        value={formData.countryId}
                                        onChange={(e) => setFormData({ ...formData, countryId: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select country</option>
                                        {countries.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {['STATE', 'CITY'].includes(formData.geoLevel) && formData.countryId && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <select
                                            value={formData.stateId}
                                            onChange={(e) => setFormData({ ...formData, stateId: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select state</option>
                                            {states.map((s) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {formData.geoLevel === 'CITY' && formData.stateId && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <select
                                            value={formData.cityId}
                                            onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select city</option>
                                            {cities.map((c) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Details */}
                {step === 3 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Page Details</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                            <input
                                type="text"
                                value={formData.heroTitle}
                                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Best Car Insurance in Los Angeles"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                            <input
                                type="text"
                                value={formData.heroSubtitle}
                                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Compare rates and find the perfect coverage"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title (SEO)</label>
                            <input
                                type="text"
                                value={formData.metaTitle}
                                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Best Car Insurance in Los Angeles | MyInsuranceBuddies"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description (SEO)</label>
                            <textarea
                                value={formData.metaDescription}
                                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Find the best car insurance rates in Los Angeles. Compare quotes, coverage options, and save money on your auto insurance."
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="isPublished"
                                checked={formData.isPublished}
                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="isPublished" className="text-sm text-gray-700">
                                Publish immediately
                            </label>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => setStep(s => Math.max(1, s - 1))}
                        disabled={step === 1}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        Back
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(s => s + 1)}
                            disabled={!canProceed()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {saving ? 'Creating...' : 'Create Page'}
                        </button>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
