'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        siteName: 'MyInsuranceBuddies',
        siteTagline: 'Your trusted insurance resource',
        contactEmail: 'hello@myinsurancebuddies.com',
        contactPhone: '1-800-INSURE',
        metaTitle: 'MyInsuranceBuddies | Insurance Made Simple',
        metaDescription: 'Find the best insurance rates and coverage information for your needs.',
        googleAnalyticsId: '',
        enableBlogComments: true,
        requireEmailVerification: false,
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        // In production, this would save to database/API
        setTimeout(() => {
            setSaving(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 500);
    };

    return (
        <AdminLayout>
            <div className="max-w-3xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                        <p className="text-slate-500 mt-1">Configure your site settings and preferences.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
                        Settings saved successfully!
                    </div>
                )}

                <div className="space-y-8">
                    {/* General Settings */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">General</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Site Name</label>
                                <input
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
                                <input
                                    type="text"
                                    value={settings.siteTagline}
                                    onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Contact Settings */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                                <input
                                    type="email"
                                    value={settings.contactEmail}
                                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={settings.contactPhone}
                                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                        </div>
                    </section>

                    {/* SEO Settings */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">SEO Defaults</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Default Meta Title</label>
                                <input
                                    type="text"
                                    value={settings.metaTitle}
                                    onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                                <p className="text-xs text-slate-500 mt-1">{settings.metaTitle.length}/60 characters</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Default Meta Description</label>
                                <textarea
                                    value={settings.metaDescription}
                                    onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                                />
                                <p className="text-xs text-slate-500 mt-1">{settings.metaDescription.length}/160 characters</p>
                            </div>
                        </div>
                    </section>

                    {/* Analytics */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Analytics</h2>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Google Analytics ID</label>
                            <input
                                type="text"
                                value={settings.googleAnalyticsId}
                                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="G-XXXXXXXXXX"
                            />
                        </div>
                    </section>

                    {/* Feature Toggles */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Features</h2>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.enableBlogComments}
                                    onChange={(e) => setSettings({ ...settings, enableBlogComments: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-300"
                                />
                                <div>
                                    <span className="font-medium text-slate-900">Enable Blog Comments</span>
                                    <p className="text-sm text-slate-500">Allow users to comment on blog posts</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.requireEmailVerification}
                                    onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-300"
                                />
                                <div>
                                    <span className="font-medium text-slate-900">Require Email Verification</span>
                                    <p className="text-sm text-slate-500">Users must verify email before quote requests</p>
                                </div>
                            </label>
                        </div>
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}
