'use client';

import AdminLayout from '@/components/AdminLayout';
import CSVImport from '@/components/CSVImport';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ImportCountriesPage() {
    const router = useRouter();

    return (
        <AdminLayout>
            <div>
                <div className="mb-6">
                    <Link
                        href="/dashboard/countries"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                        ← Back to Countries
                    </Link>
                </div>

                <CSVImport
                    title="Import Countries"
                    description="Upload a CSV file to bulk import countries."
                    columns={[
                        { name: 'code', required: true, description: '2-3 letter country code (e.g., us, in)' },
                        { name: 'name', required: true, description: 'Full country name' },
                    ]}
                    sampleData={[
                        { code: 'us', name: 'United States' },
                        { code: 'in', name: 'India' },
                        { code: 'uk', name: 'United Kingdom' },
                    ]}
                    importUrl={getApiUrl('/api/countries/import')}
                    onSuccess={() => router.push('/dashboard/countries')}
                />
            </div>
        </AdminLayout>
    );
}
