'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={[]} states={[]} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Contact Us</h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Have questions? We're here to help 24/7.
                    </p>
                </div>
            </section>

            {/* Contact Options */}
            <section className="py-12 bg-slate-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <a href="tel:1-855-205-2412" className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition text-center group">
                            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-600 transition">
                                <svg className="w-7 h-7 text-teal-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">Call Us</h3>
                            <p className="text-teal-600 font-semibold">1-855-205-2412</p>
                            <p className="text-xs text-slate-500 mt-1">Available 24/7</p>
                        </a>

                        <a href="sms:1-855-627-3925" className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition text-center group">
                            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-600 transition">
                                <svg className="w-7 h-7 text-teal-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">Text Us</h3>
                            <p className="text-teal-600 font-semibold">1-855-627-3925</p>
                            <p className="text-xs text-slate-500 mt-1">Quick responses</p>
                        </a>

                        <a href="mailto:support@insurancebuddies.com" className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition text-center group">
                            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-600 transition">
                                <svg className="w-7 h-7 text-teal-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">Email Us</h3>
                            <p className="text-teal-600 font-semibold">support@insurancebuddies.com</p>
                            <p className="text-xs text-slate-500 mt-1">Response within 24 hours</p>
                        </a>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Send Us a Message</h2>

                        {submitted ? (
                            <div className="text-center py-12 bg-slate-50 rounded-xl">
                                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">Message Sent!</h3>
                                <p className="text-slate-600 mb-6">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                                <Link href="/" className="text-teal-600 font-semibold hover:text-teal-700">
                                    ← Back to Home
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                                    <select
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    >
                                        <option value="">Select a topic</option>
                                        <option value="quote">Help with my quote</option>
                                        <option value="policy">Question about my policy</option>
                                        <option value="technical">Technical issue</option>
                                        <option value="feedback">Feedback</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-teal-600 text-white py-4 rounded-xl font-semibold hover:bg-teal-700 transition"
                                >
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* FAQ Quick Links */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Looking for Quick Answers?</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <Link href="/faq" className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition">
                                <h3 className="font-bold text-slate-900 mb-2">FAQ</h3>
                                <p className="text-sm text-slate-600">Common questions answered</p>
                            </Link>
                            <Link href="/guides" className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition">
                                <h3 className="font-bold text-slate-900 mb-2">Guides</h3>
                                <p className="text-sm text-slate-600">Learn about insurance</p>
                            </Link>
                            <Link href="/about#how-it-works" className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition">
                                <h3 className="font-bold text-slate-900 mb-2">How It Works</h3>
                                <p className="text-sm text-slate-600">Our comparison process</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={[]} />
        </div>
    );
}
