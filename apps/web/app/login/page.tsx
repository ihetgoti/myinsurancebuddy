'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={[]} states={[]} />

            <section className="py-20 bg-slate-50 min-h-[calc(100vh-104px)]">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                                <p className="text-slate-500">Enter your email to retrieve your saved quotes</p>
                            </div>

                            {isSubmitted ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-2">Check Your Email</h2>
                                    <p className="text-slate-600 mb-6">
                                        We've sent a link to <strong>{email}</strong> to access your saved quotes.
                                    </p>
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="text-teal-600 font-semibold hover:text-teal-700"
                                    >
                                        ← Use a different email
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition"
                                    >
                                        Get My Quotes
                                    </button>
                                </form>
                            )}

                            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                                <p className="text-sm text-slate-500 mb-4">New to InsuranceBuddies?</p>
                                <Link
                                    href="/get-quote"
                                    className="inline-block w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition"
                                >
                                    Get New Quotes
                                </Link>
                            </div>
                        </div>

                        <p className="text-center text-xs text-slate-400 mt-6">
                            By continuing, you agree to our{' '}
                            <Link href="/terms" className="text-teal-600 hover:underline">Terms of Service</Link>
                            {' '}and{' '}
                            <Link href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>
                        </p>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={[]} />
        </div>
    );
}

