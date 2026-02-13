'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import * as XLSX from 'xlsx';
import {
  Car,
  Home,
  Heart,
  Stethoscope,
  Dog,
  Briefcase,
  Zap,
  Umbrella,
  Building,
  Shield
} from 'lucide-react';

// Template definitions matching the web app templates
interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  variables: string[];
  sampleData: Record<string, string>;
}

const TEMPLATES: Template[] = [
  {
    id: 'auto',
    name: 'Auto Insurance',
    description: 'Car and vehicle insurance pages with state-specific requirements',
    icon: <Car className="w-8 h-8" />,
    color: 'bg-blue-500',
    variables: ['state_name', 'state_code', 'avg_premium', 'min_coverage', 'top_insurer', 'uninsured_rate'],
    sampleData: {
      state_name: 'California',
      state_code: 'CA',
      avg_premium: '$1,500/year',
      min_coverage: '15/30/5',
      top_insurer: 'State Farm',
      uninsured_rate: '12%'
    }
  },
  {
    id: 'home',
    name: 'Home Insurance',
    description: 'Homeowners insurance with property coverage details',
    icon: <Home className="w-8 h-8" />,
    color: 'bg-green-500',
    variables: ['state_name', 'state_code', 'avg_premium', 'avg_home_value', 'natural_disasters', 'top_insurer'],
    sampleData: {
      state_name: 'California',
      state_code: 'CA',
      avg_premium: '$1,200/year',
      avg_home_value: '$750,000',
      natural_disasters: 'Earthquakes, Wildfires',
      top_insurer: 'State Farm'
    }
  },
  {
    id: 'health',
    name: 'Health Insurance',
    description: 'Health coverage and Medicare information',
    icon: <Stethoscope className="w-8 h-8" />,
    color: 'bg-red-500',
    variables: ['state_name', 'state_code', 'avg_premium', 'uninsured_rate', 'top_insurer', 'medicare_enrollment'],
    sampleData: {
      state_name: 'California',
      state_code: 'CA',
      avg_premium: '$450/month',
      uninsured_rate: '7%',
      top_insurer: 'Kaiser Permanente',
      medicare_enrollment: '2.5M'
    }
  },
  {
    id: 'life',
    name: 'Life Insurance',
    description: 'Term and whole life insurance options',
    icon: <Heart className="w-8 h-8" />,
    color: 'bg-pink-500',
    variables: ['state_name', 'state_code', 'avg_rate', 'top_insurer', 'avg_coverage', 'policy_types'],
    sampleData: {
      state_name: 'California',
      state_code: 'CA',
      avg_rate: '$30/month',
      top_insurer: 'Northwestern Mutual',
      avg_coverage: '$250,000',
      policy_types: 'Term, Whole, Universal'
    }
  },
  {
    id: 'motorcycle',
    name: 'Motorcycle Insurance',
    description: 'Motorcycle and scooter coverage',
    icon: <Zap className="w-8 h-8" />,
    color: 'bg-purple-500',
    variables: ['state_name', 'state_code', 'avg_premium', 'min_coverage', 'helmet_law', 'top_insurer'],
    sampleData: {
      state_name: 'California',
      state_code: 'CA',
      avg_premium: '$800/year',
      min_coverage: '15/30/5',
      helmet_law: 'Required',
      top_insurer: 'Progressive'
    }
  },
  {
    id: 'pet',
    name: 'Pet Insurance',
    description: 'Dog and cat health insurance',
    icon: <Dog className="w-8 h-8" />,
    color: 'bg-orange-500',
    variables: ['state_name', 'state_code', 'avg_premium', 'top_insurer', 'popular_breeds', 'coverage_types'],
    sampleData: {
      state_name: 'California',
      state_code: 'CA',
      avg_premium: '$45/month',
      top_insurer: 'Trupanion',
      popular_breeds: 'Labrador, French Bulldog',
      coverage_types: 'Accident, Illness, Wellness'
    }
  },
  {
    id: 'business',
    name: 'Business Insurance',
    description: 'Commercial and small business coverage',
    icon: <Briefcase className="w-8 h-8" />,
    color: 'bg-indigo-500',
    variables: ['state_name', 'state_code', 'avg_premium', 'top_insurer', 'business_types', 'required_coverage'],
    sampleData: {
      state_name: 'California',
      state_code: 'CA',
      avg_premium: '$1,800/year',
      top_insurer: 'Hiscox',
      business_types: 'LLC, Corp, Sole Prop',
      required_coverage: 'GL, WC, PL'
    }
  },
  {
    id: 'renters',
    name: 'Renters Insurance',
    description: 'Rental property coverage',
    icon: <Building className="w-8 h-8" />,
    color: 'bg-teal-500',
    variables: ['state_name', 'state_code', 'avg_premium', 'avg_rent', 'top_insurer', 'coverage_types'],
    sampleData: {
      state_name: 'California',
      state_code: 'CA',
      avg_premium: '$180/year',
      avg_rent: '$2,500/month',
      top_insurer: 'Lemonade',
      coverage_types: 'Personal Property, Liability'
    }
  },
  {
    id: 'umbrella',
    name: 'Umbrella Insurance',
    description: 'Extra liability coverage',
    icon: <Umbrella className="w-8 h-8" />,
    color: 'bg-cyan-500',
    variables: ['state_name', 'state_code', 'avg_premium', 'coverage_limits', 'top_insurer', 'recommended_for'],
    sampleData: {
      state_name: 'California',
      state_code: 'CA',
      avg_premium: '$400/year',
      coverage_limits: '$1M - $5M',
      top_insurer: 'RLI',
      recommended_for: 'High net worth individuals'
    }
  }
];

interface CsvRow {
  [key: string]: string;
}

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const handleUploadClick = (template: Template) => {
    setSelectedTemplate(template);
    setUploadOpen(true);
    setCsvData([]);
    setUploadResult(null);
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileExt = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        let parsed: CsvRow[] = [];

        if (fileExt === 'csv') {
          const lines = String(data).split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          parsed = lines.slice(1).filter(line => line.trim()).map(line => {
            const values = line.split(',');
            const row: CsvRow = {};
            headers.forEach((header, i) => {
              row[header] = values[i]?.trim() || '';
            });
            return row;
          });
        } else if (fileExt === 'json') {
          parsed = JSON.parse(String(data));
          if (!Array.isArray(parsed)) {
            throw new Error('JSON must be an array of objects');
          }
        } else if (fileExt === 'xlsx' || fileExt === 'xls') {
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          parsed = XLSX.utils.sheet_to_json(firstSheet) as CsvRow[];
        }

        setCsvData(parsed);
      } catch (error) {
        alert('Error parsing file: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    };

    if (fileExt === 'xlsx' || fileExt === 'xls') {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  }, []);

  const handleGeneratePages = async () => {
    if (!selectedTemplate || csvData.length === 0) return;

    setUploading(true);
    setUploadResult(null);

    try {
      const res = await fetch('/api/pages/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          data: csvData
        })
      });

      const result = await res.json();
      setUploadResult({
        success: result.created || 0,
        failed: result.failed || 0,
        errors: result.errors || []
      });

      if (result.created > 0) {
        setCsvData([]);
      }
    } catch (error) {
      setUploadResult({
        success: 0,
        failed: csvData.length,
        errors: ['Network error: ' + (error instanceof Error ? error.message : 'Unknown error')]
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadSample = (template: Template, format: 'csv' | 'json') => {
    if (format === 'csv') {
      const headers = template.variables.join(',');
      const row = template.variables.map(v => template.sampleData[v] || '').join(',');
      const csv = `${headers}\n${row}`;
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sample-${template.id}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const json = JSON.stringify([template.sampleData], null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sample-${template.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
            <p className="text-gray-600 mt-1">
              Choose an insurance template, upload your data, and generate pages instantly
            </p>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map(template => (
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Template Header */}
              <div className={`h-32 ${template.color} flex items-center justify-center text-white`}>
                {template.icon}
              </div>

              {/* Template Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {template.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {template.description}
                </p>

                {/* Variables */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-1">Variables:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.slice(0, 4).map(v => (
                      <span key={v} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {v}
                      </span>
                    ))}
                    {template.variables.length > 4 && (
                      <span className="text-xs text-gray-400">+{template.variables.length - 4}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(template)}
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Preview Variables
                  </button>
                  <button
                    onClick={() => handleUploadClick(template)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Generate Pages
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Preview Modal */}
        {previewOpen && selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className={`${selectedTemplate.color} text-white p-1 rounded`}>
                    {selectedTemplate.icon}
                  </span>
                  {selectedTemplate.name} - Variables
                </h3>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Template Variables</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Variable</th>
                        <th className="text-left py-2">Sample Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTemplate.variables.map(variable => (
                        <tr key={variable} className="border-b last:border-0">
                          <td className="py-2 font-mono text-blue-600">{variable}</td>
                          <td className="py-2">{selectedTemplate.sampleData[variable] || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Sample Data (JSON)</h4>
                  <pre className="text-xs text-blue-800 overflow-x-auto">
                    {JSON.stringify(selectedTemplate.sampleData, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="p-4 border-t flex gap-2">
                <button
                  onClick={() => downloadSample(selectedTemplate, 'csv')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Download CSV Sample
                </button>
                <button
                  onClick={() => downloadSample(selectedTemplate, 'json')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Download JSON Sample
                </button>
                <button
                  onClick={() => {
                    setPreviewOpen(false);
                    handleUploadClick(selectedTemplate);
                  }}
                  className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Generate Pages
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {uploadOpen && selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Generate {selectedTemplate.name} Pages
                </h3>
                <button
                  onClick={() => setUploadOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto max-h-[70vh]">
                {/* Step 1: Upload */}
                {csvData.length === 0 && !uploadResult && (
                  <>
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">1. Upload Your Data</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload a CSV, JSON, or Excel file with your page data. 
                        Your file must include these columns: <code className="bg-gray-100 px-1 rounded">{selectedTemplate.variables.join(', ')}</code>
                      </p>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          accept=".csv,.json,.xlsx,.xls"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer inline-flex flex-col items-center"
                        >
                          <span className="text-4xl mb-2">📁</span>
                          <span className="text-blue-600 font-medium">Click to upload</span>
                          <span className="text-gray-400 text-sm mt-1">
                            CSV, JSON, or Excel files
                          </span>
                        </label>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => downloadSample(selectedTemplate, 'csv')}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Download CSV sample
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => downloadSample(selectedTemplate, 'json')}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Download JSON sample
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Required Columns/Fields:</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.variables.map(v => (
                          <span key={v} className="text-sm bg-white border px-2 py-1 rounded font-mono">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Review */}
                {csvData.length > 0 && !uploadResult && (
                  <>
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        2. Review Data ({csvData.length} rows)
                      </h4>
                      <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              {Object.keys(csvData[0]).map(key => (
                                <th key={key} className="text-left px-3 py-2 border-b font-medium">
                                  {key}
                                  {selectedTemplate.variables.includes(key) && (
                                    <span className="text-green-600 ml-1" title="Required">✓</span>
                                  )}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {csvData.slice(0, 5).map((row, i) => (
                              <tr key={i} className="border-b last:border-0">
                                {Object.values(row).map((value, j) => (
                                  <td key={j} className="px-3 py-2 truncate max-w-[200px]">
                                    {String(value)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {csvData.length > 5 && (
                          <p className="text-center text-sm text-gray-500 py-2">
                            ... and {csvData.length - 5} more rows
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setCsvData([])}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Change File
                      </button>
                      <button
                        onClick={handleGeneratePages}
                        disabled={uploading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {uploading ? (
                          <>
                            <span className="animate-spin">⟳</span>
                            Generating...
                          </>
                        ) : (
                          `Generate ${csvData.length} Pages`
                        )}
                      </button>
                    </div>
                  </>
                )}

                {/* Step 3: Result */}
                {uploadResult && (
                  <div className="text-center py-8">
                    {uploadResult.failed === 0 ? (
                      <div className="text-green-600 text-6xl mb-4">✓</div>
                    ) : (
                      <div className="text-yellow-600 text-6xl mb-4">⚠</div>
                    )}
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {uploadResult.failed === 0 ? 'All Pages Created!' : 'Partial Success'}
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Successfully created {uploadResult.success} pages
                      {uploadResult.failed > 0 && `, ${uploadResult.failed} failed`}
                    </p>
                    
                    {uploadResult.errors.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left">
                        <h5 className="font-medium text-red-900 mb-2">Errors:</h5>
                        <ul className="text-sm text-red-700 list-disc pl-4">
                          {uploadResult.errors.slice(0, 5).map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                          {uploadResult.errors.length > 5 && (
                            <li>... and {uploadResult.errors.length - 5} more</li>
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          setUploadResult(null);
                          setCsvData([]);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Upload Another File
                      </button>
                      <button
                        onClick={() => router.push('/dashboard/pages')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        View Pages
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
