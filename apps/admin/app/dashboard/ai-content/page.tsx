'use client';

import { useState, useEffect } from 'react';
import { Play, Loader2, CheckCircle2, XCircle, Clock, StopCircle } from 'lucide-react';
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
    priority: 'all',
    regenerate: false,
    includeDrafts: true // Default to true - create as drafts, publish later
  });

  const [settings, setSettings] = useState({
    sections: {
      // Original sections
      intro: true,
      requirements: true,
      faqs: true,
      tips: true,
      // New SEO sections
      costBreakdown: false,
      comparison: false,
      discounts: false,
      localStats: false,
      coverageGuide: false,
      claimsProcess: false,
      buyersGuide: false,
      // Meta tags
      metaTags: false
    },
    model: 'deepseek/deepseek-r1:free', // Default to free model
    batchSize: 10,
    delayBetweenBatches: 1000
  });

  useEffect(() => {
    fetchInsuranceTypes();
    fetchStates();
    fetchJobs();
  }, []);

  // Auto-refresh jobs every 5 seconds when there's a processing job
  useEffect(() => {
    const hasProcessingJob = jobs.some(job => job.status === 'PROCESSING');
    if (hasProcessingJob) {
      const interval = setInterval(fetchJobs, 5000);
      return () => clearInterval(interval);
    }
  }, [jobs]);

  const fetchInsuranceTypes = async () => {
    try {
      const res = await fetch('/api/insurance-types');
      const data = await res.json();
      // API returns array directly, not { types: [...] }
      setInsuranceTypes(Array.isArray(data) ? data : (data.types || []));
    } catch (error) {
      console.error('Failed to fetch insurance types:', error);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await fetch('/api/states');
      const data = await res.json();
      // API may return array directly or { states: [...] }
      setStates(Array.isArray(data) ? data : (data.states || []));
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
          priority: filters.priority,
          regenerate: filters.regenerate,
          includeDrafts: filters.includeDrafts
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

  const cancelJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to cancel this job?')) return;

    try {
      const res = await fetch(`/api/ai-generate?jobId=${jobId}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        alert('Job cancelled successfully');
        fetchJobs();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Failed to cancel job: ${error.message}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'CANCELLED':
        return <StopCircle className="w-5 h-5 text-orange-600" />;
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

        {/* Info Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            Generate unique content for your insurance pages using free AI models. 
            Only models ending with <code>:free</code> will be used to protect your deposit.
          </p>
        </div>

        {/* Workflow Guide */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-3">📋 Recommended Workflow for SEO</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="font-bold text-blue-800 mb-1">Step 1: State Pages</div>
              <p className="text-blue-700">Set Geo Level to &quot;State Pages Only&quot; and select your insurance type. Generate AI content for all state pages first.</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="font-bold text-blue-800 mb-1">Step 2: City Pages</div>
              <p className="text-blue-700">Set Geo Level to &quot;City Pages Only&quot;. Generate AI content for city pages after states are done.</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="font-bold text-blue-800 mb-1">Step 3: Review</div>
              <p className="text-blue-700">Go to Dynamic Pages to review the generated content. Pages are created as drafts.</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="font-bold text-blue-800 mb-1">Step 4: Publish Slowly</div>
              <p className="text-blue-700">Publish 50-100 pages per day to avoid looking spammy to search engines.</p>
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
              <div className="grid grid-cols-4 gap-4">
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
                    Geo Level
                  </label>
                  <select
                    value={filters.geoLevel}
                    onChange={(e) => setFilters({ ...filters, geoLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Levels</option>
                    <option value="STATE">State Pages Only</option>
                    <option value="CITY">City Pages Only</option>
                    <option value="COUNTRY">Country Pages Only</option>
                    <option value="NICHE">Niche Pages Only</option>
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
                    <option value="states-only">States Only (Legacy)</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.includeDrafts}
                    onChange={(e) => setFilters({ ...filters, includeDrafts: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    Include draft pages
                    <span className="text-gray-500 ml-1">(generate for unpublished pages - recommended for SEO)</span>
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.regenerate}
                    onChange={(e) => setFilters({ ...filters, regenerate: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    Regenerate existing AI content
                    <span className="text-gray-500 ml-1">(include pages that already have AI content)</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Content Sections */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Content Sections</h3>

              {/* Original Sections */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">📝 Core Content</h4>
                <div className="grid grid-cols-4 gap-4 bg-gray-50 p-3 rounded-lg">
                  {(['intro', 'requirements', 'faqs', 'tips'] as const).map((section) => (
                    <label key={section} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.sections[section]}
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

              {/* New SEO Sections */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-green-600 mb-2">🚀 NEW: SEO Sections (Recommended for better indexing)</h4>
                <div className="grid grid-cols-4 gap-4 bg-green-50 p-3 rounded-lg">
                  {([
                    { key: 'costBreakdown', label: 'Cost Breakdown' },
                    { key: 'comparison', label: 'Provider Comparison' },
                    { key: 'discounts', label: 'Discounts' },
                    { key: 'localStats', label: 'Local Statistics' },
                    { key: 'coverageGuide', label: 'Coverage Guide' },
                    { key: 'claimsProcess', label: 'Claims Process' },
                    { key: 'buyersGuide', label: 'Buyers Guide' }
                  ] as const).map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.sections[key]}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            sections: { ...settings.sections, [key]: e.target.checked }
                          })
                        }
                        className="rounded border-green-300"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Meta Tags Section */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-purple-600 mb-2">🏷️ SEO Meta Tags (Unique per page)</h4>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.sections.metaTags}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          sections: { ...settings.sections, metaTags: e.target.checked }
                        })
                      }
                      className="rounded border-purple-300"
                    />
                    <span className="text-sm text-gray-700">Generate Meta Tags</span>
                    <span className="text-xs text-purple-600 ml-2">(metaTitle, metaDescription, OG tags, Twitter tags)</span>
                  </label>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setSettings({
                    ...settings,
                    sections: {
                      intro: true, requirements: true, faqs: true, tips: true,
                      costBreakdown: true, comparison: true, discounts: true, localStats: true,
                      coverageGuide: true, claimsProcess: true, buyersGuide: true, metaTags: true
                    }
                  })}
                  className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({
                    ...settings,
                    sections: {
                      intro: true, requirements: true, faqs: true, tips: true,
                      costBreakdown: false, comparison: false, discounts: false, localStats: false,
                      coverageGuide: false, claimsProcess: false, buyersGuide: false, metaTags: false
                    }
                  })}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Core Only
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({
                    ...settings,
                    sections: {
                      intro: false, requirements: false, faqs: false, tips: false,
                      costBreakdown: true, comparison: true, discounts: true, localStats: true,
                      coverageGuide: true, claimsProcess: true, buyersGuide: true, metaTags: true
                    }
                  })}
                  className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                >
                  New SEO Only
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({
                    ...settings,
                    sections: {
                      intro: false, requirements: false, faqs: false, tips: false,
                      costBreakdown: false, comparison: false, discounts: false, localStats: false,
                      coverageGuide: false, claimsProcess: false, buyersGuide: false, metaTags: false
                    }
                  })}
                  className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Clear All
                </button>
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
                      <option value="deepseek/deepseek-r1:free">DeepSeek R1 (Free)</option>
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
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Jobs</h2>
            {jobs.some(job => job.status === 'PROCESSING') && (
              <span className="flex items-center gap-2 text-sm text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                Auto-refreshing...
              </span>
            )}
          </div>

          <div className="divide-y divide-gray-200">
            {jobs.map((job) => {
              const remaining = job.totalPages - job.processedPages;
              const percentage = job.totalPages > 0 ? Math.round((job.processedPages / job.totalPages) * 100) : 0;

              return (
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
                        {job.status === 'PROCESSING' && (
                          <span className="text-blue-600 ml-2">({remaining} remaining)</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="text-green-600">{job.successfulPages} created</span>
                        {job.failedPages > 0 && (
                          <span className="text-red-600 ml-2">• {job.failedPages} failed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {job.status === 'PROCESSING' && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <div className="flex items-center gap-2">
                          <span>{percentage}%</span>
                          <button
                            onClick={() => cancelJob(job.id)}
                            className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 flex items-center gap-1"
                          >
                            <StopCircle className="w-3 h-3" />
                            Cancel
                          </button>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {(job.status === 'PENDING' || job.status === 'QUEUED') && (
                    <div className="mt-2">
                      <button
                        onClick={() => cancelJob(job.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 flex items-center gap-1"
                      >
                        <StopCircle className="w-3 h-3" />
                        Cancel Job
                      </button>
                    </div>
                  )}

                  {job.status === 'COMPLETED' && (
                    <div className="mt-2 text-xs text-green-600">
                      Completed at {job.completedAt ? new Date(job.completedAt).toLocaleString() : 'N/A'}
                    </div>
                  )}
                </div>
              );
            })}

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
            <p>
              <strong>DeepSeek R1:</strong> FREE - Unlimited pages! ⭐
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
