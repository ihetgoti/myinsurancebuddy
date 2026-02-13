'use client';

import AdminLayout from '@/components/AdminLayout';

export default function FreeModelsPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Free AI Models</h1>
        <p className="text-gray-600">Configure free AI models for content generation.</p>
      </div>
    </AdminLayout>
  );
}
