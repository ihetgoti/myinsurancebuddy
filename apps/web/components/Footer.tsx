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

    return (
        <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-8 h-8 bg-white text-slate-900 flex items-center justify-center rounded-lg">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight group-hover:text-slate-200 transition-colors">
                                InsuranceBuddies
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6 max-w-sm text-slate-400">
                            We provide comprehensive, unbiased insurance information to help millions of Americans protect what matters most. Our guides are written by industry experts.
                        </p>
                        <div className="flex gap-4">
                            {['Twitter', 'Facebook', 'LinkedIn'].map((social) => (
                                <a key={social} href="#" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Insurance Types */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Insurance</h4>
                        <ul className="space-y-3">
                            {insuranceTypes.slice(0, 6).map(type => (
                                <li key={type.id}>
                                    <Link
                                        href={`/${type.slug}`}
                                        className="text-sm hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        {type.name.replace(' Insurance', '')}
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
                            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Resources</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/guides" className="hover:text-white transition-colors">Insurance Guides</Link></li>
                            <li><Link href="/glossary" className="hover:text-white transition-colors">Glossary</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">Help Center</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-900 bg-slate-950">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                        <p>© {currentYear} InsuranceBuddies Inc. All rights reserved.</p>
                        <div className="flex items-center gap-8">
                            <p>Made with care in San Francisco</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
