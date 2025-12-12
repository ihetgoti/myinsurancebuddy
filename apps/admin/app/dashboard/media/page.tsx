'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';

interface MediaFile {
    id: string;
    filename: string;
    path: string;
    width: number | null;
    height: number | null;
    sizeBytes: number | null;
    altText: string | null;
    uploadedBy: string | null;
    createdAt: string;
}

export default function MediaLibrary() {
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        try {
            const res = await fetch('/api/media');
            const data = await res.json();
            if (Array.isArray(data)) {
                setMedia(data);
            } else {
                setMedia([]);
            }
        } catch (error) {
            console.error('Failed to fetch media:', error);
            setMedia([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const res = await fetch('/api/media/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setSelectedFile(null);
                fetchMedia();
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMedia(media.filter(m => m.id !== id));
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const formatBytes = (bytes: number | null) => {
        if (!bytes) return 'Unknown';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const copyUrl = (path: string) => {
        navigator.clipboard.writeText(path);
        alert('URL copied to clipboard!');
    };

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
                        <p className="text-gray-600 mt-1">Manage uploaded images and files</p>
                    </div>
                </div>

                {/* Upload Form */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Upload New File</h2>
                    <form onSubmit={handleUpload} className="flex items-center gap-4">
                        <input
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            accept="image/*,.pdf,.doc,.docx"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <button
                            type="submit"
                            disabled={!selectedFile || uploading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </form>
                </div>

                {/* Media Grid */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-600">Loading media...</div>
                    ) : media.length === 0 ? (
                        <div className="p-8 text-center text-gray-600">
                            No media files found. Upload your first file above.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
                            {media.map((file) => (
                                <div key={file.id} className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition">
                                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                        {file.path.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                            <img
                                                src={file.path}
                                                alt={file.altText || file.filename}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-4xl">📄</div>
                                        )}
                                    </div>
                                    <div className="p-2">
                                        <p className="text-xs font-medium text-gray-900 truncate">{file.filename}</p>
                                        <p className="text-xs text-gray-500">{formatBytes(file.sizeBytes)}</p>
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => copyUrl(file.path)}
                                            className="bg-white text-gray-900 px-3 py-1 rounded text-xs hover:bg-gray-100"
                                        >
                                            Copy URL
                                        </button>
                                        <button
                                            onClick={() => handleDelete(file.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
