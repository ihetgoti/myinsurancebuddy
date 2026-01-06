'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';
import {
    allComponents,
    componentCategories,
    getComponentById,
    systemVariables,
    ComponentDefinition,
    ComponentProp
} from '@/lib/component-definitions';

interface Section {
    id: string;
    componentId: string;
    props: Record<string, any>;
    isHidden?: boolean;
}

interface Template {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    type: string;
    category: string | null;
    sections: Section[];
    customVariables: any[];
    seoTitleTemplate: string | null;
    seoDescTemplate: string | null;
    customCss: string | null;
    customJs: string | null;
    layout: string;
    isActive: boolean;
}

export default function TemplateBuilderPage() {
    const params = useParams();
    const router = useRouter();
    const [template, setTemplate] = useState<Template | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'builder' | 'seo' | 'variables' | 'settings'>('builder');
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [componentSearch, setComponentSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    useEffect(() => {
        if (params.id && params.id !== 'new') {
            fetchTemplate();
        } else {
            setTemplate({
                id: '',
                name: 'New Template',
                slug: 'new-template',
                description: '',
                type: 'PAGE',
                category: null,
                sections: [],
                customVariables: [],
                seoTitleTemplate: '{{page_title}} | {{site_name}}',
                seoDescTemplate: '{{page_subtitle}}',
                customCss: null,
                customJs: null,
                layout: 'default',
                isActive: true,
            });
            setLoading(false);
        }
    }, [params.id]);

    const fetchTemplate = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/templates/${params.id}`));
            if (!res.ok) throw new Error('Template not found');
            const data = await res.json();
            setTemplate(data);
        } catch (error) {
            console.error('Failed to fetch template:', error);
            router.push('/dashboard/templates');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!template) return;
        setSaving(true);

        try {
            const url = template.id
                ? getApiUrl(`/api/templates/${template.id}`)
                : getApiUrl('/api/templates');

            const res = await fetch(url, {
                method: template.id ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(template),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save');
            }

            const saved = await res.json();
            if (!template.id) {
                router.push(`/dashboard/templates/${saved.id}`);
            }
            setTemplate(saved);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const addSection = (componentId: string, index?: number) => {
        if (!template) return;

        const component = getComponentById(componentId);
        if (!component) return;

        const newSection: Section = {
            id: `section-${Date.now()}`,
            componentId,
            props: { ...component.defaultProps },
        };

        const sections = [...template.sections];
        if (index !== undefined) {
            sections.splice(index, 0, newSection);
        } else {
            sections.push(newSection);
        }

        setTemplate({ ...template, sections });
        setSelectedSection(newSection.id);
    };

    const updateSection = (sectionId: string, updates: Partial<Section>) => {
        if (!template) return;
        setTemplate({
            ...template,
            sections: template.sections.map(s =>
                s.id === sectionId ? { ...s, ...updates } : s
            ),
        });
    };

    const deleteSection = (sectionId: string) => {
        if (!template) return;
        setTemplate({
            ...template,
            sections: template.sections.filter(s => s.id !== sectionId),
        });
        if (selectedSection === sectionId) {
            setSelectedSection(null);
        }
    };

    const moveSection = (sectionId: string, direction: 'up' | 'down') => {
        if (!template) return;
        const index = template.sections.findIndex(s => s.id === sectionId);
        if (index === -1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= template.sections.length) return;

        const sections = [...template.sections];
        [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
        setTemplate({ ...template, sections });
    };

    const duplicateSection = (sectionId: string) => {
        if (!template) return;
        const section = template.sections.find(s => s.id === sectionId);
        if (!section) return;

        const index = template.sections.findIndex(s => s.id === sectionId);
        const newSection: Section = {
            ...section,
            id: `section-${Date.now()}`,
        };

        const sections = [...template.sections];
        sections.splice(index + 1, 0, newSection);
        setTemplate({ ...template, sections });
    };

    const handleDragStart = (e: React.DragEvent, componentId: string) => {
        setDraggedItem(componentId);
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent, index?: number) => {
        e.preventDefault();
        if (draggedItem) {
            addSection(draggedItem, index);
        }
        setDraggedItem(null);
    };

    const filteredComponents = allComponents.filter(c => {
        const matchesSearch = !componentSearch ||
            c.name.toLowerCase().includes(componentSearch.toLowerCase()) ||
            c.description.toLowerCase().includes(componentSearch.toLowerCase());
        const matchesCategory = !selectedCategory || c.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const selectedSectionData = selectedSection
        ? template?.sections.find(s => s.id === selectedSection)
        : null;

    const selectedComponent = selectedSectionData
        ? getComponentById(selectedSectionData.componentId)
        : null;

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!template) return null;

    return (
        <AdminLayout>
            <div className="h-[calc(100vh-64px)] flex flex-col">
                {/* Header */}
                <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard/templates')}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ← Back
                        </button>
                        <div>
                            <input
                                type="text"
                                value={template.name}
                                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                                className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 -ml-2"
                            />
                            <div className="text-sm text-gray-500 px-2">
                                {template.sections.length} sections
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Preview Toggle */}
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className={`px-3 py-1.5 rounded-lg text-sm ${showPreview ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                }`}
                        >
                            {showPreview ? '👁 Preview' : '👁 Preview'}
                        </button>

                        {/* Device Toggle */}
                        {showPreview && (
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
                                    <button
                                        key={device}
                                        onClick={() => setPreviewDevice(device)}
                                        className={`px-2 py-1 rounded text-sm ${previewDevice === device ? 'bg-white shadow' : ''
                                            }`}
                                    >
                                        {device === 'desktop' ? '🖥' : device === 'tablet' ? '📱' : '📱'}
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    Saving...
                                </>
                            ) : (
                                'Save Template'
                            )}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white border-b px-6">
                    <div className="flex gap-6">
                        {[
                            { id: 'builder', label: 'Builder', icon: '🎨' },
                            { id: 'seo', label: 'SEO', icon: '🔍' },
                            { id: 'variables', label: 'Variables', icon: '🔤' },
                            { id: 'settings', label: 'Settings', icon: '⚙️' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-3 border-b-2 transition ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                    {activeTab === 'builder' && (
                        <>
                            {/* Component Palette */}
                            <div className="w-72 bg-gray-50 border-r overflow-y-auto">
                                <div className="p-4 border-b bg-white sticky top-0 z-10">
                                    <input
                                        type="text"
                                        placeholder="Search components..."
                                        value={componentSearch}
                                        onChange={(e) => setComponentSearch(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                    />
                                </div>

                                {/* Categories */}
                                <div className="p-2 border-b bg-white flex flex-wrap gap-1">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`px-2 py-1 text-xs rounded ${!selectedCategory ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
                                            }`}
                                    >
                                        All
                                    </button>
                                    {componentCategories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`px-2 py-1 text-xs rounded ${selectedCategory === cat.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
                                                }`}
                                        >
                                            {cat.icon}
                                        </button>
                                    ))}
                                </div>

                                {/* Components */}
                                <div className="p-2 space-y-1">
                                    {filteredComponents.map((component) => (
                                        <div
                                            key={component.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, component.id)}
                                            onClick={() => addSection(component.id)}
                                            className="bg-white p-3 rounded-lg border cursor-move hover:border-blue-300 hover:shadow-sm transition group"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{component.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm truncate">
                                                        {component.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {component.description}
                                                    </div>
                                                </div>
                                                <span className="text-gray-400 opacity-0 group-hover:opacity-100">+</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Canvas */}
                            <div className="flex-1 bg-gray-100 overflow-y-auto p-6">
                                <div
                                    className={`mx-auto bg-white rounded-xl shadow-lg min-h-[600px] ${showPreview
                                            ? previewDevice === 'mobile'
                                                ? 'w-[375px]'
                                                : previewDevice === 'tablet'
                                                    ? 'w-[768px]'
                                                    : 'w-full max-w-5xl'
                                            : 'max-w-4xl'
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e)}
                                >
                                    {template.sections.length === 0 ? (
                                        <div className="h-96 flex flex-col items-center justify-center text-gray-400">
                                            <div className="text-6xl mb-4">📄</div>
                                            <p className="text-lg mb-2">Drag components here</p>
                                            <p className="text-sm">or click a component to add it</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y">
                                            {template.sections.map((section, index) => {
                                                const component = getComponentById(section.componentId);
                                                if (!component) return null;

                                                return (
                                                    <div
                                                        key={section.id}
                                                        onClick={() => setSelectedSection(section.id)}
                                                        className={`relative group ${selectedSection === section.id
                                                                ? 'ring-2 ring-blue-500 ring-inset'
                                                                : ''
                                                            } ${section.isHidden ? 'opacity-50' : ''}`}
                                                    >
                                                        {/* Section Controls */}
                                                        <div className={`absolute top-2 right-2 flex gap-1 z-10 ${selectedSection === section.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                            } transition`}>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }}
                                                                disabled={index === 0}
                                                                className="p-1 bg-white rounded shadow hover:bg-gray-50 disabled:opacity-30"
                                                            >
                                                                ↑
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }}
                                                                disabled={index === template.sections.length - 1}
                                                                className="p-1 bg-white rounded shadow hover:bg-gray-50 disabled:opacity-30"
                                                            >
                                                                ↓
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }}
                                                                className="p-1 bg-white rounded shadow hover:bg-gray-50"
                                                            >
                                                                📋
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateSection(section.id, { isHidden: !section.isHidden });
                                                                }}
                                                                className="p-1 bg-white rounded shadow hover:bg-gray-50"
                                                            >
                                                                {section.isHidden ? '👁' : '🙈'}
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                                                                className="p-1 bg-white rounded shadow hover:bg-red-50 text-red-500"
                                                            >
                                                                🗑
                                                            </button>
                                                        </div>

                                                        {/* Section Label */}
                                                        <div className={`absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded ${selectedSection === section.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                            } transition`}>
                                                            {component.icon} {component.name}
                                                        </div>

                                                        {/* Section Preview */}
                                                        <SectionPreview
                                                            component={component}
                                                            props={section.props}
                                                            showPreview={showPreview}
                                                        />

                                                        {/* Drop Zone */}
                                                        <div
                                                            onDragOver={handleDragOver}
                                                            onDrop={(e) => { e.stopPropagation(); handleDrop(e, index + 1); }}
                                                            className="absolute -bottom-1 left-0 right-0 h-2 bg-blue-500 opacity-0 hover:opacity-100 transition"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Properties Panel */}
                            <div className="w-80 bg-white border-l overflow-y-auto">
                                {selectedSectionData && selectedComponent ? (
                                    <div>
                                        <div className="p-4 border-b sticky top-0 bg-white z-10">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{selectedComponent.icon}</span>
                                                <div>
                                                    <h3 className="font-semibold">{selectedComponent.name}</h3>
                                                    <p className="text-xs text-gray-500">{selectedComponent.description}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 space-y-4">
                                            <PropertyEditor
                                                props={selectedComponent.props}
                                                values={selectedSectionData.props}
                                                onChange={(newProps) => updateSection(selectedSectionData.id, { props: newProps })}
                                                supportedVariables={selectedComponent.supportedVariables || []}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-400">
                                        <div className="text-4xl mb-4">👈</div>
                                        <p>Select a section to edit its properties</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'seo' && (
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h3 className="font-semibold mb-4">SEO Title Template</h3>
                                    <input
                                        type="text"
                                        value={template.seoTitleTemplate || ''}
                                        onChange={(e) => setTemplate({ ...template, seoTitleTemplate: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="{{page_title}} | {{site_name}}"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        Use variables like {'{{page_title}}'}, {'{{insurance_type}}'}, {'{{state}}'}, {'{{city}}'}
                                    </p>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h3 className="font-semibold mb-4">SEO Description Template</h3>
                                    <textarea
                                        value={template.seoDescTemplate || ''}
                                        onChange={(e) => setTemplate({ ...template, seoDescTemplate: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        rows={3}
                                        placeholder="Compare {{insurance_type}} rates in {{city}}, {{state}}. Get free quotes and save up to {{avg_savings}}."
                                    />
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h3 className="font-semibold mb-4">Available Variables</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {systemVariables.map((v) => (
                                            <div key={v.name} className="bg-gray-50 px-3 py-2 rounded text-sm">
                                                <code className="text-blue-600">{`{{${v.name}}}`}</code>
                                                <p className="text-gray-500 text-xs">{v.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'variables' && (
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="max-w-3xl mx-auto">
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold">Custom Variables</h3>
                                        <button
                                            onClick={() => setTemplate({
                                                ...template,
                                                customVariables: [
                                                    ...(template.customVariables || []),
                                                    { name: '', label: '', type: 'text', required: false, defaultValue: '' }
                                                ]
                                            })}
                                            className="text-blue-600 text-sm"
                                        >
                                            + Add Variable
                                        </button>
                                    </div>

                                    {(!template.customVariables || template.customVariables.length === 0) ? (
                                        <p className="text-gray-500 text-center py-8">
                                            No custom variables defined. Add variables that can be filled from CSV imports.
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
                                            {(template.customVariables || []).map((variable, index) => (
                                                <div key={index} className="border rounded-lg p-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-xs text-gray-500">Variable Name</label>
                                                            <input
                                                                type="text"
                                                                value={variable.name}
                                                                onChange={(e) => {
                                                                    const vars = [...template.customVariables];
                                                                    vars[index].name = e.target.value.replace(/[^a-z0-9_]/gi, '_').toLowerCase();
                                                                    setTemplate({ ...template, customVariables: vars });
                                                                }}
                                                                className="w-full px-3 py-1.5 border rounded text-sm"
                                                                placeholder="custom_field"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-gray-500">Label</label>
                                                            <input
                                                                type="text"
                                                                value={variable.label}
                                                                onChange={(e) => {
                                                                    const vars = [...template.customVariables];
                                                                    vars[index].label = e.target.value;
                                                                    setTemplate({ ...template, customVariables: vars });
                                                                }}
                                                                className="w-full px-3 py-1.5 border rounded text-sm"
                                                                placeholder="Custom Field"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-gray-500">Type</label>
                                                            <select
                                                                value={variable.type}
                                                                onChange={(e) => {
                                                                    const vars = [...template.customVariables];
                                                                    vars[index].type = e.target.value;
                                                                    setTemplate({ ...template, customVariables: vars });
                                                                }}
                                                                className="w-full px-3 py-1.5 border rounded text-sm"
                                                            >
                                                                <option value="text">Text</option>
                                                                <option value="number">Number</option>
                                                                <option value="richtext">Rich Text</option>
                                                                <option value="image">Image URL</option>
                                                                <option value="url">URL</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-gray-500">Default Value</label>
                                                            <input
                                                                type="text"
                                                                value={variable.defaultValue}
                                                                onChange={(e) => {
                                                                    const vars = [...template.customVariables];
                                                                    vars[index].defaultValue = e.target.value;
                                                                    setTemplate({ ...template, customVariables: vars });
                                                                }}
                                                                className="w-full px-3 py-1.5 border rounded text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <label className="flex items-center gap-2 text-sm">
                                                            <input
                                                                type="checkbox"
                                                                checked={variable.required}
                                                                onChange={(e) => {
                                                                    const vars = [...template.customVariables];
                                                                    vars[index].required = e.target.checked;
                                                                    setTemplate({ ...template, customVariables: vars });
                                                                }}
                                                            />
                                                            Required
                                                        </label>
                                                        <button
                                                            onClick={() => {
                                                                const vars = template.customVariables.filter((_, i) => i !== index);
                                                                setTemplate({ ...template, customVariables: vars });
                                                            }}
                                                            className="text-red-500 text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h3 className="font-semibold mb-4">Template Settings</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Slug</label>
                                            <input
                                                type="text"
                                                value={template.slug}
                                                onChange={(e) => setTemplate({ ...template, slug: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Description</label>
                                            <textarea
                                                value={template.description || ''}
                                                onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                                rows={3}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Type</label>
                                            <select
                                                value={template.type}
                                                onChange={(e) => setTemplate({ ...template, type: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            >
                                                <option value="PAGE">Page</option>
                                                <option value="LANDING">Landing Page</option>
                                                <option value="BLOG">Blog Post</option>
                                                <option value="CATEGORY">Category</option>
                                                <option value="CARRIER">Carrier Review</option>
                                                <option value="COMPARISON">Comparison</option>
                                                <option value="CALCULATOR">Calculator</option>
                                                <option value="GUIDE">Guide</option>
                                                <option value="FAQ">FAQ Page</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Layout</label>
                                            <select
                                                value={template.layout}
                                                onChange={(e) => setTemplate({ ...template, layout: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            >
                                                <option value="default">Default</option>
                                                <option value="sidebar-left">Sidebar Left</option>
                                                <option value="sidebar-right">Sidebar Right</option>
                                                <option value="full-width">Full Width</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="isActive"
                                                checked={template.isActive}
                                                onChange={(e) => setTemplate({ ...template, isActive: e.target.checked })}
                                            />
                                            <label htmlFor="isActive">Active</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h3 className="font-semibold mb-4">Custom CSS</h3>
                                    <textarea
                                        value={template.customCss || ''}
                                        onChange={(e) => setTemplate({ ...template, customCss: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
                                        rows={10}
                                        placeholder=".custom-class { color: blue; }"
                                    />
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h3 className="font-semibold mb-4">Custom JavaScript</h3>
                                    <textarea
                                        value={template.customJs || ''}
                                        onChange={(e) => setTemplate({ ...template, customJs: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
                                        rows={10}
                                        placeholder="// Custom JavaScript"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

// Property Editor Component
function PropertyEditor({
    props,
    values,
    onChange,
    supportedVariables
}: {
    props: ComponentProp[];
    values: Record<string, any>;
    onChange: (values: Record<string, any>) => void;
    supportedVariables: string[];
}) {
    const groups = props.reduce((acc, prop) => {
        const group = prop.group || 'General';
        if (!acc[group]) acc[group] = [];
        acc[group].push(prop);
        return acc;
    }, {} as Record<string, ComponentProp[]>);

    const updateValue = (name: string, value: any) => {
        onChange({ ...values, [name]: value });
    };

    const shouldShow = (prop: ComponentProp) => {
        if (!prop.showIf) return true;
        return values[prop.showIf.field] === prop.showIf.value;
    };

    return (
        <div className="space-y-6">
            {Object.entries(groups).map(([group, groupProps]) => (
                <div key={group}>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{group}</h4>
                    <div className="space-y-3">
                        {groupProps.filter(shouldShow).map((prop) => (
                            <div key={prop.name}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {prop.label}
                                    {prop.required && <span className="text-red-500">*</span>}
                                </label>

                                {prop.type === 'text' && (
                                    <input
                                        type="text"
                                        value={values[prop.name] || ''}
                                        onChange={(e) => updateValue(prop.name, e.target.value)}
                                        placeholder={prop.placeholder}
                                        className="w-full px-3 py-1.5 border rounded-lg text-sm"
                                    />
                                )}

                                {prop.type === 'textarea' && (
                                    <textarea
                                        value={values[prop.name] || ''}
                                        onChange={(e) => updateValue(prop.name, e.target.value)}
                                        placeholder={prop.placeholder}
                                        rows={3}
                                        className="w-full px-3 py-1.5 border rounded-lg text-sm"
                                    />
                                )}

                                {prop.type === 'richtext' && (
                                    <textarea
                                        value={values[prop.name] || ''}
                                        onChange={(e) => updateValue(prop.name, e.target.value)}
                                        rows={6}
                                        className="w-full px-3 py-1.5 border rounded-lg text-sm font-mono"
                                    />
                                )}

                                {prop.type === 'number' && (
                                    <input
                                        type="number"
                                        value={values[prop.name] ?? prop.defaultValue ?? ''}
                                        onChange={(e) => updateValue(prop.name, parseFloat(e.target.value))}
                                        min={prop.min}
                                        max={prop.max}
                                        step={prop.step}
                                        className="w-full px-3 py-1.5 border rounded-lg text-sm"
                                    />
                                )}

                                {prop.type === 'boolean' && (
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={values[prop.name] ?? prop.defaultValue ?? false}
                                            onChange={(e) => updateValue(prop.name, e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm text-gray-600">Enable</span>
                                    </label>
                                )}

                                {prop.type === 'select' && (
                                    <select
                                        value={values[prop.name] ?? prop.defaultValue ?? ''}
                                        onChange={(e) => updateValue(prop.name, e.target.value)}
                                        className="w-full px-3 py-1.5 border rounded-lg text-sm"
                                    >
                                        {prop.options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                )}

                                {prop.type === 'color' && (
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={values[prop.name] || prop.defaultValue || '#000000'}
                                            onChange={(e) => updateValue(prop.name, e.target.value)}
                                            className="w-10 h-8 rounded border cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={values[prop.name] || ''}
                                            onChange={(e) => updateValue(prop.name, e.target.value)}
                                            placeholder="#000000"
                                            className="flex-1 px-3 py-1.5 border rounded-lg text-sm"
                                        />
                                    </div>
                                )}

                                {prop.type === 'image' && (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={values[prop.name] || ''}
                                            onChange={(e) => updateValue(prop.name, e.target.value)}
                                            placeholder="Image URL or upload"
                                            className="w-full px-3 py-1.5 border rounded-lg text-sm"
                                        />
                                        {values[prop.name] && (
                                            <img
                                                src={values[prop.name]}
                                                alt=""
                                                className="w-full h-20 object-cover rounded"
                                            />
                                        )}
                                    </div>
                                )}

                                {prop.type === 'url' && (
                                    <input
                                        type="url"
                                        value={values[prop.name] || ''}
                                        onChange={(e) => updateValue(prop.name, e.target.value)}
                                        placeholder="https://"
                                        className="w-full px-3 py-1.5 border rounded-lg text-sm"
                                    />
                                )}

                                {prop.type === 'json' && (
                                    <textarea
                                        value={typeof values[prop.name] === 'object'
                                            ? JSON.stringify(values[prop.name], null, 2)
                                            : values[prop.name] || ''}
                                        onChange={(e) => {
                                            try {
                                                updateValue(prop.name, JSON.parse(e.target.value));
                                            } catch {
                                                // Invalid JSON, keep as string
                                            }
                                        }}
                                        rows={4}
                                        className="w-full px-3 py-1.5 border rounded-lg text-sm font-mono"
                                    />
                                )}

                                {prop.type === 'array' && prop.arrayItemSchema && (
                                    <ArrayEditor
                                        items={values[prop.name] || []}
                                        schema={prop.arrayItemSchema}
                                        onChange={(items) => updateValue(prop.name, items)}
                                    />
                                )}

                                {prop.description && (
                                    <p className="text-xs text-gray-500 mt-1">{prop.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Array Editor Component
function ArrayEditor({
    items,
    schema,
    onChange,
}: {
    items: any[];
    schema: ComponentProp[];
    onChange: (items: any[]) => void;
}) {
    const addItem = () => {
        const newItem: Record<string, any> = {};
        schema.forEach(prop => {
            newItem[prop.name] = prop.defaultValue ?? '';
        });
        onChange([...items, newItem]);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onChange(newItems);
    };

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= items.length) return;
        const newItems = [...items];
        [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
        onChange(newItems);
    };

    return (
        <div className="space-y-2">
            {items.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Item {index + 1}</span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => moveItem(index, 'up')}
                                disabled={index === 0}
                                className="text-xs px-1 disabled:opacity-30"
                            >
                                ↑
                            </button>
                            <button
                                onClick={() => moveItem(index, 'down')}
                                disabled={index === items.length - 1}
                                className="text-xs px-1 disabled:opacity-30"
                            >
                                ↓
                            </button>
                            <button
                                onClick={() => removeItem(index)}
                                className="text-xs text-red-500 px-1"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                    {schema.map(prop => (
                        <div key={prop.name}>
                            <label className="text-xs text-gray-600">{prop.label}</label>
                            {prop.type === 'text' && (
                                <input
                                    type="text"
                                    value={item[prop.name] || ''}
                                    onChange={(e) => updateItem(index, prop.name, e.target.value)}
                                    className="w-full px-2 py-1 border rounded text-sm"
                                />
                            )}
                            {prop.type === 'textarea' && (
                                <textarea
                                    value={item[prop.name] || ''}
                                    onChange={(e) => updateItem(index, prop.name, e.target.value)}
                                    rows={2}
                                    className="w-full px-2 py-1 border rounded text-sm"
                                />
                            )}
                            {prop.type === 'image' && (
                                <input
                                    type="text"
                                    value={item[prop.name] || ''}
                                    onChange={(e) => updateItem(index, prop.name, e.target.value)}
                                    placeholder="Image URL"
                                    className="w-full px-2 py-1 border rounded text-sm"
                                />
                            )}
                            {prop.type === 'url' && (
                                <input
                                    type="url"
                                    value={item[prop.name] || ''}
                                    onChange={(e) => updateItem(index, prop.name, e.target.value)}
                                    placeholder="https://"
                                    className="w-full px-2 py-1 border rounded text-sm"
                                />
                            )}
                            {prop.type === 'number' && (
                                <input
                                    type="number"
                                    value={item[prop.name] ?? ''}
                                    onChange={(e) => updateItem(index, prop.name, parseFloat(e.target.value))}
                                    className="w-full px-2 py-1 border rounded text-sm"
                                />
                            )}
                            {prop.type === 'select' && (
                                <select
                                    value={item[prop.name] || ''}
                                    onChange={(e) => updateItem(index, prop.name, e.target.value)}
                                    className="w-full px-2 py-1 border rounded text-sm"
                                >
                                    <option value="">Select...</option>
                                    {prop.options?.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    ))}
                </div>
            ))}
            <button
                onClick={addItem}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm hover:border-blue-400 hover:text-blue-500"
            >
                + Add Item
            </button>
        </div>
    );
}

// Section Preview Component
function SectionPreview({
    component,
    props,
    showPreview
}: {
    component: ComponentDefinition;
    props: Record<string, any>;
    showPreview: boolean;
}) {
    // Simple preview renderers for each component type
    const renderPreview = () => {
        switch (component.category) {
            case 'hero':
                return (
                    <div
                        className="py-16 px-8 text-center"
                        style={{
                            background: props.backgroundType === 'gradient'
                                ? `linear-gradient(135deg, ${props.gradientFrom || '#0f172a'}, ${props.gradientTo || '#1e3a5f'})`
                                : props.backgroundColor || '#0f172a',
                            color: props.textColor || '#ffffff',
                        }}
                    >
                        <h1 className="text-3xl font-bold mb-4">{props.title || 'Hero Title'}</h1>
                        <p className="text-lg opacity-80 mb-6">{props.subtitle || 'Hero subtitle goes here'}</p>
                        {props.primaryCta && (
                            <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold">
                                {props.primaryCta}
                            </button>
                        )}
                    </div>
                );

            case 'content':
                if (component.id === 'content-accordion') {
                    return (
                        <div className="py-12 px-8">
                            {props.title && <h2 className="text-2xl font-bold mb-6">{props.title}</h2>}
                            <div className="space-y-2">
                                {(props.items || []).slice(0, 3).map((item: any, i: number) => (
                                    <div key={i} className="border rounded-lg p-4">
                                        <div className="font-medium">{item.question || `Question ${i + 1}`}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="py-12 px-8">
                        <div className="prose max-w-none">
                            {props.content || props.title || 'Content block'}
                        </div>
                    </div>
                );

            case 'cta':
                return (
                    <div
                        className="py-12 px-8 text-center"
                        style={{
                            backgroundColor: props.backgroundColor || '#0f172a',
                            color: props.textColor || '#ffffff',
                        }}
                    >
                        <h2 className="text-2xl font-bold mb-4">{props.title || 'Call to Action'}</h2>
                        <p className="opacity-80 mb-6">{props.subtitle || 'Take action now'}</p>
                        <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold">
                            {props.primaryCta || props.ctaText || 'Get Started'}
                        </button>
                    </div>
                );

            case 'features':
                return (
                    <div className="py-12 px-8">
                        {props.title && <h2 className="text-2xl font-bold mb-8 text-center">{props.title}</h2>}
                        <div className={`grid grid-cols-${props.columns || 3} gap-6`}>
                            {(props.features || props.steps || []).slice(0, 3).map((item: any, i: number) => (
                                <div key={i} className="bg-gray-50 p-6 rounded-lg text-center">
                                    <div className="text-3xl mb-3">{item.icon || '✨'}</div>
                                    <h3 className="font-semibold mb-2">{item.title || `Feature ${i + 1}`}</h3>
                                    <p className="text-sm text-gray-600">{item.description || 'Description'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'social':
                if (component.id === 'carrier-logos') {
                    return (
                        <div className="py-8 px-8">
                            <p className="text-center text-gray-500 mb-4">{props.title || 'Compare Top Carriers'}</p>
                            <div className="flex justify-center gap-8 opacity-50">
                                {['GEICO', 'State Farm', 'Progressive', 'Allstate'].map((name) => (
                                    <div key={name} className="text-gray-400 font-semibold">{name}</div>
                                ))}
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="py-12 px-8">
                        {props.title && <h2 className="text-2xl font-bold mb-6 text-center">{props.title}</h2>}
                        <div className="grid grid-cols-3 gap-4">
                            {(props.testimonials || []).slice(0, 3).map((t: any, i: number) => (
                                <div key={i} className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm italic mb-2">&quot;{t.quote || 'Great service!'}&quot;</p>
                                    <p className="text-xs text-gray-500">- {t.author || 'Customer'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'form':
                return (
                    <div className="py-12 px-8 bg-gray-50">
                        <div className="max-w-md mx-auto">
                            <h2 className="text-xl font-bold mb-4">{props.title || 'Get a Quote'}</h2>
                            <div className="space-y-3">
                                <div className="bg-white border rounded-lg p-3 text-gray-400">Name</div>
                                <div className="bg-white border rounded-lg p-3 text-gray-400">Email</div>
                                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
                                    {props.submitText || props.buttonText || 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'utility':
                if (component.id === 'spacer') {
                    const heights = { xs: 8, sm: 16, md: 32, lg: 48, xl: 64 };
                    return (
                        <div
                            className="bg-gray-100 flex items-center justify-center text-gray-400 text-xs"
                            style={{ height: heights[props.height as keyof typeof heights] || 32 }}
                        >
                            Spacer ({props.height || 'md'})
                        </div>
                    );
                }
                if (component.id === 'divider') {
                    return (
                        <div className="py-4 px-8">
                            <hr style={{
                                borderStyle: props.style || 'solid',
                                borderColor: props.color || '#e5e7eb',
                                borderWidth: `${props.thickness || 1}px 0 0 0`,
                            }} />
                        </div>
                    );
                }
                return (
                    <div className="py-8 px-8 bg-gray-50 text-center text-gray-500">
                        {component.name}
                    </div>
                );

            default:
                return (
                    <div className="py-12 px-8 bg-gray-50 text-center">
                        <div className="text-4xl mb-2">{component.icon}</div>
                        <div className="text-gray-500">{component.name}</div>
                    </div>
                );
        }
    };

    return renderPreview();
}
