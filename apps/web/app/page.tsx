export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center text-white mb-16">
                    <h1 className="text-6xl font-bold mb-6">MyInsuranceBuddies</h1>
                    <p className="text-2xl mb-4">Your Trusted Insurance Guide</p>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        Find the best insurance coverage for your needs across all 50 states and major cities
                    </p>
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
                    <div className="inline-block bg-white/20 backdrop-blur-md rounded-lg p-8 text-white">
                        <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
                        <p className="text-lg mb-6">Browse our comprehensive guides to find the perfect insurance coverage</p>
                        <div className="space-x-4">
                            <a href="#" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                                Browse States
                            </a>
                            <a href="#" className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
                                View Cities
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
