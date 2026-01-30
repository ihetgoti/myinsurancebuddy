import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Shield, Lock, Eye, Database, UserCheck, Mail, Phone, Globe, FileText, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
    ]);
    return { insuranceTypes, states };
}

export const metadata = {
    title: 'Privacy Policy | MyInsuranceBuddies',
    description: 'Learn how MyInsuranceBuddies collects, uses, and protects your personal information. Our privacy policy is designed for transparency and CCPA/GDPR compliance.',
};

const sections = [
    { id: 'overview', title: 'Privacy Overview' },
    { id: 'information-collected', title: 'Information We Collect' },
    { id: 'how-we-use', title: 'How We Use Your Information' },
    { id: 'information-sharing', title: 'Information Sharing' },
    { id: 'cookies', title: 'Cookies & Tracking' },
    { id: 'data-security', title: 'Data Security' },
    { id: 'your-rights', title: 'Your Privacy Rights' },
    { id: 'ccpa', title: 'California Privacy Rights (CCPA)' },
    { id: 'children', title: 'Children\'s Privacy' },
    { id: 'updates', title: 'Policy Updates' },
    { id: 'contact', title: 'Contact Us' },
];

export default async function PrivacyPage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-slate-50">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-2xl mb-6">
                        <Shield className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-4">
                        Your privacy matters to us. Learn how we collect, use, and protect your personal information.
                    </p>
                    <p className="text-slate-400">
                        <span className="font-semibold">Effective Date:</span> January 1, 2025 | <span className="font-semibold">Last Updated:</span> January 15, 2025
                    </p>
                </div>
            </section>

            {/* Quick Navigation */}
            <section className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
                        <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">Jump to:</span>
                        {sections.slice(0, 6).map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition whitespace-nowrap"
                            >
                                {section.title}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">

                        {/* Sidebar Navigation */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-24 bg-white rounded-xl border border-slate-200 p-6">
                                <h3 className="font-bold text-slate-900 mb-4">Table of Contents</h3>
                                <nav className="space-y-2">
                                    {sections.map((section, idx) => (
                                        <a
                                            key={section.id}
                                            href={`#${section.id}`}
                                            className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition py-1"
                                        >
                                            <span className="text-xs text-slate-400 font-mono">{String(idx + 1).padStart(2, '0')}</span>
                                            {section.title}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Content */}
                        <div className="lg:col-span-3 space-y-12">

                            {/* Overview */}
                            <section id="overview" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">Privacy Overview</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        MyInsuranceBuddies ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website myinsurancebuddies.com and use our services.
                                    </p>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        As a licensed insurance agency operating in all 50 states, we understand the sensitive nature of the information you share with us. We have designed our privacy practices to exceed industry standards and comply with applicable federal and state laws, including the California Consumer Privacy Act (CCPA) and other state privacy regulations.
                                    </p>
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
                                        <p className="text-blue-800 text-sm">
                                            <strong>Key Commitment:</strong> We never sell your personal information to third parties for marketing purposes. Your trust is our most valuable asset.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Information We Collect */}
                            <section id="information-collected" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Database className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">Information We Collect</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Information You Provide Directly</h3>
                                    <p className="text-slate-600 mb-4">When you use our services, you may provide us with:</p>
                                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                                        <li><strong>Contact Information:</strong> Name, email address, phone number, and mailing address</li>
                                        <li><strong>Quote Request Information:</strong> Date of birth, driver's license number, vehicle information, property details, health information, and other details needed to provide insurance quotes</li>
                                        <li><strong>Account Information:</strong> Username, password, and account preferences</li>
                                        <li><strong>Communication Records:</strong> Records of your correspondence with us, including chat logs and email exchanges</li>
                                        <li><strong>Payment Information:</strong> Credit card numbers and billing information (processed securely through our payment processors)</li>
                                    </ul>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Information Collected Automatically</h3>
                                    <p className="text-slate-600 mb-4">When you visit our website, we automatically collect:</p>
                                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                                        <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
                                        <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, and referring URLs</li>
                                        <li><strong>Location Data:</strong> General geographic location based on IP address</li>
                                        <li><strong>Cookie Data:</strong> Information stored in cookies and similar tracking technologies</li>
                                    </ul>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Information from Third Parties</h3>
                                    <p className="text-slate-600 mb-4">We may receive information from:</p>
                                    <ul className="list-disc pl-6 text-slate-600 space-y-2">
                                        <li><strong>Insurance Partners:</strong> Quote results, policy information, and underwriting decisions</li>
                                        <li><strong>Data Providers:</strong> Motor vehicle records, claims history, and credit information (with your consent)</li>
                                        <li><strong>Marketing Partners:</strong> Information about how you learned about our services</li>
                                    </ul>
                                </div>
                            </section>

                            {/* How We Use Your Information */}
                            <section id="how-we-use" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Eye className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">How We Use Your Information</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 mb-4">We use the information we collect for the following purposes:</p>

                                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-slate-900 mb-2">Providing Services</h4>
                                            <ul className="text-sm text-slate-600 space-y-1">
                                                <li>Generate and deliver insurance quotes</li>
                                                <li>Connect you with insurance providers</li>
                                                <li>Process applications and policy purchases</li>
                                                <li>Provide customer support</li>
                                            </ul>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-slate-900 mb-2">Improving Experience</h4>
                                            <ul className="text-sm text-slate-600 space-y-1">
                                                <li>Personalize your experience</li>
                                                <li>Analyze and improve our website</li>
                                                <li>Develop new features and services</li>
                                                <li>Conduct research and analytics</li>
                                            </ul>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-slate-900 mb-2">Communications</h4>
                                            <ul className="text-sm text-slate-600 space-y-1">
                                                <li>Send service-related notifications</li>
                                                <li>Respond to your inquiries</li>
                                                <li>Send promotional content (with consent)</li>
                                                <li>Provide policy reminders</li>
                                            </ul>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-slate-900 mb-2">Legal & Security</h4>
                                            <ul className="text-sm text-slate-600 space-y-1">
                                                <li>Comply with legal obligations</li>
                                                <li>Prevent fraud and abuse</li>
                                                <li>Protect our rights and property</li>
                                                <li>Enforce our terms of service</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Information Sharing */}
                            <section id="information-sharing" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">Information Sharing</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 mb-4">We may share your information with the following categories of third parties:</p>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Insurance Partners</h3>
                                    <p className="text-slate-600 mb-4">
                                        When you request quotes, we share your information with our network of 120+ insurance carriers and agencies to provide you with competitive rates. These partners are bound by confidentiality agreements and may only use your information for insurance purposes.
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Service Providers</h3>
                                    <p className="text-slate-600 mb-4">
                                        We work with trusted service providers who assist us in operating our business, including:
                                    </p>
                                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                                        <li>Cloud hosting and data storage providers</li>
                                        <li>Analytics and advertising platforms</li>
                                        <li>Customer service and communication tools</li>
                                        <li>Payment processors</li>
                                        <li>Fraud prevention services</li>
                                    </ul>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Legal Requirements</h3>
                                    <p className="text-slate-600 mb-4">
                                        We may disclose your information when required by law, court order, or government regulation, or when we believe disclosure is necessary to protect our rights, prevent fraud, or ensure the safety of our users.
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Business Transfers</h3>
                                    <p className="text-slate-600">
                                        In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. We will notify you of any such change and your choices regarding your information.
                                    </p>
                                </div>
                            </section>

                            {/* Cookies & Tracking */}
                            <section id="cookies" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <Database className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">Cookies & Tracking Technologies</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 mb-4">
                                        We use cookies and similar technologies to enhance your experience and gather information about visitors and visits to our website.
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Types of Cookies We Use</h3>
                                    <div className="space-y-4 mb-6">
                                        <div className="border-l-4 border-blue-500 pl-4">
                                            <h4 className="font-semibold text-slate-900">Essential Cookies</h4>
                                            <p className="text-sm text-slate-600">Required for the website to function properly. These cannot be disabled.</p>
                                        </div>
                                        <div className="border-l-4 border-green-500 pl-4">
                                            <h4 className="font-semibold text-slate-900">Performance Cookies</h4>
                                            <p className="text-sm text-slate-600">Help us understand how visitors interact with our website by collecting anonymous information.</p>
                                        </div>
                                        <div className="border-l-4 border-purple-500 pl-4">
                                            <h4 className="font-semibold text-slate-900">Functional Cookies</h4>
                                            <p className="text-sm text-slate-600">Enable enhanced functionality and personalization, such as remembering your preferences.</p>
                                        </div>
                                        <div className="border-l-4 border-orange-500 pl-4">
                                            <h4 className="font-semibold text-slate-900">Advertising Cookies</h4>
                                            <p className="text-sm text-slate-600">Used to deliver relevant advertisements and track campaign performance.</p>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Managing Cookies</h3>
                                    <p className="text-slate-600">
                                        Most browsers allow you to control cookies through settings. You can set your browser to refuse all cookies or indicate when a cookie is being sent. However, some features of our website may not function properly without cookies.
                                    </p>
                                </div>
                            </section>

                            {/* Data Security */}
                            <section id="data-security" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-red-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">Data Security</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 mb-4">
                                        We implement comprehensive security measures to protect your personal information:
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                                            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-slate-900">Encryption</h4>
                                                <p className="text-sm text-slate-600">All data transmitted using 256-bit SSL/TLS encryption</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                                            <Lock className="w-5 h-5 text-green-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-slate-900">Access Controls</h4>
                                                <p className="text-sm text-slate-600">Role-based access with multi-factor authentication</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                                            <Database className="w-5 h-5 text-purple-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-slate-900">Secure Storage</h4>
                                                <p className="text-sm text-slate-600">Data stored in SOC 2 compliant data centers</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                                            <Eye className="w-5 h-5 text-orange-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-slate-900">Monitoring</h4>
                                                <p className="text-sm text-slate-600">24/7 security monitoring and threat detection</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                                            <p className="text-amber-800 text-sm">
                                                While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to using industry best practices.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Your Privacy Rights */}
                            <section id="your-rights" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                        <UserCheck className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">Your Privacy Rights</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 mb-4">You have the following rights regarding your personal information:</p>

                                    <div className="space-y-4 mb-6">
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-slate-900 mb-2">Right to Access</h4>
                                            <p className="text-sm text-slate-600">Request a copy of the personal information we hold about you.</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-slate-900 mb-2">Right to Correction</h4>
                                            <p className="text-sm text-slate-600">Request correction of inaccurate or incomplete information.</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-slate-900 mb-2">Right to Deletion</h4>
                                            <p className="text-sm text-slate-600">Request deletion of your personal information, subject to legal exceptions.</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-slate-900 mb-2">Right to Opt-Out</h4>
                                            <p className="text-sm text-slate-600">Opt out of marketing communications and certain data sharing.</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-slate-900 mb-2">Right to Portability</h4>
                                            <p className="text-sm text-slate-600">Request your data in a portable, machine-readable format.</p>
                                        </div>
                                    </div>

                                    <p className="text-slate-600">
                                        To exercise any of these rights, please contact us at <a href="mailto:privacy@myinsurancebuddies.com" className="text-blue-600 hover:underline">privacy@myinsurancebuddies.com</a> or call <a href="tel:1-855-205-2412" className="text-blue-600 hover:underline">1-855-205-2412</a>. We will respond to your request within 30 days.
                                    </p>
                                </div>
                            </section>

                            {/* CCPA Rights */}
                            <section id="ccpa" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">California Privacy Rights (CCPA)</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 mb-4">
                                        If you are a California resident, the California Consumer Privacy Act (CCPA) provides you with additional rights regarding your personal information:
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Your CCPA Rights</h3>
                                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                                        <li><strong>Right to Know:</strong> Request disclosure of the categories and specific pieces of personal information we've collected about you</li>
                                        <li><strong>Right to Delete:</strong> Request deletion of personal information we've collected from you</li>
                                        <li><strong>Right to Opt-Out:</strong> Opt out of the sale of your personal information (Note: We do not sell personal information)</li>
                                        <li><strong>Right to Non-Discrimination:</strong> You will not receive discriminatory treatment for exercising your privacy rights</li>
                                    </ul>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Categories of Information Collected</h3>
                                    <p className="text-slate-600 mb-4">In the past 12 months, we have collected the following categories of personal information:</p>
                                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                                        <li>Identifiers (name, email, phone, IP address)</li>
                                        <li>Personal information under California Civil Code Section 1798.80</li>
                                        <li>Commercial information (quote requests, service history)</li>
                                        <li>Internet or network activity (browsing history, search history)</li>
                                        <li>Geolocation data</li>
                                        <li>Professional or employment-related information</li>
                                        <li>Inferences drawn from the above categories</li>
                                    </ul>

                                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                                        <p className="text-indigo-800 text-sm">
                                            <strong>Do Not Sell My Personal Information:</strong> MyInsuranceBuddies does not sell your personal information as defined by the CCPA. However, if you wish to exercise your rights or have questions, please contact us.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Children's Privacy */}
                            <section id="children" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                        <UserCheck className="w-5 h-5 text-pink-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">Children's Privacy</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 mb-4">
                                        Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at <a href="mailto:privacy@myinsurancebuddies.com" className="text-blue-600 hover:underline">privacy@myinsurancebuddies.com</a>.
                                    </p>
                                    <p className="text-slate-600">
                                        If we become aware that we have collected personal information from a child under 18 without parental consent, we will take steps to delete that information from our servers immediately.
                                    </p>
                                </div>
                            </section>

                            {/* Policy Updates */}
                            <section id="updates" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-cyan-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">Policy Updates</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 mb-4">
                                        We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. When we make material changes, we will:
                                    </p>
                                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-4">
                                        <li>Update the "Last Updated" date at the top of this policy</li>
                                        <li>Notify you via email (if you have an account with us)</li>
                                        <li>Display a prominent notice on our website</li>
                                    </ul>
                                    <p className="text-slate-600">
                                        We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                                    </p>
                                </div>
                            </section>

                            {/* Contact Us */}
                            <section id="contact" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">Contact Us</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 mb-6">
                                        If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-slate-50 rounded-lg p-6">
                                            <h3 className="font-semibold text-slate-900 mb-4">Privacy Team</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Mail className="w-4 h-4 text-slate-400" />
                                                    <a href="mailto:privacy@myinsurancebuddies.com" className="text-blue-600 hover:underline text-sm">privacy@myinsurancebuddies.com</a>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-4 h-4 text-slate-400" />
                                                    <a href="tel:1-855-205-2412" className="text-blue-600 hover:underline text-sm">1-855-205-2412</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-6">
                                            <h3 className="font-semibold text-slate-900 mb-4">Mailing Address</h3>
                                            <address className="not-italic text-sm text-slate-600">
                                                MyInsuranceBuddies<br />
                                                Attn: Privacy Officer<br />
                                                123 Insurance Way, Suite 400<br />
                                                Austin, TX 78701
                                            </address>
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Questions About Your Privacy?</h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        Our privacy team is here to help. Contact us anytime for questions about how we protect your information.
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Link href="/contact" className="inline-block bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition">
                            Contact Us
                        </Link>
                        <Link href="/terms" className="inline-block bg-blue-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-400 transition">
                            View Terms of Service
                        </Link>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
