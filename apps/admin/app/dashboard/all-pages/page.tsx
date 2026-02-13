'use client';

import AdminLayout from '@/components/AdminLayout';

export default function AllPagesPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All Site Pages</h1>
        <p className="text-gray-600">View all pages across the site.</p>
      </div>
    </AdminLayout>
  );
}
