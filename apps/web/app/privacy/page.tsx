import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Shield, Lock, Eye, Users, FileText, ArrowRight,
  CheckCircle, AlertCircle
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Privacy Policy | MyInsuranceBuddy - Your Data Security Matters',
  description: 'Learn how MyInsuranceBuddy protects your personal information. We use industry-standard encryption and never sell your data without consent.',
  keywords: 'privacy policy, data protection, insurance privacy, personal information security',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function PrivacyPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-16 sm:py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              Last Updated: January 2025
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
              Your privacy and data security are our top priorities. 
              Learn how we collect, use, and protect your information.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 sm:py-10 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {[
              { icon: Lock, title: '256-bit SSL', desc: 'Bank-level encryption' },
              { icon: Eye, title: 'No Selling', desc: 'We never sell your data' },
              { icon: CheckCircle, title: 'CCPA Compliant', desc: 'California privacy rights' },
              { icon: Users, title: 'Opt-Out Anytime', desc: 'Easy unsubscribe' },
            ].map((badge) => (
              <div key={badge.title} className="text-center p-3 sm:p-4">
                <div className="flex justify-center mb-2">
                  <badge.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <div className="font-bold text-slate-900 text-sm sm:text-base mb-1">{badge.title}</div>
                <div className="text-xs sm:text-sm text-slate-600">{badge.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-10">
              
              {/* Introduction */}
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6 sm:mb-8">
                  At MyInsuranceBuddy, we take your privacy seriously. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you visit our website or use our services. 
                  Please read this policy carefully. By accessing or using our services, you agree to the practices 
                  described in this Privacy Policy.
                </p>

                {/* Section 1 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">1</span>
                  Information We Collect
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">
                  We collect several types of information from and about users of our website, including:
                </p>
                <ul className="space-y-2 text-slate-600 text-sm sm:text-base mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Personal Information:</strong> Name, email address, phone number, mailing address, date of birth, and ZIP code.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Insurance Information:</strong> Vehicle details, property information, current insurance coverage, and claims history.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Usage Data:</strong> IP address, browser type, pages visited, time spent on pages, and referring website.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Device Information:</strong> Device type, operating system, and mobile network information.</span>
                  </li>
                </ul>

                {/* Section 2 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">2</span>
                  How We Use Your Information
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="space-y-2 text-slate-600 text-sm sm:text-base mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Providing and improving our insurance comparison services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Connecting you with licensed insurance agents and providers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Processing quote requests and facilitating policy purchases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Sending you relevant insurance information and offers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Responding to your inquiries and providing customer support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Analyzing website usage to improve user experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Complying with legal obligations and preventing fraud</span>
                  </li>
                </ul>

                {/* Section 3 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">3</span>
                  Information Sharing and Disclosure
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">
                  We may share your information with:
                </p>
                <ul className="space-y-2 text-slate-600 text-sm sm:text-base mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Insurance Partners:</strong> Licensed insurance companies, agents, and brokers who can provide quotes and coverage.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Service Providers:</strong> Third-party vendors who help us operate our website and provide services.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Legal Requirements:</strong> When required by law, court order, or government regulation.</span>
                  </li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-900 text-sm sm:text-base mb-1">Important Note</h4>
                      <p className="text-amber-800 text-xs sm:text-sm">
                        We do not sell your personal information to third parties for their marketing purposes 
                        without your explicit consent. Any sharing is done solely to help you find insurance coverage.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 4 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">4</span>
                  Data Security
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="space-y-2 text-slate-600 text-sm sm:text-base mb-6">
                  <li className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                    <span>256-bit SSL encryption for all data transmission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                    <span>Secure data storage with access controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                    <span>Regular security audits and vulnerability assessments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                    <span>Employee training on data protection practices</span>
                  </li>
                </ul>

                {/* Section 5 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">5</span>
                  Your Privacy Rights
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">
                  Depending on your location, you may have the following rights:
                </p>
                <ul className="space-y-2 text-slate-600 text-sm sm:text-base mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Access:</strong> Request a copy of your personal information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Correction:</strong> Update or correct inaccurate information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Deletion:</strong> Request deletion of your personal information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Opt-Out:</strong> Unsubscribe from marketing communications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Portability:</strong> Receive your data in a portable format</span>
                  </li>
                </ul>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">
                  To exercise these rights, please contact us at{' '}
                  <a href="mailto:privacy@myinsurancebuddies.com" className="text-blue-600 hover:underline">
                    privacy@myinsurancebuddies.com
                  </a>.
                </p>

                {/* Section 6 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">6</span>
                  Cookies and Tracking
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">
                  We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, 
                  and personalize content. You can control cookies through your browser settings. Note that disabling 
                  certain cookies may affect website functionality.
                </p>

                {/* Section 7 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">7</span>
                  Contact Us
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-slate-50 rounded-xl p-4 sm:p-5 mb-6">
                  <p className="text-slate-700 text-sm sm:text-base">
                    <strong>MyInsuranceBuddy</strong><br />
                    Attn: Privacy Department<br />
                    123 Insurance Way, Suite 400<br />
                    Austin, TX 78701<br /><br />
                    Email: <a href="mailto:privacy@myinsurancebuddies.com" className="text-blue-600 hover:underline">privacy@myinsurancebuddies.com</a><br />
                    Phone: <a href="tel:1-855-205-2412" className="text-blue-600 hover:underline">1-855-205-2412</a>
                  </p>
                </div>

                {/* Last Updated */}
                <div className="border-t border-slate-200 pt-6 mt-8">
                  <p className="text-slate-500 text-xs sm:text-sm text-center">
                    This Privacy Policy was last updated on January 1, 2025. We may update this policy from time to time, 
                    so please review it periodically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Your Privacy is Our Priority</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto text-sm sm:text-base">
            Compare insurance quotes with confidence, knowing your information is secure.
          </p>
          <Link 
            href="/get-quote" 
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-bold hover:bg-blue-50 transition text-sm sm:text-base"
          >
            Get Free Quotes
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer insuranceTypes={insuranceTypes} />
    </div>
  );
}
