'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X, AlertCircle } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface FreeModel {
  id: string;
  modelId: string;
  name: string;
  provider: string;
  description: string | null;
  isActive: boolean;
  priority: number;
}

export default function FreeModelsPage() {
  const [models, setModels] = useState<FreeModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    modelId: '',
    name: '',
    provider: '',
    description: ''
  });

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/admin/free-models');
      const data = await res.json();
      setModels(data.models || []);
    } catch (err) {
      setError('Failed to fetch free models');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.modelId.trim() || !formData.name.trim()) {
      setError('Model ID and name are required');
      return;
    }

    try {
      const res = await fetch('/api/admin/free-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          priority: models.length + 1
        })
      });

      if (res.ok) {
        setSuccess(`Added ${formData.name} to free models list`);
        setFormData({ modelId: '', name: '', provider: '', description: '' });
        setShowAddForm(false);
        fetchModels();
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to add model');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from free models?`)) return;

    try {
      const res = await fetch(`/api/admin/free-models?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setSuccess(`Removed ${name}`);
        fetchModels();
      } else {
        setError('Failed to remove model');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleToggle = async (model: FreeModel) => {
    try {
      const res = await fetch('/api/admin/free-models', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: model.id,
          isActive: !model.isActive
        })
      });

      if (res.ok) {
        setSuccess(`${model.name} is now ${!model.isActive ? 'active' : 'inactive'}`);
        fetchModels();
      }
    } catch (err) {
      setError('Failed to update model');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Free AI Models</h1>
            <p className="text-slate-500 mt-1">Manage which models are considered free (no cost)</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Free Model
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <Check className="text-green-500" size={20} />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div className="card mb-6">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Add New Free Model</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Model ID</label>
                    <input
                      type="text"
                      value={formData.modelId}
                      onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                      placeholder="deepseek/deepseek-r1:free"
                      className="input-field"
                    />
                    <p className="text-xs text-slate-500 mt-1">Must end with &quot;:free&quot;</p>
                  </div>
                  <div>
                    <label className="label">Display Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="DeepSeek R1 (Free)"
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Provider</label>
                    <input
                      type="text"
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      placeholder="deepseek"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="DeepSeek R1 reasoning model"
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary">
                    <Check size={16} className="inline mr-1" />
                    Add Model
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Models List */}
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading...</div>
        ) : models.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-lg">
            <p className="text-slate-500">No free models configured. Add some to get started!</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.id} className={!model.isActive ? 'opacity-60' : ''}>
                    <td>
                      <div className="font-medium text-slate-900">{model.name}</div>
                      <div className="text-sm text-slate-500 font-mono">{model.modelId}</div>
                      {model.description && (
                        <div className="text-xs text-slate-400 mt-1">{model.description}</div>
                      )}
                    </td>
                    <td className="text-slate-600">{model.provider}</td>
                    <td>
                      <button
                        onClick={() => handleToggle(model)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          model.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {model.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(model.id, model.name)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Only models ending with <code>:free</code> can be added</li>
            <li>These models will be used for content generation</li>
            <li>Any model not in this list will be treated as PAID and blocked</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
