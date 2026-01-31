'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getApiUrl } from '@/lib/api';
import { Code, Save, Globe, AlertCircle, CheckCircle } from 'lucide-react';

interface CallOffer {
  id: string;
  name: string;
  campaignId: string;
  scriptUrl: string | null;
  scriptCode: string | null;
  phoneNumber: string | null;
  insuranceType: { id: string; name: string } | null;
  stateIds: string[];
  isActive: boolean;
}

interface State {
  id: string;
  name: string;
  code: string;
}

interface InsuranceType {
  id: string;
  name: string;
}

export default function MarketcallScriptsPage() {
  const [offers, setOffers] = useState<CallOffer[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingOffer, setEditingOffer] = useState<CallOffer | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    campaignId: '',
    scriptUrl: '',
    scriptCode: '',
    phoneNumber: '',
    insuranceTypeId: '',
    stateIds: [] as string[],
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [offersRes, statesRes, typesRes] = await Promise.all([
        fetch(getApiUrl('/api/call-offers')),
        fetch(getApiUrl('/api/states?limit=100')),
        fetch(getApiUrl('/api/insurance-types')),
      ]);

      const offersData = await offersRes.json();
      const statesData = await statesRes.json();
      const typesData = await typesRes.json();

      setOffers(Array.isArray(offersData) ? offersData : []);
      setStates(Array.isArray(statesData.states) ? statesData.states : (Array.isArray(statesData) ? statesData : []));
      setInsuranceTypes(Array.isArray(typesData) ? typesData : (typesData.types || []));
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (offer: CallOffer) => {
    setEditingOffer(offer);
    setFormData({
      name: offer.name,
      campaignId: offer.campaignId,
      scriptUrl: offer.scriptUrl || '',
      scriptCode: offer.scriptCode || '',
      phoneNumber: offer.phoneNumber || '',
      insuranceTypeId: offer.insuranceType?.id || '',
      stateIds: offer.stateIds || [],
      isActive: offer.isActive,
    });
    setMessage(null);
  };

  const handleSave = async () => {
    if (!editingOffer) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(getApiUrl(`/api/call-offers/${editingOffer.id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          insuranceTypeId: formData.insuranceTypeId || null,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Script updated successfully!' });
        fetchData();
        setTimeout(() => setEditingOffer(null), 1000);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  const getStateNames = (stateIds: string[]) => {
    if (!stateIds || stateIds.length === 0) return 'All States';
    return stateIds.map(id => states.find(s => s.id === id)?.code || id).join(', ');
  };

  const hasScript = (offer: CallOffer) => offer.scriptUrl || offer.scriptCode;

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Code className="w-8 h-8 text-blue-600" />
            Marketcall Scripts
          </h1>
          <p className="text-gray-600 mt-1">
            Add Marketcall JavaScript codes to display dynamic phone numbers
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            How Marketcall Scripts Work
          </h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p>
              <strong>Step 1:</strong> Marketcall gives you a JavaScript code for each campaign
            </p>
            <p>
              <strong>Step 2:</strong> Paste that script here, linked to the right insurance type and state
            </p>
            <p>
              <strong>Step 3:</strong> The script loads on your website and displays the correct phone number
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {offers.filter(o => hasScript(o)).length}
            </div>
            <div className="text-sm text-gray-600">With Scripts</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">
              {offers.filter(o => !hasScript(o)).length}
            </div>
            <div className="text-sm text-gray-600">Missing Scripts</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {offers.filter(o => o.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active Offers</div>
          </div>
        </div>

        {/* Offers Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : offers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No offers yet. Create offers in Call Offers section first.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Script</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">States</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${offer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {offer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{offer.name}</div>
                      <div className="text-xs text-gray-500">
                        {offer.insuranceType?.name || 'No insurance type'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {hasScript(offer) ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Script Added
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          No Script
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {getStateNames(offer.stateIds)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(offer)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {hasScript(offer) ? 'Edit Script' : 'Add Script'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Modal */}
        {editingOffer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-8">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 p-6">
              <h2 className="text-xl font-bold mb-1">
                {hasScript(editingOffer) ? 'Edit Script' : 'Add Script'}
              </h2>
              <p className="text-gray-500 text-sm mb-4">{editingOffer.name}</p>

              {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                  {message.text}
                </div>
              )}

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {/* Script URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Script URL (from Marketcall)
                  </label>
                  <input
                    type="url"
                    value={formData.scriptUrl}
                    onChange={(e) => setFormData({ ...formData, scriptUrl: e.target.value })}
                    placeholder="https://js.marketcall.com/..."
                    className="w-full px-4 py-2 border rounded-lg text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste the script URL that Marketcall provides
                  </p>
                </div>

                {/* Fallback Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fallback Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-2 border rounded-lg text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This number shows if the script fails to load
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setEditingOffer(null)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Script
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Example Script Section */}
        <div className="mt-6 bg-gray-50 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Example Marketcall Script
          </h3>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400 text-sm">
              {`<script src="https://js.marketcall.com/campaign/12345.js"></script>`}
            </code>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Marketcall will give you a script URL like this. Just paste it above.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
