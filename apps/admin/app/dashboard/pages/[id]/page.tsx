'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';

interface Page {
    id: string;
    heroTitle: string | null;
    heroSubtitle: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    isPublished: boolean;
    publishedAt: string | null;
    insuranceType: { id: string; name: string };
    country: { id: string; name: string } | null;
    state: { id: string; name: string } | null;
    city: { id: string; name: string } | null;
    geoLevel: string;
    sections: { title: string; content: string }[];
}

export default function EditPagePage() {
    const params = useParams();
    const router = useRouter();
    const pageId = params.id as string;

    const [page, setPage] = useState<Page | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        heroTitle: '',
        heroSubtitle: '',
        metaTitle: '',
        metaDescription: '',
        isPublished: false,
        sections: [] as { title: string; content: string }[],
    });

    useEffect(() => {
        fetchPage();
    }, [pageId]);

    const fetchPage = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/pages/${pageId}`));
            if (!res.ok) throw new Error('Page not found');
            const data = await res.json();
            setPage(data);
            setFormData({
                heroTitle: data.heroTitle || '',
                heroSubtitle: data.heroSubtitle || '',
                metaTitle: data.metaTitle || '',
                metaDescription: data.metaDescription || '',
                isPublished: data.isPublished,
                sections: data.sections || [],
            });
        } catch (err) {
            setError('Failed to load page');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const res = await fetch(getApiUrl(`/api/pages/${pageId}`), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save');
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const updateSection = (index: number, field: 'title' | 'content', value: string) => {
        const newSections = [...formData.sections];
        newSections[index] = { ...newSections[index], [field]: value };
        setFormData({ ...formData, sections: newSections });
    };

    const addSection = () => {
        setFormData({
            ...formData,
            sections: [...formData.sections, { title: '', content: '' }],
        });
    };

    const removeSection = (index: number) => {
        const newSections = formData.sections.filter((_, i) => i !== index);
        setFormData({ ...formData, sections: newSections });
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    if (error && !page) {
        return (
            <AdminLayout>
                <div className="text-center py-20">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Link href="/dashboard/pages" className="text-blue-600 font-semibold">
                        ← Back to Pages
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/dashboard/pages" className="text-sm text-slate-500 hover:text-slate-700 mb-2 inline-block">
                            ← Back to Pages
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900">Edit Page</h1>
                        {page && (
                            <p className="text-slate-500 mt-1">
                                {page.insuranceType.name} • {page.city?.name || page.state?.name || page.country?.name || 'General'}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isPublished}
                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-300"
                            />
                            <span className="text-sm font-medium text-slate-700">Published</span>
                        </label>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
                        Changes saved successfully!
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Form */}
                <div className="space-y-8">
                    {/* Hero Section */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Hero Content</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Hero Title</label>
                                <input
                                    type="text"
                                    value={formData.heroTitle}
                                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    placeholder="Main page title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Hero Subtitle</label>
                                <textarea
                                    value={formData.heroSubtitle}
                                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                                    placeholder="Supporting text below the title"
                                />
                            </div>
                        </div>
                    </section>

                    {/* SEO Section */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">SEO Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                                <input
                                    type="text"
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    placeholder="SEO title (shown in browser tab)"
                                />
                                <p className="text-xs text-slate-500 mt-1">{formData.metaTitle.length}/60 characters</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                                <textarea
                                    value={formData.metaDescription}
                                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                                    placeholder="Brief description for search engines"
                                />
                                <p className="text-xs text-slate-500 mt-1">{formData.metaDescription.length}/160 characters</p>
                            </div>
                        </div>
                    </section>

                    {/* Content Sections */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900">Content Sections</h2>
                            <button
                                onClick={addSection}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                + Add Section
                            </button>
                        </div>

                        {formData.sections.length === 0 ? (
                            <p className="text-slate-500 text-center py-8">No content sections. Click &quot;Add Section&quot; to create one.</p>
                        ) : (
                            <div className="space-y-6">
                                {formData.sections.map((section, index) => (
                                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-slate-500">Section {index + 1}</span>
                                            <button
                                                onClick={() => removeSection(index)}
                                                className="text-red-600 hover:text-red-700 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={section.title}
                                                onChange={(e) => updateSection(index, 'title', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900"
                                                placeholder="Section title"
                                            />
                                            <textarea
                                                value={section.content}
                                                onChange={(e) => updateSection(index, 'content', e.target.value)}
                                                rows={6}
                                                className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none font-mono text-sm"
                                                placeholder="Section content (HTML supported)"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}
