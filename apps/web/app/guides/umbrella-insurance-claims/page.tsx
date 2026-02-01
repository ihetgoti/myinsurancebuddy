import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Umbrella, ArrowRight, CheckCircle, Shield, AlertTriangle,
  Car, Dog, Waves, Scale, UserX, Home, Briefcase, 
  Clock, FileText, HeartPulse, MessageCircle
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'When Does Umbrella Insurance Pay Off? Real Claim Scenarios | MyInsuranceBuddy',
  description: 'Discover real-world umbrella insurance claim scenarios including car accidents, dog bites, pool accidents, and lawsuits. Learn when umbrella coverage kicks in and protects you.',
  keywords: 'umbrella insurance claims, umbrella policy payouts, personal liability claims, car accident umbrella insurance, dog bite lawsuit coverage, umbrella insurance examples',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function UmbrellaInsuranceClaimsPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-900 via-teal-800 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Real Claims Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              When Does Umbrella Insurance Pay Off? Real Claim Scenarios
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 12 min read</span>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">Must Read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                You might wonder if umbrella insurance is worth the investment. The reality is that 
                accidents happen every day, and when they do, the financial consequences can be 
                devastating. This guide explores real-world scenarios where umbrella insurance has 
                protected families from financial ruin.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Triggers Umbrella Coverage?</h2>
              <p className="text-slate-600 mb-6">
                Umbrella insurance kicks in when a claim exceeds the liability limits of your underlying 
                policies—auto, homeowners, renters, or boat insurance. It also covers certain claims that 
                your base policies may not cover at all, such as libel, slander, and false arrest.
              </p>

              <div className="bg-cyan-50 rounded-xl p-6 border border-cyan-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-cyan-600" />
                  How Coverage Layers Work
                </h3>
                <p className="text-slate-700 mb-4">
                  Think of your insurance coverage like a layered cake:
                </p>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <span className="font-semibold text-slate-900">Layer 1:</span>
                    <span className="text-slate-700"> Your primary policy pays first (e.g., $300k auto liability)</span>
                  </div>
                  <div className="bg-cyan-100 rounded-lg p-3 border border-cyan-200">
                    <span className="font-semibold text-cyan-900">Layer 2:</span>
                    <span className="text-cyan-800"> Umbrella coverage kicks in when primary limits are exhausted</span>
                  </div>
                </div>
                <p className="text-slate-700 mt-4 text-sm">
                  <strong>Example:</strong> If you cause an accident with $750,000 in damages and have 
                  $250,000 auto liability plus $1M umbrella coverage, your auto policy pays $250,000 
                  and your umbrella pays the remaining $500,000.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Real Claim Scenarios</h2>
              <p className="text-slate-600 mb-6">
                These scenarios are based on actual claims that have resulted in significant payouts. 
                Names and details have been modified for privacy, but the financial outcomes are realistic.
              </p>

              {/* Scenario 1: Car Accident */}
              <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-6 border border-red-200 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Scenario 1: Multi-Vehicle Highway Accident</h3>
                    <p className="text-sm text-slate-600">Result: $1.2 Million Settlement</p>
                  </div>
                </div>
                
                <div className="space-y-4 text-slate-700">
                  <div>
                    <p className="font-semibold mb-1">The Incident:</p>
                    <p className="text-sm">
                      Sarah, a 42-year-old professional, was driving on the highway during a rainstorm. 
                      She hydroplaned and lost control, crossing the median and colliding with an 
                      oncoming minivan carrying a family of four.
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-semibold mb-1">Injuries & Damages:</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Driver of minivan: Spinal cord injury requiring surgery ($400,000)</li>
                      <li>Passenger (spouse): Multiple fractures and 6-month recovery ($250,000)</li>
                      <li>Two children: Various injuries and psychological trauma ($350,000)</li>
                      <li>Lost wages and future earning capacity ($200,000)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <p className="font-semibold text-red-700 mb-1">How Insurance Responded:</p>
                    <div className="text-sm space-y-1">
                      <p>• Auto policy limit: $250,000 (exhausted immediately)</p>
                      <p>• Umbrella policy paid: $950,000</p>
                      <p>• Sarah's personal assets: <strong>Protected</strong></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      <strong>Without umbrella insurance:</strong> Sarah would have been personally 
                      responsible for $950,000, potentially forcing her to sell her home, drain retirement 
                      accounts, and face wage garnishment for years.
                    </p>
                  </div>
                </div>
              </div>

              {/* Scenario 2: Dog Bite */}
              <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border border-amber-200 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Dog className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Scenario 2: Dog Attack on Child</h3>
                    <p className="text-sm text-slate-600">Result: $850,000 Settlement</p>
                  </div>
                </div>
                
                <div className="space-y-4 text-slate-700">
                  <div>
                    <p className="font-semibold mb-1">The Incident:</p>
                    <p className="text-sm">
                      The Johnson family had a 5-year-old German Shepherd. During a neighborhood 
                      barbecue, a neighbor's 7-year-old child wandered into the backyard and approached 
                      the dog while it was eating. The dog attacked, causing severe facial injuries.
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-semibold mb-1">Injuries & Damages:</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Facial reconstruction surgeries ($350,000)</li>
                      <li>Ongoing psychological therapy ($100,000)</li>
                      <li>Future cosmetic procedures ($200,000)</li>
                      <li>Pain and suffering ($200,000)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-amber-200">
                    <p className="font-semibold text-amber-700 mb-1">How Insurance Responded:</p>
                    <div className="text-sm space-y-1">
                      <p>• Homeowners policy limit: $300,000</p>
                      <p>• Umbrella policy paid: $550,000</p>
                      <p>• Johnson's savings and home equity: <strong>Protected</strong></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg">
                    <Shield className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700">
                      <strong>Important note:</strong> Some homeowner policies exclude certain dog breeds. 
                      Umbrella insurance can provide coverage even when your base policy has restrictions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Scenario 3: Pool Accident */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-200 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Waves className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Scenario 3: Swimming Pool Drowning Incident</h3>
                    <p className="text-sm text-slate-600">Result: $2.3 Million Verdict</p>
                  </div>
                </div>
                
                <div className="space-y-4 text-slate-700">
                  <div>
                    <p className="font-semibold mb-1">The Incident:</p>
                    <p className="text-sm">
                      The Martinez family hosted a graduation party for their son. A 16-year-old guest 
                      slipped and fell into the pool while unsupervised, hitting his head on the pool's 
                      edge. He suffered a traumatic brain injury and permanent disability.
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-semibold mb-1">Injuries & Damages:</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Emergency medical care and surgery ($500,000)</li>
                      <li>Lifetime care and rehabilitation ($1,200,000)</li>
                      <li>Lost future earning capacity ($400,000)</li>
                      <li>Home modifications and medical equipment ($100,000)</li>
                      <li>Pain and suffering ($100,000)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <p className="font-semibold text-blue-700 mb-1">How Insurance Responded:</p>
                    <div className="text-sm space-y-1">
                      <p>• Homeowners policy limit: $500,000</p>
                      <p>• Umbrella policy paid: $1,800,000</p>
                      <p>• Martinez family assets: <strong>Fully Protected</strong></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 bg-red-50 p-3 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-800">
                      <strong>Without adequate coverage:</strong> The Martinez family would have faced 
                      bankruptcy. Even with a $1M umbrella policy, they would have owed $800,000 personally. 
                      Their $3M umbrella policy provided complete protection.
                    </p>
                  </div>
                </div>
              </div>

              {/* Scenario 4: Defamation Lawsuit */}
              <div className="bg-gradient-to-br from-violet-50 to-white rounded-2xl p-6 border border-violet-200 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Scenario 4: Social Media Defamation</h3>
                    <p className="text-sm text-slate-600">Result: $750,000 Judgment</p>
                  </div>
                </div>
                
                <div className="space-y-4 text-slate-700">
                  <div>
                    <p className="font-semibold mb-1">The Incident:</p>
                    <p className="text-sm">
                      A small business owner posted negative reviews about a competitor on social media, 
                      accusing them of fraudulent business practices without evidence. The competitor 
                      sued for defamation and business interference, proving significant financial losses.
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-semibold mb-1">Damages Awarded:</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Lost business revenue ($400,000)</li>
                      <li>Reputational damage ($200,000)</li>
                      <li>Legal fees ($150,000)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-violet-200">
                    <p className="font-semibold text-violet-700 mb-1">How Insurance Responded:</p>
                    <div className="text-sm space-y-1">
                      <p>• Homeowners policy: $0 (defamation excluded)</p>
                      <p>• Umbrella policy paid: $750,000 (including legal defense)</p>
                      <p>• Business owner's personal assets: <strong>Protected</strong></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 bg-violet-50 p-3 rounded-lg">
                    <Shield className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-violet-800">
                      <strong>Key insight:</strong> This case highlights how umbrella insurance covers 
                      claims your homeowners policy excludes. Personal injury coverage in umbrella 
                      policies includes libel, slander, and defamation.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Additional Coverage Triggers</h2>
              <p className="text-slate-600 mb-6">
                Beyond the major scenarios above, umbrella insurance can protect you in many other situations:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Home className="w-5 h-5 text-cyan-600" />
                    Rental Property Incidents
                  </h4>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Tenant injuries from property defects</li>
                    <li>• Accidents on rental property grounds</li>
                    <li>• Dog bites by tenant's pets (in some cases)</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-cyan-600" />
                    Volunteer Activities
                  </h4>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Coaching youth sports injuries</li>
                    <li>• Church or nonprofit volunteer incidents</li>
                    <li>• School volunteer accidents</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <UserX className="w-5 h-5 text-cyan-600" />
                    Personal Injury Claims
                  </h4>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• False arrest or wrongful detention</li>
                    <li>• Malicious prosecution</li>
                    <li>• Invasion of privacy</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-cyan-600" />
                    Business Activities
                  </h4>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Home-based business liability</li>
                    <li>• Independent contractor exposures</li>
                    <li>• Board membership (non-profit)</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Umbrella Insurance Does NOT Cover</h2>
              <p className="text-slate-600 mb-6">
                It's equally important to understand the limitations of umbrella insurance:
              </p>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Common Exclusions
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span><strong>Intentional acts:</strong> Damage or injury you cause intentionally</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span><strong>Business liability:</strong> Claims related to your business operations (separate commercial policy needed)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span><strong>Personal property:</strong> Damage to your own belongings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span><strong>Criminal acts:</strong> Liability arising from illegal activities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span><strong>Contractual liability:</strong> Obligations you've assumed under contract</span>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Key Takeaways</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 bg-emerald-50 rounded-lg p-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Accidents can happen to anyone</p>
                    <p className="text-slate-600 text-sm">Even careful, responsible people face unexpected situations that lead to liability claims.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-emerald-50 rounded-lg p-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Medical costs drive high settlements</p>
                    <p className="text-slate-600 text-sm">Serious injuries can result in hundreds of thousands or millions in medical bills alone.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-emerald-50 rounded-lg p-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Umbrella insurance is affordable protection</p>
                    <p className="text-slate-600 text-sm">For a few hundred dollars annually, you get millions in protection against financial devastation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-emerald-50 rounded-lg p-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Coverage gaps can be catastrophic</p>
                    <p className="text-slate-600 text-sm">Without adequate coverage, you could lose your home, savings, and future earnings.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Don't Wait for a Claim to Find Out</h3>
              <p className="text-cyan-100 mb-6">
                Protect your family's financial future with umbrella insurance. Get quotes from multiple carriers in minutes.
              </p>
              <Link 
                href="/get-quote?type=umbrella"
                className="inline-flex items-center gap-2 bg-white text-cyan-700 px-8 py-3 rounded-xl font-bold hover:bg-cyan-50 transition"
              >
                Get Free Quotes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Related Guides */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Related Guides</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  href="/guides/umbrella-coverage-amount"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-cyan-50 transition"
                >
                  <Scale className="w-5 h-5 text-cyan-600" />
                  <span className="font-medium text-slate-700">How Much Coverage Do You Need?</span>
                </Link>
                <Link 
                  href="/guides/umbrella-insurance-explained"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-cyan-50 transition"
                >
                  <Umbrella className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">What Is Umbrella Insurance?</span>
                </Link>
                <Link 
                  href="/guides/home-insurance-claims"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-cyan-50 transition"
                >
                  <Home className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Home Insurance Claims Guide</span>
                </Link>
                <Link 
                  href="/guides"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-cyan-50 transition"
                >
                  <FileText className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-slate-700">All Insurance Guides</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer insuranceTypes={insuranceTypes} />
    </div>
  );
}
