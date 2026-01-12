'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useRef } from 'react';
import { getApiUrl } from '@/lib/api';

type Step = 'upload' | 'mapping' | 'preview' | 'execute';

interface PreviewPage {
    slug: string;
    status: string;
    changes?: Record<string, any>;
}

export default function BulkEditPage() {
    const [step, setStep] = useState<Step>('upload');
    const [csvData, setCsvData] = useState<any[]>([]);
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [csvFileName, setCsvFileName] = useState('');
    const [slugColumn, setSlugColumn] = useState('');
    const [mergeMode, setMergeMode] = useState<'merge' | 'replace'>('merge');
    const [updatePublished, setUpdatePublished] = useState(true);
    const [previewData, setPreviewData] = useState<PreviewPage[]>([]);
    const [previewStats, setPreviewStats] = useState<any>(null);
    const [executing, setExecuting] = useState(false);
    const [results, setResults] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCsvFileName(file.name);

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

        const headers = parseCSVLine(lines[0]);
        setCsvHeaders(headers);

        // Auto-detect slug column
        const slugCol = headers.find(h => h.toLowerCase() === 'slug') || headers[0];
        setSlugColumn(slugCol);

        const data = lines.slice(1).map(line => {
            const values = parseCSVLine(line);
            const row: Record<string, string> = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            return row;
        });

        setCsvData(data);
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

    const generatePreview = async () => {
        try {
            const res = await fetch(getApiUrl('/api/bulk-edit'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    csvData: csvData.slice(0, 20), // Preview first 20
                    slugColumn,
                    mergeMode,
                    updatePublished,
                    dryRun: true,
                }),
            });

            const data = await res.json();
            if (data.success) {
                setPreviewData(data.pages || []);
                setPreviewStats({
                    total: data.total,
                    updated: data.updated,
                    notFound: data.notFound,
                    skipped: data.skipped,
                });
                setStep('preview');
            } else {
                alert(data.error || 'Failed to generate preview');
            }
        } catch (error) {
            console.error('Failed to generate preview:', error);
            alert('Failed to generate preview');
        }
    };

    const executeUpdate = async () => {
        setExecuting(true);
        try {
            const res = await fetch(getApiUrl('/api/bulk-edit'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    csvData,
                    slugColumn,
                    mergeMode,
                    updatePublished,
                    dryRun: false,
                }),
            });

            const data = await res.json();
            setResults(data);
            setStep('execute');
        } catch (error) {
            console.error('Failed to execute update:', error);
            alert('Failed to execute update');
        } finally {
            setExecuting(false);
        }
    };

    const getStepNumber = (s: Step) => {
        const steps: Step[] = ['upload', 'mapping', 'preview', 'execute'];
        return steps.indexOf(s);
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {(['upload', 'mapping', 'preview', 'execute'] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center">
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${step === s
                            ? 'bg-blue-600 text-white'
                            : getStepNumber(s) < getStepNumber(step)
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        {getStepNumber(s) < getStepNumber(step) ? '✓' : i + 1}
                    </div>
                    {i < 3 && (
                        <div className={`w-16 h-1 ${getStepNumber(s) < getStepNumber(step) ? 'bg-green-500' : 'bg-gray-200'}`} />
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Bulk Edit Pages</h1>
                    <p className="text-gray-600 mt-1">Update multiple pages&apos; data from a CSV file</p>
                </div>

                {renderStepIndicator()}

                <div className="bg-white rounded-xl shadow-sm p-8">
                    {/* Step 1: Upload CSV */}
                    {step === 'upload' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Step 1: Upload CSV File</h2>

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
                                    <div className="text-5xl mb-4">📄</div>
                                    <p className="text-lg font-medium mb-2">Drop CSV file here or click to upload</p>
                                    <p className="text-sm text-gray-500">Your CSV must include a column with page slugs</p>
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

                                    <button
                                        onClick={() => setStep('mapping')}
                                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Continue →
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Mapping & Options */}
                    {step === 'mapping' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Step 2: Configure Update Options</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Slug Column *</label>
                                    <select
                                        value={slugColumn}
                                        onChange={(e) => setSlugColumn(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        {csvHeaders.map((h) => (
                                            <option key={h} value={h}>{h}</option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        This column should contain the page URL slugs (e.g., &quot;car-insurance/california&quot;)
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Update Mode</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={mergeMode === 'merge'}
                                                onChange={() => setMergeMode('merge')}
                                                className="text-blue-600"
                                            />
                                            <span>Merge with existing data</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={mergeMode === 'replace'}
                                                onChange={() => setMergeMode('replace')}
                                                className="text-blue-600"
                                            />
                                            <span>Replace all custom data</span>
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Merge: Only updates fields in CSV. Replace: Clears existing data.
                                    </p>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={updatePublished}
                                            onChange={(e) => setUpdatePublished(e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600"
                                        />
                                        <span className="font-medium">Update published (live) pages</span>
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        If unchecked, only draft pages will be updated.
                                    </p>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-900 mb-2">📋 Columns to Update</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {csvHeaders.filter(h => h !== slugColumn).map(h => (
                                            <span key={h} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                                {h}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-blue-700 mt-2">
                                        These columns will be added to each page&apos;s customData
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={() => setStep('upload')}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={generatePreview}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Preview Changes →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Preview */}
                    {step === 'preview' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Step 3: Review Changes</h2>

                            {previewStats && (
                                <div className="grid grid-cols-4 gap-4 mb-6">
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold">{csvData.length}</div>
                                        <div className="text-sm text-gray-500">Total Rows</div>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-green-600">{previewStats.updated}</div>
                                        <div className="text-sm text-gray-500">Will Update</div>
                                    </div>
                                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-yellow-600">{previewStats.notFound}</div>
                                        <div className="text-sm text-gray-500">Not Found</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-gray-400">{previewStats.skipped}</div>
                                        <div className="text-sm text-gray-500">Skipped</div>
                                    </div>
                                </div>
                            )}

                            <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-medium text-gray-500">Slug</th>
                                            <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                                            <th className="px-4 py-2 text-left font-medium text-gray-500">Changes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {previewData.map((page, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-2 font-mono text-xs">{page.slug}</td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded text-xs ${page.status === 'would_update' ? 'bg-green-100 text-green-700' :
                                                        page.status === 'not_found' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {page.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-xs text-gray-500">
                                                    {page.changes ? Object.keys(page.changes).length + ' fields' : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={() => setStep('mapping')}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={executeUpdate}
                                    disabled={executing}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                >
                                    {executing ? 'Updating...' : `Update ${csvData.length} Pages →`}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Results */}
                    {step === 'execute' && results && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">✅ Update Complete</h2>

                            <div className="grid grid-cols-4 gap-4 mb-6">
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">{results.updated}</div>
                                    <div className="text-sm text-gray-500">Updated</div>
                                </div>
                                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-yellow-600">{results.notFound}</div>
                                    <div className="text-sm text-gray-500">Not Found</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-gray-400">{results.skipped}</div>
                                    <div className="text-sm text-gray-500">Skipped</div>
                                </div>
                                <div className="bg-red-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                                    <div className="text-sm text-gray-500">Failed</div>
                                </div>
                            </div>

                            {results.errors && results.errors.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                    <h4 className="font-medium text-red-900 mb-2">Errors</h4>
                                    <ul className="text-sm text-red-700 space-y-1">
                                        {results.errors.slice(0, 10).map((err: any, i: number) => (
                                            <li key={i}>Row {err.row}: {err.error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    setStep('upload');
                                    setCsvData([]);
                                    setCsvHeaders([]);
                                    setCsvFileName('');
                                    setResults(null);
                                    setPreviewData([]);
                                }}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Start New Bulk Edit
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
