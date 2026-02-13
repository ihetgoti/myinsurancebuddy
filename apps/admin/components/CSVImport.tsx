'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';

interface Column {
    name: string;
    required: boolean;
    description: string;
}

interface CSVImportProps {
    title: string;
    description: string;
    columns: Column[];
    sampleData: Record<string, string>[];
    importUrl: string;
    onSuccess?: () => void;
}

export default function CSVImport({
    title,
    description,
    columns,
    sampleData,
    importUrl,
    onSuccess
}: CSVImportProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<Record<string, string>[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setError(null);
        setSuccess(false);

        // Parse CSV for preview
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim());
            if (lines.length < 2) {
                setError('CSV file must have a header row and at least one data row');
                return;
            }

            const headers = lines[0].split(',').map(h => h.trim());
            const data: Record<string, string>[] = [];

            for (let i = 1; i < Math.min(lines.length, 6); i++) {
                const values = lines[i].split(',');
                const row: Record<string, string> = {};
                headers.forEach((header, index) => {
                    row[header] = values[index]?.trim() || '';
                });
                data.push(row);
            }

            setPreview(data);
        };
        reader.readAsText(selectedFile);
    }, []);

    const handleImport = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(importUrl, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Import failed');
            }

            setSuccess(true);
            setFile(null);
            setPreview([]);
            onSuccess?.();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadSample = () => {
        const headers = columns.map(col => col.name).join(',');
        const rows = sampleData.map(row => 
            columns.map(col => row[col.name] || '').join(',')
        ).join('\n');
        
        const csv = `${headers}\n${rows}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample.csv';
        a.click();
        
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-600 mb-6">{description}</p>

                {/* Column Info */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Required Columns</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid gap-2">
                            {columns.map(col => (
                                <div key={col.name} className="flex items-start gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded ${col.required ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'}`}>
                                        {col.required ? 'Required' : 'Optional'}
                                    </span>
                                    <code className="text-sm font-mono text-gray-800">{col.name}</code>
                                    <span className="text-sm text-gray-600">- {col.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sample Download */}
                <button
                    onClick={downloadSample}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
                >
                    <Download size={16} />
                    Download sample CSV
                </button>

                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="csv-upload"
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-1">
                            {file ? file.name : 'Click to upload CSV file'}
                        </p>
                        <p className="text-sm text-gray-500">
                            or drag and drop your file here
                        </p>
                    </label>
                </div>

                {/* Preview */}
                {preview.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Preview (first 5 rows)</h3>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {columns.map(col => (
                                            <th key={col.name} className="px-3 py-2 text-left font-medium text-gray-700">
                                                {col.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.map((row, i) => (
                                        <tr key={i} className="border-t">
                                            {columns.map(col => (
                                                <td key={col.name} className="px-3 py-2 text-gray-600">
                                                    {row[col.name] || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                        <CheckCircle size={18} />
                        <span>Import successful!</span>
                    </div>
                )}

                {/* Import Button */}
                {file && (
                    <div className="mt-6">
                        <button
                            onClick={handleImport}
                            disabled={loading}
                            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                <>
                                    <FileText size={18} />
                                    Import {preview.length} Records
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
