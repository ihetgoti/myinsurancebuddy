'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';

interface Template {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    thumbnail: string | null;
    sections: any[];
    variables: Record<string, any> | null;
    isActive: boolean;
    createdAt: string;
    _count: { pages: number };
}

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await fetch(getApiUrl('/api/templates'));
            const data = await res.json();
            setTemplates(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const url = editingTemplate
                ? getApiUrl(`/api/templates/${editingTemplate.id}`)
                : getApiUrl('/api/templates');

            const res = await fetch(url, {
                method: editingTemplate ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    sections: editingTemplate?.sections || [],
                    variables: editingTemplate?.variables || {},
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save');
            }

            setShowForm(false);
            setEditingTemplate(null);
            setFormData({ name: '', slug: '', description: '' });
            fetchTemplates();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this template?')) return;

        try {
            const res = await fetch(getApiUrl(`/api/templates/${id}`), { method: 'DELETE' });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete');
            }
            fetchTemplates();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
                        <p className="text-gray-600 mt-1">Create reusable page templates</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingTemplate(null);
                            setFormData({ name: '', slug: '', description: '' });
                            setShowForm(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + New Template
                    </button>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                            <h2 className="text-xl font-bold mb-4">
                                {editingTemplate ? 'Edit Template' : 'Create Template'}
                            </h2>

                            {error && (
                                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
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
                                                slug: editingTemplate ? formData.slug : generateSlug(name),
                                            });
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="City Page Template"
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
                                        placeholder="city-page-template"
                                        required
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
                                        rows={3}
                                        placeholder="Template for city-level insurance pages..."
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

                {/* Templates Grid */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : templates.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border">
                        <div className="text-4xl mb-4">📄</div>
                        <p className="text-gray-500 mb-4">No templates yet</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="text-blue-600 hover:text-blue-700"
                        >
                            Create your first template →
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition"
                            >
                                {/* Thumbnail */}
                                <div className="h-40 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                                    {template.thumbnail ? (
                                        <img
                                            src={template.thumbnail}
                                            alt={template.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">📋</div>
                                            <div className="text-xs text-gray-400">
                                                {template.sections?.length || 0} sections
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                                            <code className="text-xs text-gray-500">{template.slug}</code>
                                        </div>
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${template.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {template.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    {template.description && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {template.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">
                                            {template._count.pages} pages
                                        </span>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/dashboard/templates/${template.id}`}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(template.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
