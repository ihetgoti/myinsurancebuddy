'use client';

import { useState, useEffect } from 'react';
import { Rocket, Loader2, CheckCircle2, Info } from 'lucide-react';
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

interface Template {
  id: string;
  name: string;
  insuranceType: string;
}

export default function AutoGeneratePage() {
  const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [config, setConfig] = useState({
    insuranceTypeId: '',
    stateIds: [] as string[],
    geoLevels: ['STATE', 'CITY'] as string[],
    templateId: '',
    model: 'xiaomi/mimo-v2-flash',
    sections: {
      intro: true,
      requirements: true,
      faqs: true,
      tips: true,
      costBreakdown: true,
      comparison: true,
      discounts: true,
      localStats: true,
      coverageGuide: true,
      claimsProcess: true,
      buyersGuide: true,
      metaTags: true
    }
  });

  useEffect(() => {
    fetchInsuranceTypes();
    fetchStates();
    fetchTemplates();
  }, []);

  const fetchInsuranceTypes = async () => {
    try {
      const res = await fetch('/api/insurance-types');
      const data = await res.json();
      setInsuranceTypes(Array.isArray(data) ? data : (data.types || []));
    } catch (error) {
      console.error('Failed to fetch insurance types:', error);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await fetch('/api/states');
      const data = await res.json();
      setStates(Array.isArray(data) ? data : (data.states || []));
    } catch (error) {
      console.error('Failed to fetch states:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/ai-templates');
      const data = await res.json();
      setTemplates(Array.isArray(data) ? data : (data.templates || []));
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const handleSelectAllStates = () => {
    if (config.stateIds.length === states.length) {
      setConfig({ ...config, stateIds: [] });
    } else {
      setConfig({ ...config, stateIds: states.map(s => s.id) });
    }
  };

  const handleStateToggle = (stateId: string) => {
    if (config.stateIds.includes(stateId)) {
      setConfig({ ...config, stateIds: config.stateIds.filter(id => id !== stateId) });
    } else {
      setConfig({ ...config, stateIds: [...config.stateIds, stateId] });
    }
  };

  const startAutoGenerate = async () => {
    if (!config.insuranceTypeId) {
      alert('Please select an insurance type');
      return;
    }

    if (config.stateIds.length === 0) {
      alert('Please select at least one state');
      return;
    }

    if (!confirm(`This will create pages and generate AI content for ${config.stateIds.length} states. Continue?`)) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const sections = Object.entries(config.sections)
        .filter(([_, enabled]) => enabled)
        .map(([section]) => section);

      const res = await fetch('/api/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insuranceTypeId: config.insuranceTypeId,
          stateIds: config.stateIds,
          geoLevels: config.geoLevels,
          templateId: config.templateId || undefined,
          model: config.model,
          sections
        })
      });

      const data = await res.json();
      setResult(data);

      if (data.success) {
        alert(`Successfully generated ${data.pagesCreated} pages with AI content!`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error: any) {
      alert(`Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedInsuranceType = insuranceTypes.find(t => t.id === config.insuranceTypeId);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Auto Generate Pages</h1>
          <p className="text-gray-600 mt-1">
            Create pages AND generate AI content in one click
          </p>
        </div>

        {/* How it works */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">How Auto Generate Works</h3>
              <ol className="mt-2 text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Select an insurance type (e.g., Car Insurance)</li>
                <li>Select the states you want to generate pages for</li>
                <li>Choose geo levels (state pages, city pages, or both)</li>
                <li>Optionally select a template for AI prompts</li>
                <li>Click Generate - pages are created AND filled with AI content automatically!</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="space-y-6">
            {/* Insurance Type Selection */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">1. Select Insurance Type</h3>
              <div className="grid grid-cols-3 gap-3">
                {insuranceTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setConfig({ ...config, insuranceTypeId: type.id })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      config.insuranceTypeId === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{type.name}</div>
                    <div className="text-sm text-gray-500">{type.slug}</div>
                  </button>
                ))}
              </div>
              {insuranceTypes.length === 0 && (
                <p className="text-gray-500">Loading insurance types...</p>
              )}
            </div>

            {/* State Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">2. Select States</h3>
                <button
                  onClick={handleSelectAllStates}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {config.stateIds.length === states.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                {states.map((state) => (
                  <label
                    key={state.id}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                      config.stateIds.includes(state.id) ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={config.stateIds.includes(state.id)}
                      onChange={() => handleStateToggle(state.id)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{state.code}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {config.stateIds.length} of {states.length} states selected
              </p>
            </div>

            {/* Geo Level Selection */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">3. Select Page Types</h3>
              <div className="flex gap-4">
                {[
                  { value: 'STATE', label: 'State Pages', desc: 'e.g., car-insurance/california' },
                  { value: 'CITY', label: 'City Pages', desc: 'e.g., car-insurance/california/los-angeles' }
                ].map(({ value, label, desc }) => (
                  <label
                    key={value}
                    className={`flex-1 p-4 rounded-lg border-2 cursor-pointer ${
                      config.geoLevels.includes(value)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.geoLevels.includes(value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConfig({ ...config, geoLevels: [...config.geoLevels, value] });
                          } else {
                            setConfig({ ...config, geoLevels: config.geoLevels.filter(l => l !== value) });
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="font-medium">{label}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 ml-6">{desc}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">4. AI Template (Optional)</h3>
              <select
                value={config.templateId}
                onChange={(e) => setConfig({ ...config, templateId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Use default prompts</option>
                {templates
                  .filter(t => !config.insuranceTypeId || t.insuranceType === selectedInsuranceType?.slug || t.insuranceType === 'all')
                  .map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.insuranceType})
                    </option>
                  ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Templates customize the AI prompts for better content quality
              </p>
            </div>

            {/* Model Selection */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">5. AI Model</h3>
              <select
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <optgroup label="FREE Models">
                  <option value="xiaomi/mimo-v2-flash">MiMo-V2-Flash (FREE - BEST!) Until Jan 26</option>
                  <option value="deepseek/deepseek-r1">DeepSeek R1 (FREE)</option>
                  <option value="deepseek/deepseek-chat">DeepSeek Chat (FREE)</option>
                  <option value="google/gemini-2.0-flash-exp">Gemini 2.0 Flash (FREE)</option>
                </optgroup>
                <optgroup label="Paid Models">
                  <option value="google/gemini-flash-1.5">Gemini Flash 1.5 ($0.075/M)</option>
                  <option value="openai/gpt-4o-mini">GPT-4o Mini ($0.15/M)</option>
                </optgroup>
              </select>
            </div>

            {/* Content Sections */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">6. Content Sections</h3>
              <div className="grid grid-cols-4 gap-3 bg-gray-50 p-4 rounded-lg">
                {Object.entries(config.sections).map(([key, enabled]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => setConfig({
                        ...config,
                        sections: { ...config.sections, [key]: e.target.checked }
                      })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={startAutoGenerate}
              disabled={loading || !config.insuranceTypeId || config.stateIds.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Pages & Content...
                </>
              ) : (
                <>
                  <Rocket className="w-6 h-6" />
                  Auto Generate Pages with AI Content
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className={`bg-white rounded-lg shadow-sm p-6 mb-6 border-2 ${result.success ? 'border-green-500' : 'border-red-500'}`}>
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <div className="w-6 h-6 text-red-600">X</div>
              )}
              <div>
                <h3 className="font-semibold text-lg">
                  {result.success ? 'Generation Complete!' : 'Generation Failed'}
                </h3>
                {result.success && (
                  <div className="mt-2 space-y-1 text-sm">
                    <p>Pages created: <strong>{result.pagesCreated}</strong></p>
                    <p>Pages skipped (already exist): <strong>{result.pagesSkipped || 0}</strong></p>
                    <p>AI content generated: <strong>{result.contentGenerated}</strong></p>
                    {result.errors?.length > 0 && (
                      <div className="mt-2 p-2 bg-red-50 rounded">
                        <p className="text-red-700 font-medium">Errors:</p>
                        <ul className="list-disc list-inside text-red-600">
                          {result.errors.slice(0, 5).map((err: string, i: number) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {!result.success && (
                  <p className="text-red-600 mt-1">{result.message}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
