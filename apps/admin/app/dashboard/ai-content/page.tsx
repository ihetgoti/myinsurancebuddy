'use client';

import { useState, useEffect } from 'react';
import { Play, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
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

interface AIJob {
  id: string;
  name: string;
  status: string;
  totalPages: number;
  processedPages: number;
  successfulPages: number;
  failedPages: number;
  model: string;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export default function AIContentPage() {
  const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [jobs, setJobs] = useState<AIJob[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    insuranceTypeId: '',
    stateId: '',
    geoLevel: '',
    priority: 'all'
  });

  const [settings, setSettings] = useState({
    sections: {
      intro: true,
      requirements: true,
      faqs: true,
      tips: true
    },
    model: 'xiaomi/mimo-v2-flash', // Default to FREE PREMIUM model (until Jan 26!)
    batchSize: 10,
    delayBetweenBatches: 1000
  });

  useEffect(() => {
    fetchInsuranceTypes();
    fetchStates();
    fetchJobs();
  }, []);

  const fetchInsuranceTypes = async () => {
    try {
      const res = await fetch('/api/insurance-types');
      const data = await res.json();
      setInsuranceTypes(data.types || []);
    } catch (error) {
      console.error('Failed to fetch insurance types:', error);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await fetch('/api/states');
      const data = await res.json();
      setStates(data.states || []);
    } catch (error) {
      console.error('Failed to fetch states:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/ai-generate');
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const startGeneration = async () => {
    if (!confirm('This will start AI content generation. Continue?')) return;

    setLoading(true);
    try {
      const sections = Object.entries(settings.sections)
        .filter(([_, enabled]) => enabled)
        .map(([section]) => section);

      const res = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filters: {
            insuranceTypeId: filters.insuranceTypeId || undefined,
            stateId: filters.stateId || undefined,
            geoLevel: filters.geoLevel || undefined
          },
          sections,
          model: settings.model,
          batchSize: settings.batchSize,
          delayBetweenBatches: settings.delayBetweenBatches,
          priority: filters.priority
        })
      });

      const data = await res.json();

      if (data.success) {
        alert(`Started AI generation for ${data.totalPages} pages! Job ID: ${data.jobId}`);
        fetchJobs();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error: any) {
      alert(`Failed to start generation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'PROCESSING':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">AI Content Generation</h1>
          <p className="text-gray-600 mt-1">
            Generate unique content for your pages using AI
          </p>
        </div>

        {/* URGENT: Limited Time Offer Banner */}
        <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-orange-300 rounded-lg p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="bg-orange-500 text-white rounded-full p-2 flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-orange-900 text-lg">🔥 URGENT: Premium FREE Model Available - Act Now!</h3>
              <p className="text-orange-800 mt-1">
                <strong>MiMo-V2-Flash by Xiaomi</strong> is FREE and comparable to Claude Sonnet 4.5 quality!
                <br />
                ⚠️ <strong className="text-red-700">Only available until January 26, 2026 (2 days left!)</strong>
              </p>
              <div className="mt-2 flex gap-4 text-sm">
                <span className="text-orange-700">✓ FREE ($0/M tokens)</span>
                <span className="text-orange-700">✓ 262K context</span>
                <span className="text-orange-700">✓ Claude Sonnet 4.5 quality</span>
                <span className="text-orange-700">✓ #1 on SWE-bench</span>
              </div>
              <p className="mt-2 text-sm font-bold text-red-700">
                💡 Generate your 500k pages NOW before this model disappears! After Jan 26, fall back to DeepSeek R1.
              </p>
            </div>
          </div>
        </div>

        {/* Generation Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Generation Settings</h2>

          <div className="space-y-6">
            {/* Filters */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Target Pages</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insurance Type
                  </label>
                  <select
                    value={filters.insuranceTypeId}
                    onChange={(e) => setFilters({ ...filters, insuranceTypeId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Types</option>
                    {insuranceTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    value={filters.stateId}
                    onChange={(e) => setFilters({ ...filters, stateId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All States</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="all">All Pages</option>
                    <option value="major-cities">Major Cities Only</option>
                    <option value="states-only">States Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Content Sections</h3>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(settings.sections).map(([section, enabled]) => (
                  <label key={section} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          sections: { ...settings.sections, [section]: e.target.checked }
                        })
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 capitalize">{section}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* AI Settings */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">AI Configuration</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <select
                    value={settings.model}
                    onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <optgroup label="🆓 FREE Models">
                      <option value="xiaomi/mimo-v2-flash">🔥 MiMo-V2-Flash (FREE - BEST!) ⚠️ URGENT: Ends Jan 26</option>
                      <option value="deepseek/deepseek-r1">DeepSeek R1 (FREE - Xiaomi) ⭐</option>
                      <option value="deepseek/deepseek-chat">DeepSeek Chat (FREE)</option>
                      <option value="google/gemini-2.0-flash-exp">Gemini 2.0 Flash (FREE)</option>
                      <option value="qwen/qwen-2.5-72b-instruct">Qwen 2.5 72B (FREE)</option>
                    </optgroup>
                    <optgroup label="💰 Ultra Cheap">
                      <option value="google/gemini-flash-1.5">Gemini Flash 1.5 ($0.075/M)</option>
                      <option value="openai/gpt-4o-mini">GPT-4o Mini ($0.15/M)</option>
                    </optgroup>
                    <optgroup label="💵 Premium">
                      <option value="anthropic/claude-haiku">Claude Haiku ($0.25/M)</option>
                      <option value="anthropic/claude-haiku-3.5">Claude Haiku 3.5 ($0.80/M)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Size
                  </label>
                  <input
                    type="number"
                    value={settings.batchSize}
                    onChange={(e) =>
                      setSettings({ ...settings, batchSize: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="1"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delay (ms)
                  </label>
                  <input
                    type="number"
                    value={settings.delayBetweenBatches}
                    onChange={(e) =>
                      setSettings({ ...settings, delayBetweenBatches: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="0"
                    max="10000"
                    step="100"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={startGeneration}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start AI Generation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generation Jobs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Recent Jobs</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <div key={job.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <div className="font-medium text-gray-900">{job.name}</div>
                      <div className="text-sm text-gray-500">
                        Model: {job.model.split('/')[1]} • Started:{' '}
                        {new Date(job.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {job.processedPages} / {job.totalPages} pages
                    </div>
                    <div className="text-xs text-gray-500">
                      {job.successfulPages} successful • {job.failedPages} failed
                    </div>
                  </div>
                </div>

                {job.status === 'PROCESSING' && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(job.processedPages / job.totalPages) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {jobs.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500">
                No generation jobs yet. Start your first one above!
              </div>
            )}
          </div>
        </div>

        {/* Help Info */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-2">💰 Cost Estimation</h3>
          <div className="text-sm text-green-800 space-y-1">
            <p className="text-lg font-bold text-green-900 mb-2">
              🎉 FREE MODELS - Generate UNLIMITED pages at $0 cost!
            </p>
            <p className="text-orange-700 font-bold">
              <strong>🔥 MiMo-V2-Flash (Xiaomi):</strong> FREE - BEST QUALITY! ⚠️ Until Jan 26 only!
            </p>
            <p>
              <strong>DeepSeek R1 (Xiaomi):</strong> FREE - Unlimited pages! ⭐ Use after Jan 26
            </p>
            <p>
              <strong>DeepSeek Chat:</strong> FREE - Unlimited pages!
            </p>
            <p>
              <strong>Gemini 2.0 Flash Exp:</strong> FREE - Unlimited pages!
            </p>
            <p>
              <strong>Qwen 2.5 72B:</strong> FREE - Unlimited pages!
            </p>
            <hr className="my-2 border-green-200" />
            <p className="text-xs text-green-700">
              <strong>Paid alternatives (if free models are rate-limited):</strong>
            </p>
            <p className="text-xs">
              Gemini Flash: $0.0001/page = $50 for 500k pages
            </p>
            <p className="text-xs">
              GPT-4o Mini: $0.0002/page = $100 for 500k pages
            </p>
            <p className="mt-2 font-medium text-green-900">
              With FREE models, you can generate ALL 500,000 pages at $0 cost! 🚀
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
