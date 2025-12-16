"use client";

import AdminLayout from "@/components/AdminLayout";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface Template {
    id: string;
    name: string;
    slug: string;
    templateHtml: string;
    placeholders: string[];
    createdAt: string;
    updatedAt: string;
}

export default function EditTemplate() {
    const params = useParams();
    const router = useRouter();
    const templateId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState<Template | null>(null);
    const placeholdersText = useMemo(
        () => (formData?.placeholders?.length ? formData.placeholders.join(", ") : ""),
        [formData?.placeholders]
    );

    useEffect(() => {
        if (templateId) {
            fetchTemplate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateId]);

    const fetchTemplate = async () => {
        setError("");
        try {
            const res = await fetch(`/api/templates/${templateId}`);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Template not found");
            }
            const data = await res.json();
            setFormData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) =>
            prev
                ? {
                      ...prev,
                      [name]: value,
                      ...(name === "name" && !prev.slug
                          ? {
                                slug: value
                                    .toLowerCase()
                                    .replace(/[^a-z0-9]+/g, "-")
                                    .replace(/(^-|-$)/g, ""),
                            }
                          : {}),
                  }
                : null
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        setError("");
        setSuccess("");
        setSaving(true);

        try {
            const res = await fetch(`/api/templates/${templateId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    slug: formData.slug,
                    templateHtml: formData.templateHtml,
                    placeholders: placeholdersText
                        .split(",")
                        .map((p) => p.trim())
                        .filter(Boolean),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update template");
            }

            setSuccess("Template updated successfully!");
            setTimeout(() => setSuccess(""), 2500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this template?")) return;

        try {
            const res = await fetch(`/api/templates/${templateId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete template");
            router.push("/dashboard/templates");
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-gray-600">Loading template...</div>
                </div>
            </AdminLayout>
        );
    }

    if (!formData) {
        return (
            <AdminLayout>
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
                    <p className="text-gray-600 mb-6">The requested template could not be found.</p>
                    <button onClick={() => router.push("/dashboard/templates")} className="text-blue-600 hover:text-blue-800">
                        ← Back to Templates
                    </button>
                </div>
            </AdminLayout>
        );
    }

    const variables = [
        "{{region_name}}",
        "{{region_slug}}",
        "{{region_type}}",
        "{{state_code}}",
        "{{population}}",
        "{{median_income}}",
        "{{timezone}}",
        "{{seo_summary}}",
        "{{legal_notes}}",
    ];

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <button
                            onClick={() => router.push("/dashboard/templates")}
                            className="text-gray-600 hover:text-gray-900 mb-2 inline-block"
                        >
                            ← Back to Templates
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Template</h1>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                    >
                        Delete Template
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold mb-4">Template Details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">HTML Template *</label>
                                        <textarea
                                            name="templateHtml"
                                            value={formData.templateHtml}
                                            onChange={handleChange}
                                            required
                                            rows={15}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold mb-4">Placeholders</h2>
                                <p className="text-sm text-gray-600 mb-3">
                                    Document the values your template expects. These are not rendered automatically but help authors
                                    keep templates consistent.
                                </p>
                                <input
                                    type="text"
                                    name="placeholders"
                                    value={placeholdersText}
                                    onChange={(e) =>
                                        setFormData((prev) =>
                                            prev
                                                ? { ...prev, placeholders: e.target.value.split(",").map((p) => p.trim()).filter(Boolean) }
                                                : prev
                                        )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="region_name, seo_summary, median_income"
                                />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                                >
                                    {saving ? "Saving..." : "Update Template"}
                                </button>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold mb-4">Available Variables</h2>
                                <p className="text-sm text-gray-600 mb-4">Use these variables in your templates:</p>
                                <div className="space-y-2">
                                    {variables.map((variable) => (
                                        <button
                                            key={variable}
                                            type="button"
                                            onClick={() => navigator.clipboard.writeText(variable)}
                                            className="block w-full text-left px-3 py-2 bg-gray-50 rounded text-sm font-mono hover:bg-gray-100 transition"
                                        >
                                            {variable}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-3">Click to copy</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
