'use client';

import { useState, useEffect } from 'react';
import { Download, Filter, Search, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface Lead {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
    zipCode: string;
    insuranceType: string | null;
    source: string;
    status: string;
    createdAt: string;
    referrer: string | null;
    metadata: any;
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useState({
        status: '',
        insuranceType: '',
        source: '',
        search: '',
    });

    const limit = 50;

    useEffect(() => {
        fetchLeads();
    }, [page, filters]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('limit', limit.toString());
            params.set('offset', (page * limit).toString());
            if (filters.status) params.set('status', filters.status);
            if (filters.insuranceType) params.set('insuranceType', filters.insuranceType);
            if (filters.source) params.set('source', filters.source);

            // Use web API endpoint from admin app
            const res = await fetch(`/api/leads?${params.toString()}`);
            const data = await res.json();

            setLeads(data.leads || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('Failed to fetch leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportLeads = () => {
        // Create CSV
        const headers = ['Date', 'Name', 'Email', 'Phone', 'ZIP', 'Insurance Type', 'Source', 'Status'];
        const rows = leads.map(lead => [
            new Date(lead.createdAt).toLocaleDateString(),
            `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'N/A',
            lead.email || 'N/A',
            lead.phoneNumber || 'N/A',
            lead.zipCode,
            lead.insuranceType || 'N/A',
            lead.source,
            lead.status,
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            NEW: 'bg-blue-100 text-blue-700',
            CONTACTED: 'bg-yellow-100 text-yellow-700',
            QUALIFIED: 'bg-purple-100 text-purple-700',
            CONVERTED: 'bg-green-100 text-green-700',
            DISQUALIFIED: 'bg-red-100 text-red-700',
            DUPLICATE: 'bg-gray-100 text-gray-700',
        };

        return (
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${styles[status] || styles.NEW}`}>
                {status}
            </span>
        );
    };

    const getSourceBadge = (source: string) => {
        const styles: Record<string, string> = {
            web: 'bg-blue-50 text-blue-700',
            popup: 'bg-purple-50 text-purple-700',
            phone_click: 'bg-green-50 text-green-700',
            affiliate: 'bg-orange-50 text-orange-700',
            fallback_form_no_offer: 'bg-red-50 text-red-700',
        };
        
        const labels: Record<string, string> = {
            web: 'Web Form',
            popup: 'Popup',
            phone_click: 'Phone Click',
            affiliate: 'Affiliate',
            fallback_form_no_offer: 'No Offer',
        };

        return (
            <span className={`px-2 py-1 text-xs rounded-full ${styles[source] || 'bg-gray-50 text-gray-700'}`}>
                {labels[source] || source}
            </span>
        );
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
                            <p className="text-gray-600 mt-1">
                                {total} total leads captured
                            </p>
                        </div>
                        <button
                            onClick={exportLeads}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Download size={18} />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Filters:</span>
                        </div>

                        <select
                            value={filters.status}
                            onChange={(e) => {
                                setFilters({ ...filters, status: e.target.value });
                                setPage(0);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="">All Statuses</option>
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="QUALIFIED">Qualified</option>
                            <option value="CONVERTED">Converted</option>
                            <option value="DISQUALIFIED">Disqualified</option>
                            <option value="DUPLICATE">Duplicate</option>
                        </select>

                        <select
                            value={filters.insuranceType}
                            onChange={(e) => {
                                setFilters({ ...filters, insuranceType: e.target.value });
                                setPage(0);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="">All Types</option>
                            <option value="Auto Insurance">Auto</option>
                            <option value="Home Insurance">Home</option>
                            <option value="Life Insurance">Life</option>
                            <option value="Health Insurance">Health</option>
                            <option value="Business Insurance">Business</option>
                            <option value="Renters Insurance">Renters</option>
                            <option value="Pet Insurance">Pet</option>
                            <option value="Motorcycle Insurance">Motorcycle</option>
                            <option value="Umbrella Insurance">Umbrella</option>
                        </select>

                        <select
                            value={filters.source}
                            onChange={(e) => {
                                setFilters({ ...filters, source: e.target.value });
                                setPage(0);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="">All Sources</option>
                            <option value="web">Web Form</option>
                            <option value="popup">Popup</option>
                            <option value="phone_click">Phone Click</option>
                            <option value="affiliate">Affiliate</option>
                            <option value="fallback_form_no_offer">Fallback (No Offer)</option>
                        </select>

                        <div className="relative flex-1 min-w-[200px]">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by email or ZIP..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Leads Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2">Loading leads...</p>
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <p className="text-lg">No leads found</p>
                            <p className="text-sm mt-1">Leads will appear here when users submit forms</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ZIP</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Insurance</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {leads.map((lead) => (
                                            <tr key={lead.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {lead.firstName || lead.lastName
                                                            ? `${lead.firstName || ''} ${lead.lastName || ''}`.trim()
                                                            : 'Anonymous'}
                                                    </div>
                                                    {lead.email && (
                                                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                                            <Mail size={12} />
                                                            {lead.email}
                                                        </div>
                                                    )}
                                                    {lead.phoneNumber && (
                                                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                                            <Phone size={12} />
                                                            {lead.phoneNumber}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1 text-sm text-gray-900">
                                                        <MapPin size={14} />
                                                        {lead.zipCode}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {lead.insuranceType || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getSourceBadge(lead.source)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(lead.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                    {lead.referrer && (
                                                        <a
                                                            href={lead.referrer}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800"
                                                            title="View Referrer"
                                                        >
                                                            <ExternalLink size={16} />
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Showing {page * limit + 1} to {Math.min((page + 1) * limit, total)} of {total} leads
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage(Math.max(0, page - 1))}
                                        disabled={page === 0}
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page {page + 1} of {Math.ceil(total / limit)}
                                    </span>
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={(page + 1) * limit >= total}
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="text-sm text-gray-500">New Leads</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {leads.filter(l => l.status === 'NEW').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="text-sm text-gray-500">Qualified</div>
                        <div className="text-2xl font-bold text-purple-600">
                            {leads.filter(l => l.status === 'QUALIFIED').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="text-sm text-gray-500">Converted</div>
                        <div className="text-2xl font-bold text-green-600">
                            {leads.filter(l => l.status === 'CONVERTED').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="text-sm text-gray-500">Conversion Rate</div>
                        <div className="text-2xl font-bold text-orange-600">
                            {leads.length > 0
                                ? ((leads.filter(l => l.status === 'CONVERTED').length / leads.length) * 100).toFixed(1)
                                : 0}%
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="text-sm text-gray-500">No Offer (Fallback)</div>
                        <div className="text-2xl font-bold text-red-600">
                            {leads.filter(l => l.source === 'fallback_form_no_offer').length}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
