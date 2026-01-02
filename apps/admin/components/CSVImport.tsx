'use client';

import { useState, useRef } from 'react';

interface CSVImportProps {
    title: string;
    description: string;
    columns: { name: string; required: boolean; description: string }[];
    sampleData: Record<string, string>[];
    importUrl: string;
    onSuccess: () => void;
}

interface ImportProgress {
    currentBatch: number;
    totalBatches: number;
    processedRows: number;
    totalRows: number;
    created: number;
    updated: number;
    skipped: number;
    errors: string[];
    status: 'idle' | 'validating' | 'importing' | 'completed' | 'cancelled' | 'error';
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
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [progress, setProgress] = useState<ImportProgress>({
        currentBatch: 0,
        totalBatches: 0,
        processedRows: 0,
        totalRows: 0,
        created: 0,
        updated: 0,
        skipped: 0,
        errors: [],
        status: 'idle',
    });

    const cancelRef = useRef(false);

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

    const validateData = (data: Record<string, string>[]): string[] => {
        const errors: string[] = [];
        const requiredCols = columns.filter(c => c.required).map(c => c.name.toLowerCase());

        if (data.length === 0) {
            errors.push('No data rows found in CSV');
            return errors;
        }

        const csvHeaders = Object.keys(data[0]).map(h => h.toLowerCase());

        // Check for required columns
        for (const col of requiredCols) {
            if (!csvHeaders.includes(col)) {
                errors.push(`Missing required column: ${col}`);
            }
        }

        // Check for unexpected columns (might be wrong data type)
        const expectedCols = columns.map(c => c.name.toLowerCase());
        const unexpectedCols = csvHeaders.filter(h => !expectedCols.includes(h) && h !== '');
        if (unexpectedCols.length > 0) {
            errors.push(`Warning: Unexpected columns found: ${unexpectedCols.join(', ')}`);
        }

        return errors;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setValidationErrors([]);
        setProgress(p => ({ ...p, status: 'idle', errors: [] }));

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const data = parseCSV(text);
            setParsedData(data);

            // Validate columns
            const errors = validateData(data);
            setValidationErrors(errors);
        };
        reader.readAsText(selectedFile);
    };

    const handleImport = async () => {
        if (parsedData.length === 0) return;
        if (validationErrors.some(e => !e.startsWith('Warning'))) return;

        cancelRef.current = false;

        const BATCH_SIZE = 500;
        const totalBatches = Math.ceil(parsedData.length / BATCH_SIZE);

        setProgress({
            currentBatch: 0,
            totalBatches,
            processedRows: 0,
            totalRows: parsedData.length,
            created: 0,
            updated: 0,
            skipped: 0,
            errors: [],
            status: 'importing',
        });

        let created = 0, updated = 0, skipped = 0;
        const errors: string[] = [];

        try {
            for (let i = 0; i < totalBatches; i++) {
                if (cancelRef.current) {
                    setProgress(p => ({ ...p, status: 'cancelled' }));
                    return;
                }

                const start = i * BATCH_SIZE;
                const end = Math.min(start + BATCH_SIZE, parsedData.length);
                const batch = parsedData.slice(start, end);

                // Update progress before request
                setProgress(p => ({
                    ...p,
                    currentBatch: i + 1,
                    processedRows: start,
                }));

                const res = await fetch(importUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: batch, mode }),
                });

                const data = await res.json();

                if (data.error) {
                    errors.push(`Batch ${i + 1}: ${data.error}`);
                } else {
                    created += data.created || 0;
                    updated += data.updated || 0;
                    skipped += data.skipped || 0;
                    if (data.errors?.length > 0) {
                        errors.push(...data.errors.slice(0, 3));
                    }
                }

                // Update progress after request
                setProgress(p => ({
                    ...p,
                    processedRows: end,
                    created,
                    updated,
                    skipped,
                    errors: errors.slice(0, 20),
                }));

                // Small delay for UI responsiveness
                await new Promise(r => setTimeout(r, 50));
            }

            setProgress(p => ({ ...p, status: 'completed' }));
            if (created > 0 || updated > 0) {
                onSuccess();
            }
        } catch (error) {
            setProgress(p => ({
                ...p,
                status: 'error',
                errors: [...p.errors, 'Import failed. Please try again.'],
            }));
        }
    };

    const handleCancel = () => {
        cancelRef.current = true;
    };

    const handleReset = () => {
        setFile(null);
        setParsedData([]);
        setValidationErrors([]);
        setProgress({
            currentBatch: 0,
            totalBatches: 0,
            processedRows: 0,
            totalRows: 0,
            created: 0,
            updated: 0,
            skipped: 0,
            errors: [],
            status: 'idle',
        });
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

    const progressPercent = progress.totalRows > 0
        ? Math.round((progress.processedRows / progress.totalRows) * 100)
        : 0;

    const isImporting = progress.status === 'importing';
    const isCompleted = progress.status === 'completed';
    const isCancelled = progress.status === 'cancelled';
    const hasErrors = validationErrors.some(e => !e.startsWith('Warning'));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    <p className="text-gray-600 mt-1">{description}</p>
                </div>
                {(isCompleted || isCancelled || parsedData.length > 0) && (
                    <button
                        onClick={handleReset}
                        className="text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                        Reset
                    </button>
                )}
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
                        disabled={isImporting}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                    />
                </label>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                    <div className={`mt-4 p-3 rounded-lg ${hasErrors ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                        {validationErrors.map((err, idx) => (
                            <p key={idx} className={`text-sm ${err.startsWith('Warning') ? 'text-yellow-700' : 'text-red-700'}`}>
                                {err.startsWith('Warning') ? '⚠️' : '❌'} {err}
                            </p>
                        ))}
                    </div>
                )}

                {parsedData.length > 0 && !hasErrors && (
                    <div className="mt-4">
                        <p className="text-sm text-green-600 font-medium">
                            ✓ {parsedData.length.toLocaleString()} rows parsed
                        </p>

                        {/* Preview - limited rows */}
                        <div className="mt-3 overflow-x-auto">
                            <table className="text-sm border rounded-lg overflow-hidden">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {Object.keys(parsedData[0]).slice(0, 6).map((key) => (
                                            <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                {key}
                                            </th>
                                        ))}
                                        {Object.keys(parsedData[0]).length > 6 && (
                                            <th className="px-3 py-2 text-xs text-gray-400">...</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {parsedData.slice(0, 3).map((row, idx) => (
                                        <tr key={idx}>
                                            {Object.values(row).slice(0, 6).map((val, i) => (
                                                <td key={i} className="px-3 py-2 text-gray-600 max-w-[150px] truncate">
                                                    {val}
                                                </td>
                                            ))}
                                            {Object.values(row).length > 6 && (
                                                <td className="px-3 py-2 text-gray-400">...</td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {parsedData.length > 3 && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Showing 3 of {parsedData.length.toLocaleString()} rows
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Import Options & Progress */}
            {parsedData.length > 0 && !hasErrors && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    {!isImporting && !isCompleted && !isCancelled && (
                        <>
                            <h3 className="font-medium text-gray-900 mb-3">Import Mode</h3>
                            <div className="flex gap-4 mb-6">
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
                        </>
                    )}

                    {/* Progress Bar */}
                    {(isImporting || isCompleted || isCancelled) && (
                        <div className="mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-gray-700">
                                    {isImporting && `Importing... Batch ${progress.currentBatch}/${progress.totalBatches}`}
                                    {isCompleted && '✅ Import completed!'}
                                    {isCancelled && '⚠️ Import cancelled'}
                                </span>
                                <span className="text-gray-500">
                                    {progress.processedRows.toLocaleString()} / {progress.totalRows.toLocaleString()} rows
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-green-500' :
                                            isCancelled ? 'bg-yellow-500' :
                                                'bg-blue-600'
                                        }`}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <p className="text-center text-sm text-gray-600 mt-1">{progressPercent}%</p>
                        </div>
                    )}

                    {/* Stats */}
                    {(isImporting || isCompleted || isCancelled) && (
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{progress.created.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">Created</p>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{progress.updated.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">Updated</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-gray-600">{progress.skipped.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">Skipped</p>
                            </div>
                        </div>
                    )}

                    {/* Errors */}
                    {progress.errors.length > 0 && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg max-h-32 overflow-y-auto">
                            <p className="text-sm font-medium text-red-700 mb-1">Errors:</p>
                            {progress.errors.map((err, idx) => (
                                <p key={idx} className="text-sm text-red-600">• {err}</p>
                            ))}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-4">
                        {!isImporting && !isCompleted && !isCancelled && (
                            <button
                                onClick={handleImport}
                                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition"
                            >
                                Import {parsedData.length.toLocaleString()} rows
                            </button>
                        )}
                        {isImporting && (
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium transition"
                            >
                                Cancel Import
                            </button>
                        )}
                        {(isCompleted || isCancelled) && (
                            <button
                                onClick={handleReset}
                                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium transition"
                            >
                                Import Another File
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
