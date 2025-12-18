'use client';

import AdminLayout from '@/components/AdminLayout';
import CSVImport from '@/components/CSVImport';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ImportCitiesPage() {
    const router = useRouter();

    return (
        <AdminLayout>
            <div>
                <div className="mb-6">
                    <Link
                        href="/dashboard/cities"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                        ← Back to Cities
                    </Link>
                </div>

                <CSVImport
                    title="Import Cities"
                    description="Upload a CSV file to bulk import cities. Countries and states must exist first."
                    columns={[
                        { name: 'country_code', required: true, description: 'Country code (e.g., us)' },
                        { name: 'state_slug', required: true, description: 'State slug (e.g., california)' },
                        { name: 'name', required: true, description: 'City name' },
                        { name: 'slug', required: false, description: 'URL slug (auto-generated if empty)' },
                        { name: 'population', required: false, description: 'Population count' },
                    ]}
                    sampleData={[
                        { country_code: 'us', state_slug: 'california', name: 'Los Angeles', slug: 'los-angeles', population: '3900000' },
                        { country_code: 'us', state_slug: 'california', name: 'San Francisco', slug: 'san-francisco', population: '870000' },
                        { country_code: 'us', state_slug: 'new-york', name: 'New York City', slug: 'new-york-city', population: '8400000' },
                    ]}
                    importUrl={getApiUrl('/api/cities/import')}
                    onSuccess={() => router.push('/dashboard/cities')}
                />
            </div>
        </AdminLayout>
    );
}
