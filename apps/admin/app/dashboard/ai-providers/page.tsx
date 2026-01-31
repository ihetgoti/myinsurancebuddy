'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface AIProvider {
  id: string;
  name: string;
  provider: string;
  preferredModel: string;
  maxRequestsPerMinute: number;
  totalBudget: number | null;
  usedBudget: number;
  requestCount: number;
  lastUsedAt: string | null;
  isActive: boolean;
  priority: number;
  createdAt: string;
}

export default function AIProvidersPage() {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    apiKey: '',
    preferredModel: 'deepseek/deepseek-r1:free', // Default to free model
    totalBudget: '',
    priority: '0'
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/ai-providers');
      const data = await res.json();
      setProviders(data.providers || []);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/ai-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          apiKey: formData.apiKey,
          preferredModel: formData.preferredModel,
          totalBudget: formData.totalBudget ? parseFloat(formData.totalBudget) : null,
          priority: parseInt(formData.priority)
        })
      });

      if (res.ok) {
        setFormData({
          name: '',
          apiKey: '',
          preferredModel: 'deepseek/deepseek-r1:free',
          totalBudget: '',
          priority: '0'
        });
        setShowAddForm(false);
        fetchProviders();
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to add provider');
      }
    } catch (error) {
      console.error('Failed to add provider:', error);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    try {
      const res = await fetch(`/api/ai-providers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentState })
      });
      if (!res.ok) {
        const error = await res.json();
        alert(`Failed to toggle provider: ${error.error || 'Unknown error'}`);
        return;
      }
      fetchProviders();
    } catch (error) {
      console.error('Failed to toggle provider:', error);
      alert('Failed to toggle provider. Check console for details.');
    }
  };

  const deleteProvider = async (id: string) => {
    if (!confirm('Are you sure you want to delete this provider?')) return;

    try {
      const res = await fetch(`/api/ai-providers/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const error = await res.json();
        alert(`Failed to delete provider: ${error.error || 'Unknown error'}`);
        return;
      }
      fetchProviders();
    } catch (error) {
      console.error('Failed to delete provider:', error);
      alert('Failed to delete provider. Check console for details.');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Providers</h1>
            <p className="text-gray-600 mt-1">
              Manage OpenRouter API accounts for AI content generation
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Provider
          </button>
        </div>

        {/* Budget Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Budget Overview</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                ${providers.reduce((sum, p) => sum + (p.totalBudget || 0), 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Used</p>
              <p className="text-2xl font-bold text-orange-600">
                ${providers.reduce((sum, p) => sum + p.usedBudget, 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-green-600">
                ${(
                  providers.reduce((sum, p) => sum + (p.totalBudget || 0), 0) -
                  providers.reduce((sum, p) => sum + p.usedBudget, 0)
                ).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {providers.reduce((sum, p) => sum + p.requestCount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Add Provider Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Add New Provider</h2>
            <form onSubmit={handleAddProvider} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="OpenRouter Account 1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="sk-or-..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Model
                  </label>
                  <select
                    value={formData.preferredModel}
                    onChange={(e) => setFormData({ ...formData, preferredModel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <optgroup label="🆓 FREE Models (Recommended)">
                      <option value="deepseek/deepseek-r1:free">DeepSeek R1 (Free)</option>
                      <option value="deepseek/deepseek-r1">DeepSeek R1 (FREE - Xiaomi)</option>
                      <option value="deepseek/deepseek-chat">DeepSeek Chat (FREE)</option>
                      <option value="google/gemini-2.0-flash-exp">Gemini 2.0 Flash (FREE)</option>
                      <option value="qwen/qwen-2.5-72b-instruct">Qwen 2.5 72B (FREE)</option>
                      <option value="meta-llama/llama-3.2-3b-instruct">Llama 3.2 3B (FREE)</option>
                    </optgroup>
                    <optgroup label="💰 Ultra Cheap Models">
                      <option value="google/gemini-flash-1.5">Gemini Flash 1.5 ($0.075/M)</option>
                      <option value="openai/gpt-4o-mini">GPT-4o Mini ($0.15/M)</option>
                    </optgroup>
                    <optgroup label="💵 Standard Models">
                      <option value="anthropic/claude-haiku">Claude Haiku ($0.25/M)</option>
                      <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo ($0.50/M)</option>
                      <option value="anthropic/claude-haiku-3.5">Claude Haiku 3.5 ($0.80/M)</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Budget ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.totalBudget}
                    onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="10.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority (lower = used first)
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Adding...' : 'Add Provider'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  disabled={submitting}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Providers List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Used
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Requests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {providers.map((provider) => (
                <tr key={provider.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                    <div className="text-xs text-gray-500">Priority: {provider.priority}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {provider.preferredModel.split('/')[1]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${provider.totalBudget?.toFixed(2) || '∞'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${provider.usedBudget.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {provider.requestCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        provider.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {provider.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleActive(provider.id, provider.isActive)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      {provider.isActive ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteProvider(provider.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {providers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No providers configured</p>
              <p className="text-sm text-gray-400 mt-1">
                Add your first OpenRouter API key to start generating AI content
              </p>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-2">🆓 Get FREE OpenRouter API Key:</h3>
          <ol className="list-decimal list-inside text-sm text-green-800 space-y-1">
            <li>Go to <a href="https://openrouter.ai" target="_blank" className="underline font-medium">openrouter.ai</a></li>
            <li>Sign up for a FREE account (no credit card needed!)</li>
            <li><strong>Skip adding credits</strong> - Use free models like DeepSeek R1!</li>
            <li>Go to Settings → API Keys → Create new key</li>
            <li>Copy the key and paste it above</li>
            <li><strong>Select &quot;DeepSeek R1 (FREE - Xiaomi)&quot;</strong> as preferred model ⭐</li>
            <li>Optional: Create 3-5 accounts for higher rate limits (use Gmail aliases)</li>
          </ol>
          <p className="text-xs text-green-700 mt-3">
            💡 <strong>Pro Tip:</strong> Free tier gives you unlimited pages! Use models like DeepSeek R1 (Xiaomi),
            DeepSeek Chat, or Gemini 2.0 Flash to generate all 500k pages at $0 cost.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
