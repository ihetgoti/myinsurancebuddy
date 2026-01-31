'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Provider {
  id: string;
  name: string;
  preferredModel: string;
  isActive: boolean;
  requestCount: number;
  lastError: string | null;
  lastUsedAt: string | null;
}

interface Job {
  id: string;
  name: string;
  status: string;
  totalPages: number;
  processedPages: number;
  successfulPages: number;
  failedPages: number;
  isPaused: boolean;
  canResume: boolean;
  timeUntilResume: number | null;
}

export default function TestAIProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/ai-providers');
      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers || []);
        addLog(`Fetched ${data.providers?.length || 0} providers`);
      }
    } catch (e) {
      addLog('Error fetching providers');
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/auto-generate');
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        addLog(`Fetched ${data.jobs?.length || 0} jobs`);
      }
    } catch (e) {
      addLog('Error fetching jobs');
    }
  };

  const addTestProvider = async (num: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Test Account ${num}`,
          apiKey: `sk-or-v1-test-key-${num}`,
          preferredModel: num % 2 === 0 
            ? 'deepseek/deepseek-r1:free' 
            : 'google/gemini-2.0-flash-exp:free',
          priority: num,
          isActive: true
        })
      });
      
      if (res.ok) {
        addLog(`✅ Added Test Account ${num}`);
        fetchProviders();
      } else {
        const err = await res.json();
        addLog(`❌ Failed: ${err.error}`);
      }
    } catch (e: any) {
      addLog(`❌ Error: ${e.message}`);
    }
    setLoading(false);
  };

  const createTestJob = async () => {
    setLoading(true);
    try {
      const insRes = await fetch('/api/insurance-types');
      const insData = await insRes.json();
      
      if (!insData.types?.length) {
        addLog('❌ No insurance types found. Add one first.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Test Job ${new Date().toLocaleTimeString()}`,
          filters: {
            insuranceTypeId: insData.types[0].id,
            stateIds: [],
            geoLevels: ['STATE']
          },
          sections: ['intro', 'requirements'],
          model: 'deepseek/deepseek-r1:free',
          batchSize: 2,
          delayBetweenBatches: 1000
        })
      });

      if (res.ok) {
        const data = await res.json();
        addLog(`✅ Created job: ${data.job?.id?.slice(0, 8)}...`);
        fetchJobs();
      } else {
        const err = await res.json();
        addLog(`❌ Failed: ${err.error}`);
      }
    } catch (e: any) {
      addLog(`❌ Error: ${e.message}`);
    }
    setLoading(false);
  };

  const executeJob = async (jobId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/auto-generate/${jobId}/execute`, {
        method: 'POST'
      });

      if (res.ok) {
        addLog(`▶️ Started job ${jobId.slice(0, 8)}...`);
      } else {
        const err = await res.json();
        addLog(`❌ Failed: ${err.error}`);
      }
    } catch (e: any) {
      addLog(`❌ Error: ${e.message}`);
    }
    setLoading(false);
  };

  const checkJobStatus = async (jobId: string) => {
    try {
      const res = await fetch(`/api/auto-generate/${jobId}/status`);
      if (res.ok) {
        const data = await res.json();
        addLog(`📊 Job ${jobId.slice(0, 8)}: ${data.status} (${data.processedPages}/${data.totalPages})`);
        if (data.isPaused) {
          addLog(`⏸️ PAUSED - Resume in ${data.timeUntilResume} mins`);
        }
        fetchJobs();
      }
    } catch (e) {
      addLog('❌ Error checking status');
    }
  };

  const clearRateLimits = async () => {
    try {
      await fetch('/api/admin/ai-providers/clear-rate-limits', { method: 'POST' });
      addLog('🧹 Cleared rate limit status');
      fetchProviders();
    } catch (e) {
      addLog('❌ Error clearing rate limits');
    }
  };

  useEffect(() => {
    fetchProviders();
    fetchJobs();
    
    const interval = setInterval(() => {
      fetchJobs();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">AI Provider Testing</h1>
          <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Providers Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">AI Providers ({providers.length})</h2>
            </div>
            <div className="card-body">
              <div className="space-y-2 mb-4">
                {[1, 2, 3].map(num => (
                  <button
                    key={num}
                    onClick={() => addTestProvider(num)}
                    disabled={loading}
                    className="btn-primary text-sm mr-2"
                  >
                    + Test Provider {num}
                  </button>
                ))}
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {providers.map(p => (
                  <div key={p.id} className={`p-3 rounded border ${p.lastError ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-900">{p.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500">{p.preferredModel}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Requests: {p.requestCount}
                      {p.lastError && <span className="text-red-600 ml-2">⚠️ {p.lastError}</span>}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={clearRateLimits}
                className="btn-secondary mt-4 text-sm"
              >
                🧹 Clear Rate Limits
              </button>
            </div>
          </div>

          {/* Jobs Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Generation Jobs ({jobs.length})</h2>
            </div>
            <div className="card-body">
              <button
                onClick={createTestJob}
                disabled={loading}
                className="btn-primary mb-4"
              >
                + Create Test Job
              </button>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {jobs.map(job => (
                  <div key={job.id} className="p-3 rounded border border-slate-200 bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-slate-900 truncate max-w-xs">{job.name}</div>
                        <div className="text-sm text-slate-500">
                          {job.processedPages}/{job.totalPages} pages
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        job.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        job.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                        job.status === 'PAUSED' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    
                    {job.isPaused && (
                      <div className="text-amber-600 text-sm mt-2">
                        ⏸️ Paused - Resume in {job.timeUntilResume} mins
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-2">
                      {job.canResume && (
                        <button
                          onClick={() => executeJob(job.id)}
                          className="btn-primary text-xs"
                        >
                          ▶️ Resume
                        </button>
                      )}
                      {job.status === 'PENDING' && (
                        <button
                          onClick={() => executeJob(job.id)}
                          className="btn-primary text-xs"
                        >
                          ▶️ Start
                        </button>
                      )}
                      <button
                        onClick={() => checkJobStatus(job.id)}
                        className="btn-secondary text-xs"
                      >
                        🔄 Refresh
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Logs Section */}
        <div className="mt-6 bg-slate-900 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Activity Logs</h2>
          <div className="font-mono text-sm space-y-1 max-h-64 overflow-y-auto">
            {logs.length === 0 && <span className="text-slate-500">No logs yet...</span>}
            {logs.map((log, i) => (
              <div key={i} className={`${
                log.includes('❌') ? 'text-red-400' :
                log.includes('✅') ? 'text-green-400' :
                log.includes('⏸️') ? 'text-amber-400' :
                'text-slate-300'
              }`}>
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => { fetchProviders(); fetchJobs(); addLog('🔄 Manual refresh'); }}
            className="btn-secondary"
          >
            🔄 Refresh All
          </button>
          <button
            onClick={() => setLogs([])}
            className="btn-ghost"
          >
            🧹 Clear Logs
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Testing Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Click &quot;+ Test Provider 1/2/3&quot; to add fake providers</li>
            <li>Click &quot;+ Create Test Job&quot; to create a generation job</li>
            <li>Click &quot;▶️ Start&quot; to run the job</li>
            <li>Watch logs - it should try Provider 1 → Fail → Try Provider 2 → Pause</li>
            <li>Check job shows &quot;PAUSED&quot; with resume time</li>
            <li>Click &quot;🧹 Clear Rate Limits&quot; then &quot;▶️ Resume&quot; to continue</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
