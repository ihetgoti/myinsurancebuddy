'use client';

import Link from 'next/link';

export default function AdminHome() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl mx-4">
                <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">Admin Portal</h1>
                <p className="text-gray-600 text-center mb-8">MyInsuranceBuddies Management</p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h2 className="font-semibold text-lg mb-3 text-blue-900">Default Credentials</h2>
                    <div className="space-y-1 text-sm">
                        <p className="font-mono">Email: admin@myinsurancebuddies.com</p>
                        <p className="font-mono">Password: changeme123</p>
                        <p className="text-red-600 font-semibold mt-2">⚠️ Change password immediately after first login</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="font-semibold text-lg mb-3">Backend APIs Ready</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                            <h3 className="font-semibold text-blue-600 mb-1">Posts API</h3>
                            <p className="text-xs text-gray-600 mb-2">Blog management endpoints</p>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">GET/POST /api/posts</code>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                            <h3 className="font-semibold text-blue-600 mb-1">Templates API</h3>
                            <p className="text-xs text-gray-600 mb-2">Programmatic page templates</p>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">GET/POST /api/templates</code>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                            <h3 className="font-semibold text-blue-600 mb-1">Regions API</h3>
                            <p className="text-xs text-gray-600 mb-2">States & cities management</p>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">GET/POST /api/regions</code>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                            <h3 className="font-semibold text-blue-600 mb-1">Media API</h3>
                            <p className="text-xs text-gray-600 mb-2">Image upload & processing</p>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">POST /api/media</code>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">🚧 UI Under Development</h3>
                    <p className="text-sm text-yellow-800 mb-2">
                        The admin user interface is currently being built. Backend APIs are fully functional and ready to use.
                    </p>
                    <p className="text-sm text-yellow-800">
                        You can test APIs using tools like Postman or curl.
                    </p>
                </div>

                <div className="mt-6 flex gap-3">
                    <Link 
                        href="/"
                        className="flex-1 text-center bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition"
                    >
                        ← Back to Site
                    </Link>
                    <a
                        href="/api/health"
                        target="_blank"
                        className="flex-1 text-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
                    >
                        Check Health
                    </a>
                </div>

                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>Backend Progress: ~60% complete</p>
                    <p className="mt-1">Next: Build blog editor & template manager UIs</p>
                </div>
            </div>
        </main>
    )
}
