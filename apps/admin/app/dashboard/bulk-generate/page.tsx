'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState, useRef } from 'react';
import { getApiUrl } from '@/lib/api';
import { systemVariables } from '@/lib/component-definitions';

interface Template {
    id: string;
    name: string;
    slug: string;
    customVariables: any[];
}

interface InsuranceType {
    id: string;
    name: string;
    slug: string;
}

interface BulkJob {
    id: string;
    name: string;
    status: string;
    totalRows: number;
    processedRows: number;
    createdPages: number;
    updatedPages: number;
    skippedPages: number;
    failedPages: number;
    createdAt: string;
    template: { name: string };
    insuranceType?: { name: string };
}

type Step = 'source' | 'template' | 'mapping' | 'options' | 'preview' | 'execute';

export default function BulkGeneratePage() {
    const [step, setStep] = useState<Step>('source');
    const [templates, setTemplates] = useState<Template[]>([]);
    const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
    const [jobs, setJobs] = useState<BulkJob[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [dataSource, setDataSource] = useState<'csv' | 'geo' | 'api'>('csv');
    const [csvData, setCsvData] = useState<any[]>([]);
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [csvFileName, setCsvFileName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [selectedInsuranceType, setSelectedInsuranceType] = useState<string>('');
    const [geoLevel, setGeoLevel] = useState<'STATE' | 'CITY'>('STATE');
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>('');
    const [variableMapping, setVariableMapping] = useState<Record<string, string>>({});
    const [slugPattern, setSlugPattern] = useState('{{insurance_type_slug}}/{{state_slug}}/{{city_slug}}');
    const [options, setOptions] = useState({
        publishOnCreate: false,
        updateExisting: false,
        skipExisting: true,
        validateData: true,
        dryRun: false,
    });
    const [jobName, setJobName] = useState('');
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [executing, setExecuting] = useState(false);
    const [currentJob, setCurrentJob] = useState<BulkJob | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [templatesRes, typesRes, jobsRes] = await Promise.all([
                fetch(getApiUrl('/api/templates')),
                fetch(getApiUrl('/api/insurance-types')),
                fetch(getApiUrl('/api/bulk-generate')),
            ]);

            const [templatesData, typesData, jobsData] = await Promise.all([
                templatesRes.json(),
                typesRes.json(),
                jobsRes.json(),
            ]);

            setTemplates(Array.isArray(templatesData) ? templatesData : []);
            setInsuranceTypes(Array.isArray(typesData) ? typesData : []);
            setJobs(Array.isArray(jobsData) ? jobsData : []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCsvFileName(file.name);
        setJobName(file.name.replace(/\.[^/.]+$/, ''));

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            parseCSV(text);
        };
        reader.readAsText(file);
    };

    const parseCSV = (text: string) => {
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length === 0) return;

        // Parse headers
        const headers = parseCSVLine(lines[0]);
        setCsvHeaders(headers);

        // Parse data rows
        const data = lines.slice(1).map(line => {
            const values = parseCSVLine(line);
            const row: Record<string, string> = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            return row;
        });

        setCsvData(data);

        // Auto-map common columns
        const autoMapping: Record<string, string> = {};
        headers.forEach(header => {
            const normalized = header.toLowerCase().replace(/[^a-z0-9]/g, '_');
            if (normalized.includes('title') || normalized === 'name') {
                autoMapping.page_title = header;
            } else if (normalized.includes('description') || normalized.includes('desc')) {
                autoMapping.page_subtitle = header;
            } else if (normalized.includes('state') && !normalized.includes('code')) {
                autoMapping.state = header;
            } else if (normalized.includes('city')) {
                autoMapping.city = header;
            } else if (normalized.includes('slug') || normalized.includes('url')) {
                autoMapping.slug = header;
            }
        });
        setVariableMapping(autoMapping);
    };

    const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    };

    const getAvailableVariables = () => {
        const template = templates.find(t => t.id === selectedTemplate);
        const customVars = template?.customVariables || [];

        return [
            ...systemVariables.map(v => ({ name: v.name, label: v.label, type: 'system' })),
            ...customVars.map((v: any) => ({ name: v.name, label: v.label, type: 'custom' })),
        ];
    };

    const generatePreview = async () => {
        if (dataSource === 'csv' && csvData.length === 0) return;

        try {
            const res = await fetch(getApiUrl('/api/bulk-generate/preview'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dataSource,
                    csvData: csvData.slice(0, 10), // Preview first 10
                    templateId: selectedTemplate,
                    insuranceTypeId: selectedInsuranceType,
                    geoLevel,
                    variableMapping,
                    slugPattern,
                }),
            });

            const data = await res.json();
            setPreviewData(data.preview || []);
        } catch (error) {
            console.error('Failed to generate preview:', error);
        }
    };

    const executeJob = async () => {
        setExecuting(true);

        try {
            const res = await fetch(getApiUrl('/api/bulk-generate'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: jobName || `Bulk Job - ${new Date().toLocaleString()}`,
                    dataSource,
                    csvData,
                    csvFileName,
                    templateId: selectedTemplate,
                    insuranceTypeId: selectedInsuranceType,
                    geoLevel,
                    variableMapping,
                    slugPattern,
                    ...options,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create job');
            }

            const job = await res.json();
            setCurrentJob(job);

            // Start execution
            const execRes = await fetch(getApiUrl(`/api/bulk-generate/${job.id}/execute`), {
                method: 'POST',
            });

            if (!execRes.ok) {
                throw new Error('Failed to execute job');
            }

            // Poll for status
            pollJobStatus(job.id);
        } catch (error: any) {
            alert(error.message);
            setExecuting(false);
        }
    };

    const pollJobStatus = async (jobId: string) => {
        const poll = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/bulk-generate/${jobId}`));
                const job = await res.json();
                setCurrentJob(job);

                if (job.status === 'PROCESSING' || job.status === 'QUEUED') {
                    setTimeout(poll, 1000);
                } else {
                    setExecuting(false);
                    fetchData();
                }
            } catch (error) {
                setExecuting(false);
            }
        };

        poll();
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {(['source', 'template', 'mapping', 'options', 'preview', 'execute'] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center">
                    <button
                        onClick={() => setStep(s)}
                        disabled={getStepNumber(s) > getStepNumber(step) + 1}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${step === s
                                ? 'bg-blue-600 text-white'
                                : getStepNumber(s) < getStepNumber(step)
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        {getStepNumber(s) < getStepNumber(step) ? '✓' : i + 1}
                    </button>
                    {i < 5 && (
                        <div className={`w-16 h-1 ${getStepNumber(s) < getStepNumber(step) ? 'bg-green-500' : 'bg-gray-200'
                            }`} />
                    )}
                </div>
            ))}
        </div>
    );

    const getStepNumber = (s: Step) => {
        const steps: Step[] = ['source', 'template', 'mapping', 'options', 'preview', 'execute'];
        return steps.indexOf(s);
    };

    const canProceed = () => {
        switch (step) {
            case 'source':
                return (dataSource === 'csv' && csvData.length > 0) || dataSource === 'geo';
            case 'template':
                return selectedTemplate && selectedInsuranceType;
            case 'mapping':
                return Object.keys(variableMapping).length > 0 || dataSource === 'geo';
            case 'options':
                return true;
            case 'preview':
                return previewData.length > 0 || dataSource === 'geo';
            default:
                return true;
        }
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Bulk Page Generation</h1>
                    <p className="text-gray-600 mt-1">Generate thousands of pages from CSV data or geo database</p>
                </div>

                {/* Step Indicator */}
                {renderStepIndicator()}

                {/* Step Content */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                    {/* Step 1: Data Source */}
                    {step === 'source' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Step 1: Choose Data Source</h2>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {[
                                    { id: 'csv', icon: '📄', title: 'CSV Upload', desc: 'Upload a CSV file with page data' },
                                    { id: 'geo', icon: '🌍', title: 'Geo Database', desc: 'Generate from states/cities' },
                                    { id: 'api', icon: '🔗', title: 'External API', desc: 'Fetch data from API endpoint' },
                                ].map((source) => (
                                    <button
                                        key={source.id}
                                        onClick={() => setDataSource(source.id as any)}
                                        className={`p-6 rounded-xl border-2 text-left transition ${dataSource === source.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-3xl mb-3">{source.icon}</div>
                                        <h3 className="font-semibold mb-1">{source.title}</h3>
                                        <p className="text-sm text-gray-500">{source.desc}</p>
                                    </button>
                                ))}
                            </div>

                            {dataSource === 'csv' && (
                                <div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />

                                    {csvData.length === 0 ? (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
                                        >
                                            <div className="text-5xl mb-4">📁</div>
                                            <p className="text-lg font-medium mb-2">Drop CSV file here or click to upload</p>
                                            <p className="text-sm text-gray-500">Supports .csv files up to 50MB</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">📄</span>
                                                    <div>
                                                        <p className="font-medium">{csvFileName}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {csvData.length} rows, {csvHeaders.length} columns
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setCsvData([]);
                                                        setCsvHeaders([]);
                                                        setCsvFileName('');
                                                        setVariableMapping({});
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            {/* Preview Table */}
                                            <div className="border rounded-lg overflow-hidden">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-4 py-2 text-left font-medium text-gray-500">#</th>
                                                                {csvHeaders.map((header) => (
                                                                    <th key={header} className="px-4 py-2 text-left font-medium text-gray-500">
                                                                        {header}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y">
                                                            {csvData.slice(0, 5).map((row, i) => (
                                                                <tr key={i}>
                                                                    <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                                                                    {csvHeaders.map((header) => (
                                                                        <td key={header} className="px-4 py-2 truncate max-w-[200px]">
                                                                            {row[header]}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {csvData.length > 5 && (
                                                    <div className="bg-gray-50 px-4 py-2 text-sm text-gray-500 text-center">
                                                        ... and {csvData.length - 5} more rows
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {dataSource === 'geo' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Geo Level</label>
                                        <select
                                            value={geoLevel}
                                            onChange={(e) => setGeoLevel(e.target.value as any)}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        >
                                            <option value="STATE">All States</option>
                                            <option value="CITY">All Cities</option>
                                        </select>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-800">
                                            <strong>Note:</strong> This will generate pages for all {geoLevel === 'STATE' ? 'states' : 'cities'} in the database.
                                            {geoLevel === 'CITY' && ' This could be thousands of pages.'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {dataSource === 'api' && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-yellow-800">API data source coming soon. Please use CSV upload for now.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Template Selection */}
                    {step === 'template' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Step 2: Select Template & Insurance Type</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Template *</label>
                                    <select
                                        value={selectedTemplate}
                                        onChange={(e) => setSelectedTemplate(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        <option value="">Select a template...</option>
                                        {templates.map((t) => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                    {templates.length === 0 && (
                                        <p className="text-sm text-red-500 mt-2">
                                            No templates found. <a href="/dashboard/templates" className="underline">Create one first</a>.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Insurance Type *</label>
                                    <select
                                        value={selectedInsuranceType}
                                        onChange={(e) => setSelectedInsuranceType(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        <option value="">Select insurance type...</option>
                                        {insuranceTypes.map((t) => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {selectedTemplate && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium mb-2">Template Variables</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {getAvailableVariables().map((v) => (
                                            <span
                                                key={v.name}
                                                className={`px-2 py-1 rounded text-xs ${v.type === 'system' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                                    }`}
                                            >
                                                {`{{${v.name}}}`}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Variable Mapping */}
                    {step === 'mapping' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Step 3: Map Variables</h2>

                            {dataSource === 'csv' && (
                                <>
                                    <p className="text-gray-600 mb-6">
                                        Map your CSV columns to template variables. Each row will generate one page.
                                    </p>

                                    <div className="space-y-4">
                                        {getAvailableVariables().map((variable) => (
                                            <div key={variable.name} className="flex items-center gap-4">
                                                <div className="w-48">
                                                    <span className={`px-2 py-1 rounded text-sm ${variable.type === 'system' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                                        }`}>
                                                        {`{{${variable.name}}}`}
                                                    </span>
                                                </div>
                                                <span className="text-gray-400">←</span>
                                                <select
                                                    value={variableMapping[variable.name] || ''}
                                                    onChange={(e) => setVariableMapping({
                                                        ...variableMapping,
                                                        [variable.name]: e.target.value,
                                                    })}
                                                    className="flex-1 px-4 py-2 border rounded-lg"
                                                >
                                                    <option value="">Not mapped</option>
                                                    {csvHeaders.map((header) => (
                                                        <option key={header} value={header}>{header}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8">
                                        <label className="block text-sm font-medium mb-2">URL Slug Pattern</label>
                                        <input
                                            type="text"
                                            value={slugPattern}
                                            onChange={(e) => setSlugPattern(e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg font-mono"
                                            placeholder="{{insurance_type_slug}}/{{state_slug}}/{{city_slug}}"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Use variables to create dynamic URLs. Example: car-insurance/california/los-angeles
                                        </p>
                                    </div>
                                </>
                            )}

                            {dataSource === 'geo' && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-blue-800">
                                        Geo-based generation will automatically map state and city data to template variables.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Options */}
                    {step === 'options' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Step 4: Generation Options</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Job Name</label>
                                    <input
                                        type="text"
                                        value={jobName}
                                        onChange={(e) => setJobName(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="My Bulk Generation Job"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={options.publishOnCreate}
                                            onChange={(e) => setOptions({ ...options, publishOnCreate: e.target.checked })}
                                            className="mt-1"
                                        />
                                        <div>
                                            <p className="font-medium">Publish on Create</p>
                                            <p className="text-sm text-gray-500">Automatically publish pages after creation</p>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={options.updateExisting}
                                            onChange={(e) => setOptions({ ...options, updateExisting: e.target.checked, skipExisting: !e.target.checked })}
                                            className="mt-1"
                                        />
                                        <div>
                                            <p className="font-medium">Update Existing</p>
                                            <p className="text-sm text-gray-500">Update pages that already exist</p>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={options.skipExisting}
                                            onChange={(e) => setOptions({ ...options, skipExisting: e.target.checked, updateExisting: !e.target.checked })}
                                            className="mt-1"
                                        />
                                        <div>
                                            <p className="font-medium">Skip Existing</p>
                                            <p className="text-sm text-gray-500">Skip pages that already exist</p>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={options.validateData}
                                            onChange={(e) => setOptions({ ...options, validateData: e.target.checked })}
                                            className="mt-1"
                                        />
                                        <div>
                                            <p className="font-medium">Validate Data</p>
                                            <p className="text-sm text-gray-500">Check for missing required fields</p>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={options.dryRun}
                                            onChange={(e) => setOptions({ ...options, dryRun: e.target.checked })}
                                            className="mt-1"
                                        />
                                        <div>
                                            <p className="font-medium">Dry Run</p>
                                            <p className="text-sm text-gray-500">Simulate without creating pages</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Preview */}
                    {step === 'preview' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Step 5: Preview</h2>

                            <button
                                onClick={generatePreview}
                                className="mb-6 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
                            >
                                🔄 Generate Preview
                            </button>

                            {previewData.length > 0 ? (
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left">#</th>
                                                <th className="px-4 py-2 text-left">Slug</th>
                                                <th className="px-4 py-2 text-left">Title</th>
                                                <th className="px-4 py-2 text-left">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {previewData.map((item, i) => (
                                                <tr key={i}>
                                                    <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                                                    <td className="px-4 py-2 font-mono text-sm">{item.slug}</td>
                                                    <td className="px-4 py-2">{item.title}</td>
                                                    <td className="px-4 py-2">
                                                        <span className={`px-2 py-0.5 rounded text-xs ${item.exists
                                                                ? options.updateExisting
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : 'bg-gray-100 text-gray-600'
                                                                : 'bg-green-100 text-green-700'
                                                            }`}>
                                                            {item.exists
                                                                ? options.updateExisting ? 'Will Update' : 'Will Skip'
                                                                : 'Will Create'
                                                            }
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    Click "Generate Preview" to see what pages will be created
                                </div>
                            )}

                            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-800 mb-2">Summary</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Total rows: {csvData.length}</li>
                                    <li>• Template: {templates.find(t => t.id === selectedTemplate)?.name}</li>
                                    <li>• Insurance Type: {insuranceTypes.find(t => t.id === selectedInsuranceType)?.name}</li>
                                    <li>• Publish on create: {options.publishOnCreate ? 'Yes' : 'No'}</li>
                                    <li>• Dry run: {options.dryRun ? 'Yes' : 'No'}</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Step 6: Execute */}
                    {step === 'execute' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Step 6: Execute</h2>

                            {!executing && !currentJob && (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🚀</div>
                                    <h3 className="text-xl font-semibold mb-2">Ready to Generate</h3>
                                    <p className="text-gray-500 mb-6">
                                        This will create {csvData.length} pages using the selected template.
                                    </p>
                                    <button
                                        onClick={executeJob}
                                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
                                    >
                                        Start Generation
                                    </button>
                                </div>
                            )}

                            {(executing || currentJob) && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">{currentJob?.name || 'Processing...'}</h3>
                                        <span className={`px-3 py-1 rounded-full text-sm ${currentJob?.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                currentJob?.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {currentJob?.status || 'Starting...'}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div>
                                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                                            <span>Progress</span>
                                            <span>{currentJob?.processedRows || 0} / {currentJob?.totalRows || csvData.length}</span>
                                        </div>
                                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 transition-all duration-500"
                                                style={{
                                                    width: `${currentJob ? (currentJob.processedRows / currentJob.totalRows) * 100 : 0}%`
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="bg-green-50 p-4 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-green-600">{currentJob?.createdPages || 0}</div>
                                            <div className="text-sm text-green-700">Created</div>
                                        </div>
                                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-yellow-600">{currentJob?.updatedPages || 0}</div>
                                            <div className="text-sm text-yellow-700">Updated</div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-gray-600">{currentJob?.skippedPages || 0}</div>
                                            <div className="text-sm text-gray-700">Skipped</div>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-red-600">{currentJob?.failedPages || 0}</div>
                                            <div className="text-sm text-red-700">Failed</div>
                                        </div>
                                    </div>

                                    {currentJob?.status === 'COMPLETED' && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                            <div className="text-2xl mb-2">✅</div>
                                            <p className="text-green-800 font-medium">Generation Complete!</p>
                                            <a
                                                href="/dashboard/pages"
                                                className="text-green-600 hover:underline text-sm"
                                            >
                                                View generated pages →
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <button
                            onClick={() => {
                                const steps: Step[] = ['source', 'template', 'mapping', 'options', 'preview', 'execute'];
                                const currentIndex = steps.indexOf(step);
                                if (currentIndex > 0) setStep(steps[currentIndex - 1]);
                            }}
                            disabled={step === 'source'}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                        >
                            ← Back
                        </button>

                        {step !== 'execute' && (
                            <button
                                onClick={() => {
                                    const steps: Step[] = ['source', 'template', 'mapping', 'options', 'preview', 'execute'];
                                    const currentIndex = steps.indexOf(step);
                                    if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1]);
                                }}
                                disabled={!canProceed()}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue →
                            </button>
                        )}
                    </div>
                </div>

                {/* Previous Jobs */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold mb-4">Previous Jobs</h2>
                    {jobs.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                            No bulk generation jobs yet
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Template</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Progress</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {jobs.map((job) => (
                                        <tr key={job.id}>
                                            <td className="px-4 py-3 font-medium">{job.name}</td>
                                            <td className="px-4 py-3 text-gray-500">{job.template?.name}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded text-xs ${job.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                        job.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                                                            job.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {job.createdPages} created, {job.skippedPages} skipped
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
