import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { FileText, Scale, Shield, AlertTriangle, Users, Ban, Gavel, Mail, Phone, Clock, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
    ]);
    return { insuranceTypes, states };
}

export const metadata = {
    title: 'Terms of Service | MyInsuranceBuddies',
    description: 'Read the terms and conditions governing your use of MyInsuranceBuddies insurance comparison and quote services.',
};

const sections = [
    { id: 'agreement', title: 'Agreement to Terms' },
    { id: 'services', title: 'Description of Services' },
    { id: 'eligibility', title: 'Eligibility' },
    { id: 'account', title: 'User Accounts' },
    { id: 'conduct', title: 'User Conduct' },
    { id: 'quotes', title: 'Insurance Quotes' },
    { id: 'intellectual-property', title: 'Intellectual Property' },
    { id: 'disclaimers', title: 'Disclaimers' },
    { id: 'liability', title: 'Limitation of Liability' },
    { id: 'indemnification', title: 'Indemnification' },
    { id: 'termination', title: 'Termination' },
    { id: 'governing-law', title: 'Governing Law' },
    { id: 'changes', title: 'Changes to Terms' },
    { id: 'contact', title: 'Contact Information' },
];

export default async function TermsPage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-slate-50">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-2xl mb-6">
                        <Scale className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Terms of Service</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-4">
                        Please read these terms carefully before using our services.
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

                            {/* Agreement to Terms */}
                            <section id="agreement" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">1. Agreement to Terms</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and MyInsuranceBuddies, LLC ("Company," "we," "us," or "our") governing your access to and use of the MyInsuranceBuddies website (myinsurancebuddies.com), mobile applications, and related services (collectively, the "Services").
                                    </p>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use our Services.
                                    </p>
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <p className="text-blue-800 text-sm">
                                                <strong>Important:</strong> These Terms include an arbitration agreement and class action waiver that affect your legal rights. Please read Section 12 (Governing Law and Dispute Resolution) carefully.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Description of Services */}
                            <section id="services" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">2. Description of Services</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 mb-4">
                                        MyInsuranceBuddies is a licensed insurance agency providing insurance comparison and quote services. Our Services include:
                                    </p>
                                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                                        <li><strong>Insurance Quote Comparison:</strong> We collect your information and provide quotes from multiple insurance carriers</li>
                                        <li><strong>Educational Content:</strong> Guides, articles, and tools to help you understand insurance options</li>
                                        <li><strong>Policy Assistance:</strong> Help connecting you with insurance carriers to purchase policies</li>
                                        <li><strong>Customer Support:</strong> Assistance with questions about insurance and our services</li>
                                    </ul>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">What We Are Not</h3>
                                    <p className="text-slate-600 mb-4">
                                        MyInsuranceBuddies is <strong>not</strong> an insurance company. We do not underwrite insurance policies or make coverage decisions. We act as an intermediary connecting you with insurance carriers and agents. All insurance policies are issued by the respective insurance companies.
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Service Availability</h3>
                                    <p className="text-slate-600">
                                        Our Services are available to residents of all 50 United States. Service availability, insurance carriers, and coverage options may vary by state. We reserve the right to modify, suspend, or discontinue any aspect of our Services at any time without prior notice.
                                    </p>
                                </div>
                            </section>

                            {/* Eligibility */}
                            <section id="eligibility" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">3. Eligibility</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 mb-4">To use our Services, you must:</p>
                                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                                        <li>Be at least 18 years of age</li>
                                        <li>Be a legal resident of the United States</li>
                                        <li>Have the legal capacity to enter into binding contracts</li>
                                        <li>Not be barred from using our Services under applicable law</li>
                                    </ul>
                                    <p className="text-slate-600">
                                        By using our Services, you represent and warrant that you meet all eligibility requirements. If you are using our Services on behalf of an organization, you represent that you have authority to bind that organization to these Terms.
                                    </p>
                                </div>
                            </section>

                            {/* User Accounts */}
                            <section id="account" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">4. User Accounts</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Account Creation</h3>
                                    <p className="text-slate-600 mb-4">
                                        Some features of our Services may require you to create an account. When creating an account, you agree to:
                                    </p>
                                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                                        <li>Provide accurate, current, and complete information</li>
                                        <li>Maintain and promptly update your account information</li>
                                        <li>Keep your password secure and confidential</li>
                                        <li>Notify us immediately of any unauthorized access</li>
                                    </ul>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Account Security</h3>
                                    <p className="text-slate-600 mb-4">
                                        You are responsible for all activities that occur under your account. We recommend using a strong, unique password and enabling two-factor authentication when available. You agree to notify us immediately if you believe your account has been compromised.
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Account Termination</h3>
                                    <p className="text-slate-600">
                                        You may terminate your account at any time by contacting us. We reserve the right to suspend or terminate your account if we reasonably believe you have violated these Terms or engaged in fraudulent or illegal activity.
                                    </p>
                                </div>
                            </section>

                            {/* User Conduct */}
                            <section id="conduct" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                        <Ban className="w-5 h-5 text-red-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">5. User Conduct</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 mb-4">When using our Services, you agree NOT to:</p>

                                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                                        <div className="bg-red-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-slate-900 mb-2">Prohibited Actions</h4>
                                            <ul className="text-sm text-slate-600 space-y-1">
                                                <li>Provide false or misleading information</li>
                                                <li>Use the Services for fraudulent purposes</li>
                                                <li>Attempt to obtain quotes for others without authorization</li>
                                                <li>Violate any applicable laws or regulations</li>
                                            </ul>
                                        </div>
                                        <div className="bg-red-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-slate-900 mb-2">Technical Restrictions</h4>
                                            <ul className="text-sm text-slate-600 space-y-1">
                                                <li>Attempt to gain unauthorized access to our systems</li>
                                                <li>Use automated tools to scrape or collect data</li>
                                                <li>Interfere with the proper functioning of our Services</li>
                                                <li>Transmit viruses or malicious code</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                                            <p className="text-amber-800 text-sm">
                                                <strong>Warning:</strong> Providing false information to obtain insurance quotes is a form of insurance fraud and may result in criminal prosecution, civil liability, and denial of insurance coverage.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Insurance Quotes */}
                            <section id="quotes" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">6. Insurance Quotes</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Quote Accuracy</h3>
                                    <p className="text-slate-600 mb-4">
                                        Insurance quotes provided through our Services are estimates based on the information you provide. Actual premiums may vary based on:
                                    </p>
                                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                                        <li>Verification of information by the insurance carrier</li>
                                        <li>Underwriting criteria specific to each carrier</li>
                                        <li>Additional information obtained during the application process</li>
                                        <li>Changes in rates or coverage availability</li>
                                    </ul>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Not a Guarantee of Coverage</h3>
                                    <p className="text-slate-600 mb-4">
                                        A quote is not a guarantee of coverage or an insurance policy. Coverage is subject to the insurance carrier's underwriting approval and the terms of the policy. We make no representations or warranties regarding the availability of coverage.
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Third-Party Relationships</h3>
                                    <p className="text-slate-600">
                                        We work with multiple insurance carriers and may receive compensation when you purchase a policy through our Services. This compensation does not affect the quotes you receive or our recommendations. We are committed to providing objective comparisons.
                                    </p>
                                </div>
                            </section>

                            {/* Intellectual Property */}
                            <section id="intellectual-property" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">7. Intellectual Property</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Our Content</h3>
                                    <p className="text-slate-600 mb-4">
                                        All content on our Services, including text, graphics, logos, images, software, and other materials ("Content"), is owned by MyInsuranceBuddies or our licensors and is protected by copyright, trademark, and other intellectual property laws.
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Limited License</h3>
                                    <p className="text-slate-600 mb-4">
                                        We grant you a limited, non-exclusive, non-transferable license to access and use our Services for personal, non-commercial purposes. You may not:
                                    </p>
                                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                                        <li>Copy, modify, or distribute our Content without permission</li>
                                        <li>Use our trademarks or logos without written authorization</li>
                                        <li>Create derivative works based on our Content</li>
                                        <li>Use our Content for commercial purposes</li>
                                    </ul>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Trademarks</h3>
                                    <p className="text-slate-600">
                                        "MyInsuranceBuddies," our logo, and other marks are trademarks of MyInsuranceBuddies, LLC. All other trademarks appearing on our Services are the property of their respective owners.
                                    </p>
                                </div>
                            </section>

                            {/* Disclaimers */}
                            <section id="disclaimers" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">8. Disclaimers</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <div className="bg-slate-100 rounded-lg p-6 mb-6">
                                        <p className="text-slate-700 font-medium uppercase text-sm mb-4">Important Legal Disclaimers</p>
                                        <p className="text-slate-600 mb-4">
                                            OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                                        </p>
                                        <p className="text-slate-600">
                                            WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE. WE DO NOT WARRANT THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY INFORMATION PROVIDED THROUGH OUR SERVICES.
                                        </p>
                                    </div>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Not Professional Advice</h3>
                                    <p className="text-slate-600 mb-4">
                                        The information provided through our Services is for general informational purposes only and should not be construed as professional insurance, legal, financial, or tax advice. You should consult with qualified professionals before making insurance decisions.
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Third-Party Content</h3>
                                    <p className="text-slate-600">
                                        Our Services may contain links to third-party websites or content. We do not endorse or assume responsibility for any third-party content. Your use of third-party websites is at your own risk and subject to their terms of service.
                                    </p>
                                </div>
                            </section>

                            {/* Limitation of Liability */}
                            <section id="liability" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                        <Gavel className="w-5 h-5 text-red-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">9. Limitation of Liability</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <div className="bg-slate-100 rounded-lg p-6 mb-6">
                                        <p className="text-slate-600 mb-4">
                                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, MYINSURANCEBUDDIES AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                                        </p>
                                        <ul className="list-disc pl-6 text-slate-600 space-y-1">
                                            <li>Loss of profits, revenue, or data</li>
                                            <li>Business interruption</li>
                                            <li>Personal injury or property damage</li>
                                            <li>Costs of substitute services</li>
                                            <li>Any other intangible losses</li>
                                        </ul>
                                    </div>

                                    <p className="text-slate-600 mb-4">
                                        IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THESE TERMS OR YOUR USE OF OUR SERVICES EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100).
                                    </p>

                                    <p className="text-slate-600">
                                        Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability for certain damages. If these laws apply to you, some or all of the above exclusions or limitations may not apply.
                                    </p>
                                </div>
                            </section>

                            {/* Indemnification */}
                            <section id="indemnification" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-cyan-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">10. Indemnification</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 mb-4">
                                        You agree to indemnify, defend, and hold harmless MyInsuranceBuddies and its officers, directors, employees, agents, licensors, and service providers from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to:
                                    </p>
                                    <ul className="list-disc pl-6 text-slate-600 space-y-2">
                                        <li>Your use of our Services</li>
                                        <li>Your violation of these Terms</li>
                                        <li>Your violation of any rights of another party</li>
                                        <li>Any content you submit through our Services</li>
                                        <li>Your negligence or willful misconduct</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Termination */}
                            <section id="termination" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <Ban className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">11. Termination</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 mb-4">
                                        We may terminate or suspend your access to our Services at any time, with or without cause or notice, including for:
                                    </p>
                                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                                        <li>Violation of these Terms</li>
                                        <li>Fraudulent or illegal activity</li>
                                        <li>Conduct that harms other users or our business</li>
                                        <li>Extended periods of inactivity</li>
                                    </ul>
                                    <p className="text-slate-600">
                                        Upon termination, your right to use our Services will immediately cease. Sections of these Terms that by their nature should survive termination shall survive, including but not limited to intellectual property, disclaimers, limitation of liability, and indemnification.
                                    </p>
                                </div>
                            </section>

                            {/* Governing Law */}
                            <section id="governing-law" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Scale className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">12. Governing Law & Dispute Resolution</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Governing Law</h3>
                                    <p className="text-slate-600 mb-4">
                                        These Terms shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of law provisions.
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Arbitration Agreement</h3>
                                    <p className="text-slate-600 mb-4">
                                        Any dispute arising out of or relating to these Terms or our Services shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) in accordance with its Consumer Arbitration Rules. The arbitration shall take place in Austin, Texas, unless otherwise agreed.
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Class Action Waiver</h3>
                                    <p className="text-slate-600 mb-4">
                                        You agree to resolve any disputes on an individual basis and waive any right to participate in a class action, class-wide arbitration, or representative action.
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Exceptions</h3>
                                    <p className="text-slate-600">
                                        Notwithstanding the above, either party may seek injunctive relief in any court of competent jurisdiction to protect intellectual property rights or prevent imminent harm.
                                    </p>
                                </div>
                            </section>

                            {/* Changes to Terms */}
                            <section id="changes" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">13. Changes to Terms</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 mb-4">
                                        We reserve the right to modify these Terms at any time. When we make material changes, we will:
                                    </p>
                                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                                        <li>Update the "Last Updated" date at the top of these Terms</li>
                                        <li>Notify you via email (if you have an account) or prominent notice on our website</li>
                                        <li>Provide at least 30 days' notice before material changes take effect</li>
                                    </ul>
                                    <p className="text-slate-600">
                                        Your continued use of our Services after the effective date of any changes constitutes your acceptance of the revised Terms. If you do not agree to the new Terms, you must stop using our Services.
                                    </p>
                                </div>
                            </section>

                            {/* Contact Information */}
                            <section id="contact" className="bg-white rounded-xl border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">14. Contact Information</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 mb-6">
                                        If you have any questions about these Terms of Service, please contact us:
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-slate-50 rounded-lg p-6">
                                            <h3 className="font-semibold text-slate-900 mb-4">Legal Department</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Mail className="w-4 h-4 text-slate-400" />
                                                    <a href="mailto:legal@myinsurancebuddies.com" className="text-blue-600 hover:underline text-sm">legal@myinsurancebuddies.com</a>
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
                                                MyInsuranceBuddies, LLC<br />
                                                Attn: Legal Department<br />
                                                123 Insurance Way, Suite 400<br />
                                                Austin, TX 78701
                                            </address>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Miscellaneous */}
                            <section className="bg-white rounded-xl border border-slate-200 p-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">15. Miscellaneous</h2>
                                <div className="prose prose-slate max-w-none">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Entire Agreement</h3>
                                            <p className="text-sm text-slate-600">
                                                These Terms, together with our Privacy Policy, constitute the entire agreement between you and MyInsuranceBuddies regarding your use of our Services.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Severability</h3>
                                            <p className="text-sm text-slate-600">
                                                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Waiver</h3>
                                            <p className="text-sm text-slate-600">
                                                Our failure to enforce any provision of these Terms shall not constitute a waiver of that provision or any other provision.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Assignment</h3>
                                            <p className="text-sm text-slate-600">
                                                You may not assign or transfer these Terms without our prior written consent. We may assign our rights and obligations freely.
                                            </p>
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
                    <h2 className="text-2xl font-bold text-white mb-4">Questions About Our Terms?</h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        Our team is here to help clarify any questions you may have about these Terms of Service.
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Link href="/contact" className="inline-block bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition">
                            Contact Us
                        </Link>
                        <Link href="/privacy" className="inline-block bg-blue-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-400 transition">
                            View Privacy Policy
                        </Link>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
