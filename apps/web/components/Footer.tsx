import Link from 'next/link';

interface InsuranceType {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
}

interface FooterProps {
    insuranceTypes?: InsuranceType[];
}

export default function Footer({ insuranceTypes = [] }: FooterProps) {
    const currentYear = new Date().getFullYear();

    const popularStates = [
        { name: 'California', slug: 'california' },
        { name: 'Texas', slug: 'texas' },
        { name: 'Florida', slug: 'florida' },
        { name: 'New York', slug: 'new-york' },
        { name: 'New Jersey', slug: 'new-jersey' },
        { name: 'Virginia', slug: 'virginia' },
    ];

    return (
        <footer className="bg-[#0B1B34] text-slate-400">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 text-white flex items-center justify-center rounded-xl">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                InsuranceBuddies
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6 text-slate-400 max-w-sm">
                            InsuranceBuddies delivers on its promise to help customers save money and find the best insurance. As a licensed insurance agent in all 50 states, we exist to empower customers with bite-sized tips to ease those big decisions. No spam, no fees, no catch.
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                            <a href="tel:1-855-205-2412" className="text-teal-400 hover:text-teal-300 font-medium">
                                1-855-205-2412
                            </a>
                            <span className="text-slate-600">|</span>
                            <a href="sms:1-855-627-3925" className="text-teal-400 hover:text-teal-300 font-medium">
                                Text Us
                            </a>
                        </div>
                    </div>

                    {/* Car Insurance */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Car Insurance</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/car-insurance" className="hover:text-white transition-colors">Auto Insurance Rates</Link></li>
                            <li><Link href="/car-insurance/cheapest" className="hover:text-white transition-colors">Cheap Car Insurance</Link></li>
                            <li><Link href="/compare" className="hover:text-white transition-colors">Best Comparison Sites</Link></li>
                            <li><Link href="/car-insurance/best" className="hover:text-white transition-colors">Best Car Insurance Companies</Link></li>
                            <li><Link href="/states" className="hover:text-white transition-colors">Rates by State</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Resources</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/guides" className="hover:text-white transition-colors">Auto Insurance Coverage</Link></li>
                            <li><Link href="/guides/by-vehicle" className="hover:text-white transition-colors">Car Insurance by Vehicle</Link></li>
                            <li><Link href="/car-insurance/calculator" className="hover:text-white transition-colors">Car Insurance Calculator</Link></li>
                            <li><Link href="/guides/reviews" className="hover:text-white transition-colors">Car Insurance Reviews</Link></li>
                            <li><Link href="/guides/discounts" className="hover:text-white transition-colors">Car Insurance Discounts</Link></li>
                        </ul>
                    </div>

                    {/* Popular States */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Popular States</h4>
                        <ul className="space-y-3 text-sm">
                            {popularStates.map(state => (
                                <li key={state.slug}>
                                    <Link href={`/car-insurance/us/${state.slug}`} className="hover:text-white transition-colors">
                                        {state.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/privacy#do-not-sell" className="hover:text-white transition-colors">Do Not Sell My Data</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms and Conditions</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                        <p>
                            †Average potential savings based on initial quotes received by customers seeking insurance through InsuranceBuddies. Actual savings may vary depending on state of residence, individual circumstances, coverage selections, and insurance provider.
                        </p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                        <p>© {currentYear} InsuranceBuddies. All rights reserved. InsuranceBuddies is a licensed insurance agency in all 50 US jurisdictions.</p>
                        <div className="flex items-center gap-4">
                            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/privacy#choices" className="hover:text-white transition-colors">Your Privacy Choices</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
