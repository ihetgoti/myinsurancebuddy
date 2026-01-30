'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';
import { ExternalLink, Plus, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';

interface Affiliate {
    id: string;
    name: string;
    marketCallUrl: string;
    insuranceTypeId: string | null;
    insuranceType: { id: string; name: string; slug: string } | null;
    priority: number;
    isActive: boolean;
    subId: string | null;
    createdAt: string;
}

interface InsuranceType {
    id: string;
    name: string;
    slug: string;
}

export default function AffiliatesPage() {
    const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
    const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        marketCallUrl: '',
        insuranceTypeId: '',
        priority: 0,
        isActive: true,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [affRes, typesRes] = await Promise.all([
                fetch(getApiUrl('/api/affiliates')),
                fetch(getApiUrl('/api/insurance-types')),
            ]);
            
            const affiliatesData = await affRes.json();
            const typesData = await typesRes.json();
            
            setAffiliates(Array.isArray(affiliatesData) ? affiliatesData : []);
            setInsuranceTypes(Array.isArray(typesData) ? typesData : []);
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditingId(null);
        setFormData({
            name: '',
            marketCallUrl: '',
            insuranceTypeId: '',
            priority: 0,
            isActive: true,
        });
        setShowModal(true);
    };

    const openEdit = (affiliate: Affiliate) => {
        setEditingId(affiliate.id);
        setFormData({
            name: affiliate.name,
            marketCallUrl: affiliate.marketCallUrl,
            insuranceTypeId: affiliate.insuranceTypeId || '',
            priority: affiliate.priority,
            isActive: affiliate.isActive,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const url = editingId 
                ? getApiUrl(`/api/affiliates/${editingId}`)
                : getApiUrl('/api/affiliates');
            
            const res = await fetch(url, {
                method: editingId ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowModal(false);
                fetchData();
            }
        } catch (error) {
            console.error('Failed to save:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this affiliate?')) return;
        
        try {
            const res = await fetch(getApiUrl(`/api/affiliates/${id}`), {
                method: 'DELETE',
            });
            if (res.ok) fetchData();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const toggleActive = async (affiliate: Affiliate) => {
        try {
            const res = await fetch(getApiUrl(`/api/affiliates/${affiliate.id}`), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !affiliate.isActive }),
            });
            if (res.ok) fetchData();
        } catch (error) {
            console.error('Failed to toggle:', error);
        }
    };

    if (loading) return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">MarketCall Affiliates</h1>
                        <p className="text-slate-500 mt-1">Simple: Just add the niche and MarketCall URL. System handles tracking.</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                    >
                        <Plus size={20} />
                        Add Affiliate
                    </button>
                </div>

                {/* Affiliates Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Niche</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">MarketCall URL</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Priority</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {affiliates.map((affiliate) => (
                                <tr key={affiliate.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{affiliate.name}</td>
                                    <td className="px-6 py-4">
                                        {affiliate.insuranceType ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {affiliate.insuranceType.name}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-sm">General</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <a 
                                            href={affiliate.marketCallUrl} 
                                            target="_blank" 
                                            rel="noopener"
                                            className="flex items-center gap-1 text-blue-600 hover:underline text-sm truncate max-w-xs"
                                        >
                                            <ExternalLink size={14} />
                                            {affiliate.marketCallUrl.replace('https://', '').substring(0, 40)}...
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-medium text-sm">
                                            {affiliate.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => toggleActive(affiliate)}
                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                                affiliate.isActive 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-slate-100 text-slate-600'
                                            }`}
                                        >
                                            {affiliate.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            {affiliate.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(affiliate)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(affiliate.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {affiliates.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No affiliates yet. Click &quot;Add Affiliate&quot; to create one.
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• <strong>Niche:</strong> Select the insurance type this offer is for</li>
                        <li>• <strong>MarketCall URL:</strong> Paste the direct form URL from MarketCall</li>
                        <li>• <strong>Priority:</strong> Higher number = shown first when multiple match</li>
                        <li>• <strong>Auto-tracking:</strong> System automatically adds subId and campaign tracking</li>
                    </ul>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-6">
                            {editingId ? 'Edit Affiliate' : 'Add Affiliate'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Auto Insurance CA"
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Niche (Insurance Type)</label>
                                <select
                                    value={formData.insuranceTypeId}
                                    onChange={(e) => setFormData({ ...formData, insuranceTypeId: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="">General (All types)</option>
                                    {insuranceTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">MarketCall URL</label>
                                <input
                                    type="url"
                                    value={formData.marketCallUrl}
                                    onChange={(e) => setFormData({ ...formData, marketCallUrl: e.target.value })}
                                    placeholder="https://form.marketcall.com/..."
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-1">Paste the direct form URL from your MarketCall account</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                                <input
                                    type="number"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    min={0}
                                />
                                <p className="text-xs text-slate-500 mt-1">Higher number = shown first</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="rounded"
                                />
                                <label htmlFor="isActive" className="text-sm text-slate-700">Active</label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {editingId ? 'Save Changes' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
