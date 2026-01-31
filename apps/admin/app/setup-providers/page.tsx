'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SetupProviders() {
  const [providers, setProviders] = useState([
    { name: 'OpenRouter Account 1', apiKey: '', model: 'deepseek/deepseek-r1:free', priority: 1 },
    { name: 'OpenRouter Account 2', apiKey: '', model: 'google/gemini-2.0-flash-exp:free', priority: 2 },
    { name: 'OpenRouter Account 3', apiKey: '', model: 'meta-llama/llama-3.1-8b-instruct:free', priority: 3 },
    { name: 'OpenRouter Account 4', apiKey: '', model: 'deepseek/deepseek-r1:free', priority: 4 },
    { name: 'OpenRouter Account 5', apiKey: '', model: 'google/gemini-2.0-flash-exp:free', priority: 5 },
  ]);
  const [status, setStatus] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (msg: string) => {
    setStatus(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const updateProvider = (index: number, field: string, value: string) => {
    const updated = [...providers];
    updated[index] = { ...updated[index], [field]: value };
    setProviders(updated);
  };

  const saveProviders = async () => {
    setLoading(true);
    setStatus([]);
    
    for (let i = 0; i < providers.length; i++) {
      const p = providers[i];
      
      if (!p.apiKey.trim()) {
        addLog(`⚠️ Skipped ${p.name} - no API key`);
        continue;
      }
      
      try {
        const res = await fetch('/api/ai-providers/public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: p.name,
            apiKey: p.apiKey,
            preferredModel: p.model,
            priority: p.priority,
            isActive: true
          })
        });
        
        if (res.ok) {
          addLog(`✅ Added ${p.name}`);
        } else {
          const err = await res.json();
          addLog(`❌ Failed ${p.name}: ${err.error}`);
        }
      } catch (e: any) {
        addLog(`❌ Error ${p.name}: ${e.message}`);
      }
    }
    
    addLog('🎉 Done! Go to /auth/signin to login');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Setup AI Providers</h1>
          <p className="text-slate-600">Add your 5 OpenRouter API keys to get started</p>
        </div>
        
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="text-lg font-semibold">OpenRouter Accounts</h2>
          </div>
          <div className="card-body">
            <p className="text-sm text-slate-600 mb-4">
              Get API keys from: <a href="https://openrouter.ai/keys" target="_blank" className="text-blue-600 hover:underline">https://openrouter.ai/keys</a>
              <br/>
              Need $10 deposit per account (stays as balance, not spent on free models)
            </p>
            
            <div className="space-y-4">
              {providers.map((p, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-slate-900">{p.name}</span>
                    <span className="text-xs text-slate-500">Priority: {p.priority}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">API Key</label>
                      <input
                        type="password"
                        value={p.apiKey}
                        onChange={(e) => updateProvider(i, 'apiKey', e.target.value)}
                        placeholder="sk-or-v1-..."
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Model</label>
                      <select
                        value={p.model}
                        onChange={(e) => updateProvider(i, 'model', e.target.value)}
                        className="select-field"
                      >
                        <option value="deepseek/deepseek-r1:free">deepseek-r1:free</option>
                        <option value="google/gemini-2.0-flash-exp:free">gemini-2.0-flash:free</option>
                        <option value="meta-llama/llama-3.1-8b-instruct:free">llama-3.1-8b:free</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button
          onClick={saveProviders}
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? 'Saving...' : 'Save All Providers'}
        </button>
        
        {status.length > 0 && (
          <div className="mt-6 bg-slate-900 rounded-lg p-4 font-mono text-sm">
            {status.map((s, i) => (
              <div key={i} className={`${
                s.includes('✅') ? 'text-green-400' :
                s.includes('❌') ? 'text-red-400' :
                'text-slate-300'
              }`}>
                {s}
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-semibold text-amber-900 mb-2">Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-amber-800">
            <li>Create 5 accounts at OpenRouter (use gmail+1, gmail+2, etc.)</li>
            <li>Deposit $10 in each account (total $50 - stays as balance)</li>
            <li>Copy API keys and paste above</li>
            <li>Click &quot;Save All Providers&quot;</li>
            <li>Go to <Link href="/auth/signin" className="text-blue-600 hover:underline">/auth/signin</Link> to login</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
