'use client';

import AdminLayout from '@/components/AdminLayout';

export default function AITemplatesPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">AI Templates</h1>
        <p className="text-gray-600">Manage AI prompt templates for content generation.</p>
      </div>
    </AdminLayout>
  );
}
