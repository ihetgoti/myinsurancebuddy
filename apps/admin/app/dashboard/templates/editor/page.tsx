'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface MediaItem {
    id: string;
    filename: string;
    url: string;
    mimeType: string;
}

function TemplateEditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams?.get('id');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('custom');
    const [htmlContent, setHtmlContent] = useState('');
    const [cssContent, setCssContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [activeTab, setActiveTab] = useState<'html' | 'css' | 'preview'>('html');

    useEffect(() => {
        if (editId) {
            fetchTemplate(editId);
        }
        fetchMedia();
    }, [editId]);

    const fetchTemplate = async (id: string) => {
        try {
            const res = await fetch(`/api/templates/${id}`);
            if (res.ok) {
                const data = await res.json();
                setName(data.name || '');
                setDescription(data.description || '');
                setCategory(data.category || 'custom');
                setHtmlContent(data.htmlContent || '');
                setCssContent(data.customCss || '');
            }
        } catch (error) {
            console.error('Failed to fetch template:', error);
        }
    };

    const fetchMedia = async () => {
        try {
            const res = await fetch('/api/media');
            if (res.ok) {
                const data = await res.json();
                setMediaItems(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Failed to fetch media:', error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setHtmlContent(content);
        };
        reader.readAsText(file);
    };

    const insertVariable = (variable: string) => {
        setHtmlContent(prev => prev + `{{${variable}}}`);
    };

    const insertImage = (url: string) => {
        setHtmlContent(prev => prev + `<img src="${url}" alt="{{image_alt}}" class="template-image" />`);
        setShowMediaPicker(false);
    };

    const handleSave = async () => {
        if (!name.trim()) {
            alert('Please enter a template name');
            return;
        }

        setSaving(true);
        try {
            const url = editId ? `/api/templates/${editId}` : '/api/templates';
            const method = editId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    description,
                    category,
                    htmlContent,
                    customCss: cssContent,
                    type: 'html',
                }),
            });

            if (res.ok) {
                router.push('/dashboard/templates');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save template');
            }
        } catch (error) {
            alert('Failed to save template');
        } finally {
            setSaving(false);
        }
    };

    const variables = [
        'page_title', 'page_subtitle', 'insurance_type', 'state', 'city',
        'avg_premium', 'population', 'current_year', 'image_url', 'cta_text'
    ];

    return (
        <AdminLayout>
            <div className="h-[calc(100vh-64px)] flex flex-col">
                {/* Header */}
                <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            ← Back
                        </button>
                        <h1 className="text-xl font-semibold">
                            {editId ? 'Edit Template' : 'Create Template'}
                        </h1>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Template'}
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 bg-gray-50 border-r p-4 overflow-auto">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    placeholder="Template name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    rows={2}
                                    placeholder="Brief description"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                >
                                    <option value="custom">Custom</option>
                                    <option value="state">State</option>
                                    <option value="city">City</option>
                                    <option value="comparison">Comparison</option>
                                    <option value="guide">Guide</option>
                                    <option value="landing">Landing</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload HTML</label>
                                <input
                                    type="file"
                                    accept=".html,.htm"
                                    onChange={handleFileUpload}
                                    className="w-full text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Insert Variable</label>
                                <div className="flex flex-wrap gap-1">
                                    {variables.map(v => (
                                        <button
                                            key={v}
                                            onClick={() => insertVariable(v)}
                                            className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={() => setShowMediaPicker(true)}
                                    className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                                >
                                    📷 Insert Image from Media
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Add Custom Variable</label>
                                <div className="flex gap-1">
                                    <input
                                        type="text"
                                        id="custom-var-input"
                                        placeholder="my_variable"
                                        className="flex-1 px-2 py-1 border rounded text-sm"
                                    />
                                    <button
                                        onClick={() => {
                                            const input = document.getElementById('custom-var-input') as HTMLInputElement;
                                            if (input.value.trim()) {
                                                insertVariable(input.value.trim());
                                                input.value = '';
                                            }
                                        }}
                                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                                    >
                                        Add
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Creates {"{{your_variable}}"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 flex flex-col">
                        {/* Tabs */}
                        <div className="bg-white border-b flex">
                            {(['html', 'css', 'preview'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === tab
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {tab.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-auto">
                            {activeTab === 'html' && (
                                <textarea
                                    value={htmlContent}
                                    onChange={(e) => setHtmlContent(e.target.value)}
                                    className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none"
                                    placeholder="Paste or type your HTML template here...

Use {{variable}} for dynamic content.
Example: <h1>{{page_title}}</h1>"
                                />
                            )}

                            {activeTab === 'css' && (
                                <textarea
                                    value={cssContent}
                                    onChange={(e) => setCssContent(e.target.value)}
                                    className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none"
                                    placeholder="Add custom CSS styles here..."
                                />
                            )}

                            {activeTab === 'preview' && (
                                <iframe
                                    srcDoc={`<!DOCTYPE html>
<html>
<head><style>${cssContent}</style></head>
<body>${htmlContent}</body>
</html>`}
                                    className="w-full h-full border-0"
                                    title="Preview"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Media Picker Modal */}
                {showMediaPicker && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h3 className="font-semibold">Select Image</h3>
                                <button
                                    onClick={() => setShowMediaPicker(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-4 overflow-auto max-h-96">
                                {mediaItems.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">
                                        No images found. Upload images in Media Library first.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-4 gap-3">
                                        {mediaItems.filter(m => m.mimeType?.startsWith('image/')).map(media => (
                                            <button
                                                key={media.id}
                                                onClick={() => insertImage(media.url)}
                                                className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500"
                                            >
                                                <img
                                                    src={media.url}
                                                    alt={media.filename}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t">
                                <label className="block text-sm text-gray-600 mb-2">Or enter image URL:</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        id="image-url-input"
                                        placeholder="https://..."
                                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                    />
                                    <button
                                        onClick={() => {
                                            const input = document.getElementById('image-url-input') as HTMLInputElement;
                                            if (input.value) insertImage(input.value);
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                                    >
                                        Insert
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default function TemplateEditorPage() {
    return (
        <Suspense fallback={
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        }>
            <TemplateEditorContent />
        </Suspense>
    );
}
