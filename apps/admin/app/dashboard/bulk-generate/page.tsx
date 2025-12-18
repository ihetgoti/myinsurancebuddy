'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState, useRef } from 'react';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';

interface Template {
    id: string;
    name: string;
    slug: string;
    sections: any[];
    customVariables?: any[];
}

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

interface PreviewPage {
    title: string;
    url: string;
    variables: Record<string, string>;
    sampleContent: string;
}

type GeoLevel = 'NICHE' | 'COUNTRY' | 'STATE' | 'CITY';

const STEPS = ['Select Template', 'Geo Scope', 'CSV Data', 'Preview', 'Generate'];

export default function BulkGeneratePage() {
    const [step, setStep] = useState(0);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [selectedInsuranceType, setSelectedInsuranceType] = useState<string>('');
    const [geoLevel, setGeoLevel] = useState<GeoLevel>('STATE');
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>('');
    const [csvData, setCsvData] = useState<any[]>([]);
    const [csvColumns, setCsvColumns] = useState<string[]>([]);
    const [variableMapping, setVariableMapping] = useState<Record<string, string>>({});
    const [publishOnCreate, setPublishOnCreate] = useState(false);
    const [skipExisting, setSkipExisting] = useState(true);

    // Preview state
    const [previewData, setPreviewData] = useState<{
        totalPages: number;
        previewPages: PreviewPage[];
        template: any;
    } | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);

    // Execution state
    const [executing, setExecuting] = useState(false);
    const [jobResult, setJobResult] = useState<{
        success: boolean;
        createdPages: number;
        skippedPages: number;
    } | null>(null);
    const [error, setError] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedCountry) {
            fetchStates(selectedCountry);
        }
    }, [selectedCountry]);

    const fetchInitialData = async () => {
        try {
            const [templatesRes, typesRes, countriesRes] = await Promise.all([
                fetch(getApiUrl('/api/templates')),
                fetch(getApiUrl('/api/insurance-types')),
                fetch(getApiUrl('/api/countries')),
            ]);

            const [templatesData, typesData, countriesData] = await Promise.all([
                templatesRes.json(),
                typesRes.json(),
                countriesRes.json(),
            ]);

            setTemplates(Array.isArray(templatesData) ? templatesData : []);
            setInsuranceTypes(Array.isArray(typesData) ? typesData : []);
            setCountries(Array.isArray(countriesData) ? countriesData : []);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStates = async (countryId: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/states?countryId=${countryId}`));
            const data = await res.json();
            setStates(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch states:', err);
        }
    };

    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim());
            if (lines.length < 2) {
                setError('CSV must have header row and at least one data row');
                return;
            }

            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            const rows = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const row: Record<string, string> = {};
                headers.forEach((header, i) => {
                    row[header] = values[i] || '';
                });
                return row;
            });

            setCsvColumns(headers);
            setCsvData(rows);

            // Auto-map common columns
            const autoMapping: Record<string, string> = {};
            headers.forEach(col => {
                if (['state', 'city', 'country'].includes(col)) {
                    autoMapping[col] = col;
                }
            });
            setVariableMapping(autoMapping);
        };
        reader.readAsText(file);
    };

    const handlePreview = async () => {
        setPreviewLoading(true);
        setError('');

        try {
            const res = await fetch(getApiUrl('/api/bulk-generate/preview'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    templateId: selectedTemplate,
                    insuranceTypeId: selectedInsuranceType,
                    geoLevel,
                    countryId: selectedCountry || null,
                    stateId: selectedState || null,
                    csvData,
                    variableMapping,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Preview failed');
            }

            const data = await res.json();
            setPreviewData(data);
            setStep(3);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleExecute = async () => {
        setExecuting(true);
        setError('');

        try {
            // First create the job
            const createRes = await fetch(getApiUrl('/api/bulk-generate'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    templateId: selectedTemplate,
                    insuranceTypeId: selectedInsuranceType,
                    geoLevel,
                    countryId: selectedCountry || null,
                    stateId: selectedState || null,
                    csvData: csvData.length > 0 ? csvData : null,
                    variableMapping: Object.keys(variableMapping).length > 0 ? variableMapping : null,
                    publishOnCreate,
                    skipExisting,
                }),
            });

            if (!createRes.ok) {
                const data = await createRes.json();
                throw new Error(data.error || 'Failed to create job');
            }

            const job = await createRes.json();

            // Then execute it
            const execRes = await fetch(getApiUrl(`/api/bulk-generate/${job.id}/execute`), {
                method: 'POST',
            });

            if (!execRes.ok) {
                const data = await execRes.json();
                throw new Error(data.error || 'Execution failed');
            }

            const result = await execRes.json();
            setJobResult(result);
            setStep(4);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setExecuting(false);
        }
    };

    const canProceed = () => {
        if (step === 0) return selectedTemplate && selectedInsuranceType;
        if (step === 1) return geoLevel && (geoLevel === 'NICHE' || selectedCountry);
        if (step === 2) return true; // CSV is optional
        if (step === 3) return previewData && previewData.totalPages > 0;
        return false;
    };

    const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
    const selectedTypeData = insuranceTypes.find(t => t.id === selectedInsuranceType);

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Bulk Page Generation</h1>
                    <p className="text-gray-600 mt-1">Generate multiple pages at once using templates</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${i < step ? 'bg-green-500 text-white' :
                                    i === step ? 'bg-blue-600 text-white' :
                                        'bg-gray-200 text-gray-500'
                                }`}>
                                {i < step ? '✓' : i + 1}
                            </div>
                            <span className={`ml-2 text-sm ${i === step ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                                {s}
                            </span>
                            {i < STEPS.length - 1 && (
                                <div className={`w-16 h-1 mx-4 ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Step Content */}
                <div className="bg-white rounded-xl border p-6 mb-6">
                    {/* Step 0: Select Template & Insurance Type */}
                    {step === 0 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Template *
                                </label>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {templates.length === 0 ? (
                                        <div className="col-span-2 text-center py-8 bg-gray-50 rounded-lg">
                                            <p className="text-gray-500 mb-2">No templates found</p>
                                            <Link href="/dashboard/templates" className="text-blue-600 hover:text-blue-700">
                                                Create a template first →
                                            </Link>
                                        </div>
                                    ) : (
                                        templates.map(template => (
                                            <button
                                                key={template.id}
                                                onClick={() => setSelectedTemplate(template.id)}
                                                className={`p-4 border rounded-lg text-left transition ${selectedTemplate === template.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="font-medium">{template.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {template.sections?.length || 0} sections
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Insurance Type *
                                </label>
                                <div className="grid md:grid-cols-3 gap-3">
                                    {insuranceTypes.map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => setSelectedInsuranceType(type.id)}
                                            className={`p-3 border rounded-lg text-left transition flex items-center gap-2 ${selectedInsuranceType === type.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <span className="text-xl">{type.icon || '📋'}</span>
                                            <span className="font-medium text-sm">{type.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Geo Scope */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Generate Pages For *
                                </label>
                                <div className="grid md:grid-cols-4 gap-3">
                                    {(['COUNTRY', 'STATE', 'CITY'] as GeoLevel[]).map(level => (
                                        <button
                                            key={level}
                                            onClick={() => setGeoLevel(level)}
                                            className={`p-4 border rounded-lg text-center transition ${geoLevel === level
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="text-2xl mb-1">
                                                {level === 'COUNTRY' ? '🌍' : level === 'STATE' ? '🗺️' : '🏙️'}
                                            </div>
                                            <div className="font-medium">{level}</div>
                                            <div className="text-xs text-gray-500">
                                                {level === 'COUNTRY' ? 'All countries' :
                                                    level === 'STATE' ? 'All states' : 'All cities'}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter by Country {geoLevel !== 'COUNTRY' && '*'}
                                </label>
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => {
                                        setSelectedCountry(e.target.value);
                                        setSelectedState('');
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Countries</option>
                                    {countries.map(country => (
                                        <option key={country.id} value={country.id}>
                                            {country.name} ({country.code.toUpperCase()})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {geoLevel === 'CITY' && selectedCountry && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Filter by State (optional)
                                    </label>
                                    <select
                                        value={selectedState}
                                        onChange={(e) => setSelectedState(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All States in Country</option>
                                        {states.map(state => (
                                            <option key={state.id} value={state.id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="border-t pt-4 space-y-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={skipExisting}
                                        onChange={(e) => setSkipExisting(e.target.checked)}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Skip existing pages (recommended)</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={publishOnCreate}
                                        onChange={(e) => setPublishOnCreate(e.target.checked)}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Publish pages immediately</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Step 2: CSV Data */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload CSV with Custom Data (Optional)
                                </label>
                                <p className="text-sm text-gray-500 mb-4">
                                    Upload a CSV to fill custom template variables. Include a column for matching
                                    (city, state, or country name) and columns for custom data.
                                </p>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
                                    onChange={handleCSVUpload}
                                    className="hidden"
                                />

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition"
                                >
                                    <span className="text-3xl block mb-2">📄</span>
                                    <span className="text-gray-600">Click to upload CSV file</span>
                                </button>
                            </div>

                            {csvData.length > 0 && (
                                <>
                                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg">
                                        ✓ Loaded {csvData.length} rows from CSV
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Map CSV Columns to Template Variables
                                        </label>
                                        <div className="space-y-2">
                                            {csvColumns.map(col => (
                                                <div key={col} className="flex items-center gap-4">
                                                    <span className="w-32 text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                                        {col}
                                                    </span>
                                                    <span className="text-gray-400">→</span>
                                                    <input
                                                        type="text"
                                                        value={variableMapping[col] || ''}
                                                        onChange={(e) => setVariableMapping({
                                                            ...variableMapping,
                                                            [col]: e.target.value
                                                        })}
                                                        placeholder={`e.g., ${col}`}
                                                        className="flex-1 px-3 py-1 border rounded text-sm"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preview CSV Data
                                        </label>
                                        <div className="overflow-x-auto border rounded-lg">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        {csvColumns.map(col => (
                                                            <th key={col} className="px-3 py-2 text-left">{col}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {csvData.slice(0, 5).map((row, i) => (
                                                        <tr key={i} className="border-t">
                                                            {csvColumns.map(col => (
                                                                <td key={col} className="px-3 py-2">{row[col]}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {csvData.length > 5 && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Showing 5 of {csvData.length} rows
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Step 3: Preview */}
                    {step === 3 && previewData && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 px-4 py-3 rounded-lg">
                                <p className="font-medium text-blue-900">
                                    Ready to generate {previewData.totalPages} pages
                                </p>
                                <p className="text-sm text-blue-700">
                                    Using template: {previewData.template.name}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Sample Pages Preview</h3>
                                <div className="space-y-4">
                                    {previewData.previewPages.map((page, i) => (
                                        <div key={i} className="border rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-medium text-gray-900">{page.title}</h4>
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                    {page.url}
                                                </code>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{page.sampleContent}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(page.variables).slice(0, 6).map(([key, value]) => (
                                                    <span key={key} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                        <span className="text-gray-500">{key}:</span> {value}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded-lg">
                                <p className="text-sm text-amber-800">
                                    <strong>Note:</strong> {skipExisting ? 'Existing pages will be skipped.' : 'Existing pages will be overwritten.'}
                                    {publishOnCreate ? ' Pages will be published immediately.' : ' Pages will be saved as drafts.'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Results */}
                    {step === 4 && jobResult && (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">🎉</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generation Complete!</h2>
                            <p className="text-gray-600 mb-6">
                                Created {jobResult.createdPages} pages
                                {jobResult.skippedPages > 0 && `, skipped ${jobResult.skippedPages} existing`}
                            </p>
                            <div className="flex justify-center gap-4">
                                <Link
                                    href="/dashboard/pages"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    View Pages
                                </Link>
                                <button
                                    onClick={() => {
                                        setStep(0);
                                        setSelectedTemplate('');
                                        setSelectedInsuranceType('');
                                        setCsvData([]);
                                        setCsvColumns([]);
                                        setVariableMapping({});
                                        setPreviewData(null);
                                        setJobResult(null);
                                    }}
                                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200"
                                >
                                    Generate More
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                {step < 4 && (
                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep(s => Math.max(0, s - 1))}
                            disabled={step === 0}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                        >
                            ← Back
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={() => {
                                    if (step === 2) {
                                        handlePreview();
                                    } else {
                                        setStep(s => s + 1);
                                    }
                                }}
                                disabled={!canProceed() || previewLoading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {previewLoading ? 'Loading...' : step === 2 ? 'Preview →' : 'Next →'}
                            </button>
                        ) : step === 3 ? (
                            <button
                                onClick={handleExecute}
                                disabled={executing}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {executing ? 'Generating...' : `Generate ${previewData?.totalPages || 0} Pages`}
                            </button>
                        ) : null}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
