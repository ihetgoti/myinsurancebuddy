'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getApiUrl } from '@/lib/api';
import { Phone, MapPin, RefreshCw, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface CallOffer {
  id: string;
  name: string;
  phoneNumber: string | null;
  campaignId: string;
  marketcallOfferId: string | null;
  insuranceType: { id: string; name: string } | null;
  stateIds: string[];
  isActive: boolean;
  displayPrice: number | null;
}

interface State {
  id: string;
  name: string;
  code: string;
}

export default function MarketcallPage() {
  const [offers, setOffers] = useState<CallOffer[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [syncResult, setSyncResult] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [offersRes, statesRes] = await Promise.all([
        fetch(getApiUrl('/api/call-offers')),
        fetch(getApiUrl('/api/states?limit=100')),
      ]);

      const offersData = await offersRes.json();
      const statesData = await statesRes.json();

      setOffers(Array.isArray(offersData) ? offersData : []);
      setStates(Array.isArray(statesData.states) ? statesData.states : (Array.isArray(statesData) ? statesData : []));
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncWithMarketcall = async () => {
    if (!apiKey.trim()) {
      alert('Please enter your Marketcall API key');
      return;
    }

    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch(getApiUrl('/api/marketcall/sync'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          syncPhones: true,
          syncOffers: true,
          dryRun: false,
        }),
      });

      const data = await res.json();
      setSyncResult(data);
      if (data.success) {
        fetchData(); // Refresh offers
      }
    } catch (error: any) {
      setSyncResult({ error: error.message });
    } finally {
      setSyncing(false);
    }
  };

  const getStateNames = (stateIds: string[]) => {
    if (!stateIds || stateIds.length === 0) return 'All States';
    return stateIds.map(id => states.find(s => s.id === id)?.code || id).join(', ');
  };

  const offersWithPhones = offers.filter(o => o.phoneNumber);
  const offersWithoutPhones = offers.filter(o => !o.phoneNumber);
  const offersByState = offers.filter(o => o.stateIds && o.stateIds.length > 0);
  const offersAllStates = offers.filter(o => !o.stateIds || o.stateIds.length === 0);

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Phone className="w-8 h-8 text-blue-600" />
            Marketcall Integration
          </h1>
          <p className="text-gray-600 mt-1">
            Sync phone numbers and offers from your Marketcall account
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{offers.length}</div>
            <div className="text-sm text-gray-600">Total Offers</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{offersWithPhones.length}</div>
            <div className="text-sm text-gray-600">With Phone Numbers</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">{offersByState.length}</div>
            <div className="text-sm text-gray-600">State-Specific</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{offersAllStates.length}</div>
            <div className="text-sm text-gray-600">All States</div>
          </div>
        </div>

        {/* Sync Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Sync with Marketcall
          </h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-900 mb-2">How to get your API Key:</h3>
            <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
              <li>Login to your Marketcall account</li>
              <li>Go to your Profile or API section</li>
              <li>Copy your API Key</li>
              <li>Paste it below and click Sync</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Marketcall API Key"
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              onClick={syncWithMarketcall}
              disabled={syncing}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {syncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Sync Now
                </>
              )}
            </button>
          </div>

          {syncResult && (
            <div className={`mt-4 p-4 rounded-lg ${syncResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {syncResult.success ? (
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">{syncResult.message}</p>
                    {syncResult.mappings && (
                      <p className="text-sm text-green-600 mt-1">
                        Found {syncResult.mappings.regionsFound} regions and {syncResult.mappings.categoriesFound} categories in Marketcall
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <p className="text-red-800">{syncResult.error || 'Sync failed'}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Offers List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold">Your Offers</h2>
            <a 
              href="/dashboard/call-offers" 
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              Manage All Offers <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : offers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Phone className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No offers yet. Click &ldquo;Sync Now&rdquo; above to import from Marketcall.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">States</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
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
                      <div className="text-xs text-gray-500">ID: {offer.campaignId}</div>
                    </td>
                    <td className="px-6 py-4">
                      {offer.phoneNumber ? (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-600" />
                          <span className="font-mono">{offer.phoneNumber}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No phone</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {getStateNames(offer.stateIds)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {offer.displayPrice ? (
                        <span className="text-green-600 font-bold">
                          ${offer.displayPrice}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Guide */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-medium text-amber-900 mb-2">📖 Quick Guide for Performance Marketers</h3>
          <div className="text-sm text-amber-800 space-y-2">
            <p><strong>What happens when I sync?</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>We fetch all your phone numbers from Marketcall</li>
              <li>We fetch all your offers (with their state restrictions)</li>
              <li>We match them to your website&apos;s insurance types and states</li>
              <li>The right phone number shows on the right page automatically</li>
            </ul>
            
            <p className="mt-3"><strong>How it works on your website:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>User visits &ldquo;Car Insurance California&rdquo; page</li>
              <li>System finds the California phone number for Car Insurance</li>
              <li>Phone number is displayed: &ldquo;Call (555) 123-4567&rdquo;</li>
              <li>If no California number, shows fallback number</li>
            </ul>

            <p className="mt-3"><strong>Setting up pricing (optional):</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>Go to Marketing → Pricing Manager</li>
              <li>Set display prices like &ldquo;Starting from $59&rdquo;</li>
              <li>This increases form fills without changing actual rates</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
