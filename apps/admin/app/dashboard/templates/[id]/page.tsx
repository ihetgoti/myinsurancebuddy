'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState, useRef } from 'react';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';

interface Section {
    id: string;
    type: 'text' | 'faq' | 'features' | 'cta' | 'image';
    title: string;
    content: string;
    items?: any[];
}

interface CustomVariable {
    name: string;
    label: string;
    type: 'text' | 'number';
    required: boolean;
    defaultValue: string;
}

interface Template {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    thumbnail: string | null;
    sections: Section[];
    variables: Record<string, string> | null;
    customVariables: CustomVariable[] | null;
    isActive: boolean;
}

const SECTION_TYPES = [
    { type: 'text', icon: '📝', label: 'Text Section' },
    { type: 'faq', icon: '❓', label: 'FAQ Section' },
    { type: 'features', icon: '✨', label: 'Features Grid' },
    { type: 'cta', icon: '🎯', label: 'Call to Action' },
    { type: 'image', icon: '🖼️', label: 'Image Section' },
];

const DEFAULT_VARIABLES = [
    { key: '{{insurance_type}}', label: 'Insurance Type Name' },
    { key: '{{insurance_slug}}', label: 'Insurance Slug' },
    { key: '{{country}}', label: 'Country Name' },
    { key: '{{country_code}}', label: 'Country Code' },
    { key: '{{state}}', label: 'State Name' },
    { key: '{{state_code}}', label: 'State Code' },
    { key: '{{city}}', label: 'City Name' },
    { key: '{{city_population}}', label: 'City Population' },
];

export default function TemplateEditorPage({ params }: { params: { id: string } }) {
    const [template, setTemplate] = useState<Template | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [sections, setSections] = useState<Section[]>([]);
    const [customVariables, setCustomVariables] = useState<CustomVariable[]>([]);
    const [editingSection, setEditingSection] = useState<Section | null>(null);
    const [activeTab, setActiveTab] = useState<'sections' | 'variables'>('sections');

    useEffect(() => {
        fetchTemplate();
    }, [params.id]);

    const fetchTemplate = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/templates/${params.id}`));
            if (!res.ok) throw new Error('Template not found');
            const data = await res.json();
            setTemplate(data);
            setSections(data.sections || []);
            setCustomVariables(data.customVariables || []);
        } catch (error) {
            console.error('Failed to fetch template:', error);
            setError('Template not found');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!template) return;
        setSaving(true);
        setError('');

        try {
            const res = await fetch(getApiUrl(`/api/templates/${params.id}`), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sections, customVariables }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save');
            }

            const updated = await res.json();
            setTemplate(updated);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const addCustomVariable = () => {
        setCustomVariables([
            ...customVariables,
            { name: '', label: '', type: 'text', required: false, defaultValue: '' }
        ]);
    };

    const updateCustomVariable = (index: number, updates: Partial<CustomVariable>) => {
        setCustomVariables(customVariables.map((v, i) =>
            i === index ? { ...v, ...updates } : v
        ));
    };

    const removeCustomVariable = (index: number) => {
        setCustomVariables(customVariables.filter((_, i) => i !== index));
    };

    const addSection = (type: string) => {
        const newSection: Section = {
            id: Date.now().toString(),
            type: type as Section['type'],
            title: `New ${type} section`,
            content: '',
            items: type === 'faq' || type === 'features' ? [] : undefined,
        };
        setSections([...sections, newSection]);
        setEditingSection(newSection);
    };

    const updateSection = (id: string, updates: Partial<Section>) => {
        setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
        if (editingSection?.id === id) {
            setEditingSection({ ...editingSection, ...updates });
        }
    };

    const removeSection = (id: string) => {
        setSections(sections.filter(s => s.id !== id));
        if (editingSection?.id === id) {
            setEditingSection(null);
        }
    };

    const moveSection = (id: string, direction: 'up' | 'down') => {
        const index = sections.findIndex(s => s.id === id);
        if (index === -1) return;
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === sections.length - 1) return;

        const newSections = [...sections];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]];
        setSections(newSections);
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="text-center py-12 text-gray-500">Loading...</div>
            </AdminLayout>
        );
    }

    if (error && !template) {
        return (
            <AdminLayout>
                <div className="text-center py-12">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Link href="/dashboard/templates" className="text-blue-600 hover:text-blue-700">
                        ← Back to Templates
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="h-[calc(100vh-2rem)] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/templates" className="text-gray-500 hover:text-gray-700">
                            ← Back
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{template?.name}</h1>
                            <code className="text-sm text-gray-500">{template?.slug}</code>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className={`px-4 py-2 rounded-lg transition ${showPreview
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            👁️ Preview
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Template'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <div className="flex gap-6 flex-1 min-h-0">
                    {/* Editor Panel */}
                    <div className={`flex-1 flex flex-col min-h-0 ${showPreview ? 'w-1/2' : 'w-full'}`}>
                        {/* Tabs */}
                        <div className="flex gap-2 mb-4 flex-shrink-0">
                            <button
                                onClick={() => setActiveTab('sections')}
                                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'sections'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                📝 Sections ({sections.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('variables')}
                                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'variables'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                🔤 Custom Variables ({customVariables.length})
                            </button>
                        </div>

                        {activeTab === 'sections' && (
                            <>
                                {/* Add Section Bar */}
                                <div className="bg-white rounded-xl border p-4 mb-4 flex-shrink-0">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Add Section</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {SECTION_TYPES.map(({ type, icon, label }) => (
                                            <button
                                                key={type}
                                                onClick={() => addSection(type)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-blue-50 rounded-lg text-sm transition"
                                            >
                                                <span>{icon}</span>
                                                <span>{label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Variables Reference */}
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex-shrink-0">
                                    <p className="text-sm font-medium text-amber-800 mb-2">Available Variables (click to copy)</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {DEFAULT_VARIABLES.map(({ key, label }) => (
                                            <code
                                                key={key}
                                                className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs cursor-pointer hover:bg-amber-200"
                                                onClick={() => navigator.clipboard.writeText(key)}
                                                title={`${label} - Click to copy`}
                                            >
                                                {key}
                                            </code>
                                        ))}
                                        {customVariables.filter(v => v.name).map(v => (
                                            <code
                                                key={v.name}
                                                className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs cursor-pointer hover:bg-purple-200"
                                                onClick={() => navigator.clipboard.writeText(`{{${v.name}}}`)}
                                                title={`${v.label || v.name} (custom) - Click to copy`}
                                            >
                                                {`{{${v.name}}}`}
                                            </code>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'variables' && (
                            <div className="bg-white rounded-xl border p-4 mb-4 flex-shrink-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Custom Variables</p>
                                        <p className="text-xs text-gray-500">Define custom placeholders for CSV data import</p>
                                    </div>
                                    <button
                                        onClick={addCustomVariable}
                                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                    >
                                        + Add Variable
                                    </button>
                                </div>

                                {customVariables.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500 mb-2">No custom variables defined</p>
                                        <p className="text-sm text-gray-400">
                                            Add variables like avg_premium, top_provider to use in your content
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {customVariables.map((v, index) => (
                                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-1 grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs text-gray-500">Variable Name</label>
                                                        <input
                                                            type="text"
                                                            value={v.name}
                                                            onChange={(e) => updateCustomVariable(index, {
                                                                name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_')
                                                            })}
                                                            placeholder="e.g. avg_premium"
                                                            className="w-full px-2 py-1 border rounded text-sm font-mono"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500">Label</label>
                                                        <input
                                                            type="text"
                                                            value={v.label}
                                                            onChange={(e) => updateCustomVariable(index, { label: e.target.value })}
                                                            placeholder="e.g. Average Premium"
                                                            className="w-full px-2 py-1 border rounded text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500">Default Value</label>
                                                        <input
                                                            type="text"
                                                            value={v.defaultValue}
                                                            onChange={(e) => updateCustomVariable(index, { defaultValue: e.target.value })}
                                                            placeholder="Fallback value if not in CSV"
                                                            className="w-full px-2 py-1 border rounded text-sm"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <label className="flex items-center gap-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={v.required}
                                                                onChange={(e) => updateCustomVariable(index, { required: e.target.checked })}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-xs text-gray-600">Required</span>
                                                        </label>
                                                        <select
                                                            value={v.type}
                                                            onChange={(e) => updateCustomVariable(index, { type: e.target.value as 'text' | 'number' })}
                                                            className="px-2 py-1 border rounded text-sm"
                                                        >
                                                            <option value="text">Text</option>
                                                            <option value="number">Number</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeCustomVariable(index)}
                                                    className="p-1 text-red-400 hover:text-red-600"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {customVariables.length > 0 && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-xs text-blue-700 mb-2">Usage in sections:</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {customVariables.filter(v => v.name).map(v => (
                                                <code key={v.name} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                                    {`{{${v.name}}}`}
                                                </code>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Sections List - Only show when on sections tab */}
                        {activeTab === 'sections' && (
                            <div className="bg-white rounded-xl border flex-1 overflow-y-auto">
                                {sections.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <p className="mb-2">No sections yet</p>
                                        <p className="text-sm">Add sections using the buttons above</p>
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {sections.map((section, index) => (
                                            <div
                                                key={section.id}
                                                className={`p-4 ${editingSection?.id === section.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">
                                                            {SECTION_TYPES.find(t => t.type === section.type)?.icon}
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={section.title}
                                                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                                            className="font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => moveSection(section.id, 'up')}
                                                            disabled={index === 0}
                                                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                        >
                                                            ↑
                                                        </button>
                                                        <button
                                                            onClick={() => moveSection(section.id, 'down')}
                                                            disabled={index === sections.length - 1}
                                                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                        >
                                                            ↓
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingSection(
                                                                editingSection?.id === section.id ? null : section
                                                            )}
                                                            className={`p-1 ${editingSection?.id === section.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            onClick={() => removeSection(section.id)}
                                                            className="p-1 text-red-400 hover:text-red-600"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>

                                                {editingSection?.id === section.id && (
                                                    <div className="mt-3 space-y-3">
                                                        <textarea
                                                            value={section.content}
                                                            onChange={(e) => updateSection(section.id, { content: e.target.value })}
                                                            className="w-full px-3 py-2 border rounded-lg text-sm"
                                                            rows={4}
                                                            placeholder={`Enter content... Use variables like {{city}} to personalize`}
                                                        />

                                                        {(section.type === 'faq' || section.type === 'features') && (
                                                            <div className="space-y-2">
                                                                <p className="text-xs text-gray-500">Items (one per line, format: Title | Content)</p>
                                                                <textarea
                                                                    value={(section.items || []).map(
                                                                        (i: any) => `${i.title} | ${i.content}`
                                                                    ).join('\n')}
                                                                    onChange={(e) => {
                                                                        const items = e.target.value.split('\n').map(line => {
                                                                            const [title, content] = line.split('|').map(s => s.trim());
                                                                            return { title: title || '', content: content || '' };
                                                                        }).filter(i => i.title);
                                                                        updateSection(section.id, { items });
                                                                    }}
                                                                    className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
                                                                    rows={4}
                                                                    placeholder="What is car insurance? | Car insurance protects..."
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Preview Panel */}
                    {showPreview && (
                        <div className="w-1/2 bg-white rounded-xl border overflow-y-auto">
                            <div className="p-4 border-b bg-gray-50">
                                <h3 className="font-medium text-gray-700">Preview</h3>
                                <p className="text-xs text-gray-500">Variables shown as placeholders</p>
                            </div>
                            <div className="p-6 space-y-6">
                                {sections.length === 0 ? (
                                    <p className="text-center text-gray-400">Add sections to see preview</p>
                                ) : (
                                    sections.map((section) => (
                                        <div key={section.id} className="border rounded-lg p-4">
                                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                                {section.title}
                                            </h2>

                                            {section.type === 'text' && (
                                                <p className="text-gray-600 whitespace-pre-wrap">
                                                    {section.content || 'No content yet...'}
                                                </p>
                                            )}

                                            {section.type === 'faq' && (
                                                <div className="space-y-2">
                                                    {(section.items || []).map((item: any, i: number) => (
                                                        <details key={i} className="border rounded p-2">
                                                            <summary className="font-medium cursor-pointer">
                                                                {item.title}
                                                            </summary>
                                                            <p className="mt-2 text-gray-600">{item.content}</p>
                                                        </details>
                                                    ))}
                                                    {(!section.items || section.items.length === 0) && (
                                                        <p className="text-gray-400">No FAQ items yet...</p>
                                                    )}
                                                </div>
                                            )}

                                            {section.type === 'features' && (
                                                <div className="grid grid-cols-2 gap-3">
                                                    {(section.items || []).map((item: any, i: number) => (
                                                        <div key={i} className="p-3 bg-gray-50 rounded">
                                                            <h4 className="font-medium">{item.title}</h4>
                                                            <p className="text-sm text-gray-600">{item.content}</p>
                                                        </div>
                                                    ))}
                                                    {(!section.items || section.items.length === 0) && (
                                                        <p className="text-gray-400 col-span-2">No features yet...</p>
                                                    )}
                                                </div>
                                            )}

                                            {section.type === 'cta' && (
                                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                                    <p className="text-gray-700 mb-3">{section.content}</p>
                                                    <button className="bg-blue-600 text-white px-4 py-2 rounded">
                                                        Get Started
                                                    </button>
                                                </div>
                                            )}

                                            {section.type === 'image' && (
                                                <div className="bg-gray-100 h-40 rounded flex items-center justify-center">
                                                    <span className="text-gray-400">🖼️ Image Placeholder</span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
