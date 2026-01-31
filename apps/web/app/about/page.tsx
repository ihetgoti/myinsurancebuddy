import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Shield, Award, Users, Clock, CheckCircle, Star, 
  TrendingUp, Heart, MapPin, Phone, ArrowRight,
  Target, Lightbulb, Lock
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About Us | MyInsuranceBuddy - Trusted Insurance Comparison Platform',
  description: 'Learn about MyInsuranceBuddy, your trusted partner in finding the best insurance coverage. 12+ years experience, 50 states licensed, 8M+ customers served.',
  keywords: 'about MyInsuranceBuddy, insurance comparison company, licensed insurance agents, insurance experts, company history',
  openGraph: {
    title: 'About MyInsuranceBuddy - Your Trusted Insurance Guide',
    description: 'Discover how we help millions find the perfect insurance coverage at the best rates.',
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

const teamMembers = [
  {
    name: 'Sarah Mitchell',
    role: 'Senior Managing Editor',
    bio: 'Sarah leads our editorial department with over 15 years of experience in insurance journalism. Her work has been featured in Forbes, Bloomberg, and The Wall Street Journal.',
    initials: 'SM',
    color: 'bg-blue-100 text-blue-700',
    expertise: ['Auto Insurance', 'Editorial Standards'],
  },
  {
    name: 'Michael Chen',
    role: 'Senior Editor',
    bio: 'Michael brings 10+ years of experience in personal finance writing. He specializes in making complex insurance topics accessible to everyday consumers.',
    initials: 'MC',
    color: 'bg-emerald-100 text-emerald-700',
    expertise: ['Home Insurance', 'Financial Planning'],
  },
  {
    name: 'Jessica Rodriguez',
    role: 'Insurance Analyst',
    bio: 'Jessica is a licensed insurance agent with expertise in auto and home insurance. She ensures all our rate data and comparisons are accurate.',
    initials: 'JR',
    color: 'bg-violet-100 text-violet-700',
    expertise: ['Policy Analysis', 'Rate Comparisons'],
  },
  {
    name: 'David Park',
    role: 'Editor',
    bio: 'David focuses on SEO and user experience, ensuring our content reaches those who need it most. He has a background in digital marketing and journalism.',
    initials: 'DP',
    color: 'bg-amber-100 text-amber-700',
    expertise: ['Digital Strategy', 'User Experience'],
  },
];

const milestones = [
  { year: '2012', title: 'Founded', desc: 'Started with a mission to simplify insurance comparison' },
  { year: '2015', title: '50 States', desc: 'Licensed to operate in all 50 US states' },
  { year: '2018', title: '1M Users', desc: 'Helped over 1 million customers find better rates' },
  { year: '2021', title: '8M Served', desc: 'Reached 8 million customers with $2B+ in savings' },
  { year: '2024', title: 'Innovation', desc: 'Launched AI-powered personalized recommendations' },
];

export default async function AboutPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero Section - Mobile Optimized */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              Trusted by 8 Million+ Customers
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
              About MyInsuranceBuddy
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
              We're on a mission to help Americans save money and find the best insurance coverage. 
              Licensed in all 50 states with over 12 years of experience.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar - Mobile Scrollable */}
      <section className="py-8 sm:py-12 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
            {[
              { value: '12+', label: 'Years Experience', icon: Clock },
              { value: '50', label: 'States Licensed', icon: MapPin },
              { value: '120+', label: 'Insurance Partners', icon: Shield },
              { value: '8M+', label: 'Happy Customers', icon: Users },
            ].map((stat, i) => (
              <div key={i} className="text-center p-3 sm:p-4">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section - Mobile First Grid */}
      <section className="py-12 sm:py-16 lg:py-20" id="how-it-works">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
                  How MyInsuranceBuddy Works
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm sm:text-base">
                  InsuranceBuddies delivers on its promise to help customers save money and find the best insurance. 
                  As a licensed insurance agency in all 50 states, we exist to empower customers with bite-sized tips 
                  to ease those big decisions.
                </p>
                <p className="text-slate-600 leading-relaxed mb-6 text-sm sm:text-base">
                  No spam, no fees, no catch. We partner with over 120 insurance companies to bring you real, 
                  accurate quotes. Unlike some other sites, we'll never sell your information to make a buck.
                </p>
                <Link 
                  href="/get-quote" 
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8">
                <div className="space-y-4 sm:space-y-6">
                  {[
                    { num: '1', title: 'Select Insurance Type', desc: 'Choose auto, home, life, or other coverage you need.' },
                    { num: '2', title: 'Compare Top Providers', desc: 'See personalized rates from 120+ insurance companies.' },
                    { num: '3', title: 'Save Money', desc: 'Connect with the best policy and start saving up to $867/year.' },
                  ].map((step) => (
                    <div key={step.num} className="flex items-start gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-sm sm:text-base">{step.num}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1 text-sm sm:text-base">{step.title}</h3>
                        <p className="text-slate-600 text-xs sm:text-sm">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Our Journey</h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">From startup to industry leader</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>
              <div className="space-y-6 sm:space-y-8">
                {milestones.map((milestone, i) => (
                  <div key={i} className="relative flex items-start gap-4 sm:gap-6 pl-12 sm:pl-20">
                    <div className="absolute left-2 sm:left-6 w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 rounded-full border-4 border-white shadow"></div>
                    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100 flex-1">
                      <span className="text-blue-600 font-bold text-sm sm:text-base">{milestone.year}</span>
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg mt-1">{milestone.title}</h3>
                      <p className="text-slate-600 text-xs sm:text-sm mt-1">{milestone.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20" id="team">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Meet Our Editorial Team</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base px-2 sm:px-0">
              Our experienced team has more than 70 years of combined experience, including over 50 years in the insurance industry.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 hover:shadow-lg transition">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-sm sm:text-lg font-bold flex-shrink-0 ${member.color}`}>
                    {member.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{member.name}</h3>
                    <p className="text-blue-600 font-medium text-xs sm:text-sm mb-2">{member.role}</p>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-2">{member.bio}</p>
                    <div className="flex flex-wrap gap-1">
                      {member.expertise.map((exp) => (
                        <span key={exp} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Our Core Values</h2>
            <p className="text-slate-600 text-sm sm:text-base">The principles that guide everything we do</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {[
              { icon: CheckCircle, title: 'Accuracy', desc: 'Every article reviewed by licensed agents', color: 'emerald' },
              { icon: Target, title: 'Independence', desc: 'Editorial content free from influence', color: 'blue' },
              { icon: Lightbulb, title: 'Transparency', desc: 'Clear disclosure of partnerships', color: 'amber' },
              { icon: Lock, title: 'Privacy', desc: 'Your data is secure and protected', color: 'violet' },
            ].map((value) => (
              <div key={value.title} className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 text-center">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${value.color === 'emerald' ? 'bg-emerald-100' : value.color === 'blue' ? 'bg-blue-100' : value.color === 'amber' ? 'bg-amber-100' : 'bg-violet-100'} rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                  <value.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${value.color === 'emerald' ? 'text-emerald-600' : value.color === 'blue' ? 'text-blue-600' : value.color === 'amber' ? 'text-amber-600' : 'text-violet-600'}`} />
                </div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1 sm:mb-2">{value.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 sm:py-12 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {[
              { icon: Shield, text: 'Licensed in All 50 States' },
              { icon: Star, text: 'BBB A+ Rating' },
              { icon: TrendingUp, text: '$2B+ in Customer Savings' },
              { icon: Heart, text: 'Trusted by 8M+ Customers' },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
                <badge.icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Ready to Start Saving?</h2>
          <p className="text-blue-100 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base px-2 sm:px-0">
            Join millions of Americans who found better insurance rates with MyInsuranceBuddy.
          </p>
          <Link 
            href="/get-quote" 
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-bold hover:bg-blue-50 transition text-sm sm:text-base"
          >
            Compare Quotes Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer insuranceTypes={insuranceTypes} />
    </div>
  );
}
