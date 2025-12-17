'use client';

import AdminLayout from '@/components/AdminLayout';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';

interface AuditLog {
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    changes: any;
    createdAt: string;
    user: {
        name: string | null;
        email: string;
    };
}

export default function AuditLogs() {
    const { data: session } = useSession();
    const router = useRouter();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (session?.user?.role !== 'SUPER_ADMIN') {
            router.push('/dashboard');
            return;
        }
        fetchLogs();
    }, [session, router]);

    const fetchLogs = async () => {
        try {
            const res = await fetch(getApiUrl('/api/audit'));
            const data = await res.json();
            setLogs(data);
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = filter === 'all'
        ? logs
        : logs.filter(log => log.entityType.toLowerCase() === filter.toLowerCase());

    if (session?.user?.role !== 'SUPER_ADMIN') {
        return null;
    }

    return (
        <AdminLayout>
            <div>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
                    <p className="text-gray-600 mt-1">System activity and change history</p>
                </div>

                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex gap-2">
                        {['all', 'post', 'template', 'user', 'media'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-4 py-2 rounded-md transition capitalize ${filter === type
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-600">Loading audit logs...</div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="p-8 text-center text-gray-600">No audit logs found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Changes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {log.user.name || log.user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                                                    log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                                                        log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div>
                                                    <p className="font-medium text-gray-900">{log.entityType}</p>
                                                    <p className="text-xs text-gray-500 font-mono">{log.entityId.slice(0, 8)}...</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <details className="cursor-pointer">
                                                    <summary className="text-blue-600 hover:text-blue-800">View details</summary>
                                                    <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto max-w-md">
                                                        {JSON.stringify(log.changes, null, 2)}
                                                    </pre>
                                                </details>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
