export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center text-white mb-16">
                    <h1 className="text-6xl font-bold mb-6">MyInsuranceBuddies</h1>
                    <p className="text-2xl mb-4">Your Trusted Insurance Guide</p>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto mb-6">
                        Find the best insurance coverage for your needs across all 50 states and major cities
                    </p>
                    <div className="inline-flex gap-3">
                        <a href="/api/health" target="_blank" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition">
                            API Health
                        </a>
                        <a href="/admin" className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg font-semibold transition">
                            Admin Portal
                        </a>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
                        <h3 className="text-xl font-bold mb-3">State Guides</h3>
                        <p className="opacity-90">Comprehensive insurance guides for all 50 US states</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
                        <h3 className="text-xl font-bold mb-3">City Coverage</h3>
                        <p className="opacity-90">Detailed coverage information for major metropolitan areas</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
                        <h3 className="text-xl font-bold mb-3">Expert Articles</h3>
                        <p className="opacity-90">Stay informed with our latest insurance tips and news</p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className="inline-block bg-white/20 backdrop-blur-md rounded-lg p-8 text-white max-w-xl">
                        <h2 className="text-3xl font-bold mb-4">Platform Status</h2>
                        <div className="space-y-2 text-sm mb-6">
                            <div className="flex items-center justify-between">
                                <span>✅ Backend APIs</span>
                                <span className="bg-green-600 px-3 py-1 rounded-full text-xs">Live</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>✅ Database</span>
                                <span className="bg-green-600 px-3 py-1 rounded-full text-xs">Ready</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>🚧 Admin UI</span>
                                <span className="bg-yellow-600 px-3 py-1 rounded-full text-xs">In Progress</span>
                            </div>
                        </div>
                        <p className="text-base">Backend complete (~60%). Admin interfaces coming soon.</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
