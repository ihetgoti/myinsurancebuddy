'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Copy, Check, X } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface AITemplate {
  id: string;
  name: string;
  description: string | null;
  insuranceTypeId: string | null;
  geoLevel: string | null;
  isMajorCity: boolean | null;
  systemPrompt: string;
  introPrompt: string | null;
  requirementsPrompt: string | null;
  faqsPrompt: string | null;
  tipsPrompt: string | null;
  model: string;
  temperature: number;
  maxTokens: number;
  isActive: boolean;
  isDefault: boolean;
  priority: number;
  usageCount: number;
  createdAt: string;
  createdBy?: { name: string; email: string };
}

export default function AITemplatesPage() {
  const [templates, setTemplates] = useState<AITemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    insuranceTypeId: '',
    geoLevel: '',
    isMajorCity: '',
    systemPrompt: '',
    introPrompt: '',
    requirementsPrompt: '',
    faqsPrompt: '',
    tipsPrompt: '',
    model: 'xiaomi/mimo-v2-flash',
    temperature: '0.7',
    maxTokens: '2000',
    isActive: true,
    isDefault: false,
    priority: '0'
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/ai-templates');
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        temperature: parseFloat(formData.temperature),
        maxTokens: parseInt(formData.maxTokens),
        priority: parseInt(formData.priority),
        insuranceTypeId: formData.insuranceTypeId || null,
        geoLevel: formData.geoLevel || null,
        isMajorCity: formData.isMajorCity ? formData.isMajorCity === 'true' : null,
      };

      if (editingId) {
        await fetch(`/api/ai-templates?id=${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/ai-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  const handleEdit = (template: AITemplate) => {
    setFormData({
      name: template.name,
      description: template.description || '',
      insuranceTypeId: template.insuranceTypeId || '',
      geoLevel: template.geoLevel || '',
      isMajorCity: template.isMajorCity !== null ? String(template.isMajorCity) : '',
      systemPrompt: template.systemPrompt,
      introPrompt: template.introPrompt || '',
      requirementsPrompt: template.requirementsPrompt || '',
      faqsPrompt: template.faqsPrompt || '',
      tipsPrompt: template.tipsPrompt || '',
      model: template.model,
      temperature: String(template.temperature),
      maxTokens: String(template.maxTokens),
      isActive: template.isActive,
      isDefault: template.isDefault,
      priority: String(template.priority)
    });
    setEditingId(template.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      await fetch(`/api/ai-templates?id=${id}`, {
        method: 'DELETE'
      });
      fetchTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const handleDuplicate = (template: AITemplate) => {
    setFormData({
      name: `${template.name} (Copy)`,
      description: template.description || '',
      insuranceTypeId: template.insuranceTypeId || '',
      geoLevel: template.geoLevel || '',
      isMajorCity: template.isMajorCity !== null ? String(template.isMajorCity) : '',
      systemPrompt: template.systemPrompt,
      introPrompt: template.introPrompt || '',
      requirementsPrompt: template.requirementsPrompt || '',
      faqsPrompt: template.faqsPrompt || '',
      tipsPrompt: template.tipsPrompt || '',
      model: template.model,
      temperature: String(template.temperature),
      maxTokens: String(template.maxTokens),
      isActive: true,
      isDefault: false,
      priority: String(template.priority)
    });
    setEditingId(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      insuranceTypeId: '',
      geoLevel: '',
      isMajorCity: '',
      systemPrompt: '',
      introPrompt: '',
      requirementsPrompt: '',
      faqsPrompt: '',
      tipsPrompt: '',
      model: 'xiaomi/mimo-v2-flash',
      temperature: '0.7',
      maxTokens: '2000',
      isActive: true,
      isDefault: false,
      priority: '0'
    });
    setEditingId(null);
    setShowForm(false);
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Prompt Templates</h1>
            <p className="text-gray-600 mt-1">
              Create custom AI prompts for different insurance types and locations
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'New Template'}
          </button>
        </div>

        {/* Template Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Template' : 'Create New Template'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., Auto Insurance - Major Cities"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={2}
                      placeholder="What this template is for..."
                    />
                  </div>
                </div>
              </div>

              {/* Targeting */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Targeting (Optional)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Type ID
                    </label>
                    <input
                      type="text"
                      value={formData.insuranceTypeId}
                      onChange={(e) => setFormData({ ...formData, insuranceTypeId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Leave blank for all types"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Geo Level
                    </label>
                    <select
                      value={formData.geoLevel}
                      onChange={(e) => setFormData({ ...formData, geoLevel: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">All Levels</option>
                      <option value="NICHE">Niche</option>
                      <option value="COUNTRY">Country</option>
                      <option value="STATE">State</option>
                      <option value="CITY">City</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Major Cities Only?
                    </label>
                    <select
                      value={formData.isMajorCity}
                      onChange={(e) => setFormData({ ...formData, isMajorCity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">All Cities</option>
                      <option value="true">Major Cities Only</option>
                      <option value="false">Non-Major Cities</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Prompts */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">AI Prompts</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      System Prompt * <span className="text-xs text-gray-500">(Sets the AI&apos;s role)</span>
                    </label>
                    <textarea
                      value={formData.systemPrompt}
                      onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      rows={3}
                      placeholder="You are a professional insurance content writer..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Introduction Prompt <span className="text-xs text-gray-500">(Use {'{{variable}}'} placeholders)</span>
                    </label>
                    <textarea
                      value={formData.introPrompt}
                      onChange={(e) => setFormData({ ...formData, introPrompt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      rows={3}
                      placeholder="Write a 2-3 paragraph introduction about {{insurance_type}} in {{location}}"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requirements Prompt
                    </label>
                    <textarea
                      value={formData.requirementsPrompt}
                      onChange={(e) => setFormData({ ...formData, requirementsPrompt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      rows={3}
                      placeholder="Explain the legal requirements for {{insurance_type}} in {{state}}"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      FAQs Prompt
                    </label>
                    <textarea
                      value={formData.faqsPrompt}
                      onChange={(e) => setFormData({ ...formData, faqsPrompt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      rows={3}
                      placeholder="Generate 5-7 location-specific FAQs for {{insurance_type}} in {{location}}"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tips Prompt
                    </label>
                    <textarea
                      value={formData.tipsPrompt}
                      onChange={(e) => setFormData({ ...formData, tipsPrompt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      rows={3}
                      placeholder="Provide 5-8 practical tips for getting the best {{insurance_type}} in {{location}}"
                    />
                  </div>
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
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="xiaomi/mimo-v2-flash">MiMo-V2-Flash (FREE)</option>
                      <option value="deepseek/deepseek-r1">DeepSeek R1 (FREE)</option>
                      <option value="google/gemini-2.0-flash-exp">Gemini 2.0 Flash (FREE)</option>
                      <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
                      <option value="anthropic/claude-haiku">Claude Haiku</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temperature (0-1)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Tokens
                    </label>
                    <input
                      type="number"
                      value={formData.maxTokens}
                      onChange={(e) => setFormData({ ...formData, maxTokens: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Settings</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Default Template</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <input
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingId ? 'Update Template' : 'Create Template'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Templates List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Targeting
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Usage
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
              {templates.map((template) => (
                <tr key={template.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{template.name}</div>
                    {template.description && (
                      <div className="text-xs text-gray-500 line-clamp-1">{template.description}</div>
                    )}
                    {template.isDefault && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                        Default
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.geoLevel && <div>{template.geoLevel}</div>}
                    {template.isMajorCity !== null && (
                      <div className="text-xs text-gray-500">
                        {template.isMajorCity ? 'Major Cities' : 'Non-Major'}
                      </div>
                    )}
                    {!template.geoLevel && template.isMajorCity === null && (
                      <span className="text-gray-400 text-xs">All</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.model.split('/')[1]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.usageCount} times
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        template.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {template.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(template)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(template)}
                      className="text-green-600 hover:text-green-900"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {templates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No AI templates yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Create your first template to customize AI-generated content
              </p>
            </div>
          )}
        </div>

        {/* Help */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">How AI Templates Work:</h3>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Templates control the AI prompts used for content generation</li>
            <li>Use <code className="bg-blue-100 px-1 rounded">{'{{variable}}'}</code> placeholders like <code className="bg-blue-100 px-1 rounded">{'{{state}}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{{city}}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{{insurance_type}}'}</code></li>
            <li>Target specific insurance types, geo levels, or major cities</li>
            <li>Higher priority templates are preferred when multiple match</li>
            <li>Default templates are used when no specific match is found</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
