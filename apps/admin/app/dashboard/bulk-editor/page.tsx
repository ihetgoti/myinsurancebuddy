'use client';

import { useState, useEffect } from 'react';
import { Wand2, Eye, Save, RefreshCw, ChevronDown, DollarSign, Type, FileText } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface InsuranceType {
    id: string;
    name: string;
    slug: string;
}

interface State {
    id: string;
    name: string;
    code: string;
}

interface TemplateVariable {
    name: string;
    description: string;
}

interface PresetTemplate {
    label: string;
    template: string;
}

interface BulkUpdateConfig {
    templateVariables: TemplateVariable[];
    presetTemplates: {
        titles: PresetTemplate[];
        subtitles: PresetTemplate[];
    };
    filters: {
        insuranceTypes: InsuranceType[];
        states: State[];
        geoLevels: string[];
    };
    stats: {
        statePages: number;
        cityPages: number;
        publishedPages: number;
        draftPages: number;
    };
}

interface PreviewItem {
    id: string;
    slug: string;
    current: {
        title: string | null;
        subtitle: string | null;
        customData: any;
    };
    updated: {
        title?: string;
        subtitle?: string;
        customData?: any;
    };
    variables: Record<string, string>;
}

export default function BulkEditorPage() {
    const [config, setConfig] = useState<BulkUpdateConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Filters
    const [insuranceTypeId, setInsuranceTypeId] = useState('');
    const [stateId, setStateId] = useState('');
    const [geoLevel, setGeoLevel] = useState('');
    const [isPublished, setIsPublished] = useState<string>('');

    // Update templates
    const [titleTemplate, setTitleTemplate] = useState('');
    const [subtitleTemplate, setSubtitleTemplate] = useState('');
    const [avgPremium, setAvgPremium] = useState('');

    // Preview
    const [preview, setPreview] = useState<PreviewItem[]>([]);
    const [previewCount, setPreviewCount] = useState(0);
    const [showPreview, setShowPreview] = useState(false);

    // Result
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/pages/bulk-update');
            const data = await res.json();
            setConfig(data);
        } catch (error) {
            console.error('Failed to fetch config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async () => {
        setUpdating(true);
        setResult(null);

        try {
            const filters: any = {};
            if (insuranceTypeId) filters.insuranceTypeId = insuranceTypeId;
            if (stateId) filters.stateId = stateId;
            if (geoLevel) filters.geoLevel = geoLevel;
            if (isPublished !== '') filters.isPublished = isPublished === 'true';

            const updates: any = {};
            if (titleTemplate) updates.title = titleTemplate;
            if (subtitleTemplate) updates.subtitle = subtitleTemplate;
            if (avgPremium) {
                updates.customData = { avg_premium: avgPremium };
            }

            const res = await fetch('/api/pages/bulk-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filters,
                    updates,
                    dryRun: true,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setPreview(data.preview || []);
                setPreviewCount(data.totalPages);
                setShowPreview(true);
            } else {
                alert(`Error: ${data.message || data.error}`);
            }
        } catch (error: any) {
            alert(`Failed to preview: ${error.message}`);
        } finally {
            setUpdating(false);
        }
    };

    const handleApply = async () => {
        if (!confirm(`Are you sure you want to update ${previewCount} pages? This cannot be undone.`)) {
            return;
        }

        setUpdating(true);
        setResult(null);

        try {
            const filters: any = {};
            if (insuranceTypeId) filters.insuranceTypeId = insuranceTypeId;
            if (stateId) filters.stateId = stateId;
            if (geoLevel) filters.geoLevel = geoLevel;
            if (isPublished !== '') filters.isPublished = isPublished === 'true';

            const updates: any = {};
            if (titleTemplate) updates.title = titleTemplate;
            if (subtitleTemplate) updates.subtitle = subtitleTemplate;
            if (avgPremium) {
                updates.customData = { avg_premium: avgPremium };
            }

            const res = await fetch('/api/pages/bulk-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filters,
                    updates,
                    dryRun: false,
                }),
            });

            const data = await res.json();
            setResult(data);

            if (data.success) {
                alert(`Successfully updated ${data.updated} pages!`);
                setShowPreview(false);
            } else {
                alert(`Error: ${data.message || data.error}`);
            }
        } catch (error: any) {
            alert(`Failed to apply: ${error.message}`);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Wand2 className="w-7 h-7 text-purple-600" />
                            Bulk Page Editor
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Update titles, subtitles, and pricing across multiple pages with one click
                        </p>
                    </div>
                </div>

                {/* Stats */}
                {config?.stats && (
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg border p-4">
                            <p className="text-sm text-gray-500">State Pages</p>
                            <p className="text-2xl font-bold">{config.stats.statePages}</p>
                        </div>
                        <div className="bg-white rounded-lg border p-4">
                            <p className="text-sm text-gray-500">City Pages</p>
                            <p className="text-2xl font-bold">{config.stats.cityPages}</p>
                        </div>
                        <div className="bg-white rounded-lg border p-4">
                            <p className="text-sm text-gray-500">Published</p>
                            <p className="text-2xl font-bold text-green-600">{config.stats.publishedPages}</p>
                        </div>
                        <div className="bg-white rounded-lg border p-4">
                            <p className="text-sm text-gray-500">Drafts</p>
                            <p className="text-2xl font-bold text-orange-600">{config.stats.draftPages}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                    {/* Left: Filters & Templates */}
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="bg-white rounded-lg border p-6">
                            <h2 className="font-semibold text-gray-900 mb-4">Select Pages</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Insurance Type
                                    </label>
                                    <select
                                        value={insuranceTypeId}
                                        onChange={(e) => setInsuranceTypeId(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option value="">All Types</option>
                                        {config?.filters.insuranceTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State
                                    </label>
                                    <select
                                        value={stateId}
                                        onChange={(e) => setStateId(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option value="">All States</option>
                                        {config?.filters.states.map((state) => (
                                            <option key={state.id} value={state.id}>
                                                {state.name} ({state.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Geo Level
                                    </label>
                                    <select
                                        value={geoLevel}
                                        onChange={(e) => setGeoLevel(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option value="">All Levels</option>
                                        {config?.filters.geoLevels.map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={isPublished}
                                        onChange={(e) => setIsPublished(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option value="">All</option>
                                        <option value="true">Published Only</option>
                                        <option value="false">Drafts Only</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Templates */}
                        <div className="bg-white rounded-lg border p-6">
                            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Type className="w-5 h-5" />
                                Update Content
                            </h2>

                            <div className="space-y-4">
                                {/* Title Template */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hero Title Template
                                    </label>
                                    <input
                                        type="text"
                                        value={titleTemplate}
                                        onChange={(e) => setTitleTemplate(e.target.value)}
                                        placeholder="e.g., Cheapest {{niche}} in {{location}}"
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                    {config?.presetTemplates.titles && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {config.presetTemplates.titles.map((preset) => (
                                                <button
                                                    key={preset.label}
                                                    onClick={() => setTitleTemplate(preset.template)}
                                                    className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                                                >
                                                    {preset.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Subtitle Template */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subtitle Template
                                    </label>
                                    <input
                                        type="text"
                                        value={subtitleTemplate}
                                        onChange={(e) => setSubtitleTemplate(e.target.value)}
                                        placeholder="e.g., Compare quotes in {{location}}"
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                    {config?.presetTemplates.subtitles && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {config.presetTemplates.subtitles.map((preset) => (
                                                <button
                                                    key={preset.label}
                                                    onClick={() => setSubtitleTemplate(preset.template)}
                                                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                                >
                                                    {preset.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Avg Premium */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                        <DollarSign className="w-4 h-4" />
                                        Average Premium
                                    </label>
                                    <input
                                        type="text"
                                        value={avgPremium}
                                        onChange={(e) => setAvgPremium(e.target.value)}
                                        placeholder="e.g., $1,500/year or $125/month"
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Leave empty to keep existing values
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={handlePreview}
                                    disabled={updating || (!titleTemplate && !subtitleTemplate && !avgPremium)}
                                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    Preview Changes
                                </button>
                                <button
                                    onClick={handleApply}
                                    disabled={updating || !showPreview || previewCount === 0}
                                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {updating ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    Apply to {previewCount} Pages
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Variables & Preview */}
                    <div className="space-y-6">
                        {/* Template Variables */}
                        <div className="bg-white rounded-lg border p-6">
                            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Available Variables
                            </h2>
                            <div className="space-y-2">
                                {config?.templateVariables.map((variable) => (
                                    <div key={variable.name} className="flex items-start gap-2 text-sm">
                                        <code className="px-2 py-0.5 bg-gray-100 rounded text-purple-600 font-mono">
                                            {variable.name}
                                        </code>
                                        <span className="text-gray-600">{variable.description}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Preview */}
                        {showPreview && preview.length > 0 && (
                            <div className="bg-white rounded-lg border p-6">
                                <h2 className="font-semibold text-gray-900 mb-4">
                                    Preview ({previewCount} pages will be updated)
                                </h2>
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {preview.map((item) => (
                                        <div key={item.id} className="border rounded-lg p-3 text-sm">
                                            <p className="font-medium text-gray-900 mb-2">{item.slug}</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">Current</p>
                                                    {item.current.title && (
                                                        <p className="text-gray-600">{item.current.title}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-green-600 uppercase">New</p>
                                                    {item.updated.title && (
                                                        <p className="text-green-700 font-medium">{item.updated.title}</p>
                                                    )}
                                                    {item.updated.subtitle && (
                                                        <p className="text-green-600 text-xs">{item.updated.subtitle}</p>
                                                    )}
                                                    {item.updated.customData?.avg_premium && (
                                                        <p className="text-green-600 text-xs">
                                                            Premium: {item.updated.customData.avg_premium}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {previewCount > 10 && (
                                        <p className="text-center text-gray-500 text-sm">
                                            ... and {previewCount - 10} more pages
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Result */}
                        {result && (
                            <div className={`rounded-lg border p-6 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <h2 className={`font-semibold mb-2 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                                    {result.success ? 'Update Complete!' : 'Update Failed'}
                                </h2>
                                {result.success && (
                                    <p className="text-green-700">
                                        Successfully updated {result.updated} of {result.totalPages} pages.
                                    </p>
                                )}
                                {result.errors && result.errors.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-red-700 font-medium">Errors:</p>
                                        <ul className="text-sm text-red-600 list-disc list-inside">
                                            {result.errors.slice(0, 5).map((err: string, i: number) => (
                                                <li key={i}>{err}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
