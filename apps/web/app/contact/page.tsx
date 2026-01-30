'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageSquare, Clock, MapPin, HelpCircle, BookOpen, Info, Send, CheckCircle, Shield, Users, Headphones } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header insuranceTypes={[]} states={[]} />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-2xl mb-6">
                        <Headphones className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Get in Touch</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Our team of licensed insurance experts is here to help you find the perfect coverage.
                    </p>
                </div>
            </section>

            {/* Trust Indicators */}
            <section className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-600" />
                            <span>Licensed in All 50 States</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            <span>8M+ Customers Served</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-600" />
                            <span>24/7 Support Available</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Options Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">How Can We Help?</h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Choose your preferred way to reach us. Our team typically responds within 24 hours.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-16">
                            {/* Phone */}
                            <a
                                href="tel:1-855-205-2412"
                                className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Phone className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Call Us</h3>
                                <p className="text-2xl font-bold text-blue-600 mb-2">1-855-205-2412</p>
                                <p className="text-sm text-slate-500 mb-4">Speak directly with an insurance expert</p>
                                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                    <Clock className="w-4 h-4" />
                                    <span>Available 24/7</span>
                                </div>
                            </a>

                            {/* Text */}
                            <a
                                href="sms:1-855-627-3925"
                                className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Text Us</h3>
                                <p className="text-2xl font-bold text-purple-600 mb-2">1-855-627-3925</p>
                                <p className="text-sm text-slate-500 mb-4">Get quick answers via text message</p>
                                <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                                    <Clock className="w-4 h-4" />
                                    <span>Avg. response: 5 minutes</span>
                                </div>
                            </a>

                            {/* Email */}
                            <a
                                href="mailto:support@myinsurancebuddies.com"
                                className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Mail className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
                                <p className="text-lg font-bold text-teal-600 mb-2 break-all">support@myinsurancebuddies.com</p>
                                <p className="text-sm text-slate-500 mb-4">Detailed inquiries & documentation</p>
                                <div className="flex items-center gap-2 text-sm text-teal-600 font-medium">
                                    <Clock className="w-4 h-4" />
                                    <span>Response within 24 hours</span>
                                </div>
                            </a>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid lg:grid-cols-5 gap-8">

                            {/* Contact Form */}
                            <div className="lg:col-span-3">
                                <div className="bg-white rounded-2xl border border-slate-200 p-8">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Send Us a Message</h2>
                                    <p className="text-slate-600 mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>

                                    {submitted ? (
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <CheckCircle className="w-10 h-10 text-green-600" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Message Sent Successfully!</h3>
                                            <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                                Thank you for reaching out. One of our insurance experts will get back to you within 24 hours.
                                            </p>
                                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                                <button
                                                    onClick={() => {
                                                        setSubmitted(false);
                                                        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                                                    }}
                                                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                                                >
                                                    Send Another Message
                                                </button>
                                                <Link
                                                    href="/"
                                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                                                >
                                                    Back to Home
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
                                                        placeholder="John Smith"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
                                                        placeholder="john@example.com"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
                                                        placeholder="(555) 123-4567"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Topic *</label>
                                                    <select
                                                        required
                                                        value={formData.subject}
                                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
                                                    >
                                                        <option value="">Select a topic</option>
                                                        <option value="quote">Help with my quote</option>
                                                        <option value="coverage">Coverage questions</option>
                                                        <option value="claims">Claims assistance</option>
                                                        <option value="policy">Existing policy inquiry</option>
                                                        <option value="billing">Billing & payments</option>
                                                        <option value="technical">Technical support</option>
                                                        <option value="feedback">Feedback & suggestions</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Message *</label>
                                                <textarea
                                                    required
                                                    rows={5}
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition resize-none"
                                                    placeholder="Tell us how we can help you..."
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        <span>Sending...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5" />
                                                        <span>Send Message</span>
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Office Location */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                        Our Office
                                    </h3>
                                    <address className="not-italic text-slate-600 leading-relaxed">
                                        <strong className="text-slate-900">MyInsuranceBuddies HQ</strong><br />
                                        123 Insurance Way, Suite 400<br />
                                        Austin, TX 78701<br />
                                        United States
                                    </address>
                                </div>

                                {/* Business Hours */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-green-600" />
                                        Business Hours
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Phone Support:</span>
                                            <span className="text-green-600 font-semibold">24/7</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Chat Support:</span>
                                            <span className="text-slate-900 font-medium">8am - 10pm CT</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Email Response:</span>
                                            <span className="text-slate-900 font-medium">Within 24 hours</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
                                    <h3 className="text-lg font-bold mb-4">Quick Resources</h3>
                                    <div className="space-y-3">
                                        <Link
                                            href="/faq"
                                            className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
                                        >
                                            <HelpCircle className="w-5 h-5 text-blue-400" />
                                            <div>
                                                <div className="font-medium">FAQs</div>
                                                <div className="text-xs text-slate-400">Common questions answered</div>
                                            </div>
                                        </Link>
                                        <Link
                                            href="/guides"
                                            className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
                                        >
                                            <BookOpen className="w-5 h-5 text-green-400" />
                                            <div>
                                                <div className="font-medium">Insurance Guides</div>
                                                <div className="text-xs text-slate-400">Learn about coverage options</div>
                                            </div>
                                        </Link>
                                        <Link
                                            href="/about"
                                            className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
                                        >
                                            <Info className="w-5 h-5 text-purple-400" />
                                            <div>
                                                <div className="font-medium">About Us</div>
                                                <div className="text-xs text-slate-400">Learn about our mission</div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map or Additional Info */}
            <section className="py-16 bg-white border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">We're Here to Help</h2>
                        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                            At MyInsuranceBuddies, we believe finding the right insurance shouldn't be complicated.
                            Our team of licensed agents is dedicated to helping you navigate your options and find
                            coverage that fits your needs and budget.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 bg-slate-50 rounded-xl">
                                <div className="text-3xl font-bold text-blue-600 mb-2">120+</div>
                                <div className="text-sm text-slate-600">Insurance Partners</div>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-xl">
                                <div className="text-3xl font-bold text-blue-600 mb-2">4.8/5</div>
                                <div className="text-sm text-slate-600">Customer Rating</div>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-xl">
                                <div className="text-3xl font-bold text-blue-600 mb-2">$867</div>
                                <div className="text-sm text-slate-600">Avg. Annual Savings</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={[]} />
        </div>
    );
}
