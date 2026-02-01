import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Cookie, Shield, Settings, Info, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Cookie Policy | MyInsuranceBuddy',
  description: 'Learn how MyInsuranceBuddy uses cookies and similar technologies to improve your browsing experience and provide personalized insurance quotes.',
  keywords: 'cookie policy, cookies, privacy, tracking, data collection',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function CookiesPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Cookie className="w-4 h-4" />
              Cookie Policy
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              How We Use Cookies
            </h1>
            <p className="text-lg text-slate-300">
              Last updated: January 1, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What Are Cookies?</h2>
            <p className="text-slate-600 mb-6">
              Cookies are small text files that are stored on your device when you visit a website. 
              They help us provide you with a better experience by remembering your preferences, 
              understanding how you use our site, and providing personalized content and advertisements.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">Types of Cookies We Use</h2>
            
            <div className="space-y-6 mb-8">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Essential Cookies</h3>
                </div>
                <p className="text-slate-600 text-sm">
                  These cookies are necessary for the website to function properly. They enable core 
                  functionality like security, network management, and accessibility. You cannot opt 
                  out of these cookies.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Preference Cookies</h3>
                </div>
                <p className="text-slate-600 text-sm">
                  These cookies remember your settings and preferences, such as your location, 
                  language, and insurance preferences. This helps us provide a more personalized experience.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                    <Info className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Analytics Cookies</h3>
                </div>
                <p className="text-slate-600 text-sm">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously. This helps us improve our site and services.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Cookie className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Marketing Cookies</h3>
                </div>
                <p className="text-slate-600 text-sm">
                  These cookies are used to deliver relevant advertisements and track the effectiveness 
                  of our marketing campaigns. They may be set by us or our advertising partners.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">Managing Your Cookie Preferences</h2>
            <p className="text-slate-600 mb-4">
              You can manage your cookie preferences at any time by clicking the button below or 
              through your browser settings. Most web browsers allow you to control cookies through 
              their settings preferences.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-slate-900 mb-3">How to Control Cookies in Your Browser:</h3>
              <ul className="space-y-2 text-slate-600">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Cookies</h2>
            <p className="text-slate-600 mb-4">
              We work with third-party service providers who may also set cookies on your device. 
              These include:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6">
              <li>Google Analytics (usage analytics)</li>
              <li>Facebook Pixel (advertising)</li>
              <li>Google Ads (advertising)</li>
              <li>Hotjar (user experience analysis)</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
            <p className="text-slate-600 mb-6">
              We may update this Cookie Policy from time to time to reflect changes in technology, 
              legislation, or our data practices. Please check back periodically for any updates.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-600 mb-6">
              If you have any questions about our use of cookies, please contact us at{' '}
              <a href="mailto:privacy@myinsurancebuddies.com" className="text-blue-600 hover:underline">
                privacy@myinsurancebuddies.com
              </a>.
            </p>

            <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-200">
              <Link 
                href="/privacy" 
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
              >
                Privacy Policy
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/terms" 
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
              >
                Terms of Service
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer insuranceTypes={insuranceTypes} />
    </div>
  );
}
