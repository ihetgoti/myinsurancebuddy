'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState, useRef } from 'react';
import { getApiUrl } from '@/lib/api';

interface InsuranceType {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
    isActive: boolean;
    sortOrder: number;
    _count: { pages: number };
}

type IconInputMode = 'emoji' | 'url' | 'upload';

export default function InsuranceTypesPage() {
    const [types, setTypes] = useState<InsuranceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingType, setEditingType] = useState<InsuranceType | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        icon: '',
        description: '',
    });
    const [iconMode, setIconMode] = useState<IconInputMode>('emoji');
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        try {
            const res = await fetch(getApiUrl('/api/insurance-types'));
            const data = await res.json();
            setTypes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch types:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const url = editingType
                ? getApiUrl(`/api/insurance-types/${editingType.id}`)
                : getApiUrl('/api/insurance-types');

            const res = await fetch(url, {
                method: editingType ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save');
            }

            setShowForm(false);
            setEditingType(null);
            setFormData({ name: '', slug: '', icon: '', description: '' });
            setIconMode('emoji');
            fetchTypes();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (type: InsuranceType) => {
        setEditingType(type);
        setFormData({
            name: type.name,
            slug: type.slug,
            icon: type.icon || '',
            description: type.description || '',
        });
        // Detect icon mode from existing value
        if (type.icon?.startsWith('http') || type.icon?.startsWith('/')) {
            setIconMode('url');
        } else {
            setIconMode('emoji');
        }
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will delete all associated pages.')) return;

        try {
            await fetch(getApiUrl(`/api/insurance-types/${id}`), { method: 'DELETE' });
            fetchTypes();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            formDataUpload.append('folder', 'icons');

            const res = await fetch(getApiUrl('/api/media/upload'), {
                method: 'POST',
                body: formDataUpload,
            });

            if (!res.ok) {
                throw new Error('Upload failed');
            }

            const data = await res.json();
            setFormData(prev => ({ ...prev, icon: data.url }));
        } catch (err: any) {
            setError('Failed to upload image: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const renderIconPreview = (icon: string) => {
        if (!icon) return <span className="text-gray-400">No icon</span>;
        if (icon.startsWith('http') || icon.startsWith('/')) {
            return <img src={icon} alt="Icon" className="w-10 h-10 object-contain rounded" />;
        }
        return <span className="text-3xl">{icon}</span>;
    };

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Insurance Types</h1>
                        <p className="text-gray-600 mt-1">Manage your insurance niches</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingType(null);
                            setFormData({ name: '', slug: '', icon: '', description: '' });
                            setIconMode('emoji');
                            setShowForm(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + Add Type
                    </button>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">
                                {editingType ? 'Edit Insurance Type' : 'Add Insurance Type'}
                            </h2>

                            {error && (
                                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            setFormData({
                                                ...formData,
                                                name,
                                                slug: editingType ? formData.slug : generateSlug(name),
                                            });
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Car Insurance"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Slug *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="car-insurance"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        URL: /{formData.slug}/us/california/los-angeles
                                    </p>
                                </div>

                                {/* Icon Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Icon
                                    </label>

                                    {/* Icon Mode Tabs */}
                                    <div className="flex gap-1 mb-3 bg-gray-100 p-1 rounded-lg">
                                        <button
                                            type="button"
                                            onClick={() => setIconMode('emoji')}
                                            className={`flex-1 px-3 py-1.5 text-sm rounded-md transition ${iconMode === 'emoji'
                                                    ? 'bg-white text-blue-600 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            Emoji
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIconMode('url')}
                                            className={`flex-1 px-3 py-1.5 text-sm rounded-md transition ${iconMode === 'url'
                                                    ? 'bg-white text-blue-600 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            URL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIconMode('upload')}
                                            className={`flex-1 px-3 py-1.5 text-sm rounded-md transition ${iconMode === 'upload'
                                                    ? 'bg-white text-blue-600 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            Upload
                                        </button>
                                    </div>

                                    {/* Icon Input based on mode */}
                                    {iconMode === 'emoji' && (
                                        <div className="flex gap-3 items-center">
                                            <input
                                                type="text"
                                                value={formData.icon}
                                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="🚗"
                                            />
                                            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border">
                                                {formData.icon ? (
                                                    <span className="text-2xl">{formData.icon}</span>
                                                ) : (
                                                    <span className="text-gray-300">?</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {iconMode === 'url' && (
                                        <div className="space-y-2">
                                            <input
                                                type="url"
                                                value={formData.icon}
                                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="https://example.com/icon.svg"
                                            />
                                            {formData.icon && (formData.icon.startsWith('http') || formData.icon.startsWith('/')) && (
                                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                    <img
                                                        src={formData.icon}
                                                        alt="Preview"
                                                        className="w-10 h-10 object-contain"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                    <span className="text-sm text-gray-600">Icon preview</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {iconMode === 'upload' && (
                                        <div className="space-y-3">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition disabled:opacity-50"
                                            >
                                                {uploading ? (
                                                    <span className="text-gray-500">Uploading...</span>
                                                ) : (
                                                    <>
                                                        <span className="text-2xl block mb-1">📤</span>
                                                        <span className="text-sm text-gray-600">Click to upload image</span>
                                                    </>
                                                )}
                                            </button>
                                            {formData.icon && (formData.icon.startsWith('http') || formData.icon.startsWith('/')) && (
                                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                                    <img
                                                        src={formData.icon}
                                                        alt="Uploaded"
                                                        className="w-12 h-12 object-contain"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-green-700">Icon uploaded</p>
                                                        <p className="text-xs text-green-600 truncate">{formData.icon}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, icon: '' })}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                        placeholder="Coverage for vehicles..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving || uploading}
                                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                                    >
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Types List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : types.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 mb-4">No insurance types yet</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                Add your first insurance type →
                            </button>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pages</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {types.map((type) => (
                                    <tr key={type.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg">
                                                    {renderIconPreview(type.icon || '')}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{type.name}</p>
                                                    {type.description && (
                                                        <p className="text-sm text-gray-500 truncate max-w-xs">
                                                            {type.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                                /{type.slug}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {type._count.pages}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${type.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {type.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleEdit(type)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(type.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
