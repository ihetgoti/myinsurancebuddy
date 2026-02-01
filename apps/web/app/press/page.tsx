import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Newspaper, Calendar, ArrowRight, Download, Mail, 
  TrendingUp, Users, Award, Globe, Phone
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Press & Media | MyInsuranceBuddy Newsroom',
  description: 'Latest news, press releases, and media resources for MyInsuranceBuddy. Learn about our company milestones, executive team, and media contact information.',
  keywords: 'MyInsuranceBuddy press, insurance news, company news, media kit, press releases',
  openGraph: {
    title: 'MyInsuranceBuddy Newsroom - Press & Media',
    description: 'Latest news and media resources for journalists and publications.',
  },
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ 
      where: { isActive: true }, 
      orderBy: { sortOrder: 'asc' } 
    }),
    prisma.state.findMany({ 
      where: { isActive: true }, 
      include: { country: true }, 
      take: 12 
    }),
  ]);
  return { insuranceTypes, states };
}

const pressReleases = [
  {
    date: 'January 15, 2025',
    title: 'MyInsuranceBuddy Surpasses 8 Million Customers, Saves Users Over $2 Billion',
    excerpt: 'Company celebrates milestone achievement and announces expansion of comparison tools to include pet and umbrella insurance options.',
    category: 'Company News',
  },
  {
    date: 'December 3, 2024',
    title: 'MyInsuranceBuddy Launches AI-Powered Quote Comparison Engine',
    excerpt: 'New machine learning technology delivers personalized insurance recommendations in under 60 seconds.',
    category: 'Product Update',
  },
  {
    date: 'October 22, 2024',
    title: 'MyInsuranceBuddy Partners with 15 New Regional Insurance Providers',
    excerpt: 'Partnership expansion brings more options and better rates to customers in underserved markets.',
    category: 'Partnership',
  },
  {
    date: 'September 10, 2024',
    title: 'MyInsuranceBuddy Named to Inc. 5000 Fastest-Growing Companies',
    excerpt: 'Insurance comparison platform ranks #234 on prestigious list with 1,847% three-year growth.',
    category: 'Awards',
  },
  {
    date: 'August 5, 2024',
    title: 'MyInsuranceBuddy Releases 2024 Insurance Affordability Report',
    excerpt: 'Comprehensive study reveals trends in auto and home insurance pricing across all 50 states.',
    category: 'Research',
  },
];

const mediaMentions = [
  { publication: 'Forbes', title: 'How MyInsuranceBuddy is Disrupting the Insurance Industry', date: 'Nov 2024' },
  { publication: 'TechCrunch', title: 'InsurTech Startup MyInsuranceBuddy Raises Series B', date: 'Oct 2024' },
  { publication: 'The Wall Street Journal', title: 'Shopping for Insurance? Try These Comparison Sites', date: 'Sep 2024' },
  { publication: 'CNBC', title: 'Ways to Save on Auto Insurance in 2024', date: 'Aug 2024' },
  { publication: 'NerdWallet', title: 'Best Insurance Comparison Sites of 2024', date: 'Jul 2024' },
];

const companyFacts = [
  { label: 'Founded', value: '2012' },
  { label: 'Headquarters', value: 'Austin, Texas' },
  { label: 'Employees', value: '150+' },
  { label: 'Coverage', value: 'All 50 States' },
  { label: 'Insurance Partners', value: '120+' },
  { label: 'Customers Served', value: '8 Million+' },
];

export default async function PressPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Newspaper className="w-3 h-3 sm:w-4 sm:h-4" />
              Newsroom
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
              MyInsuranceBuddy Newsroom
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
              Latest news, press releases, and media resources. 
              For press inquiries, contact us at{' '}
              <a href="mailto:press@myinsurancebuddies.com" className="text-blue-400 hover:underline">
                press@myinsurancebuddies.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-8 sm:py-12 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {companyFacts.map((fact) => (
              <div key={fact.label} className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{fact.value}</div>
                <div className="text-xs sm:text-sm text-slate-600">{fact.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Press Releases</h2>
              <div className="space-y-6">
                {pressReleases.map((release) => (
                  <article key={release.title} className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition group">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {release.category}
                      </span>
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {release.date}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-blue-600 transition">
                      {release.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3">{release.excerpt}</p>
                    <button className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:text-blue-700 transition">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </article>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition">
                  View All Press Releases
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Media Mentions */}
              <div className="bg-slate-50 rounded-xl p-5 sm:p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Media Mentions
                </h3>
                <div className="space-y-4">
                  {mediaMentions.map((mention) => (
                    <div key={mention.title} className="border-b border-slate-200 last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-blue-600">{mention.publication}</span>
                        <span className="text-xs text-slate-500">{mention.date}</span>
                      </div>
                      <p className="text-sm text-slate-700 hover:text-blue-600 transition cursor-pointer">
                        {mention.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media Kit */}
              <div className="bg-blue-50 rounded-xl p-5 sm:p-6">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Media Kit
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Download logos, executive bios, fact sheets, and brand guidelines.
                </p>
                <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition text-sm">
                  Download Media Kit
                </button>
              </div>

              {/* Contact */}
              <div className="bg-slate-50 rounded-xl p-5 sm:p-6">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Press Contact
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  For media inquiries, interview requests, or speaking opportunities:
                </p>
                <a 
                  href="mailto:press@myinsurancebuddies.com"
                  className="text-blue-600 font-semibold hover:underline text-sm"
                >
                  press@myinsurancebuddies.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Team */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Executive Leadership</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Available for interviews and speaking engagements</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Michael Thompson', role: 'Chief Executive Officer', bio: 'Former VP at Progressive Insurance. 20+ years in insurance and tech.' },
              { name: 'Sarah Chen', role: 'Chief Technology Officer', bio: 'Former engineering lead at Google. Expert in machine learning and scaling.' },
              { name: 'David Rodriguez', role: 'Chief Operating Officer', bio: 'Former McKinsey consultant. Operations expert with focus on customer experience.' },
              { name: 'Jennifer Walsh', role: 'Chief Marketing Officer', bio: 'Former CMO at NerdWallet. Digital marketing and brand building expert.' },
            ].map((exec) => (
              <div key={exec.name} className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-slate-400">
                    {exec.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900">{exec.name}</h3>
                <p className="text-blue-600 text-sm font-medium mb-2">{exec.role}</p>
                <p className="text-slate-600 text-xs">{exec.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Brand Assets</h2>
              <p className="text-slate-600">Official logos and usage guidelines</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-center h-24">
                  <div className="text-xl font-bold text-slate-900">
                    MyInsurance<span className="text-blue-600">Buddy</span>
                  </div>
                </div>
                <h4 className="font-semibold text-slate-900 text-sm mb-1">Logo (Full Color)</h4>
                <p className="text-xs text-slate-500 mb-3">PNG, SVG, EPS</p>
                <button className="text-blue-600 text-sm font-semibold hover:underline">Download</button>
              </div>
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <div className="bg-slate-800 rounded-lg p-4 mb-4 flex items-center justify-center h-24">
                  <div className="text-xl font-bold text-white">
                    MyInsurance<span className="text-blue-400">Buddy</span>
                  </div>
                </div>
                <h4 className="font-semibold text-white text-sm mb-1">Logo (Dark)</h4>
                <p className="text-xs text-slate-400 mb-3">PNG, SVG, EPS</p>
                <button className="text-blue-400 text-sm font-semibold hover:underline">Download</button>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="bg-blue-600 rounded-lg p-4 mb-4 flex items-center justify-center h-24">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <span className="font-bold text-blue-600">M</span>
                  </div>
                </div>
                <h4 className="font-semibold text-slate-900 text-sm mb-1">Icon</h4>
                <p className="text-xs text-slate-500 mb-3">PNG, SVG, EPS</p>
                <button className="text-blue-600 text-sm font-semibold hover:underline">Download</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Press Inquiries</h2>
          <p className="text-blue-100 mb-6 sm:mb-8 max-w-xl mx-auto">
            Need more information? Our communications team is ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="mailto:press@myinsurancebuddies.com" 
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
            >
              <Mail className="w-4 h-4" />
              Email Press Team
            </a>
            <a 
              href="tel:1-855-205-2412" 
              className="inline-flex items-center justify-center gap-2 bg-blue-500/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-500/40 transition"
            >
              <Phone className="w-4 h-4" />
              1-855-205-2412
            </a>
          </div>
        </div>
      </section>

      <Footer insuranceTypes={insuranceTypes} />
    </div>
  );
}
