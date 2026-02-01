'use client';

import { useState, useEffect, useCallback } from 'react';
import { Rocket, Loader2, CheckCircle2, Info, XCircle, Clock, RefreshCw, Trash2, Play, X } from 'lucide-react';
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
  insuranceTypeName?: string;
}

interface Job {
  id: string;
  name: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  totalPages: number;
  processedPages: number;
  successfulPages: number;
  failedPages: number;
  tokensUsed: number;
  estimatedCost: number;
  percentComplete?: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  errorLog?: any[];
  filters?: any;
  sections?: string[];
  model?: string;
}

export default function AutoGeneratePage() {
  const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const [config, setConfig] = useState({
    insuranceTypeId: '',
    stateIds: [] as string[],
    geoLevels: ['STATE', 'CITY'] as string[],
    templateId: '',
    model: 'deepseek/deepseek-r1:free',
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
    console.log('AutoGeneratePage mounting...');
    fetchInsuranceTypes();
    fetchStates();
    fetchTemplates();
    fetchJobs();
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

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

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/auto-generate');
      const data = await res.json();
      setJobs(data.jobs || []);

      // Check if there's an active job
      const running = (data.jobs || []).find((j: Job) => j.status === 'PROCESSING');
      if (running && !activeJob) {
        setActiveJob(running);
        startPolling(running.id);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const pollJobStatus = useCallback(async (jobId: string) => {
    try {
      const res = await fetch(`/api/auto-generate/${jobId}/status`);
      const data = await res.json();

      setActiveJob(data);

      // Update job in list
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...data } : j));

      // Stop polling if job is done
      if (data.status === 'COMPLETED' || data.status === 'FAILED' || data.status === 'CANCELLED') {
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        fetchJobs(); // Refresh the full list
      }
    } catch (error) {
      console.error('Failed to poll job status:', error);
    }
  }, [pollingInterval]);

  const startPolling = useCallback((jobId: string) => {
    // Clear any existing interval
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    // Poll immediately
    pollJobStatus(jobId);

    // Then poll every 2 seconds
    const interval = setInterval(() => pollJobStatus(jobId), 2000);
    setPollingInterval(interval);
  }, [pollingInterval, pollJobStatus]);

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

    try {
      const sections = Object.entries(config.sections)
        .filter(([_, enabled]) => enabled)
        .map(([section]) => section);

      // Step 1: Create the job
      const createRes = await fetch('/api/auto-generate', {
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

      const createData = await createRes.json();

      if (!createData.success) {
        alert(`Error: ${createData.message}`);
        setLoading(false);
        return;
      }

      const jobId = createData.jobId;

      // Step 2: Start execution
      const executeRes = await fetch(`/api/auto-generate/${jobId}/execute`, {
        method: 'POST'
      });

      const executeData = await executeRes.json();

      if (!executeData.success) {
        alert(`Error starting job: ${executeData.message}`);
        setLoading(false);
        return;
      }

      // Step 3: Start polling
      setActiveJob({
        id: jobId,
        name: `Job ${jobId.slice(0, 8)}...`,
        status: 'PROCESSING',
        totalPages: createData.estimatedTotal,
        processedPages: 0,
        successfulPages: 0,
        failedPages: 0,
        tokensUsed: 0,
        estimatedCost: 0,
        createdAt: new Date().toISOString()
      });

      startPolling(jobId);
      fetchJobs();

    } catch (error: any) {
      alert(`Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to cancel this job?')) return;

    try {
      const res = await fetch(`/api/auto-generate/${jobId}/status`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (data.success) {
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        setActiveJob(null);
        fetchJobs();
      } else {
        alert(`Error: ${data.message || data.error}`);
      }
    } catch (error: any) {
      alert(`Failed to cancel: ${error.message}`);
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm('Delete this job?')) return;

    try {
      const res = await fetch(`/api/auto-generate/${jobId}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (data.success) {
        fetchJobs();
        if (activeJob?.id === jobId) {
          setActiveJob(null);
        }
      } else {
        alert(`Error: ${data.message || data.error}`);
      }
    } catch (error: any) {
      alert(`Failed to delete: ${error.message}`);
    }
  };

  const selectedInsuranceType = insuranceTypes.find(t => t.id === config.insuranceTypeId);

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'PROCESSING': return 'text-blue-600 bg-blue-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'FAILED': return 'text-red-600 bg-red-100';
      case 'CANCELLED': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4" />;
      case 'PROCESSING': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'FAILED': return <XCircle className="w-4 h-4" />;
      case 'CANCELLED': return <X className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Auto Generate Pages</h1>
          <p className="text-gray-600 mt-1">
            Create pages AND generate AI content in one click
          </p>
        </div>

        {/* Active Job Progress */}
        {activeJob && (activeJob.status === 'PROCESSING' || activeJob.status === 'PENDING') && (
          <div className="mb-6 bg-white rounded-lg shadow-sm border-2 border-blue-500 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    Generating: {activeJob.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {activeJob.status === 'PENDING' ? 'Starting...' : 'Processing pages...'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => cancelJob(activeJob.id)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel Job
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{activeJob.processedPages} / {activeJob.totalPages} pages</span>
                <span>{activeJob.percentComplete || (activeJob.totalPages > 0 ? Math.round((activeJob.processedPages / activeJob.totalPages) * 100) : 0)}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${activeJob.percentComplete || (activeJob.totalPages > 0 ? Math.round((activeJob.processedPages / activeJob.totalPages) * 100) : 0)}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Success</span>
                </div>
                <p className="text-2xl font-bold text-green-800 mt-1">{activeJob.successfulPages}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-4 h-4" />
                  <span>Failed</span>
                </div>
                <p className="text-2xl font-bold text-red-800 mt-1">{activeJob.failedPages}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-700">
                  <span>Tokens</span>
                </div>
                <p className="text-2xl font-bold text-blue-800 mt-1">{activeJob.tokensUsed?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-purple-700">
                  <span>Est. Cost</span>
                </div>
                <p className="text-2xl font-bold text-purple-800 mt-1">${activeJob.estimatedCost?.toFixed(4) || '0.00'}</p>
              </div>
            </div>
          </div>
        )}

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
                    className={`p-4 rounded-lg border-2 text-left transition-all ${config.insuranceTypeId === type.id
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
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer ${config.stateIds.includes(state.id) ? 'bg-blue-100' : 'hover:bg-gray-100'
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
                    className={`flex-1 p-4 rounded-lg border-2 cursor-pointer ${config.geoLevels.includes(value)
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
                      {template.name} ({template.insuranceTypeName || template.insuranceType})
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
                  <option value="deepseek/deepseek-r1:free">DeepSeek R1 (Free)</option>
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
              disabled={loading || !config.insuranceTypeId || config.stateIds.length === 0 || (activeJob?.status === 'PROCESSING')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Creating Job...
                </>
              ) : activeJob?.status === 'PROCESSING' ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Job in Progress...
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

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-900">Recent Jobs</h3>
            <button
              onClick={fetchJobs}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {jobs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No jobs yet. Start your first auto-generate job above!</p>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className={`p-4 rounded-lg border ${activeJob?.id === job.id && job.status === 'PROCESSING'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        {job.status}
                      </span>
                      <span className="font-medium text-gray-900">{job.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{formatDate(job.createdAt)}</span>
                      {job.status === 'PROCESSING' ? (
                        <button
                          onClick={() => cancelJob(job.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Cancel job"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      ) : job.status === 'PENDING' ? (
                        <button
                          onClick={async () => {
                            await fetch(`/api/auto-generate/${job.id}/execute`, { method: 'POST' });
                            setActiveJob(job);
                            startPolling(job.id);
                          }}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Start job"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress info for completed/failed jobs */}
                  {(job.status === 'COMPLETED' || job.status === 'FAILED' || job.status === 'CANCELLED') && (
                    <div className="mt-2 text-sm text-gray-600 flex items-center gap-4">
                      <span>{job.totalPages} total pages</span>
                      <span className="text-green-600">{job.successfulPages} success</span>
                      {job.failedPages > 0 && <span className="text-red-600">{job.failedPages} failed</span>}
                      {job.tokensUsed > 0 && <span>{job.tokensUsed.toLocaleString()} tokens</span>}
                      {job.estimatedCost > 0 && <span>${job.estimatedCost.toFixed(4)} cost</span>}
                    </div>
                  )}

                  {/* Show progress bar for processing jobs */}
                  {job.status === 'PROCESSING' && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{job.processedPages} / {job.totalPages}</span>
                        <span>{Math.round((job.processedPages / job.totalPages) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${Math.round((job.processedPages / job.totalPages) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
