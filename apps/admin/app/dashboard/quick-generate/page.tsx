'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getApiUrl } from '@/lib/api';
import { GENERATION_PRESETS, GenerationPreset } from '@/lib/presets';

interface InsuranceType {
    id: string;
    name: string;
    slug: string;
}

interface State {
    id: string;
    name: string;
    slug: string;
    code: string;
}

interface JobStatus {
    total: number;
    processed: number;
    created: number;
    updated: number;
    skipped: number;
    failed: number;
    status: string;
}

interface Template {
    id: string;
    name: string;
    category: string;
}

// Built-in HTML templates
const BUILT_IN_TEMPLATES: Template[] = [
    { id: 'state-page', name: 'State Page', category: 'state' },
    { id: 'city-page', name: 'City Page', category: 'city' },
    { id: 'comparison', name: 'Comparison', category: 'comparison' },
    { id: 'guide', name: 'Guide/FAQ', category: 'guide' },
    { id: 'landing', name: 'Landing Page', category: 'landing' },
];

function QuickGenerateContent() {
    const searchParams = useSearchParams();
    const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [templates, setTemplates] = useState<Template[]>(BUILT_IN_TEMPLATES);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [currentJob, setCurrentJob] = useState<{ id: string; status: JobStatus } | null>(null);

    // Quick action form state
    const [selectedInsuranceType, setSelectedInsuranceType] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(searchParams?.get('template') || 'state-page');
    const [selectedPreset, setSelectedPreset] = useState<GenerationPreset | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [typesRes, statesRes, templatesRes] = await Promise.all([
                fetch(getApiUrl('/api/insurance-types')),
                fetch(getApiUrl('/api/states')),
                fetch(getApiUrl('/api/templates')),
            ]);

            const [typesData, statesData, templatesData] = await Promise.all([
                typesRes.json(),
                statesRes.json(),
                templatesRes.json(),
            ]);

            setInsuranceTypes(Array.isArray(typesData) ? typesData : []);
            setStates(Array.isArray(statesData) ? statesData : []);

            // Combine built-in + custom templates
            const customTemplates = Array.isArray(templatesData) ? templatesData : [];
            setTemplates([...BUILT_IN_TEMPLATES, ...customTemplates]);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const executeQuickGenerate = async (preset: GenerationPreset) => {
        if (preset.requiresInsuranceType && !selectedInsuranceType) {
            alert('Please select an insurance type first');
            return;
        }
        if (preset.requiresState && !selectedState) {
            alert('Please select a state first');
            return;
        }

        setGenerating(true);
        setSelectedPreset(preset);

        try {
            const res = await fetch(getApiUrl('/api/quick-generate'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: preset.action,
                    insuranceTypeId: selectedInsuranceType || undefined,
                    stateId: selectedState || undefined,
                    templateId: selectedTemplate,
                    options: {
                        publishOnCreate: true,
                        skipExisting: true,
                    },
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to start generation');
            }

            const data = await res.json();
            pollJobStatus(data.jobId);
        } catch (error: any) {
            alert(error.message);
            setGenerating(false);
        }
    };

    const pollJobStatus = async (jobId: string) => {
        const poll = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/quick-generate/status/${jobId}`));
                const status = await res.json();

                setCurrentJob({ id: jobId, status });

                if (status.status === 'PROCESSING' || status.status === 'QUEUED') {
                    setTimeout(poll, 1000);
                } else {
                    setGenerating(false);
                }
            } catch (error) {
                setGenerating(false);
            }
        };

        poll();
    };

    const resetGenerator = () => {
        setCurrentJob(null);
        setSelectedPreset(null);
        setGenerating(false);
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">⚡ Quick Generate</h1>
                    <p className="text-gray-600 mt-1">Generate thousands of pages with one click</p>
                </div>

                {/* Quick Selection Bar */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-8 text-white">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium mb-2 text-blue-100">Insurance Type</label>
                            <select
                                value={selectedInsuranceType}
                                onChange={(e) => setSelectedInsuranceType(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                disabled={generating}
                            >
                                <option value="">All Insurance Types</option>
                                {insuranceTypes.map((type) => (
                                    <option key={type.id} value={type.id} className="text-gray-900">
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium mb-2 text-blue-100">State (Optional)</label>
                            <select
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                disabled={generating}
                            >
                                <option value="">All States</option>
                                {states.map((state) => (
                                    <option key={state.id} value={state.id} className="text-gray-900">
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium mb-2 text-blue-100">Template</label>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => setSelectedTemplate(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                disabled={generating}
                            >
                                {templates.map((template: Template) => (
                                    <option key={template.id} value={template.id} className="text-gray-900">
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Job Progress */}
                {currentJob && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {generating ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                ) : currentJob.status.status === 'COMPLETED' ? (
                                    <span className="text-2xl">✅</span>
                                ) : currentJob.status.status === 'FAILED' ? (
                                    <span className="text-2xl">❌</span>
                                ) : null}
                                <div>
                                    <h3 className="font-semibold">
                                        {selectedPreset?.name || 'Processing'}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {currentJob.status.status === 'COMPLETED'
                                            ? 'Generation complete!'
                                            : currentJob.status.status === 'FAILED'
                                                ? 'Generation failed'
                                                : 'Generating pages...'}
                                    </p>
                                </div>
                            </div>
                            {!generating && (
                                <button
                                    onClick={resetGenerator}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕ Close
                                </button>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-500 mb-2">
                                <span>Progress</span>
                                <span>{currentJob.status.processed} / {currentJob.status.total}</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${currentJob.status.status === 'COMPLETED' ? 'bg-green-500' :
                                        currentJob.status.status === 'FAILED' ? 'bg-red-500' :
                                            'bg-blue-600'
                                        }`}
                                    style={{
                                        width: `${currentJob.status.total > 0
                                            ? (currentJob.status.processed / currentJob.status.total) * 100
                                            : 0}%`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-green-50 p-3 rounded-lg text-center">
                                <div className="text-xl font-bold text-green-600">{currentJob.status.created}</div>
                                <div className="text-xs text-green-700">Created</div>
                            </div>
                            <div className="bg-yellow-50 p-3 rounded-lg text-center">
                                <div className="text-xl font-bold text-yellow-600">{currentJob.status.updated}</div>
                                <div className="text-xs text-yellow-700">Updated</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg text-center">
                                <div className="text-xl font-bold text-gray-600">{currentJob.status.skipped}</div>
                                <div className="text-xs text-gray-700">Skipped</div>
                            </div>
                            <div className="bg-red-50 p-3 rounded-lg text-center">
                                <div className="text-xl font-bold text-red-600">{currentJob.status.failed}</div>
                                <div className="text-xs text-red-700">Failed</div>
                            </div>
                        </div>

                        {currentJob.status.status === 'COMPLETED' && (
                            <div className="mt-4 text-center">
                                <a
                                    href="/dashboard/pages"
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    View generated pages →
                                </a>
                            </div>
                        )}
                    </div>
                )}

                {/* Preset Cards */}
                <h2 className="text-xl font-semibold mb-4">🚀 One-Click Presets</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {GENERATION_PRESETS.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => executeQuickGenerate(preset)}
                            disabled={generating || (preset.requiresInsuranceType && !selectedInsuranceType)}
                            className={`text-left p-6 rounded-xl border-2 transition hover:shadow-lg ${generating
                                ? 'opacity-50 cursor-not-allowed border-gray-200'
                                : preset.requiresInsuranceType && !selectedInsuranceType
                                    ? 'opacity-50 border-gray-200'
                                    : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                                }`}
                        >
                            <div className="text-3xl mb-3">{preset.icon}</div>
                            <h3 className="font-semibold mb-1">{preset.name}</h3>
                            <p className="text-sm text-gray-500 mb-3">{preset.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    {preset.estimatedPages}
                                </span>
                                {preset.requiresInsuranceType && !selectedInsuranceType && (
                                    <span className="text-xs text-orange-500">
                                        Select type first
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                {/* State-Specific Generator */}
                {selectedState && selectedInsuranceType && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <h3 className="font-semibold mb-4">🎯 Generate for {states.find(s => s.id === selectedState)?.name}</h3>
                        <button
                            onClick={() => executeQuickGenerate({
                                id: 'state-cities',
                                name: 'Cities in Selected State',
                                description: 'Generate pages for all cities in the selected state',
                                icon: '📍',
                                estimatedPages: '500-2000',
                                action: 'STATE_CITIES',
                                requiresInsuranceType: true,
                                requiresState: true,
                            })}
                            disabled={generating}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Generate All Cities in {states.find(s => s.id === selectedState)?.name}
                        </button>
                    </div>
                )}

                {/* Advanced Options Link */}
                <div className="text-center text-gray-500">
                    Need more control?{' '}
                    <a href="/dashboard/bulk-generate" className="text-blue-600 hover:underline">
                        Use Advanced Bulk Generation →
                    </a>
                </div>
            </div>
        </AdminLayout>
    );
}

export default function QuickGeneratePage() {
    return (
        <Suspense fallback={
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        }>
            <QuickGenerateContent />
        </Suspense>
    );
}
