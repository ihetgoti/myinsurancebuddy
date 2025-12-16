"use client";

import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Template {
    id: string;
    name: string;
    slug: string;
    placeholders: string[];
    createdAt: string;
    updatedAt: string;
}

export default function TemplatesList() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setError("");
        try {
            const res = await fetch("/api/templates");
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to load templates");
            }
            const data = await res.json();
            setTemplates(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Failed to fetch templates:", err);
            setError(err.message);
            setTemplates([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this template? This cannot be undone.")) return;

        try {
            const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete template");
            }
            setTemplates((prev) => prev.filter((t) => t.id !== id));
        } catch (err: any) {
            console.error("Failed to delete template:", err);
            alert(err.message || "Delete failed");
        }
    };

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Programmatic Templates</h1>
                        <p className="text-gray-600 mt-1">Manage the HTML used to generate programmatic pages.</p>
                    </div>
                    <Link
                        href="/dashboard/templates/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        + New Template
                    </Link>
                </div>

                {error && (
                    <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-600">Loading templates...</div>
                    ) : templates.length === 0 ? (
                        <div className="p-8 text-center text-gray-600">
                            No templates found.{" "}
                            <Link href="/dashboard/templates/new" className="text-blue-600 hover:underline">
                                Create your first template
                            </Link>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Placeholders</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {templates.map((template) => (
                                    <tr key={template.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{template.name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">{template.slug}</code>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {template.placeholders?.length ? template.placeholders.join(", ") : "—"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(template.updatedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm space-x-3">
                                            <Link
                                                href={`/dashboard/templates/${template.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(template.id)}
                                                className="text-red-600 hover:text-red-900"
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
