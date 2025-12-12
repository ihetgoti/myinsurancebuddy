'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminHome() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    if (status === 'authenticated') {
        return null;
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md mx-4">
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Admin Portal</h1>
                <p className="text-gray-600 text-center mb-8">MyInsuranceBuddies</p>

                <div className="text-center mb-6">
                    <Link
                        href="/auth/signin"
                        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition font-medium"
                    >
                        Sign In to Admin Panel
                    </Link>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900 font-semibold mb-2">Default Credentials:</p>
                    <p className="text-xs font-mono text-blue-800">admin@myinsurancebuddies.com</p>
                    <p className="text-xs font-mono text-blue-800 mb-2">changeme123</p>
                    <p className="text-xs text-red-600 font-semibold">⚠️ Change password after first login</p>
                </div>

                <div className="mt-6 text-center">
                    <a
                        href="https://myinsurancebuddies.com"
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Main Site
                    </a>
                </div>
            </div>
        </main>
    );
}
