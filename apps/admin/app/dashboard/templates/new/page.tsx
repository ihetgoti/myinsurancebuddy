"use client";

import AdminLayout from "@/components/AdminLayout";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewTemplate() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        templateHtml: "",
        placeholders: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "name" && !prev.slug
                ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }
                : {}),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const placeholders = formData.placeholders
                ? formData.placeholders.split(",").map((p) => p.trim()).filter(Boolean)
                : [];

            const res = await fetch("/api/templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    slug: formData.slug,
                    templateHtml: formData.templateHtml,
                    placeholders,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create template");
            }

            router.push("/dashboard/templates");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const exampleTemplate = `<main>
  <h1>{{region_name}} Insurance Guide</h1>
  <p>{{seo_summary}}</p>
  <p>Median income: {{formatCurrency median_income}}</p>
</main>`;

    return (
        <AdminLayout>
            <div className="max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Create New Template</h1>
                    <p className="text-gray-600 mt-1">Design the HTML that powers your programmatic pages.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., State Insurance Guide"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="state-insurance-guide"
                            />
                            <p className="text-xs text-gray-500 mt-1">Used to identify the template internally.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 space-y-4">
                        <h3 className="font-semibold text-lg">Template Content</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                HTML Template * (Handlebars syntax)
                            </label>
                            <textarea
                                name="templateHtml"
                                value={formData.templateHtml}
                                onChange={handleChange}
                                required
                                rows={15}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                placeholder={exampleTemplate}
                            />
                            <p className="text-xs text-gray-500 mt-1">Variables come from region metadata and helpers.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Placeholders (comma separated)
                            </label>
                            <input
                                name="placeholders"
                                value={formData.placeholders}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="region_name, seo_summary, median_income"
                            />
                            <p className="text-xs text-gray-500 mt-1">Used to document expected dynamic values.</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Template Tips</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>Use {'{{variable}}'} for dynamic values (e.g., {'{{region_name}}'}).</li>
                            <li>Helpers available: formatNumber, formatCurrency, lowercase, uppercase, capitalize.</li>
                            <li>Keep markup semantic and include H1/H2 headings for SEO.</li>
                        </ul>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Template"}
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
