import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Shield, UserX, CheckCircle, ArrowRight, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Do Not Sell My Personal Information | MyInsuranceBuddy',
  description: 'Exercise your right to opt out of the sale of your personal information under the California Consumer Privacy Act (CCPA) and other state privacy laws.',
  keywords: 'do not sell my information, CCPA, privacy rights, opt out, data privacy',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function DoNotSellPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <UserX className="w-4 h-4" />
              Your Privacy Rights
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Do Not Sell My Personal Information
            </h1>
            <p className="text-lg text-slate-300">
              Exercise your rights under CCPA and state privacy laws
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg mb-2">Your Privacy Matters</h2>
                  <p className="text-slate-600 text-sm">
                    MyInsuranceBuddy respects your privacy rights. Under the California Consumer Privacy Act (CCPA) 
                    and similar state laws, you have the right to opt out of the sale of your personal information. 
                    We do not sell your personal information to third parties for monetary consideration. However, 
                    we do share information with insurance providers to help you get quotes.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">What Does "Sale" Mean?</h2>
            <p className="text-slate-600 mb-6">
              Under the CCPA, "sale" means selling, renting, releasing, disclosing, disseminating, making available, 
              transferring, or otherwise communicating a consumer's personal information to another business or third 
              party for monetary or other valuable consideration.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Practices</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-700">
                    <strong>We do not sell your personal information</strong> to data brokers or third parties for their own marketing purposes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-700">
                    <strong>We share information with insurance partners</strong> only when you request quotes to help you find the best coverage.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-700">
                    <strong>You can opt out at any time</strong> by using the form below or contacting us directly.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Opt Out</h2>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
              <h3 className="font-bold text-slate-900 mb-4">Submit an Opt-Out Request</h3>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number (Optional)</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">State of Residence</label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="">Select your state</option>
                    <option value="CA">California</option>
                    <option value="VA">Virginia</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="UT">Utah</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="confirm" className="mt-1" />
                  <label htmlFor="confirm" className="text-sm text-slate-600">
                    I confirm that I am the person identified above and I want to opt out of the sale of my personal information.
                  </label>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
                >
                  Submit Opt-Out Request
                </button>
              </form>
              <p className="text-xs text-slate-500 mt-4">
                We will process your request within 45 days as required by law. You will receive a confirmation email once your request has been processed.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">Other Ways to Opt Out</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <FileText className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">By Email</h4>
                  <p className="text-slate-600 text-sm">
                    Send your request to{' '}
                    <a href="mailto:privacy@myinsurancebuddies.com" className="text-emerald-600 hover:underline">
                      privacy@myinsurancebuddies.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <FileText className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">By Phone</h4>
                  <p className="text-slate-600 text-sm">
                    Call us toll-free at{' '}
                    <a href="tel:1-855-205-2412" className="text-emerald-600 hover:underline">
                      1-855-205-2412
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <FileText className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">By Mail</h4>
                  <p className="text-slate-600 text-sm">
                    MyInsuranceBuddy<br />
                    Attn: Privacy Department<br />
                    500 W 2nd St, Suite 1900<br />
                    Austin, TX 78701
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Other Privacy Rights</h2>
            <p className="text-slate-600 mb-4">
              In addition to the right to opt out of the sale of personal information, depending on your state of residence, you may also have the right to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
              <li>Know what personal information we collect about you</li>
              <li>Request deletion of your personal information</li>
              <li>Correct inaccurate personal information</li>
              <li>Request a copy of your personal information</li>
              <li>Non-discrimination for exercising your privacy rights</li>
            </ul>

            <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-200">
              <Link 
                href="/privacy" 
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:underline"
              >
                Privacy Policy
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/cookies" 
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:underline"
              >
                Cookie Policy
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
