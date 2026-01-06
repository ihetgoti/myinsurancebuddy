'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

// Sample data for preview
const SAMPLE_DATA: Record<string, Record<string, string>> = {
    'state-page': {
        state: 'California',
        state_abbr: 'CA',
        insurance_type: 'Car Insurance',
        year: '2024',
        avg_rate: '$145',
        min_rate: '$89',
        population: '39,538,223',
    },
    'city-page': {
        city: 'Los Angeles',
        state: 'California',
        state_abbr: 'CA',
        insurance_type: 'Car Insurance',
        year: '2024',
        avg_rate: '$165',
        population: '3,898,747',
        zip_codes: '90001, 90002, 90003, 90004, 90005',
    },
    'comparison': {
        title: 'Best Car Insurance Companies',
        insurance_type: 'Car Insurance',
        year: '2024',
        description: 'Compare the top car insurance companies side by side to find the best coverage for your needs.',
    },
    'guide': {
        title: 'Complete Guide to Car Insurance',
        insurance_type: 'Car Insurance',
        year: '2024',
        description: 'Everything you need to know about car insurance, from coverage types to saving tips.',
    },
    'landing': {
        title: 'Save Up to 40% on Car Insurance',
        subtitle: 'Compare quotes from 50+ top insurers in under 2 minutes.',
        insurance_type: 'Car Insurance',
        cta_text: 'Get Free Quotes →',
    },
};

function PreviewContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const templateId = searchParams.get('id') || 'state-page';

    const [previewHtml, setPreviewHtml] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [customData, setCustomData] = useState<Record<string, string>>(SAMPLE_DATA[templateId] || {});

    useEffect(() => {
        loadPreview();
    }, [templateId, customData]);

    const loadPreview = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/templates/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    templateId,
                    context: customData,
                    options: { preview: true },
                }),
            });
            const data = await res.json();
            setPreviewHtml(data.html || '<p>Failed to render template</p>');
        } catch (error) {
            setPreviewHtml('<p>Error loading preview</p>');
        } finally {
            setLoading(false);
        }
    };

    const deviceWidths = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px',
    };

    return (
        <AdminLayout>
            <div className="h-[calc(100vh-64px)] flex flex-col">
                {/* Toolbar */}
                <div className="bg-white border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            ← Back
                        </button>
                        <h1 className="font-semibold text-gray-900">
                            Template Preview: {templateId}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Device Toggles */}
                        <div className="flex rounded-lg overflow-hidden border">
                            {(['desktop', 'tablet', 'mobile'] as const).map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDevice(d)}
                                    className={`px-3 py-1.5 text-sm ${device === d
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {d === 'desktop' ? '🖥️' : d === 'tablet' ? '📱' : '📱'}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => router.push(`/dashboard/bulk-generate?template=${templateId}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Use This Template
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Preview Panel */}
                    <div className="flex-1 bg-gray-100 p-4 overflow-auto">
                        <div
                            className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
                            style={{
                                width: deviceWidths[device],
                                maxWidth: '100%',
                                minHeight: '100%',
                            }}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center h-96">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <iframe
                                    srcDoc={previewHtml}
                                    className="w-full h-full min-h-[800px] border-0"
                                    title="Template Preview"
                                />
                            )}
                        </div>
                    </div>

                    {/* Data Panel */}
                    <div className="w-80 bg-white border-l p-4 overflow-auto flex-shrink-0">
                        <h3 className="font-semibold text-gray-900 mb-4">Sample Data</h3>
                        <p className="text-gray-500 text-sm mb-4">
                            Edit values to see how the template looks with different data.
                        </p>

                        <div className="space-y-4">
                            {Object.entries(customData).map(([key, value]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {`{{${key}}}`}
                                    </label>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => setCustomData({ ...customData, [key]: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={loadPreview}
                            className="w-full mt-6 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                        >
                            Refresh Preview
                        </button>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Template Info</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Includes ad placements</li>
                                <li>• SEO schema markup</li>
                                <li>• Mobile responsive</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default function TemplatePreviewPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
            <PreviewContent />
        </Suspense>
    );
}
