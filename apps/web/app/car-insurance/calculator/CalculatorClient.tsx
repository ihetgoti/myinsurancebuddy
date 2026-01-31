'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CalculatorClient() {
    const [formData, setFormData] = useState({
        age: '35',
        gender: 'male',
        maritalStatus: 'single',
        creditScore: 'good',
        drivingRecord: 'clean',
        coverage: 'full',
        deductible: '500',
        annualMileage: '12000',
    });

    const [estimate, setEstimate] = useState<number | null>(null);

    const calculateEstimate = () => {
        let base = 100;

        // Age factor
        const age = parseInt(formData.age);
        if (age < 25) base *= 1.5;
        else if (age > 65) base *= 1.2;
        else if (age >= 30 && age <= 50) base *= 0.9;

        // Gender (simplified)
        if (formData.gender === 'male' && parseInt(formData.age) < 25) base *= 1.1;

        // Credit score
        if (formData.creditScore === 'excellent') base *= 0.8;
        else if (formData.creditScore === 'poor') base *= 1.4;

        // Driving record
        if (formData.drivingRecord === 'accident') base *= 1.4;
        else if (formData.drivingRecord === 'ticket') base *= 1.2;

        // Coverage type
        if (formData.coverage === 'minimum') base *= 0.5;
        else if (formData.coverage === 'full') base *= 1.3;

        // Deductible
        if (formData.deductible === '1000') base *= 0.9;
        else if (formData.deductible === '250') base *= 1.1;

        // Mileage
        const mileage = parseInt(formData.annualMileage);
        if (mileage > 15000) base *= 1.1;
        else if (mileage < 8000) base *= 0.9;

        setEstimate(Math.round(base));
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <>
            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                        Car Insurance Calculator
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                        Get an estimate of your car insurance costs based on your driver profile and coverage needs.
                    </p>
                </div>
            </section>

            {/* Calculator */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                            <div className="p-4 sm:p-6 lg:p-8">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">Enter Your Details</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Age</label>
                                        <input
                                            type="number"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                            placeholder="25"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Gender</label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white"
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Credit Score</label>
                                        <select
                                            value={formData.creditScore}
                                            onChange={(e) => setFormData({ ...formData, creditScore: e.target.value })}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white"
                                        >
                                            <option value="excellent">Excellent (750+)</option>
                                            <option value="good">Good (700-749)</option>
                                            <option value="fair">Fair (650-699)</option>
                                            <option value="poor">Poor (below 650)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Driving Record</label>
                                        <select
                                            value={formData.drivingRecord}
                                            onChange={(e) => setFormData({ ...formData, drivingRecord: e.target.value })}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white"
                                        >
                                            <option value="clean">Clean (no incidents)</option>
                                            <option value="ticket">1-2 tickets</option>
                                            <option value="accident">At-fault accident</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Coverage Type</label>
                                        <select
                                            value={formData.coverage}
                                            onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white"
                                        >
                                            <option value="minimum">State Minimum</option>
                                            <option value="standard">Standard</option>
                                            <option value="full">Full Coverage</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Deductible</label>
                                        <select
                                            value={formData.deductible}
                                            onChange={(e) => setFormData({ ...formData, deductible: e.target.value })}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white"
                                        >
                                            <option value="250">$250</option>
                                            <option value="500">$500</option>
                                            <option value="1000">$1,000</option>
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Annual Mileage</label>
                                        <input
                                            type="number"
                                            value={formData.annualMileage}
                                            onChange={(e) => setFormData({ ...formData, annualMileage: e.target.value })}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                            placeholder="12000"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={calculateEstimate}
                                    className="w-full mt-6 sm:mt-8 bg-blue-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
                                >
                                    Calculate Estimate
                                </button>
                            </div>

                            {estimate && (
                                <div className="bg-slate-50 p-4 sm:p-6 lg:p-8 border-t border-slate-200">
                                    <div className="text-center">
                                        <p className="text-xs sm:text-sm text-slate-500 mb-1 sm:mb-2">Estimated Monthly Premium</p>
                                        <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-3 sm:mb-4">{formatCurrency(estimate)}/mo</div>
                                        <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">
                                            This is an estimate. Get personalized quotes for accurate pricing.
                                        </p>
                                        <Link
                                            href="/get-quote"
                                            className="inline-block bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
                                        >
                                            Get Actual Quotes →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Factors */}
                        <div className="mt-12 sm:mt-16">
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">Factors That Affect Your Rate</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {[
                                    { title: 'Age', desc: 'Younger and older drivers typically pay more due to higher risk profiles.', icon: '👤' },
                                    { title: 'Driving Record', desc: 'Accidents and tickets increase your premium significantly.', icon: '🚗' },
                                    { title: 'Credit Score', desc: 'Better credit often means lower rates in most states.', icon: '💳' },
                                    { title: 'Coverage Level', desc: 'More coverage costs more, but protects you better in accidents.', icon: '🛡️' },
                                    { title: 'Deductible', desc: 'Higher deductibles lower your monthly payment but increase out-of-pocket costs.', icon: '💰' },
                                    { title: 'Annual Mileage', desc: 'More driving means more risk and higher rates.', icon: '📍' },
                                ].map((factor, i) => (
                                    <div key={i} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200">
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl sm:text-2xl">{factor.icon}</span>
                                            <div>
                                                <h3 className="font-bold text-slate-900 mb-1 text-sm sm:text-base">{factor.title}</h3>
                                                <p className="text-xs sm:text-sm text-slate-600">{factor.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Average Rates by Age */}
                        <div className="mt-12 sm:mt-16">
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">Average Car Insurance Rates by Age</h2>
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-slate-900 text-sm">Age Group</th>
                                                <th className="text-center py-3 px-3 sm:py-4 sm:px-6 font-semibold text-slate-900 text-sm">Avg. Monthly Rate</th>
                                                <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-slate-900 text-sm">Risk Level</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { age: '16-19', rate: '$315', risk: 'Very High' },
                                                { age: '20-24', rate: '$184', risk: 'High' },
                                                { age: '25-29', rate: '$118', risk: 'Moderate' },
                                                { age: '30-49', rate: '$98', risk: 'Low' },
                                                { age: '50-64', rate: '$94', risk: 'Low' },
                                                { age: '65+', rate: '$108', risk: 'Moderate' },
                                            ].map((row, index) => (
                                                <tr key={row.age} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                                    <td className="py-3 px-3 sm:py-4 sm:px-6 font-medium text-slate-900 text-sm">{row.age}</td>
                                                    <td className="py-3 px-3 sm:py-4 sm:px-6 text-center font-bold text-blue-600 text-sm">{row.rate}</td>
                                                    <td className="py-3 px-3 sm:py-4 sm:px-6 text-sm">
                                                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                                            row.risk === 'Very High' ? 'bg-red-100 text-red-700' :
                                                            row.risk === 'High' ? 'bg-orange-100 text-orange-700' :
                                                            row.risk === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                            {row.risk}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Coverage Types Explained */}
                        <div className="mt-12 sm:mt-16">
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">Coverage Types Explained</h2>
                            <div className="space-y-4">
                                {[
                                    { 
                                        title: 'State Minimum', 
                                        desc: 'Meets your state\'s minimum legal requirements. Usually includes liability coverage only. Cheapest option but provides minimal protection.',
                                        avgCost: '$42-65/mo'
                                    },
                                    { 
                                        title: 'Standard Coverage', 
                                        desc: 'Includes liability plus collision and comprehensive coverage with moderate limits. Good balance of protection and cost.',
                                        avgCost: '$85-120/mo'
                                    },
                                    { 
                                        title: 'Full Coverage', 
                                        desc: 'Maximum protection including high liability limits, collision, comprehensive, and additional options like roadside assistance.',
                                        avgCost: '$125-180/mo'
                                    },
                                ].map((coverage, i) => (
                                    <div key={i} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">{coverage.title}</h3>
                                            <span className="inline-block self-start sm:self-auto px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                                {coverage.avgCost}
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-slate-600">{coverage.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-12 sm:mt-16 text-center">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8">
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Ready to Get Real Quotes?</h3>
                                <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base">
                                    Compare actual rates from 120+ insurance companies in minutes.
                                </p>
                                <Link 
                                    href="/get-quote" 
                                    className="inline-block bg-white text-blue-700 px-6 sm:px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition text-sm sm:text-base"
                                >
                                    Get Free Quotes Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
