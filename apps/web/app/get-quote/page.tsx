'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import Link from 'next/link';

const insuranceOptions = [
    { id: 'auto', name: 'Auto Insurance', icon: '🚗' },
    { id: 'health', name: 'Health Insurance', icon: '🏥' },
    { id: 'home', name: 'Home Insurance', icon: '🏠' },
    { id: 'life', name: 'Life Insurance', icon: '💚' },
    { id: 'business', name: 'Business Insurance', icon: '🏢' },
];

export default function GetQuotePage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        insuranceType: '',
        zipCode: '',
        name: '',
        email: '',
        phone: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header insuranceTypes={[]} states={[]} />

            <section className="bg-slate-900 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Get Your Free Quote</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Compare rates from top providers in under 2 minutes.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        {submitted ? (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Quote Request Received!</h2>
                                <p className="text-slate-600 mb-8">
                                    Our team is finding the best rates for you. Expect a call within 15 minutes during business hours.
                                </p>
                                <Link href="/" className="text-blue-600 font-semibold hover:underline">
                                    Return to Home
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                                {/* Progress */}
                                <div className="flex items-center justify-between mb-8">
                                    {[1, 2, 3].map((s) => (
                                        <div key={s} className="flex items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                                {s}
                                            </div>
                                            {s < 3 && <div className={`w-16 md:w-24 h-1 mx-2 ${step > s ? 'bg-slate-900' : 'bg-slate-200'}`} />}
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {step === 1 && (
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900 mb-6">What type of insurance do you need?</h2>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {insuranceOptions.map((option) => (
                                                    <button
                                                        key={option.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({ ...formData, insuranceType: option.id });
                                                            setStep(2);
                                                        }}
                                                        className={`p-4 rounded-lg border-2 text-center transition-all ${formData.insuranceType === option.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}
                                                    >
                                                        <span className="text-2xl mb-2 block">{option.icon}</span>
                                                        <span className="text-sm font-medium text-slate-700">{option.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900 mb-6">Where are you located?</h2>
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    placeholder="Enter your ZIP code"
                                                    value={formData.zipCode}
                                                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-center text-xl tracking-widest"
                                                    maxLength={5}
                                                />
                                                <div className="flex gap-4">
                                                    <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition">
                                                        Back
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => formData.zipCode.length === 5 && setStep(3)}
                                                        disabled={formData.zipCode.length !== 5}
                                                        className="flex-1 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50"
                                                    >
                                                        Continue
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900 mb-6">Your Contact Information</h2>
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    placeholder="Full Name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                                    required
                                                />
                                                <input
                                                    type="email"
                                                    placeholder="Email Address"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                                    required
                                                />
                                                <input
                                                    type="tel"
                                                    placeholder="Phone Number"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                                    required
                                                />
                                                <div className="flex gap-4">
                                                    <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition">
                                                        Back
                                                    </button>
                                                    <button type="submit" className="flex-1 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition">
                                                        Get My Quotes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={[]} />
        </div>
    );
}
