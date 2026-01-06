'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, ToggleLeft, ToggleRight, Code, AlertCircle, CheckCircle } from 'lucide-react';

interface AdSettings {
    adsEnabled: boolean;
    adsenseId: string | null;
    adSlots: Record<string, string> | null;
    customAdCode: string | null;
}

export default function AdsSettingsPage() {
    const [settings, setSettings] = useState<AdSettings>({
        adsEnabled: true,
        adsenseId: '',
        adSlots: { header: '', sidebar: '', inContent: '' },
        customAdCode: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings/ads');
            if (res.ok) {
                const data = await res.json();
                setSettings({
                    adsEnabled: data.adsEnabled ?? true,
                    adsenseId: data.adsenseId || '',
                    adSlots: data.adSlots || { header: '', sidebar: '', inContent: '' },
                    customAdCode: data.customAdCode || '',
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
            const res = await fetch('/api/settings/ads', {
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
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <Settings className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-slate-900">Ad Settings</h1>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            <div className="space-y-8">
                {/* Master Toggle */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-slate-900">Enable Ads Globally</h3>
                            <p className="text-sm text-slate-500 mt-1">Master switch to enable/disable all ads site-wide</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, adsEnabled: !settings.adsEnabled })}
                            className={`p-2 rounded-lg transition-colors ${settings.adsEnabled ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                                }`}
                        >
                            {settings.adsEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                        </button>
                    </div>
                </div>

                {/* AdSense Configuration */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Google AdSense</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Publisher ID
                            </label>
                            <input
                                type="text"
                                placeholder="ca-pub-1234567890123456"
                                value={settings.adsenseId || ''}
                                onChange={(e) => setSettings({ ...settings, adsenseId: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-slate-400 mt-1">Your Google AdSense publisher ID</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Header Slot ID</label>
                                <input
                                    type="text"
                                    placeholder="1234567890"
                                    value={settings.adSlots?.header || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        adSlots: { ...settings.adSlots, header: e.target.value }
                                    })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sidebar Slot ID</label>
                                <input
                                    type="text"
                                    placeholder="1234567890"
                                    value={settings.adSlots?.sidebar || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        adSlots: { ...settings.adSlots, sidebar: e.target.value }
                                    })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">In-Content Slot ID</label>
                                <input
                                    type="text"
                                    placeholder="1234567890"
                                    value={settings.adSlots?.inContent || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        adSlots: { ...settings.adSlots, inContent: e.target.value }
                                    })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Custom Ad Code */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Code className="w-5 h-5 text-slate-500" />
                        <h3 className="font-semibold text-slate-900">Custom Ad Code</h3>
                    </div>
                    <textarea
                        placeholder="<!-- Paste your custom ad script here -->"
                        value={settings.customAdCode || ''}
                        onChange={(e) => setSettings({ ...settings, customAdCode: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                    <p className="text-xs text-slate-400 mt-2">
                        Use this for custom ad networks or additional scripts. Leave empty to use AdSense only.
                    </p>
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
    );
}
