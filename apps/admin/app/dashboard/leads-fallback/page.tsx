'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getApiUrl } from '@/lib/api';
import { Mail, Phone, MapPin, Calendar, Filter, Download } from 'lucide-react';

interface Lead {
  id: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
  insuranceType: string;
  source: string;
  status: string;
  createdAt: string;
  metadata: {
    state?: string;
    city?: string;
  };
}

export default function FallbackLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    converted: 0,
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/leads?source=fallback_form_no_offer&limit=100'));
      const data = await res.json();
      
      let filteredLeads = data.leads || [];
      if (filter !== 'all') {
        filteredLeads = filteredLeads.filter((l: Lead) => l.status === filter);
      }
      
      setLeads(filteredLeads);
      
      const allLeads = data.leads || [];
      setStats({
        total: allLeads.length,
        new: allLeads.filter((l: Lead) => l.status === 'NEW').length,
        contacted: allLeads.filter((l: Lead) => l.status === 'CONTACTED').length,
        converted: allLeads.filter((l: Lead) => l.status === 'CONVERTED').length,
      });
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportLeads = () => {
    const csv = [
      ['Email', 'Phone', 'ZIP', 'Insurance Type', 'Location', 'Status', 'Date'].join(','),
      ...leads.map(lead => [
        lead.email,
        lead.phoneNumber,
        lead.zipCode,
        lead.insuranceType,
        `${lead.metadata?.city || ''}, ${lead.metadata?.state || ''}`,
        lead.status,
        new Date(lead.createdAt).toLocaleDateString(),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fallback-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Fallback Leads</h1>
          <p className="text-gray-600 mt-1">
            Leads captured when no Marketcall offer was available
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Leads</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.new}</div>
            <div className="text-sm text-gray-600">New</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">{stats.contacted}</div>
            <div className="text-sm text-gray-600">Contacted</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.converted}</div>
            <div className="text-sm text-gray-600">Converted</div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CONVERTED">Converted</option>
            </select>
          </div>
          <button
            onClick={exportLeads}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No fallback leads yet.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Insurance Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{lead.phoneNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{lead.zipCode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {lead.insuranceType || 'General'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        lead.status === 'NEW' ? 'bg-green-100 text-green-700' :
                        lead.status === 'CONTACTED' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
