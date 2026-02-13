'use client';

import AdminLayout from '@/components/AdminLayout';

export default function PageDataPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Page Data</h1>
        <p className="text-gray-600">Manage page data and variables.</p>
      </div>
    </AdminLayout>
  );
}
