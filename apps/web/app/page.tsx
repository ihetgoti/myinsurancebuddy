import Link from 'next/link';

export default function Home() {
    const insuranceTypes = [
        { name: 'Auto Insurance', icon: '🚗', desc: 'Protect your vehicle and drive with confidence' },
        { name: 'Home Insurance', icon: '🏠', desc: 'Secure your home and belongings' },
        { name: 'Health Insurance', icon: '🏥', desc: 'Coverage for medical expenses and wellness' },
        { name: 'Life Insurance', icon: '💚', desc: 'Financial security for your loved ones' },
        { name: 'Business Insurance', icon: '💼', desc: 'Protect your business from unexpected risks' },
        { name: 'Travel Insurance', icon: '✈️', desc: 'Peace of mind on your adventures' },
    ];

    const popularStates = [
        { name: 'California', slug: 'california', abbr: 'CA' },
        { name: 'Texas', slug: 'texas', abbr: 'TX' },
        { name: 'Florida', slug: 'florida', abbr: 'FL' },
        { name: 'New York', slug: 'new-york', abbr: 'NY' },
        { name: 'Illinois', slug: 'illinois', abbr: 'IL' },
        { name: 'Pennsylvania', slug: 'pennsylvania', abbr: 'PA' },
    ];

    const stats = [
        { value: '50+', label: 'States Covered' },
        { value: '500+', label: 'Cities' },
        { value: '10K+', label: 'Happy Readers' },
        { value: '24/7', label: 'Resources Available' },
    ];

    return (
        <main className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🛡️</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            MyInsuranceBuddies
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition">Blog</Link>
                        <a href="#states" className="text-gray-600 hover:text-blue-600 transition">States</a>
                        <a href="#insurance-types" className="text-gray-600 hover:text-blue-600 transition">Coverage</a>
                        <a href="https://admin.myinsurancebuddies.com" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                            Admin
                        </a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-24 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

                <div className="container mx-auto px-4 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Trusted by thousands across America
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                            Insurance Made Simple
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Your comprehensive guide to finding the perfect insurance coverage across all 50 states. Expert advice, local insights, and personalized recommendations.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/blog"
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-600/30"
                            >
                                Explore Guides
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <a
                                href="#states"
                                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 hover:scale-105 transition-all border border-gray-200 shadow-lg"
                            >
                                Find Your State
                            </a>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Insurance Types */}
            <section id="insurance-types" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Coverage for Every Need
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Whether you're protecting your car, home, health, or business, we've got you covered with comprehensive guides and expert insights.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {insuranceTypes.map((type, i) => (
                            <div
                                key={i}
                                className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{type.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{type.name}</h3>
                                <p className="text-gray-600">{type.desc}</p>
                                <div className="mt-4 text-blue-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Learn more
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* States Section */}
            <section id="states" className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            State-Specific Insurance Guides
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Insurance requirements vary by state. Find detailed guides tailored to your location with local regulations, average rates, and provider comparisons.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-8">
                        {popularStates.map((state) => (
                            <Link
                                key={state.slug}
                                href={`/state/${state.slug}/insurance-guide`}
                                className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all"
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {state.abbr}
                                </div>
                                <span className="text-gray-700 font-medium text-sm">{state.name}</span>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center">
                        <p className="text-gray-500 mb-4">And 44 more states...</p>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Why Trust MyInsuranceBuddies?
                            </h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Unbiased Information</h3>
                                        <p className="text-gray-600">We provide honest, research-backed guidance without pushing any specific provider.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Expert Reviewed</h3>
                                        <p className="text-gray-600">All our content is reviewed by licensed insurance professionals.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Always Updated</h3>
                                        <p className="text-gray-600">Our guides reflect the latest regulations, rates, and industry changes.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                                <div className="text-6xl mb-4">💡</div>
                                <h3 className="text-2xl font-bold mb-3">Did You Know?</h3>
                                <p className="text-blue-100 mb-4">
                                    The average American can save up to $500 per year by comparing insurance quotes from multiple providers.
                                </p>
                                <div className="bg-white/20 rounded-xl p-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Average savings</span>
                                        <span className="font-bold text-xl">$500/year</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-400 rounded-2xl rotate-12 -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Find Your Perfect Coverage?
                    </h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                        Start exploring our comprehensive guides and make informed decisions about your insurance today.
                    </p>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all shadow-xl"
                    >
                        Browse All Guides
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">🛡️</span>
                                <span className="text-xl font-bold text-white">MyInsuranceBuddies</span>
                            </div>
                            <p className="text-sm">Your trusted partner in finding the right insurance coverage across America.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                                <li><a href="#states" className="hover:text-white transition">State Guides</a></li>
                                <li><a href="#insurance-types" className="hover:text-white transition">Coverage Types</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Popular States</h4>
                            <ul className="space-y-2 text-sm">
                                {popularStates.slice(0, 4).map(state => (
                                    <li key={state.slug}>
                                        <Link href={`/state/${state.slug}/insurance-guide`} className="hover:text-white transition">
                                            {state.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition">Disclaimer</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm">
                        <p>© {new Date().getFullYear()} MyInsuranceBuddies. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
