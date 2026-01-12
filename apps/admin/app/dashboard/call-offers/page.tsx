'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';

interface CallOffer {
    id: string;
    name: string;
    campaignId: string;
    subId: string | null;
    phoneMask: string;
    insuranceTypeId: string | null;
    insuranceType: { id: string; name: string; slug: string } | null;
    geoLevel: string | null;
    stateIds: string[];
    isActive: boolean;
    priority: number;
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

export default function CallOffersPage() {
    const [offers, setOffers] = useState<CallOffer[]>([]);
    const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOffer, setEditingOffer] = useState<CallOffer | null>(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        campaignId: '',
        subId: '',
        phoneMask: '(xxx) xxx-xx-xx',
        insuranceTypeId: '',
        stateIds: [] as string[],
        priority: 0,
        notes: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [offersRes, typesRes, statesRes] = await Promise.all([
                fetch(getApiUrl('/api/call-offers')),
                fetch(getApiUrl('/api/insurance-types')),
                fetch(getApiUrl('/api/states?limit=100')),
            ]);

            const offersData = await offersRes.json();
            const typesData = await typesRes.json();
            const statesData = await statesRes.json();

            setOffers(Array.isArray(offersData) ? offersData : []);
            setInsuranceTypes(Array.isArray(typesData) ? typesData : []);
            setStates(Array.isArray(statesData.states) ? statesData.states : (Array.isArray(statesData) ? statesData : []));
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingOffer(null);
        setFormData({
            name: '',
            campaignId: '',
            subId: '',
            phoneMask: '(xxx) xxx-xx-xx',
            insuranceTypeId: '',
            stateIds: [],
            priority: 0,
            notes: '',
        });
        setShowModal(true);
    };

    const openEditModal = (offer: CallOffer) => {
        setEditingOffer(offer);
        setFormData({
            name: offer.name,
            campaignId: offer.campaignId,
            subId: offer.subId || '',
            phoneMask: offer.phoneMask,
            insuranceTypeId: offer.insuranceTypeId || '',
            stateIds: offer.stateIds || [],
            priority: offer.priority,
            notes: offer.notes || '',
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.campaignId) {
            alert('Name and Campaign ID are required');
            return;
        }

        setSaving(true);
        try {
            const url = editingOffer
                ? getApiUrl(`/api/call-offers/${editingOffer.id}`)
                : getApiUrl('/api/call-offers');
            const method = editingOffer ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    insuranceTypeId: formData.insuranceTypeId || null,
                }),
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

    const handleToggleActive = async (offer: CallOffer) => {
        try {
            await fetch(getApiUrl(`/api/call-offers/${offer.id}`), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !offer.isActive }),
            });
            fetchData();
        } catch (error) {
            console.error('Failed to toggle:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this offer?')) return;

        try {
            await fetch(getApiUrl(`/api/call-offers/${id}`), { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const toggleState = (stateId: string) => {
        setFormData(prev => ({
            ...prev,
            stateIds: prev.stateIds.includes(stateId)
                ? prev.stateIds.filter(id => id !== stateId)
                : [...prev.stateIds, stateId],
        }));
    };

    const getStateNames = (stateIds: string[]) => {
        return stateIds.map(id => states.find(s => s.id === id)?.code || id).join(', ');
    };

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Call Offers</h1>
                        <p className="text-gray-600 mt-1">Manage Marketcall pay-per-call campaigns</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + Add Offer
                    </button>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-blue-900 mb-1">📞 How It Works</h3>
                    <p className="text-sm text-blue-700">
                        Add your Marketcall campaign IDs and select states. The offer will show on all STATE pages
                        and CITY pages within those states. Phone numbers update dynamically via Marketcall.
                    </p>
                </div>

                {/* Offers Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : offers.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 mb-4">No call offers yet</p>
                            <button onClick={openCreateModal} className="text-blue-600 hover:text-blue-700">
                                Create your first offer →
                            </button>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Insurance Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">States</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {offers.map((offer) => (
                                    <tr key={offer.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleActive(offer)}
                                                className={`px-2 py-1 text-xs rounded-full ${offer.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-500'
                                                    }`}
                                            >
                                                {offer.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{offer.name}</td>
                                        <td className="px-6 py-4">
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{offer.campaignId}</code>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {offer.insuranceType?.name || 'All Types'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {offer.stateIds && offer.stateIds.length > 0 ? (
                                                <span className="text-xs text-blue-600" title={getStateNames(offer.stateIds)}>
                                                    {offer.stateIds.length} states
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">All</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{offer.priority}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openEditModal(offer)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(offer.id)}
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-8">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6">
                        <h2 className="text-xl font-bold mb-4">
                            {editingOffer ? 'Edit Call Offer' : 'Add Call Offer'}
                        </h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Auto Insurance - California"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Campaign ID *</label>
                                    <input
                                        type="text"
                                        value={formData.campaignId}
                                        onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
                                        placeholder="330575"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Insurance Type</label>
                                    <select
                                        value={formData.insuranceTypeId}
                                        onChange={(e) => setFormData({ ...formData, insuranceTypeId: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        <option value="">All Types</option>
                                        {insuranceTypes.map((type) => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Priority</label>
                                    <input
                                        type="number"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* States Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    States (select which states should see this offer)
                                </label>
                                <div className="border rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
                                    <div className="flex flex-wrap gap-2">
                                        {states.map((state) => (
                                            <button
                                                key={state.id}
                                                type="button"
                                                onClick={() => toggleState(state.id)}
                                                className={`px-3 py-1 text-sm rounded-full border transition ${formData.stateIds.includes(state.id)
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                                                    }`}
                                            >
                                                {state.code}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <p className="text-xs text-gray-500">
                                        {formData.stateIds.length === 0 ? 'All states' : `${formData.stateIds.length} states selected`}
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
                                <p className="text-xs text-blue-600 mt-1">
                                    Offer shows on STATE pages + all CITY pages within selected states
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Sub ID (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.subId}
                                        onChange={(e) => setFormData({ ...formData, subId: e.target.value })}
                                        placeholder="tracking-ref"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone Mask</label>
                                    <input
                                        type="text"
                                        value={formData.phoneMask}
                                        onChange={(e) => setFormData({ ...formData, phoneMask: e.target.value })}
                                        placeholder="(xxx) xxx-xx-xx"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    rows={2}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
