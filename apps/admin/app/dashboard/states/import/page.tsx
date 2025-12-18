'use client';

import AdminLayout from '@/components/AdminLayout';
import CSVImport from '@/components/CSVImport';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ImportStatesPage() {
    const router = useRouter();

    return (
        <AdminLayout>
            <div>
                <div className="mb-6">
                    <Link
                        href="/dashboard/states"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                        ← Back to States
                    </Link>
                </div>

                <CSVImport
                    title="Import States"
                    description="Upload a CSV file to bulk import states. Countries must exist first."
                    columns={[
                        { name: 'country_code', required: true, description: 'Country code (e.g., us, in)' },
                        { name: 'name', required: true, description: 'State name' },
                        { name: 'slug', required: false, description: 'URL slug (auto-generated if empty)' },
                        { name: 'code', required: false, description: 'State abbreviation (e.g., CA, NY)' },
                    ]}
                    sampleData={[
                        { country_code: 'us', name: 'California', slug: 'california', code: 'CA' },
                        { country_code: 'us', name: 'New York', slug: 'new-york', code: 'NY' },
                        { country_code: 'us', name: 'Texas', slug: 'texas', code: 'TX' },
                    ]}
                    importUrl={getApiUrl('/api/states/import')}
                    onSuccess={() => router.push('/dashboard/states')}
                />
            </div>
        </AdminLayout>
    );
}
