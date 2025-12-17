import Link from 'next/link';

const popularStates = [
    { name: 'California', slug: 'california' },
    { name: 'Texas', slug: 'texas' },
    { name: 'Florida', slug: 'florida' },
    { name: 'New York', slug: 'new-york' },
];

export default function Footer() {
    return (
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
                            <li><Link href="/#states" className="hover:text-white transition">State Guides</Link></li>
                            <li><Link href="/#insurance-types" className="hover:text-white transition">Coverage Types</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Popular States</h4>
                        <ul className="space-y-2 text-sm">
                            {popularStates.map(state => (
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
                            <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                            <li><Link href="/disclaimer" className="hover:text-white transition">Disclaimer</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-sm">
                    <p>© {new Date().getFullYear()} MyInsuranceBuddies. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
