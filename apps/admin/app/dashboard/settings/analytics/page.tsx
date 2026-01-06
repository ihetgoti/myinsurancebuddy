'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Save, AlertCircle, CheckCircle, Info } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface AnalyticsSettings {
    googleAnalyticsId: string | null;
    googleTagManagerId: string | null;
}

export default function AnalyticsSettingsPage() {
    const [settings, setSettings] = useState<AnalyticsSettings>({
        googleAnalyticsId: '',
        googleTagManagerId: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings/analytics');
            if (res.ok) {
                const data = await res.json();
                setSettings({
                    googleAnalyticsId: data.googleAnalyticsId || '',
                    googleTagManagerId: data.googleTagManagerId || '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch('/api/settings/analytics', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Settings saved successfully!' });
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="p-8 flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-8 max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                    <h1 className="text-2xl font-bold text-slate-900">Analytics Settings</h1>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                <div className="space-y-8">
                    {/* Google Analytics 4 */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <svg className="w-6 h-6 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                                    <path d="M14.3 16l.7-4.1.7 4.1h-1.4z" opacity=".3" />
                                    <path d="M9.3 16l.7-4.1.7 4.1H9.3z" opacity=".3" />
                                    <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm1.3-17h2.4l-2.4 14h-2.1l-1.6-9.1-1.6 9.1H5.9l-2.4-14h2.4l1.3 9.4 1.7-9.4h1.8l1.7 9.4 1.3-9.4z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Google Analytics 4 (GA4)</h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    Integration with the latest version of Google Analytics.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Measurement ID
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="G-XXXXXXXXXX"
                                        value={settings.googleAnalyticsId || ''}
                                        onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <div className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">ID</div>
                                </div>
                                <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                                    <Info className="w-3 h-3" />
                                    <span>Found in Google Analytics Admin &gt; Data Streams &gt; Web Stream Details</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Google Tag Manager */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 opacity-60">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Google Tag Manager (Optional)</h3>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded font-medium">Coming Soon</span>
                        </div>
                        <div className="space-y-4 pointer-events-none">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Container ID
                                </label>
                                <input
                                    type="text"
                                    placeholder="GTM-XXXXXXX"
                                    value={settings.googleTagManagerId || ''}
                                    readOnly
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={saveSettings}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
