import Link from 'next/link';
import { Shield, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

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
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-16 max-w-7xl">
                <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

                    {/* Brand Column (Col Span 4) */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="flex items-center gap-3 mb-6 group inline-block">
                            <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl shadow-lg shadow-blue-900/20 group-hover:bg-blue-500 transition-colors">
                                <Shield className="w-5 h-5 fill-current" />
                            </div>
                            <div>
                                <span className="block text-xl font-bold text-white tracking-tight leading-none">
                                    MyInsurance
                                </span>
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Buddies</span>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6 text-slate-400 max-w-sm">
                            We're on a mission to simplify insurance. Our licensed agents help you compare quotes from top carriers to find coverage that fits your life and budget perfectly.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink icon={<Facebook className="w-4 h-4" />} href="#" />
                            <SocialLink icon={<Twitter className="w-4 h-4" />} href="#" />
                            <SocialLink icon={<Instagram className="w-4 h-4" />} href="#" />
                            <SocialLink icon={<Linkedin className="w-4 h-4" />} href="#" />
                        </div>
                    </div>

                    {/* Links Column 1: Insurance (Col Span 2) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Insurance</h4>
                        <ul className="space-y-3 text-sm">
                            <li><FooterLink href="/car-insurance">Car Insurance</FooterLink></li>
                            <li><FooterLink href="/home-insurance">Home Insurance</FooterLink></li>
                            <li><FooterLink href="/life-insurance">Life Insurance</FooterLink></li>
                            <li><FooterLink href="/health-insurance">Health Insurance</FooterLink></li>
                            <li><FooterLink href="/business-insurance">Business Insurance</FooterLink></li>
                            <li><FooterLink href="/pet-insurance">Pet Insurance</FooterLink></li>
                        </ul>
                    </div>

                    {/* Links Column 2: Resources (Col Span 2) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Resources</h4>
                        <ul className="space-y-3 text-sm">
                            <li><FooterLink href="/guides">Insurance Guides</FooterLink></li>
                            <li><FooterLink href="/blog">Blog & News</FooterLink></li>
                            <li><FooterLink href="/tools">Calculators</FooterLink></li>
                            <li><FooterLink href="/states">Coverage by State</FooterLink></li>
                            <li><FooterLink href="/faq">FAQs</FooterLink></li>
                            <li><FooterLink href="/glossary">Glossary</FooterLink></li>
                        </ul>
                    </div>

                    {/* Links Column 3: Company (Col Span 2) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><FooterLink href="/about">About Us</FooterLink></li>
                            <li><FooterLink href="/careers">Careers</FooterLink></li>
                            <li><FooterLink href="/contact">Contact Support</FooterLink></li>
                            <li><FooterLink href="/partners">Partner with Us</FooterLink></li>
                            <li><FooterLink href="/sitemap">Sitemap</FooterLink></li>
                        </ul>
                    </div>

                    {/* Links Column 4: Contact (Col Span 2) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <div className="text-slate-500 text-xs uppercase font-bold mb-1">Call Us</div>
                                <a href="tel:1-855-205-2412" className="text-white hover:text-blue-400 transition-colors font-medium">1-855-205-2412</a>
                            </li>
                            <li>
                                <div className="text-slate-500 text-xs uppercase font-bold mb-1">Email</div>
                                <a href="mailto:support@myinsurancebuddies.com" className="text-white hover:text-blue-400 transition-colors font-medium">support@myinsurancebuddies.com</a>
                            </li>
                            <li>
                                <div className="text-slate-500 text-xs uppercase font-bold mb-1">Office</div>
                                <address className="not-italic text-slate-400">
                                    123 Insurance Way<br />
                                    Suite 400<br />
                                    Austin, TX 78701
                                </address>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800 bg-slate-950">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
                        <p>© {currentYear} InsuranceBuddies. All rights reserved. Licensed insurance agency.</p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="/licenses" className="hover:text-white transition-colors">Licenses</Link>
                        </div>
                    </div>
                    <div className="mt-4 text-[10px] text-slate-600 leading-relaxed text-center md:text-left max-w-4xl">
                        Disclaimer: MyInsuranceBuddies is not an insurance company. We are a comparison service that connects you with insurance providers. Quotes and savings vary by state and individual factors.
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ icon, href }: { icon: React.ReactNode, href: string }) {
    return (
        <a
            href={href}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"
        >
            {icon}
        </a>
    )
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block">
            {children}
        </Link>
    )
}
