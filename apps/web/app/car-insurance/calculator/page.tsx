'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';

export default function CarInsuranceCalculatorPage() {
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

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={[]} states={[]} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Car Insurance Calculator
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Get an estimate of your car insurance costs based on your profile.
                    </p>
                </div>
            </section>

            {/* Calculator */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-8">Enter Your Details</h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                                        <input
                                            type="number"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Credit Score</label>
                                        <select
                                            value={formData.creditScore}
                                            onChange={(e) => setFormData({ ...formData, creditScore: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            <option value="excellent">Excellent (750+)</option>
                                            <option value="good">Good (700-749)</option>
                                            <option value="fair">Fair (650-699)</option>
                                            <option value="poor">Poor (below 650)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Driving Record</label>
                                        <select
                                            value={formData.drivingRecord}
                                            onChange={(e) => setFormData({ ...formData, drivingRecord: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            <option value="clean">Clean (no incidents)</option>
                                            <option value="ticket">1-2 tickets</option>
                                            <option value="accident">At-fault accident</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Coverage Type</label>
                                        <select
                                            value={formData.coverage}
                                            onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            <option value="minimum">State Minimum</option>
                                            <option value="standard">Standard</option>
                                            <option value="full">Full Coverage</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Deductible</label>
                                        <select
                                            value={formData.deductible}
                                            onChange={(e) => setFormData({ ...formData, deductible: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            <option value="250">$250</option>
                                            <option value="500">$500</option>
                                            <option value="1000">$1,000</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Annual Mileage</label>
                                        <input
                                            type="number"
                                            value={formData.annualMileage}
                                            onChange={(e) => setFormData({ ...formData, annualMileage: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            placeholder="12000"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={calculateEstimate}
                                    className="w-full mt-8 bg-teal-600 text-white py-4 rounded-xl font-semibold hover:bg-teal-700 transition"
                                >
                                    Calculate Estimate
                                </button>
                            </div>

                            {estimate && (
                                <div className="bg-slate-50 p-8 border-t border-slate-200">
                                    <div className="text-center">
                                        <p className="text-sm text-slate-500 mb-2">Estimated Monthly Premium</p>
                                        <div className="text-5xl font-bold text-teal-600 mb-4">${estimate}/mo</div>
                                        <p className="text-sm text-slate-500 mb-6">
                                            This is an estimate. Get personalized quotes for accurate pricing.
                                        </p>
                                        <Link
                                            href="/get-quote"
                                            className="inline-block bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-700 transition"
                                        >
                                            Get Actual Quotes →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Factors */}
                        <div className="mt-16">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">Factors That Affect Your Rate</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { title: 'Age', desc: 'Younger and older drivers typically pay more.' },
                                    { title: 'Driving Record', desc: 'Accidents and tickets increase your premium.' },
                                    { title: 'Credit Score', desc: 'Better credit often means lower rates.' },
                                    { title: 'Coverage Level', desc: 'More coverage costs more, but protects you better.' },
                                    { title: 'Deductible', desc: 'Higher deductibles lower your monthly payment.' },
                                    { title: 'Annual Mileage', desc: 'More driving means more risk and higher rates.' },
                                ].map((factor, i) => (
                                    <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                                        <h3 className="font-bold text-slate-900 mb-2">{factor.title}</h3>
                                        <p className="text-sm text-slate-600">{factor.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={[]} />
        </div>
    );
}

