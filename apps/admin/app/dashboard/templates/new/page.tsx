'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTemplate() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        templateType: 'STATE',
        content: '',
        variables: '',
        defaultVariables: '',
        isActive: true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    variables: formData.variables ? JSON.parse(formData.variables) : undefined,
                    defaultVariables: formData.defaultVariables ? JSON.parse(formData.defaultVariables) : undefined,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create template');
            }

            router.push('/dashboard/templates');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const exampleTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>{{state}} Insurance Guide - MyInsuranceBuddies</title>
</head>
<body>
    <h1>{{state}} Insurance Guide</h1>
    <p>Population: {{population}}</p>
    <p>Capital: {{capital}}</p>
</body>
</html>`;

    const exampleVariables = `["state", "population", "capital"]`;
    const exampleDefaults = `{"population": "N/A", "capital": "N/A"}`;

    return (
        <AdminLayout>
            <div className="max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Create New Template</h1>
                    <p className="text-gray-600 mt-1">Design a template for programmatic pages</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Template Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., State Insurance Guide Template"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Brief description of this template"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Template Type *
                            </label>
                            <select
                                name="templateType"
                                value={formData.templateType}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="STATE">State Page</option>
                                <option value="CITY">City Page</option>
                                <option value="CUSTOM">Custom</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 space-y-4">
                        <h3 className="font-semibold text-lg">Template Content</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                HTML Template * (Use Handlebars syntax)
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows={15}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                placeholder={exampleTemplate}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Use {'{{variable}}'} for dynamic content
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Variables (JSON array)
                                </label>
                                <textarea
                                    name="variables"
                                    value={formData.variables}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                                    placeholder={exampleVariables}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Default Values (JSON object)
                                </label>
                                <textarea
                                    name="defaultVariables"
                                    value={formData.defaultVariables}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                                    placeholder={exampleDefaults}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">💡 Template Tips</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Use {'{{variable}}'} for simple substitution</li>
                            <li>• Use {'{{#if condition}}...{{/if}}'} for conditionals</li>
                            <li>• Use {'{{#each items}}...{{/each}}'} for loops</li>
                            <li>• All templates use Handlebars syntax</li>
                        </ul>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Template'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
