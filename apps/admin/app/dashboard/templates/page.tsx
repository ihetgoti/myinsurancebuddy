'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    type?: string;
    usageCount?: number;
    isBuiltIn?: boolean;
}

// Built-in HTML templates
const BUILT_IN_TEMPLATES: Template[] = [
    {
        id: 'state-page',
        name: 'State Insurance Page',
        description: 'SEO-optimized for state-level pages with ad placements',
        category: 'state',
        isBuiltIn: true,
    },
    {
        id: 'city-page',
        name: 'City Insurance Page',
        description: 'Local SEO optimized for city-level pages',
        category: 'city',
        isBuiltIn: true,
    },
    {
        id: 'comparison',
        name: 'Insurance Comparison',
        description: 'Compare insurance companies or coverage types',
        category: 'comparison',
        isBuiltIn: true,
    },
    {
        id: 'guide',
        name: 'Insurance Guide',
        description: 'Educational content with FAQ section',
        category: 'guide',
        isBuiltIn: true,
    },
    {
        id: 'landing',
        name: 'Landing Page',
        description: 'High-converting page for lead generation',
        category: 'landing',
        isBuiltIn: true,
    },
];

export default function TemplatesPage() {
    const router = useRouter();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await fetch('/api/templates');
            const data = await res.json();
            const customTemplates = (Array.isArray(data) ? data : []).map((t: Template) => ({
                ...t,
                isBuiltIn: false,
            }));
            setTemplates([...BUILT_IN_TEMPLATES, ...customTemplates]);
        } catch (error) {
            setTemplates(BUILT_IN_TEMPLATES);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this template?')) return;

        setDeleting(id);
        try {
            const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setTemplates(templates.filter(t => t.id !== id));
            } else {
                alert('Failed to delete template');
            }
        } catch (error) {
            alert('Failed to delete template');
        } finally {
            setDeleting(null);
        }
    };

    const filteredTemplates = selectedCategory === 'all'
        ? templates
        : templates.filter(t => t.category === selectedCategory);

    const categories = ['all', 'state', 'city', 'comparison', 'guide', 'landing', 'custom'];

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'state': return '🏛️';
            case 'city': return '🏙️';
            case 'comparison': return '⚖️';
            case 'guide': return '📚';
            case 'landing': return '🚀';
            default: return '📄';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'state': return 'bg-blue-500';
            case 'city': return 'bg-green-500';
            case 'comparison': return 'bg-purple-500';
            case 'guide': return 'bg-orange-500';
            case 'landing': return 'bg-pink-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
                        <p className="text-gray-600 mt-1">
                            SEO-optimized templates with ad placements built-in
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/templates/editor')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <span>+</span> Create Custom Template
                    </button>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {cat === 'all' ? 'All Templates' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Templates Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map(template => (
                            <div
                                key={template.id}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
                            >
                                {/* Template Preview */}
                                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-50">
                                        {getCategoryIcon(template.category)}
                                    </div>
                                    <div className={`absolute top-3 right-3 ${getCategoryColor(template.category)} text-white text-xs px-2 py-1 rounded-full`}>
                                        {template.category}
                                    </div>
                                </div>

                                {/* Template Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                        {template.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-4">
                                        {template.description}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.push(`/dashboard/templates/preview?id=${template.id}`)}
                                            className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                        >
                                            Preview
                                        </button>
                                        <button
                                            onClick={() => router.push(`/dashboard/bulk-generate?template=${template.id}`)}
                                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            Use
                                        </button>
                                        {!template.isBuiltIn && (
                                            <>
                                                <button
                                                    onClick={() => router.push(`/dashboard/templates/editor?id=${template.id}`)}
                                                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(template.id)}
                                                    disabled={deleting === template.id}
                                                    className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {deleting === template.id ? '...' : '🗑️'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredTemplates.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No templates found in this category.</p>
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h3>
                    <ul className="text-blue-800 text-sm space-y-2">
                        <li>• <strong>State templates</strong> work best for targeting state-level keywords</li>
                        <li>• <strong>City templates</strong> are optimized for local SEO with location schema</li>
                        <li>• <strong>All templates</strong> include strategic ad placements for maximum revenue</li>
                        <li>• Use <strong>Bulk Generate</strong> or the <strong>External API</strong> to create pages at scale</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}
