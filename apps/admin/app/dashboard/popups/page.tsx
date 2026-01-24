'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';

interface Popup {
    id: string;
    name: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    ctaText: string;
    ctaUrl: string;
    secondaryCtaText: string | null;
    secondaryCtaUrl: string | null;
    phoneNumber: string | null;
    imageUrl: string | null;
    badgeText: string | null;
    accentColor: string;
    position: string;
    size: string;
    showTrustBadges: boolean;
    type: string;
    scrollPercentage: number | null;
    delaySeconds: number | null;
    showOncePerSession: boolean;
    showOncePerDay: boolean;
    cookieKey: string | null;
    insuranceTypeIds: string[];
    stateIds: string[];
    pageTypes: string[];
    excludePageSlugs: string[];
    isActive: boolean;
    priority: number;
    startDate: string | null;
    endDate: string | null;
    notes: string | null;
    createdAt: string;
}

interface InsuranceType {
    id: string;
    name: string;
    slug: string;
}

interface State {
    id: string;
    name: string;
    code: string;
}

const POPUP_TYPES = [
    { value: 'SCROLL', label: 'Scroll Trigger', desc: 'Shows when user scrolls to X% of page' },
    { value: 'EXIT_INTENT', label: 'Exit Intent', desc: 'Shows when user tries to leave' },
    { value: 'TIMED', label: 'Time Delay', desc: 'Shows after X seconds on page' },
];

const ACCENT_COLORS = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'emerald', label: 'Green', class: 'bg-emerald-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' },
];

const POSITIONS = [
    { value: 'CENTER', label: 'Center' },
    { value: 'BOTTOM_RIGHT', label: 'Bottom Right' },
    { value: 'BOTTOM_LEFT', label: 'Bottom Left' },
];

const SIZES = [
    { value: 'SM', label: 'Small' },
    { value: 'MD', label: 'Medium' },
    { value: 'LG', label: 'Large' },
];

const PAGE_TYPES = [
    { value: 'insurance', label: 'Insurance Pages' },
    { value: 'blog', label: 'Blog Posts' },
    { value: 'landing', label: 'Landing Pages' },
    { value: 'home', label: 'Homepage' },
];

export default function PopupsPage() {
    const [popups, setPopups] = useState<Popup[]>([]);
    const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'content' | 'trigger' | 'targeting' | 'style'>('content');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        subtitle: '',
        description: '',
        ctaText: 'Get Quote',
        ctaUrl: '',
        secondaryCtaText: '',
        secondaryCtaUrl: '',
        phoneNumber: '',
        imageUrl: '',
        badgeText: '',
        accentColor: 'blue',
        position: 'CENTER',
        size: 'MD',
        showTrustBadges: true,
        type: 'SCROLL',
        scrollPercentage: 50,
        delaySeconds: 0,
        showOncePerSession: true,
        showOncePerDay: false,
        cookieKey: '',
        insuranceTypeIds: [] as string[],
        stateIds: [] as string[],
        pageTypes: [] as string[],
        excludePageSlugs: '',
        priority: 0,
        startDate: '',
        endDate: '',
        notes: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [popupsRes, typesRes, statesRes] = await Promise.all([
                fetch(getApiUrl('/api/popups')),
                fetch(getApiUrl('/api/insurance-types')),
                fetch(getApiUrl('/api/states?limit=100')),
            ]);

            const popupsData = await popupsRes.json();
            const typesData = await typesRes.json();
            const statesData = await statesRes.json();

            setPopups(Array.isArray(popupsData) ? popupsData : (popupsData.popups || []));
            setInsuranceTypes(Array.isArray(typesData) ? typesData : []);
            setStates(Array.isArray(statesData.states) ? statesData.states : (Array.isArray(statesData) ? statesData : []));
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingPopup(null);
        setFormData({
            name: '',
            title: '',
            subtitle: '',
            description: '',
            ctaText: 'Get Quote',
            ctaUrl: '',
            secondaryCtaText: '',
            secondaryCtaUrl: '',
            phoneNumber: '',
            imageUrl: '',
            badgeText: '',
            accentColor: 'blue',
            position: 'CENTER',
            size: 'MD',
            showTrustBadges: true,
            type: 'SCROLL',
            scrollPercentage: 50,
            delaySeconds: 0,
            showOncePerSession: true,
            showOncePerDay: false,
            cookieKey: '',
            insuranceTypeIds: [],
            stateIds: [],
            pageTypes: [],
            excludePageSlugs: '',
            priority: 0,
            startDate: '',
            endDate: '',
            notes: '',
        });
        setActiveTab('content');
        setShowModal(true);
    };

    const openEditModal = (popup: Popup) => {
        setEditingPopup(popup);
        setFormData({
            name: popup.name,
            title: popup.title,
            subtitle: popup.subtitle || '',
            description: popup.description || '',
            ctaText: popup.ctaText,
            ctaUrl: popup.ctaUrl,
            secondaryCtaText: popup.secondaryCtaText || '',
            secondaryCtaUrl: popup.secondaryCtaUrl || '',
            phoneNumber: popup.phoneNumber || '',
            imageUrl: popup.imageUrl || '',
            badgeText: popup.badgeText || '',
            accentColor: popup.accentColor,
            position: popup.position,
            size: popup.size,
            showTrustBadges: popup.showTrustBadges,
            type: popup.type,
            scrollPercentage: popup.scrollPercentage || 50,
            delaySeconds: popup.delaySeconds || 0,
            showOncePerSession: popup.showOncePerSession,
            showOncePerDay: popup.showOncePerDay,
            cookieKey: popup.cookieKey || '',
            insuranceTypeIds: popup.insuranceTypeIds || [],
            stateIds: popup.stateIds || [],
            pageTypes: popup.pageTypes || [],
            excludePageSlugs: (popup.excludePageSlugs || []).join('\n'),
            priority: popup.priority,
            startDate: popup.startDate ? popup.startDate.split('T')[0] : '',
            endDate: popup.endDate ? popup.endDate.split('T')[0] : '',
            notes: popup.notes || '',
        });
        setActiveTab('content');
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.title || !formData.ctaUrl) {
            alert('Name, Title, and CTA URL are required');
            return;
        }

        setSaving(true);
        try {
            const url = editingPopup
                ? getApiUrl(`/api/popups/${editingPopup.id}`)
                : getApiUrl('/api/popups');
            const method = editingPopup ? 'PATCH' : 'POST';

            const payload = {
                ...formData,
                excludePageSlugs: formData.excludePageSlugs.split('\n').filter(s => s.trim()),
                startDate: formData.startDate || null,
                endDate: formData.endDate || null,
                scrollPercentage: formData.type === 'SCROLL' ? formData.scrollPercentage : null,
                delaySeconds: formData.type === 'TIMED' ? formData.delaySeconds : formData.delaySeconds,
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setShowModal(false);
                fetchData();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async (popup: Popup) => {
        try {
            await fetch(getApiUrl(`/api/popups/${popup.id}`), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !popup.isActive }),
            });
            fetchData();
        } catch (error) {
            console.error('Failed to toggle:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this popup?')) return;

        try {
            await fetch(getApiUrl(`/api/popups/${id}`), { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const toggleInsuranceType = (typeId: string) => {
        setFormData(prev => ({
            ...prev,
            insuranceTypeIds: prev.insuranceTypeIds.includes(typeId)
                ? prev.insuranceTypeIds.filter(id => id !== typeId)
                : [...prev.insuranceTypeIds, typeId],
        }));
    };

    const toggleState = (stateId: string) => {
        setFormData(prev => ({
            ...prev,
            stateIds: prev.stateIds.includes(stateId)
                ? prev.stateIds.filter(id => id !== stateId)
                : [...prev.stateIds, stateId],
        }));
    };

    const togglePageType = (type: string) => {
        setFormData(prev => ({
            ...prev,
            pageTypes: prev.pageTypes.includes(type)
                ? prev.pageTypes.filter(t => t !== type)
                : [...prev.pageTypes, type],
        }));
    };

    const getTypeLabel = (type: string) => {
        return POPUP_TYPES.find(t => t.value === type)?.label || type;
    };

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Popups</h1>
                        <p className="text-gray-600 mt-1">Configure lead capture popups for your pages</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + Create Popup
                    </button>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-purple-900 mb-1">🎯 Popup Types</h3>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                        {POPUP_TYPES.map(type => (
                            <div key={type.value} className="text-sm">
                                <span className="font-medium text-purple-800">{type.label}:</span>
                                <span className="text-purple-600 ml-1">{type.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popups Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : popups.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 mb-4">No popups configured yet</p>
                            <button onClick={openCreateModal} className="text-blue-600 hover:text-blue-700">
                                Create your first popup →
                            </button>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trigger</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Targeting</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {popups.map((popup) => (
                                    <tr key={popup.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleActive(popup)}
                                                className={`px-2 py-1 text-xs rounded-full ${popup.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-500'
                                                    }`}
                                            >
                                                {popup.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{popup.name}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-xs">{popup.title}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-full ${
                                                popup.type === 'EXIT_INTENT' ? 'bg-orange-100 text-orange-700' :
                                                popup.type === 'TIMED' ? 'bg-purple-100 text-purple-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {getTypeLabel(popup.type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {popup.type === 'SCROLL' && `${popup.scrollPercentage}% scroll`}
                                            {popup.type === 'TIMED' && `${popup.delaySeconds}s delay`}
                                            {popup.type === 'EXIT_INTENT' && 'On exit'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs space-y-1">
                                                {popup.insuranceTypeIds?.length > 0 && (
                                                    <span className="inline-block bg-blue-50 text-blue-600 px-2 py-0.5 rounded mr-1">
                                                        {popup.insuranceTypeIds.length} types
                                                    </span>
                                                )}
                                                {popup.stateIds?.length > 0 && (
                                                    <span className="inline-block bg-green-50 text-green-600 px-2 py-0.5 rounded mr-1">
                                                        {popup.stateIds.length} states
                                                    </span>
                                                )}
                                                {popup.pageTypes?.length > 0 && (
                                                    <span className="inline-block bg-purple-50 text-purple-600 px-2 py-0.5 rounded">
                                                        {popup.pageTypes.join(', ')}
                                                    </span>
                                                )}
                                                {!popup.insuranceTypeIds?.length && !popup.stateIds?.length && !popup.pageTypes?.length && (
                                                    <span className="text-gray-400">All pages</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{popup.priority}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openEditModal(popup)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(popup.id)}
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold">
                                {editingPopup ? 'Edit Popup' : 'Create Popup'}
                            </h2>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b">
                            {(['content', 'trigger', 'targeting', 'style'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 text-sm font-medium capitalize ${
                                        activeTab === tab
                                            ? 'border-b-2 border-blue-600 text-blue-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {/* Content Tab */}
                            {activeTab === 'content' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Internal Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g., Auto Insurance Exit Popup"
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Title *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Don't Leave Without Your Free Quote!"
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Subtitle</label>
                                            <input
                                                type="text"
                                                value={formData.subtitle}
                                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                                placeholder="Save up to $500/year"
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Badge Text</label>
                                            <input
                                                type="text"
                                                value={formData.badgeText}
                                                onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                                                placeholder="Limited Time Offer"
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Speak with a licensed agent and get personalized quotes..."
                                            className="w-full px-4 py-2 border rounded-lg"
                                            rows={2}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">CTA Button Text *</label>
                                            <input
                                                type="text"
                                                value={formData.ctaText}
                                                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                                placeholder="Get My Free Quote"
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">CTA URL *</label>
                                            <input
                                                type="text"
                                                value={formData.ctaUrl}
                                                onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                                                placeholder="tel:18552052412 or https://..."
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Secondary CTA Text</label>
                                            <input
                                                type="text"
                                                value={formData.secondaryCtaText}
                                                onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                                                placeholder="Compare Quotes Online"
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Secondary CTA URL</label>
                                            <input
                                                type="text"
                                                value={formData.secondaryCtaUrl}
                                                onChange={(e) => setFormData({ ...formData, secondaryCtaUrl: e.target.value })}
                                                placeholder="/get-quote"
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Phone Number (display)</label>
                                        <input
                                            type="text"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            placeholder="1-855-205-2412"
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Shown prominently if CTA is a phone call</p>
                                    </div>
                                </div>
                            )}

                            {/* Trigger Tab */}
                            {activeTab === 'trigger' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Popup Type</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {POPUP_TYPES.map(type => (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, type: type.value })}
                                                    className={`p-3 rounded-lg border text-left transition ${
                                                        formData.type === type.value
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div className="font-medium text-sm">{type.label}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {formData.type === 'SCROLL' && (
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Scroll Percentage: {formData.scrollPercentage}%
                                            </label>
                                            <input
                                                type="range"
                                                min="10"
                                                max="90"
                                                step="5"
                                                value={formData.scrollPercentage}
                                                onChange={(e) => setFormData({ ...formData, scrollPercentage: parseInt(e.target.value) })}
                                                className="w-full"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>10% (early)</span>
                                                <span>50% (middle)</span>
                                                <span>90% (late)</span>
                                            </div>
                                        </div>
                                    )}

                                    {formData.type === 'TIMED' && (
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Delay (seconds)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="300"
                                                value={formData.delaySeconds}
                                                onChange={(e) => setFormData({ ...formData, delaySeconds: parseInt(e.target.value) || 0 })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Popup shows X seconds after page load</p>
                                        </div>
                                    )}

                                    <div className="border-t pt-4 mt-4">
                                        <label className="block text-sm font-medium mb-2">Frequency Settings</label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.showOncePerSession}
                                                    onChange={(e) => setFormData({ ...formData, showOncePerSession: e.target.checked })}
                                                    className="rounded"
                                                />
                                                <span className="text-sm">Show only once per session</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.showOncePerDay}
                                                    onChange={(e) => setFormData({ ...formData, showOncePerDay: e.target.checked })}
                                                    className="rounded"
                                                />
                                                <span className="text-sm">Show only once per day (per user)</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Start Date (optional)</label>
                                            <input
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">End Date (optional)</label>
                                            <input
                                                type="date"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Targeting Tab */}
                            {activeTab === 'targeting' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Insurance Types</label>
                                        <div className="flex flex-wrap gap-2">
                                            {insuranceTypes.map(type => (
                                                <button
                                                    key={type.id}
                                                    type="button"
                                                    onClick={() => toggleInsuranceType(type.id)}
                                                    className={`px-3 py-1.5 text-sm rounded-full border transition ${
                                                        formData.insuranceTypeIds.includes(type.id)
                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                                                    }`}
                                                >
                                                    {type.name}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formData.insuranceTypeIds.length === 0 ? 'Shows on all insurance types' : `Shows on ${formData.insuranceTypeIds.length} selected types`}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Page Types</label>
                                        <div className="flex flex-wrap gap-2">
                                            {PAGE_TYPES.map(type => (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    onClick={() => togglePageType(type.value)}
                                                    className={`px-3 py-1.5 text-sm rounded-full border transition ${
                                                        formData.pageTypes.includes(type.value)
                                                            ? 'bg-purple-600 text-white border-purple-600'
                                                            : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                                                    }`}
                                                >
                                                    {type.label}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formData.pageTypes.length === 0 ? 'Shows on all page types' : `Shows on ${formData.pageTypes.join(', ')}`}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">States</label>
                                        <div className="border rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
                                            <div className="flex flex-wrap gap-2">
                                                {states.map(state => (
                                                    <button
                                                        key={state.id}
                                                        type="button"
                                                        onClick={() => toggleState(state.id)}
                                                        className={`px-2 py-1 text-xs rounded border transition ${
                                                            formData.stateIds.includes(state.id)
                                                                ? 'bg-green-600 text-white border-green-600'
                                                                : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                                                        }`}
                                                    >
                                                        {state.code}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <p className="text-xs text-gray-500">
                                                {formData.stateIds.length === 0 ? 'Shows in all states' : `${formData.stateIds.length} states selected`}
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, stateIds: states.map(s => s.id) })}
                                                    className="text-xs text-blue-600 hover:underline"
                                                >
                                                    Select All
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, stateIds: [] })}
                                                    className="text-xs text-gray-600 hover:underline"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Exclude Page Slugs</label>
                                        <textarea
                                            value={formData.excludePageSlugs}
                                            onChange={(e) => setFormData({ ...formData, excludePageSlugs: e.target.value })}
                                            placeholder="Enter slugs to exclude, one per line:&#10;/about&#10;/contact&#10;/privacy-policy"
                                            className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Priority</label>
                                        <input
                                            type="number"
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Higher priority popups show first when multiple match</p>
                                    </div>
                                </div>
                            )}

                            {/* Style Tab */}
                            {activeTab === 'style' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Accent Color</label>
                                        <div className="flex gap-3">
                                            {ACCENT_COLORS.map(color => (
                                                <button
                                                    key={color.value}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, accentColor: color.value })}
                                                    className={`w-10 h-10 rounded-lg ${color.class} ${
                                                        formData.accentColor === color.value
                                                            ? 'ring-2 ring-offset-2 ring-gray-400'
                                                            : ''
                                                    }`}
                                                    title={color.label}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Position</label>
                                            <select
                                                value={formData.position}
                                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            >
                                                {POSITIONS.map(pos => (
                                                    <option key={pos.value} value={pos.value}>{pos.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Size</label>
                                            <select
                                                value={formData.size}
                                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            >
                                                {SIZES.map(size => (
                                                    <option key={size.value} value={size.value}>{size.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.showTrustBadges}
                                                onChange={(e) => setFormData({ ...formData, showTrustBadges: e.target.checked })}
                                                className="rounded"
                                            />
                                            <span className="text-sm font-medium">Show trust badges</span>
                                        </label>
                                        <p className="text-xs text-gray-500 ml-6">Displays &quot;100% Free&quot; and &quot;No Obligation&quot; badges</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Header Image URL (optional)</label>
                                        <input
                                            type="text"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            placeholder="https://..."
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Notes (internal)</label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 p-6 border-t bg-gray-50">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Popup'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
