import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  FileText, Shield, AlertTriangle, CheckCircle, ArrowRight,
  Scale, Lock, Globe
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Terms of Service | MyInsuranceBuddy',
  description: 'Read our Terms of Service to understand the rules and regulations for using MyInsuranceBuddy insurance comparison services.',
  keywords: 'terms of service, terms and conditions, user agreement, insurance terms',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function TermsPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-16 sm:py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              Last Updated: January 2025
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
              Please read these terms carefully before using our services. 
              By using MyInsuranceBuddy, you agree to these terms.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-10">
              
              <div className="prose prose-slate max-w-none">
                {/* Agreement Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 mb-6 sm:mb-8">
                  <p className="text-blue-800 text-sm sm:text-base leading-relaxed m-0">
                    By accessing or using MyInsuranceBuddy's website and services, you agree to be bound by these 
                    Terms of Service and all applicable laws and regulations. If you do not agree with any of these 
                    terms, you are prohibited from using or accessing this site.
                  </p>
                </div>

                {/* Section 1 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">1</span>
                  Acceptance of Terms
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">
                  These Terms of Service ("Terms") constitute a legally binding agreement between you and 
                  MyInsuranceBuddy ("we," "us," or "our") regarding your use of our website, mobile applications, 
                  and services (collectively, the "Services"). By using our Services, you represent that you are 
                  at least 18 years old and have the legal capacity to enter into these Terms.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately 
                  upon posting to the website. Your continued use of the Services after any changes indicates 
                  your acceptance of the modified Terms.
                </p>

                {/* Section 2 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">2</span>
                  Description of Services
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">
                  MyInsuranceBuddy operates an online insurance marketplace that connects consumers with licensed 
                  insurance agents and providers. Our Services include:
                </p>
                <ul className="space-y-2 text-slate-600 text-sm sm:text-base mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Insurance comparison tools and resources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Connection with licensed insurance agents and carriers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Educational content about insurance products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Quote request facilitation</span>
                  </li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-900 text-sm sm:text-base mb-1">Important Disclaimer</h4>
                      <p className="text-amber-800 text-xs sm:text-sm m-0">
                        MyInsuranceBuddy is not an insurance company. We do not sell insurance policies or provide 
                        insurance advice. We are a marketing platform that connects consumers with licensed insurance 
                        professionals. All insurance decisions should be made in consultation with licensed agents.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 3 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">3</span>
                  User Accounts and Responsibilities
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">
                  When you create an account or submit information through our Services, you agree to:
                </p>
                <ul className="space-y-2 text-slate-600 text-sm sm:text-base mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Provide accurate, current, and complete information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Maintain the security of your account credentials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Promptly update your information if it changes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Accept responsibility for all activities under your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Notify us immediately of any unauthorized access</span>
                  </li>
                </ul>

                {/* Section 4 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">4</span>
                  Prohibited Activities
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">
                  You agree not to engage in any of the following prohibited activities:
                </p>
                <ul className="space-y-2 text-slate-600 text-sm sm:text-base mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Using the Services for any illegal purpose</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Submitting false or misleading information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Attempting to access other users' accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Interfering with the security features of the Services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Using automated systems to access the Services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Transmitting viruses, malware, or other harmful code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Scraping, data mining, or harvesting information</span>
                  </li>
                </ul>

                {/* Section 5 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">5</span>
                  Intellectual Property
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">
                  All content on MyInsuranceBuddy, including text, graphics, logos, images, software, and other 
                  materials, is the property of MyInsuranceBuddy or its licensors and is protected by copyright, 
                  trademark, and other intellectual property laws.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">
                  You may access and use the content for personal, non-commercial purposes only. You may not 
                  reproduce, distribute, modify, create derivative works from, or exploit the content without 
                  our prior written consent.
                </p>

                {/* Section 6 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">6</span>
                  Disclaimer of Warranties
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">
                  THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER 
                  EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING 
                  BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND 
                  NON-INFRINGEMENT.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">
                  We do not warrant that the Services will be uninterrupted, timely, secure, or error-free, or 
                  that any information provided is accurate, reliable, or complete. Insurance quotes and information 
                  provided are for educational purposes only and actual rates may vary.
                </p>

                {/* Section 7 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">7</span>
                  Limitation of Liability
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">
                  TO THE FULLEST EXTENT PERMITTED BY LAW, MyInsuranceBuddy SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE 
                  OF THE SERVICES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, 
                  OR OTHER INTANGIBLE LOSSES.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">
                  Our total liability to you for any claim arising from or relating to these Terms or the Services 
                  shall not exceed the amount you paid us, if any, during the twelve (12) months prior to the 
                  claim arising.
                </p>

                {/* Section 8 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">8</span>
                  Indemnification
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">
                  You agree to indemnify, defend, and hold harmless MyInsuranceBuddy, its officers, directors, 
                  employees, agents, licensors, and suppliers from and against all claims, losses, expenses, 
                  damages, and costs, including reasonable attorneys' fees, arising out of or relating to your 
                  violation of these Terms or your use of the Services.
                </p>

                {/* Section 9 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">9</span>
                  Governing Law and Dispute Resolution
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">
                  These Terms shall be governed by and construed in accordance with the laws of the State of 
                  Texas, without regard to its conflict of law principles. Any dispute arising from or relating 
                  to these Terms shall be resolved exclusively through binding arbitration in Austin, Texas, 
                  in accordance with the rules of the American Arbitration Association.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">
                  BY AGREEING TO THESE TERMS, YOU WAIVE ANY RIGHT TO PARTICIPATE IN CLASS ACTION LAWSUITS OR 
                  CLASS-WIDE ARBITRATION AGAINST MyInsuranceBuddy.
                </p>

                {/* Section 10 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">10</span>
                  Contact Information
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">
                  If you have any questions about these Terms, please contact us:
                </p>
                <div className="bg-slate-50 rounded-xl p-4 sm:p-5 mb-6">
                  <p className="text-slate-700 text-sm sm:text-base m-0">
                    <strong>MyInsuranceBuddy</strong><br />
                    123 Insurance Way, Suite 400<br />
                    Austin, TX 78701<br /><br />
                    Email: <a href="mailto:legal@myinsurancebuddies.com" className="text-blue-600 hover:underline">legal@myinsurancebuddies.com</a><br />
                    Phone: <a href="tel:1-855-205-2412" className="text-blue-600 hover:underline">1-855-205-2412</a>
                  </p>
                </div>

                {/* Last Updated */}
                <div className="border-t border-slate-200 pt-6 mt-8">
                  <p className="text-slate-500 text-xs sm:text-sm text-center">
                    These Terms of Service were last updated on January 1, 2025. 
                    By continuing to use our Services, you accept these Terms.
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
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto text-sm sm:text-base">
            Compare insurance quotes from top-rated providers and find the coverage you need.
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
