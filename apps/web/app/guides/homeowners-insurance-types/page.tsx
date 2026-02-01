import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Home, ArrowRight, CheckCircle, AlertTriangle, Shield,
  DollarSign, Building, TreePine, Waves, Wind, Flame,
  Clock, Info, Star, MapPin, Heart
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Types of Homeowners Insurance: HO-1 to HO-8 Explained | MyInsuranceBuddy',
  description: 'Learn about the 8 types of homeowners insurance policies (HO-1 through HO-8). Understand what each covers and find out which policy type is most common for your home.',
  keywords: 'homeowners insurance types, HO-1 HO-2 HO-3 HO-4 HO-5 HO-6 HO-7 HO-8, home insurance policy types, dwelling coverage, condo insurance, renters insurance',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function HomeownersInsuranceTypesPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Home className="w-4 h-4" />
              Home Insurance Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Types of Homeowners Insurance: HO-1 to HO-8 Explained
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 12 min read</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">Comprehensive</span>
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
                Not all home insurance policies are created equal. Depending on your living situation, 
                property type, and coverage needs, different policy forms offer varying levels of protection. 
                Understanding the eight standard types of homeowners insurance (designated HO-1 through HO-8) 
                will help you choose the right coverage for your specific situation.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Quick Comparison of All Policy Types</h2>
              
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left p-3 font-bold text-slate-900 border-b-2 border-slate-200">Policy</th>
                      <th className="text-left p-3 font-bold text-slate-900 border-b-2 border-slate-200">Best For</th>
                      <th className="text-left p-3 font-bold text-slate-900 border-b-2 border-slate-200">Coverage Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 font-semibold text-slate-900">HO-1</td>
                      <td className="p-3 text-slate-700">Bare minimum coverage (rarely used)</td>
                      <td className="p-3"><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">Named Perils</span></td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-900">HO-2</td>
                      <td className="p-3 text-slate-700">Budget-conscious homeowners</td>
                      <td className="p-3"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs">Named Perils</span></td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 font-semibold text-slate-900">HO-3</td>
                      <td className="p-3 text-slate-700">Most homeowners (most popular)</td>
                      <td className="p-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">Open Peril + Named</span></td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-900">HO-4</td>
                      <td className="p-3 text-slate-700">Renters</td>
                      <td className="p-3"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">Named Perils</span></td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 font-semibold text-slate-900">HO-5</td>
                      <td className="p-3 text-slate-700">High-value homes, comprehensive coverage</td>
                      <td className="p-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">Open Peril</span></td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-900">HO-6</td>
                      <td className="p-3 text-slate-700">Condo and co-op owners</td>
                      <td className="p-3"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">Named Perils</span></td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 font-semibold text-slate-900">HO-7</td>
                      <td className="p-3 text-slate-700">Mobile home owners</td>
                      <td className="p-3"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs">Named Perils</span></td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-900">HO-8</td>
                      <td className="p-3 text-slate-700">Older, historic homes</td>
                      <td className="p-3"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs">Named Perils</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Named Perils vs. Open Peril Coverage</h2>
              <p className="text-slate-600 mb-6">
                Before diving into specific policy types, it's important to understand the difference between 
                named perils and open peril (all-risk) coverage:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-3">Named Perils Coverage</h4>
                  <p className="text-slate-700 text-sm mb-3">
                    Only covers damage caused by specifically listed events. If a peril isn't named, it's not covered.
                  </p>
                  <div className="text-xs text-slate-600">
                    <strong>Common named perils:</strong> Fire, lightning, windstorm, hail, explosion, riot, aircraft, 
                    vehicles, smoke, vandalism, theft, falling objects, weight of ice/snow, freezing pipes
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="font-bold text-emerald-900 mb-3">Open Peril (All-Risk) Coverage</h4>
                  <p className="text-slate-700 text-sm mb-3">
                    Covers damage from all causes except those specifically excluded in the policy. Much broader protection.
                  </p>
                  <div className="text-xs text-slate-600">
                    <strong>Common exclusions:</strong> Floods, earthquakes, nuclear hazards, war, intentional damage, 
                    normal wear and tear, pest infestations
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Detailed Breakdown by Policy Type</h2>

              {/* HO-1 */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900">HO-1: Basic Form</h3>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">Limited Availability</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  The most basic and limited homeowners insurance. Covers only the dwelling against 10 specific named perils. 
                  Personal property is not covered. Very few insurers offer HO-1 policies today.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1">What it Covers:</h5>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Fire/lightning</li>
                      <li>• Windstorm/hail</li>
                      <li>• Explosion</li>
                      <li>• Riot/civil commotion</li>
                      <li>• Aircraft/vehicles</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1">Best For:</h5>
                    <p className="text-slate-600">Very budget-conscious homeowners in low-risk areas who own their home outright.</p>
                  </div>
                </div>
              </div>

              {/* HO-2 */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900">HO-2: Broad Form</h3>
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">Budget Option</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  A step up from HO-1, covering the dwelling and personal property against 16 named perils. 
                  More comprehensive than basic form but still limited compared to standard policies.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1">Additional Covered Perils:</h5>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Falling objects</li>
                      <li>• Weight of ice, snow, sleet</li>
                      <li>• Accidental water damage</li>
                      <li>• Sudden cracking/bulging</li>
                      <li>• Freezing of plumbing</li>
                      <li>• Artificially generated electricity</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1">Best For:</h5>
                    <p className="text-slate-600">Homeowners seeking basic coverage at a lower cost than standard HO-3 policies.</p>
                  </div>
                </div>
              </div>

              {/* HO-3 */}
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900">HO-3: Special Form</h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">Most Popular</span>
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  The most common homeowners insurance policy. Offers open peril coverage for the dwelling 
                  and other structures, but named perils coverage for personal property. Provides excellent 
                  protection for most homeowners.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="font-semibold text-emerald-900 mb-1">Dwelling Coverage:</h5>
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">Open Peril</span>
                    <p className="text-slate-600 mt-1">Covers all risks except specifically excluded events</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="font-semibold text-blue-900 mb-1">Personal Property:</h5>
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">Named Perils</span>
                    <p className="text-slate-600 mt-1">Covers 16 specifically listed perils</p>
                  </div>
                </div>
                <div className="text-sm">
                  <h5 className="font-semibold text-slate-900 mb-1">Best For:</h5>
                  <p className="text-slate-600">Most single-family homeowners. Offers the best balance of coverage and cost for typical homes.</p>
                </div>
              </div>

              {/* HO-4 */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900">HO-4: Contents Broad Form</h3>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">For Renters</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Commonly known as renters insurance. Covers personal property and liability but does not 
                  cover the dwelling structure (that's the landlord's responsibility).
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1">Coverage Includes:</h5>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Personal property (named perils)</li>
                      <li>• Personal liability</li>
                      <li>• Medical payments to others</li>
                      <li>• Additional living expenses</li>
                      <li>• Loss of use</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1">Best For:</h5>
                    <p className="text-slate-600">Anyone renting a house, apartment, or condo. Often required by landlords.</p>
                  </div>
                </div>
              </div>

              {/* HO-5 */}
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900">HO-5: Comprehensive Form</h3>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">Most Comprehensive</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  The most extensive coverage available. Open peril protection for both dwelling and personal 
                  property. Ideal for high-value homes and those seeking maximum protection.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="font-semibold text-emerald-900 mb-1">Dwelling Coverage:</h5>
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">Open Peril</span>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="font-semibold text-emerald-900 mb-1">Personal Property:</h5>
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">Open Peril</span>
                  </div>
                </div>
                <div className="text-sm">
                  <h5 className="font-semibold text-slate-900 mb-1">Best For:</h5>
                  <p className="text-slate-600">High-value homes, homes with expensive belongings, and homeowners who want the most comprehensive protection.</p>
                </div>
              </div>

              {/* HO-6 */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900">HO-6: Unit-Owners Form</h3>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">For Condos</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Designed specifically for condominium and co-op owners. Covers the interior of your unit, 
                  personal property, and liability. The condo association's master policy typically covers the building exterior.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1">Coverage Includes:</h5>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Interior walls, floors, ceilings</li>
                      <li>• Personal property</li>
                      <li>• Improvements/alterations</li>
                      <li>• Personal liability</li>
                      <li>• Loss assessment coverage</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1">Best For:</h5>
                    <p className="text-slate-600">Condominium and co-op owners. Check your association's master policy to understand gaps.</p>
                  </div>
                </div>
              </div>

              {/* HO-7 */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900">HO-7: Mobile Home Form</h3>
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">Mobile Homes</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Similar to HO-3 but designed specifically for mobile and manufactured homes. Provides 
                  open peril coverage for the dwelling and named perils for personal property.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1">Coverage Includes:</h5>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Mobile/manufactured home structure</li>
                      <li>• Unattached structures</li>
                      <li>• Personal property</li>
                      <li>• Liability protection</li>
                      <li>• Coverage while in transit</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1">Best For:</h5>
                    <p className="text-slate-600">Owners of mobile homes, manufactured homes, and trailer homes.</p>
                  </div>
                </div>
              </div>

              {/* HO-8 */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900">HO-8: Modified Coverage Form</h3>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">Older Homes</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Designed for older homes where the replacement cost exceeds the market value, or where 
                  meeting modern building codes would be prohibitively expensive. Typically provides actual 
                  cash value coverage rather than replacement cost.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1">Key Features:</h5>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Covers 10 basic perils</li>
                      <li>• Actual cash value settlement</li>
                      <li>• Doesn't require code upgrade coverage</li>
                      <li>• More affordable premiums</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1">Best For:</h5>
                    <p className="text-slate-600">Homes over 40 years old, historic homes, and homes with unique architectural features.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Understanding Standard Coverage Components</h2>
              <p className="text-slate-600 mb-6">
                Most homeowners insurance policies include several standard types of coverage:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { code: 'Coverage A', name: 'Dwelling', desc: 'Physical structure of your home', icon: Home },
                  { code: 'Coverage B', name: 'Other Structures', desc: 'Detached garage, fence, shed (typically 10% of Coverage A)', icon: Building },
                  { code: 'Coverage C', name: 'Personal Property', desc: 'Your belongings inside and outside the home', icon: Shield },
                  { code: 'Coverage D', name: 'Loss of Use', desc: 'Additional living expenses if home is uninhabitable', icon: DollarSign },
                  { code: 'Coverage E', name: 'Personal Liability', desc: 'Legal protection if someone is injured on your property', icon: Heart },
                  { code: 'Coverage F', name: 'Medical Payments', desc: 'Medical expenses for guests injured on your property', icon: Info },
                ].map((coverage, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                      <coverage.icon className="w-5 h-5 text-emerald-600" />
                      <div>
                        <span className="text-xs font-medium text-slate-500">{coverage.code}</span>
                        <h5 className="font-bold text-slate-900 text-sm">{coverage.name}</h5>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{coverage.desc}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Common Exclusions Across All Policy Types</h2>
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Events Typically NOT Covered
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Waves className="w-4 h-4 text-amber-600 mt-0.5" />
                    <span className="text-slate-700">Floods (requires separate flood insurance)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-600 mt-0.5" />
                    <span className="text-slate-700">Earthquakes (requires separate coverage)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-amber-600 mt-0.5" />
                    <span className="text-slate-700">War or nuclear hazards</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                    <span className="text-slate-700">Intentional damage</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 mt-0.5" />
                    <span className="text-slate-700">Normal wear and tear</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <TreePine className="w-4 h-4 text-amber-600 mt-0.5" />
                    <span className="text-slate-700">Pest infestations</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Choose the Right Policy</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-emerald-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Determine Your Property Type</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Single-family home, condo, mobile home, or rental? Each requires a different policy form.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-emerald-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Assess Your Risk Tolerance</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Are you comfortable with named perils coverage, or do you want the comprehensive protection of open peril?
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-emerald-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Calculate Your Coverage Needs</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Ensure your dwelling coverage equals your home's replacement cost, not just its market value.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-emerald-600">4</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Compare Quotes</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Get quotes for the same coverage levels from multiple insurers to find the best value.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Find the Right Home Insurance for You</h3>
              <p className="text-emerald-100 mb-6">
                Compare quotes from top insurers and find the perfect policy for your home type.
              </p>
              <Link 
                href="/get-quote?type=home"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition"
              >
                Get Home Insurance Quotes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Related Guides */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Related Guides</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  href="/guides/how-much-home-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">How Much Home Insurance Do I Need?</span>
                </Link>
                <Link 
                  href="/guides/renters-insurance-worth"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Is Renters Insurance Worth It?</span>
                </Link>
                <Link 
                  href="/guides/lower-home-premium"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">How to Lower Your Home Insurance</span>
                </Link>
                <Link 
                  href="/guides"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <Home className="w-5 h-5 text-amber-600" />
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
