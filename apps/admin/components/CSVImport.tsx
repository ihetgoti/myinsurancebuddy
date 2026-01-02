'use client';

import { useState } from 'react';

interface CSVImportProps {
    title: string;
    description: string;
    columns: { name: string; required: boolean; description: string }[];
    sampleData: Record<string, string>[];
    importUrl: string;
    onSuccess: () => void;
}

export default function CSVImport({
    title,
    description,
    columns,
    sampleData,
    importUrl,
    onSuccess,
}: CSVImportProps) {
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<Record<string, string>[]>([]);
    const [mode, setMode] = useState<'create' | 'update' | 'upsert'>('upsert');
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        created: number;
        updated: number;
        skipped: number;
        errors: string[];
    } | null>(null);

    const parseCSV = (text: string): Record<string, string>[] => {
        const lines = text.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'));
        const rows: Record<string, string>[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
            const row: Record<string, string> = {};
            headers.forEach((header, idx) => {
                row[header] = values[idx] || '';
            });
            rows.push(row);
        }

        return rows;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setResult(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const data = parseCSV(text);
            setParsedData(data);
        };
        reader.readAsText(selectedFile);
    };

    const handleImport = async () => {
        if (parsedData.length === 0) return;

        setImporting(true);
        setResult(null);

        const BATCH_SIZE = 100;
        const totalBatches = Math.ceil(parsedData.length / BATCH_SIZE);

        const aggregatedResult = {
            success: true,
            created: 0,
            updated: 0,
            skipped: 0,
            errors: [] as string[],
        };

        try {
            for (let i = 0; i < totalBatches; i++) {
                const start = i * BATCH_SIZE;
                const end = Math.min(start + BATCH_SIZE, parsedData.length);
                const batch = parsedData.slice(start, end);

                // Update progress
                setResult({
                    ...aggregatedResult,
                    errors: [`Processing batch ${i + 1}/${totalBatches} (rows ${start + 1}-${end})...`],
                });

                const res = await fetch(importUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: batch, mode }),
                });

                const data = await res.json();

                if (data.error) {
                    aggregatedResult.errors.push(`Batch ${i + 1}: ${data.error}`);
                } else {
                    aggregatedResult.created += data.created || 0;
                    aggregatedResult.updated += data.updated || 0;
                    aggregatedResult.skipped += data.skipped || 0;
                    if (data.errors && data.errors.length > 0) {
                        aggregatedResult.errors.push(...data.errors.slice(0, 5)); // Limit errors per batch
                    }
                }
            }

            setResult(aggregatedResult);
            if (aggregatedResult.created > 0 || aggregatedResult.updated > 0) {
                onSuccess();
            }
        } catch (error) {
            setResult({
                success: false,
                created: aggregatedResult.created,
                updated: aggregatedResult.updated,
                skipped: aggregatedResult.skipped,
                errors: [...aggregatedResult.errors, 'Import failed. Please try again.'],
            });
        } finally {
            setImporting(false);
        }
    };

    const downloadSample = () => {
        const headers = columns.map(c => c.name).join(',');
        const rows = sampleData.map(row =>
            columns.map(c => row[c.name] || '').join(',')
        );
        const csv = [headers, ...rows].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <p className="text-gray-600 mt-1">{description}</p>
            </div>

            {/* Column Info */}
            <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Required CSV Columns</h3>
                <div className="grid md:grid-cols-2 gap-3">
                    {columns.map((col) => (
                        <div key={col.name} className="flex items-start gap-2">
                            <code className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm">
                                {col.name}
                            </code>
                            {col.required && (
                                <span className="text-red-500 text-xs">*</span>
                            )}
                            <span className="text-sm text-blue-700">{col.description}</span>
                        </div>
                    ))}
                </div>
                <button
                    onClick={downloadSample}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 underline"
                >
                    Download sample CSV
                </button>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <label className="block">
                    <span className="text-sm font-medium text-gray-700 mb-2 block">
                        Select CSV File
                    </span>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </label>

                {parsedData.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm text-green-600 font-medium">
                            ✓ {parsedData.length} rows parsed
                        </p>

                        {/* Preview */}
                        <div className="mt-3 overflow-x-auto">
                            <table className="text-sm border rounded-lg overflow-hidden">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {Object.keys(parsedData[0]).map((key) => (
                                            <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {parsedData.slice(0, 5).map((row, idx) => (
                                        <tr key={idx}>
                                            {Object.values(row).map((val, i) => (
                                                <td key={i} className="px-3 py-2 text-gray-600">
                                                    {val}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {parsedData.length > 5 && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Showing 5 of {parsedData.length} rows
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Import Options */}
            {parsedData.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3">Import Mode</h3>
                    <div className="flex gap-4">
                        {[
                            { value: 'upsert', label: 'Create or Update', desc: 'Add new & update existing' },
                            { value: 'create', label: 'Create Only', desc: 'Skip existing records' },
                            { value: 'update', label: 'Update Only', desc: 'Only update existing' },
                        ].map((opt) => (
                            <label
                                key={opt.value}
                                className={`flex-1 p-4 border rounded-lg cursor-pointer transition ${mode === opt.value
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="mode"
                                    value={opt.value}
                                    checked={mode === opt.value}
                                    onChange={(e) => setMode(e.target.value as any)}
                                    className="sr-only"
                                />
                                <p className="font-medium text-gray-900">{opt.label}</p>
                                <p className="text-sm text-gray-500">{opt.desc}</p>
                            </label>
                        ))}
                    </div>

                    <button
                        onClick={handleImport}
                        disabled={importing}
                        className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
                    >
                        {importing ? 'Importing...' : `Import ${parsedData.length} rows`}
                    </button>
                </div>
            )}

            {/* Results */}
            {result && (
                <div className={`rounded-xl p-6 ${result.errors.length > 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
                    }`}>
                    <h3 className="font-semibold text-gray-900 mb-3">Import Results</h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{result.created}</p>
                            <p className="text-sm text-gray-500">Created</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{result.updated}</p>
                            <p className="text-sm text-gray-500">Updated</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-2xl font-bold text-gray-600">{result.skipped}</p>
                            <p className="text-sm text-gray-500">Skipped</p>
                        </div>
                    </div>
                    {result.errors.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-red-700 mb-2">Errors ({result.errors.length}):</p>
                            <ul className="text-sm text-red-600 space-y-1 max-h-40 overflow-y-auto">
                                {result.errors.slice(0, 20).map((err, idx) => (
                                    <li key={idx}>• {err}</li>
                                ))}
                                {result.errors.length > 20 && (
                                    <li>... and {result.errors.length - 20} more</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
