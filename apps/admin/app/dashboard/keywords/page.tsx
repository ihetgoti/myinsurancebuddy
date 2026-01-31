'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Target, Search, FileText } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface KeywordConfig {
  id: string;
  name: string;
  description?: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  lsiKeywords: string[];
  targetDensity: number;
  maxDensity: number;
  requireInTitle: boolean;
  requireInH1: boolean;
  requireInH2: boolean;
  requireInFirst100: boolean;
  requireInMeta: boolean;
  insuranceTypeId?: string;
  isActive: boolean;
}

interface InsuranceType {
  id: string;
  name: string;
}

export default function KeywordsPage() {
  const [configs, setConfigs] = useState<KeywordConfig[]>([]);
  const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<KeywordConfig>>({
    name: '',
    description: '',
    primaryKeyword: '',
    secondaryKeywords: [],
    longTailKeywords: [],
    lsiKeywords: [],
    targetDensity: 2.5,
    maxDensity: 4.0,
    requireInTitle: true,
    requireInH1: true,
    requireInH2: true,
    requireInFirst100: true,
    requireInMeta: true,
    isActive: true
  });

  const [tempKeywords, setTempKeywords] = useState({
    secondary: '',
    longTail: '',
    lsi: ''
  });

  useEffect(() => {
    fetchConfigs();
    fetchInsuranceTypes();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await fetch('/api/admin/keywords');
      const data = await res.json();
      setConfigs(data.configs || []);
    } catch (err) {
      console.error('Failed to fetch keyword configs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsuranceTypes = async () => {
    try {
      const res = await fetch('/api/insurance-types');
      const data = await res.json();
      setInsuranceTypes(data.types || []);
    } catch (err) {
      console.error('Failed to fetch insurance types:', err);
    }
  };

  const handleAddKeyword = (type: 'secondary' | 'longTail' | 'lsi') => {
    const value = tempKeywords[type].trim();
    if (!value) return;

    const field = type === 'secondary' ? 'secondaryKeywords' : 
                  type === 'longTail' ? 'longTailKeywords' : 'lsiKeywords';
    
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[] || []), value]
    }));
    
    setTempKeywords(prev => ({ ...prev, [type]: '' }));
  };

  const handleRemoveKeyword = (type: 'secondary' | 'longTail' | 'lsi', index: number) => {
    const field = type === 'secondary' ? 'secondaryKeywords' : 
                  type === 'longTail' ? 'longTailKeywords' : 'lsiKeywords';
    
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[] || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingId ? `/api/admin/keywords?id=${editingId}` : '/api/admin/keywords';
      const method = editingId ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowAddForm(false);
        setEditingId(null);
        resetForm();
        fetchConfigs();
      }
    } catch (err) {
      console.error('Failed to save config:', err);
    }
  };

  const handleEdit = (config: KeywordConfig) => {
    setFormData(config);
    setEditingId(config.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this keyword configuration?')) return;
    
    try {
      await fetch(`/api/admin/keywords?id=${id}`, { method: 'DELETE' });
      fetchConfigs();
    } catch (err) {
      console.error('Failed to delete config:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      primaryKeyword: '',
      secondaryKeywords: [],
      longTailKeywords: [],
      lsiKeywords: [],
      targetDensity: 2.5,
      maxDensity: 4.0,
      requireInTitle: true,
      requireInH1: true,
      requireInH2: true,
      requireInFirst100: true,
      requireInMeta: true,
      isActive: true
    });
    setTempKeywords({ secondary: '', longTail: '', lsi: '' });
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="text-blue-500" />
              SEO Keyword Management
            </h1>
            <p className="text-slate-500 mt-1">
              Configure keywords for AI-generated content to optimize for search engines
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setShowAddForm(!showAddForm); }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            {showAddForm ? 'Cancel' : 'Add Keyword Config'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="card mb-6">
            <div className="card-header">
              <h2 className="text-lg font-semibold">
                {editingId ? 'Edit Keyword Configuration' : 'New Keyword Configuration'}
              </h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Config Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Auto Insurance California"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Insurance Type</label>
                    <select
                      value={formData.insuranceTypeId || ''}
                      onChange={(e) => setFormData({ ...formData, insuranceTypeId: e.target.value || undefined })}
                      className="select-field"
                    >
                      <option value="">All Types</option>
                      {insuranceTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Description</label>
                  <input
                    type="text"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Keyword strategy for auto insurance pages in California"
                    className="input-field"
                  />
                </div>

                {/* Primary Keyword */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-blue-900 mb-1">
                    Primary Keyword *
                  </label>
                  <input
                    type="text"
                    value={formData.primaryKeyword}
                    onChange={(e) => setFormData({ ...formData, primaryKeyword: e.target.value })}
                    placeholder="cheapest auto insurance california"
                    className="input-field text-lg"
                    required
                  />
                  <p className="text-xs text-blue-700 mt-1">
                    Main target keyword - will be used 2-3% density
                  </p>
                </div>

                {/* Keyword Density */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Target Density (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="5"
                      value={formData.targetDensity}
                      onChange={(e) => setFormData({ ...formData, targetDensity: parseFloat(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Max Density (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      value={formData.maxDensity}
                      onChange={(e) => setFormData({ ...formData, maxDensity: parseFloat(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Secondary Keywords */}
                <div>
                  <label className="label">Secondary Keywords</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tempKeywords.secondary}
                      onChange={(e) => setTempKeywords({ ...tempKeywords, secondary: e.target.value })}
                      placeholder="cheap auto insurance"
                      className="input-field flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword('secondary'))}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddKeyword('secondary')}
                      className="btn-primary"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.secondaryKeywords?.map((kw, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm border border-blue-200">
                        {kw}
                        <button type="button" onClick={() => handleRemoveKeyword('secondary', i)} className="text-blue-500 hover:text-blue-700">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Long-tail Keywords */}
                <div>
                  <label className="label">Long-tail Keywords</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tempKeywords.longTail}
                      onChange={(e) => setTempKeywords({ ...tempKeywords, longTail: e.target.value })}
                      placeholder="best auto insurance rates california"
                      className="input-field flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword('longTail'))}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddKeyword('longTail')}
                      className="btn-primary"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.longTailKeywords?.map((kw, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-sm border border-green-200">
                        {kw}
                        <button type="button" onClick={() => handleRemoveKeyword('longTail', i)} className="text-green-500 hover:text-green-700">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* LSI Keywords */}
                <div>
                  <label className="label">LSI Keywords (Semantic)</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tempKeywords.lsi}
                      onChange={(e) => setTempKeywords({ ...tempKeywords, lsi: e.target.value })}
                      placeholder="premium, deductible, coverage"
                      className="input-field flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword('lsi'))}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddKeyword('lsi')}
                      className="btn-primary"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.lsiKeywords?.map((kw, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded text-sm border border-purple-200">
                        {kw}
                        <button type="button" onClick={() => handleRemoveKeyword('lsi', i)} className="text-purple-500 hover:text-purple-700">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Placement Requirements */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <label className="block text-sm font-medium mb-3">Keyword Placement Requirements</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'requireInTitle', label: 'In Title/Meta Title' },
                      { key: 'requireInH1', label: 'In H1 Heading' },
                      { key: 'requireInH2', label: 'In H2 Subheading' },
                      { key: 'requireInFirst100', label: 'In First 100 Words' },
                      { key: 'requireInMeta', label: 'In Meta Description' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData[key as keyof KeywordConfig] as boolean}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                          className="rounded border-slate-300"
                        />
                        <span className="text-sm text-slate-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-success flex items-center gap-2">
                    <Save size={18} />
                    {editingId ? 'Update Config' : 'Save Config'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAddForm(false); setEditingId(null); resetForm(); }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Configs List */}
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading...</div>
        ) : configs.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-lg">
            <Search className="mx-auto mb-4 text-slate-400" size={48} />
            <p className="text-slate-500">No keyword configurations yet.</p>
            <p className="text-sm text-slate-400 mt-1">Create one to optimize your AI content for SEO.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {configs.map((config) => (
              <div key={config.id} className={`card ${!config.isActive ? 'opacity-60' : ''}`}>
                <div className="card-header">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">{config.name}</h3>
                    {config.description && (
                      <p className="text-sm text-slate-500">{config.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(config)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(config.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  {/* Primary Keyword */}
                  <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2 mb-3">
                    <span className="text-xs text-blue-600 uppercase font-medium">Primary Keyword</span>
                    <div className="font-medium text-blue-900">{config.primaryKeyword}</div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                    <div className="bg-slate-50 rounded p-2 text-center border border-slate-200">
                      <div className="text-lg font-semibold text-blue-600">{config.secondaryKeywords.length}</div>
                      <div className="text-xs text-slate-500">Secondary</div>
                    </div>
                    <div className="bg-slate-50 rounded p-2 text-center border border-slate-200">
                      <div className="text-lg font-semibold text-green-600">{config.longTailKeywords.length}</div>
                      <div className="text-xs text-slate-500">Long-tail</div>
                    </div>
                    <div className="bg-slate-50 rounded p-2 text-center border border-slate-200">
                      <div className="text-lg font-semibold text-purple-600">{config.lsiKeywords.length}</div>
                      <div className="text-xs text-slate-500">LSI</div>
                    </div>
                  </div>

                  {/* Density */}
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                    <FileText size={14} />
                    Target Density: {config.targetDensity}% - {config.maxDensity}%
                  </div>

                  {/* Placement Requirements */}
                  <div className="flex flex-wrap gap-2">
                    {config.requireInTitle && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">Title</span>}
                    {config.requireInH1 && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">H1</span>}
                    {config.requireInH2 && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">H2</span>}
                    {config.requireInFirst100 && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">First 100</span>}
                    {config.requireInMeta && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">Meta</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-semibold text-amber-900 mb-2">SEO Tips</h3>
          <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
            <li><strong>Primary Keyword:</strong> Your main target - use 2-3% density</li>
            <li><strong>Secondary Keywords:</strong> Related terms - use 1-2 times each</li>
            <li><strong>Long-tail Keywords:</strong> Specific phrases - great for voice search</li>
            <li><strong>LSI Keywords:</strong> Semantically related - helps Google understand context</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
