import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Briefcase, Heart, Users, Zap, Globe, Coffee, Award,
  ArrowRight, MapPin, DollarSign, Clock, CheckCircle,
  Laptop, GraduationCap, HeartHandshake
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Careers at MyInsuranceBuddy | Join Our Team',
  description: 'Join MyInsuranceBuddy and help millions of Americans find the right insurance. We're hiring across engineering, marketing, sales, and customer success. Competitive benefits and remote-friendly.',
  keywords: 'MyInsuranceBuddy careers, insurance jobs, tech jobs, remote jobs, customer service jobs, sales careers',
  openGraph: {
    title: 'Careers at MyInsuranceBuddy - Join Our Mission',
    description: 'Help millions find the right insurance. View open positions and join our growing team.',
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

const openPositions = [
  {
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'Remote (US)',
    type: 'Full-time',
    salary: '$140K - $180K',
    description: 'Build the platform that helps millions compare insurance quotes. React, Node.js, PostgreSQL.',
  },
  {
    title: 'Product Manager - Growth',
    department: 'Product',
    location: 'Austin, TX / Remote',
    type: 'Full-time',
    salary: '$120K - $160K',
    description: 'Drive user acquisition and retention through data-driven product decisions.',
  },
  {
    title: 'Licensed Insurance Agent',
    department: 'Sales',
    location: 'Remote (US)',
    type: 'Full-time',
    salary: '$60K - $90K + Commission',
    description: 'Help customers find the perfect insurance coverage. Must have active state licenses.',
  },
  {
    title: 'Customer Success Specialist',
    department: 'Support',
    location: 'Remote (US)',
    type: 'Full-time',
    salary: '$45K - $60K',
    description: 'Provide exceptional support to our users via phone, chat, and email.',
  },
  {
    title: 'Content Marketing Manager',
    department: 'Marketing',
    location: 'Austin, TX / Remote',
    type: 'Full-time',
    salary: '$75K - $95K',
    description: 'Create engaging content that educates consumers about insurance.',
  },
  {
    title: 'SEO Specialist',
    department: 'Marketing',
    location: 'Remote (US)',
    type: 'Full-time',
    salary: '$70K - $90K',
    description: 'Optimize our organic search presence and drive qualified traffic.',
  },
];

const benefits = [
  { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive medical, dental, and vision coverage. 100% premium coverage for employees.' },
  { icon: DollarSign, title: 'Competitive Pay', desc: 'Above-market salaries with regular performance reviews and annual bonuses.' },
  { icon: Laptop, title: 'Remote-First', desc: 'Work from anywhere in the US. Home office stipend and flexible schedules.' },
  { icon: Clock, title: 'Unlimited PTO', desc: 'Take the time you need to recharge. Minimum 15 days encouraged annually.' },
  { icon: GraduationCap, title: 'Learning Budget', desc: '$2,500 annual budget for courses, conferences, and professional development.' },
  { icon: HeartHandshake, title: '401(k) Match', desc: '4% company match to help you save for retirement.' },
];

const values = [
  { title: 'Customer First', desc: 'Every decision starts with what\'s best for our users.', color: 'blue' },
  { title: 'Move Fast', desc: 'We iterate quickly and learn from every launch.', color: 'emerald' },
  { title: 'Data Driven', desc: 'Decisions backed by insights, not just intuition.', color: 'violet' },
  { title: 'Inclusive', desc: 'Diverse perspectives make us stronger.', color: 'amber' },
];

export default async function CareersPage() {
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
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              We're Hiring!
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
              Join Our Mission to Transform Insurance
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
              Help millions of Americans find the right coverage at the best price. 
              Join a team that values innovation, transparency, and making a real difference.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 sm:py-12 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
            {[
              { value: '150+', label: 'Team Members' },
              { value: '35', label: 'States Represented' },
              { value: '8M+', label: 'Customers Helped' },
              { value: '4.8/5', label: 'Employee Rating' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Our Values</h2>
            <p className="text-slate-600 max-w-xl mx-auto">The principles that guide how we work together</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 text-center">
                <div className={`w-12 h-12 ${value.color === 'blue' ? 'bg-blue-100' : value.color === 'emerald' ? 'bg-emerald-100' : value.color === 'violet' ? 'bg-violet-100' : 'bg-amber-100'} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <CheckCircle className={`w-6 h-6 ${value.color === 'blue' ? 'text-blue-600' : value.color === 'emerald' ? 'text-emerald-600' : value.color === 'violet' ? 'text-violet-600' : 'text-amber-600'}`} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{value.title}</h3>
                <p className="text-slate-600 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Benefits & Perks</h2>
            <p className="text-slate-600 max-w-xl mx-auto">We take care of our team so they can focus on helping others</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 hover:shadow-md transition">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <benefit.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{benefit.title}</h3>
                <p className="text-slate-600 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Open Positions</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Find your perfect role and apply today</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {openPositions.map((position) => (
              <div key={position.title} className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition group">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition">{position.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-sm text-slate-600 flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {position.department}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-sm text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {position.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      {position.type}
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-3">{position.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {position.salary}
                  </span>
                  <button className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-slate-600 text-sm">
              Don't see the right fit?{' '}
              <Link href="mailto:careers@myinsurancebuddies.com" className="text-blue-600 hover:underline">
                Send us your resume
              </Link>{' '}
              for future opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Life at MIB */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Life at MyInsuranceBuddy</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                We're a remote-first company with team members across the country. While we work hard to help our customers, 
                we also know how to have fun. From virtual game nights to annual retreats, we build connections that go beyond work.
              </p>
              <ul className="space-y-3">
                {[
                  'Weekly team lunches (virtual or in-person)',
                  'Quarterly team-building events',
                  'Annual company retreat',
                  'Volunteer days and giving back',
                  'Learning and development opportunities',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-100 rounded-xl p-4 aspect-square flex items-center justify-center">
                  <Users className="w-12 h-12 text-slate-400" />
                </div>
                <div className="bg-slate-100 rounded-xl p-4 aspect-square flex items-center justify-center">
                  <Laptop className="w-12 h-12 text-slate-400" />
                </div>
                <div className="bg-slate-100 rounded-xl p-4 aspect-square flex items-center justify-center">
                  <Coffee className="w-12 h-12 text-slate-400" />
                </div>
                <div className="bg-slate-100 rounded-xl p-4 aspect-square flex items-center justify-center">
                  <Globe className="w-12 h-12 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Ready to Join Us?</h2>
          <p className="text-blue-100 mb-6 sm:mb-8 max-w-xl mx-auto">
            Take the next step in your career and help millions of Americans save on insurance.
          </p>
          <Link 
            href="mailto:careers@myinsurancebuddies.com" 
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
          >
            View All Positions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer insuranceTypes={insuranceTypes} />
    </div>
  );
}
