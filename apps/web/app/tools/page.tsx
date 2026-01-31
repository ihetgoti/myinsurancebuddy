'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { 
  Calculator, Car, Home, Heart, ArrowRight, TrendingUp,
  DollarSign, Shield, Info, CheckCircle, AlertTriangle,
  Building2, Users, FileText
} from 'lucide-react';

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<'auto' | 'home' | 'life'>('auto');
  
  // Auto Calculator State
  const [autoState, setAutoState] = useState({ vehicleValue: '', deductible: 500, age: 35, drivingRecord: 'clean' });
  const [autoResult, setAutoResult] = useState<number | null>(null);
  
  // Home Calculator State
  const [homeState, setHomeState] = useState({ homeValue: '', deductible: 1000, location: 'suburban', homeAge: 'new' });
  const [homeResult, setHomeResult] = useState<number | null>(null);
  
  // Life Calculator State
  const [lifeState, setLifeState] = useState({ income: 50000, age: 35, dependents: 2, debts: 100000 });
  const [lifeResult, setLifeResult] = useState<number | null>(null);

  const calculateAuto = () => {
    const base = parseInt(autoState.vehicleValue) * 0.03;
    const ageFactor = autoState.age < 25 ? 1.5 : autoState.age > 55 ? 0.9 : 1;
    const recordFactor = autoState.drivingRecord === 'clean' ? 1 : autoState.drivingRecord === 'minor' ? 1.3 : 1.8;
    const deductibleFactor = 1 - (autoState.deductible - 500) / 5000;
    setAutoResult(Math.round(base * ageFactor * recordFactor * deductibleFactor));
  };

  const calculateHome = () => {
    const base = parseInt(homeState.homeValue) * 0.004;
    const locationFactor = homeState.location === 'urban' ? 1.2 : homeState.location === 'rural' ? 0.9 : 1;
    const ageFactor = homeState.homeAge === 'new' ? 0.8 : homeState.homeAge === 'old' ? 1.3 : 1;
    const deductibleFactor = 1 - (homeState.deductible - 500) / 5000;
    setHomeResult(Math.round(base * locationFactor * ageFactor * deductibleFactor));
  };

  const calculateLife = () => {
    const incomeReplacement = lifeState.income * 10;
    const total = incomeReplacement + lifeState.debts + (lifeState.dependents * 100000);
    const ageFactor = lifeState.age > 50 ? 1.5 : lifeState.age > 40 ? 1.2 : 1;
    setLifeResult(Math.round(total * ageFactor));
  };

  const tools = [
    {
      id: 'auto',
      name: 'Auto Insurance Calculator',
      icon: Car,
      description: 'Estimate your car insurance premium based on vehicle value, age, and driving history.',
    },
    {
      id: 'home',
      name: 'Home Insurance Calculator',
      icon: Home,
      description: 'Calculate estimated home insurance costs based on property value and location.',
    },
    {
      id: 'life',
      name: 'Life Insurance Calculator',
      icon: Heart,
      description: 'Determine how much life insurance coverage you need to protect your family.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header insuranceTypes={[]} states={[]} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-16 sm:py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4">
              <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
              Free Insurance Tools
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Insurance Calculators & Tools
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
              Estimate your insurance needs and costs with our easy-to-use calculators. 
              Get personalized estimates in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Tool Tabs */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id as any)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition text-sm sm:text-base ${
                    activeTab === tool.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <tool.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{tool.name}</span>
                  <span className="sm:hidden">{tool.name.replace(' Calculator', '')}</span>
                </button>
              ))}
            </div>

            {/* Tool Content */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              {activeTab === 'auto' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Car className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Auto Insurance Estimator</h2>
                      <p className="text-slate-600 text-sm">Get an estimated annual premium for your vehicle</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Value ($)</label>
                      <input
                        type="number"
                        placeholder="25000"
                        value={autoState.vehicleValue}
                        onChange={(e) => setAutoState({ ...autoState, vehicleValue: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Your Age</label>
                      <input
                        type="number"
                        placeholder="35"
                        value={autoState.age}
                        onChange={(e) => setAutoState({ ...autoState, age: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Deductible ($)</label>
                      <select
                        value={autoState.deductible}
                        onChange={(e) => setAutoState({ ...autoState, deductible: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={250}>$250</option>
                        <option value={500}>$500</option>
                        <option value={1000}>$1,000</option>
                        <option value={1500}>$1,500</option>
                        <option value={2000}>$2,000</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Driving Record</label>
                      <select
                        value={autoState.drivingRecord}
                        onChange={(e) => setAutoState({ ...autoState, drivingRecord: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="clean">Clean Record</option>
                        <option value="minor">Minor Violations</option>
                        <option value="major">Major Violations</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    onClick={calculateAuto}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Calculator className="w-5 h-5" />
                    Calculate Estimate
                  </button>

                  {autoResult !== null && (
                    <div className="mt-6 p-4 sm:p-6 bg-green-50 border border-green-200 rounded-xl">
                      <div className="text-center">
                        <p className="text-green-700 text-sm font-medium mb-1">Estimated Annual Premium</p>
                        <p className="text-3xl sm:text-4xl font-bold text-green-600">${autoResult.toLocaleString()}</p>
                        <p className="text-green-600 text-xs mt-2">*This is an estimate. Actual rates may vary.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'home' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Home className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Home Insurance Estimator</h2>
                      <p className="text-slate-600 text-sm">Calculate coverage costs for your property</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Home Value ($)</label>
                      <input
                        type="number"
                        placeholder="300000"
                        value={homeState.homeValue}
                        onChange={(e) => setHomeState({ ...homeState, homeValue: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Deductible ($)</label>
                      <select
                        value={homeState.deductible}
                        onChange={(e) => setHomeState({ ...homeState, deductible: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value={500}>$500</option>
                        <option value={1000}>$1,000</option>
                        <option value={2500}>$2,500</option>
                        <option value={5000}>$5,000</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Location Type</label>
                      <select
                        value={homeState.location}
                        onChange={(e) => setHomeState({ ...homeState, location: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="suburban">Suburban</option>
                        <option value="urban">Urban</option>
                        <option value="rural">Rural</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Home Age</label>
                      <select
                        value={homeState.homeAge}
                        onChange={(e) => setHomeState({ ...homeState, homeAge: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="new">Less than 10 years</option>
                        <option value="medium">10-30 years</option>
                        <option value="old">More than 30 years</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    onClick={calculateHome}
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                  >
                    <Calculator className="w-5 h-5" />
                    Calculate Estimate
                  </button>

                  {homeResult !== null && (
                    <div className="mt-6 p-4 sm:p-6 bg-green-50 border border-green-200 rounded-xl">
                      <div className="text-center">
                        <p className="text-green-700 text-sm font-medium mb-1">Estimated Annual Premium</p>
                        <p className="text-3xl sm:text-4xl font-bold text-green-600">${homeResult.toLocaleString()}</p>
                        <p className="text-green-600 text-xs mt-2">*This is an estimate. Actual rates may vary.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'life' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Life Insurance Calculator</h2>
                      <p className="text-slate-600 text-sm">Determine your coverage needs</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Annual Income ($)</label>
                      <input
                        type="number"
                        placeholder="50000"
                        value={lifeState.income}
                        onChange={(e) => setLifeState({ ...lifeState, income: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Your Age</label>
                      <input
                        type="number"
                        placeholder="35"
                        value={lifeState.age}
                        onChange={(e) => setLifeState({ ...lifeState, age: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Dependents</label>
                      <input
                        type="number"
                        placeholder="2"
                        value={lifeState.dependents}
                        onChange={(e) => setLifeState({ ...lifeState, dependents: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Total Debts ($)</label>
                      <input
                        type="number"
                        placeholder="100000"
                        value={lifeState.debts}
                        onChange={(e) => setLifeState({ ...lifeState, debts: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={calculateLife}
                    className="w-full bg-violet-600 text-white py-3 rounded-xl font-bold hover:bg-violet-700 transition flex items-center justify-center gap-2"
                  >
                    <Calculator className="w-5 h-5" />
                    Calculate Coverage Needed
                  </button>

                  {lifeResult !== null && (
                    <div className="mt-6 p-4 sm:p-6 bg-violet-50 border border-violet-200 rounded-xl">
                      <div className="text-center">
                        <p className="text-violet-700 text-sm font-medium mb-1">Recommended Coverage Amount</p>
                        <p className="text-3xl sm:text-4xl font-bold text-violet-600">${lifeResult.toLocaleString()}</p>
                        <p className="text-violet-600 text-xs mt-2">*Based on income replacement + debts + dependent needs</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  These calculators provide estimates only. Actual insurance premiums vary based on many factors including your specific location, 
                  credit history, claims history, and individual insurer underwriting criteria. Get actual quotes from licensed agents for accurate pricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Tools */}
      <section className="py-10 sm:py-12 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 text-center">More Insurance Resources</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: FileText, title: 'Coverage Checklist', desc: 'Ensure you have adequate protection', link: '/guides' },
              { icon: TrendingUp, title: 'Rate Comparison', desc: 'Compare rates across providers', link: '/compare' },
              { icon: Shield, title: 'State Requirements', desc: 'Minimum coverage by state', link: '/states' },
              { icon: Building2, title: 'Company Reviews', desc: 'Read ratings and reviews', link: '/resources' },
            ].map((resource) => (
              <Link 
                key={resource.title}
                href={resource.link}
                className="group p-4 sm:p-5 bg-slate-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition"
              >
                <resource.icon className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">{resource.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm">{resource.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Get Real Quotes Now</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto text-sm sm:text-base">
            Compare actual rates from 120+ top-rated insurance providers in your area.
          </p>
          <Link 
            href="/get-quote" 
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-bold hover:bg-blue-50 transition text-sm sm:text-base"
          >
            Compare Quotes
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer insuranceTypes={[]} />
    </div>
  );
}
