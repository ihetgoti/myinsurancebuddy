'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle, Shield, Clock, DollarSign } from 'lucide-react';

interface FallbackLeadFormProps {
  insuranceType?: string;
  state?: string;
  city?: string;
  onSubmit?: () => void;
}

/**
 * Fallback Lead Form
 * Shows when no Marketcall offer is available for this niche/location
 * Captures: Email, Phone, Zip Code
 */
export default function FallbackLeadForm({ 
  insuranceType = 'Insurance',
  state,
  city,
  onSubmit 
}: FallbackLeadFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    zip: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          phoneNumber: formData.phone,
          zipCode: formData.zip,
          insuranceType,
          state,
          city,
          source: 'fallback_form_no_offer',
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        onSubmit?.();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const locationText = city && state 
    ? `${city}, ${state}`
    : state 
    ? state 
    : 'your area';

  if (submitted) {
    return (
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-8 shadow-lg text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
        <p className="text-green-100">
          We&apos;ve received your information. An insurance agent will contact you shortly with personalized quotes for {locationText}.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">
          Get {insuranceType} Quotes
        </h3>
        <p className="text-blue-100">
          Sorry, we don&apos;t have an instant quote available for {locationText} yet. 
          Leave your details and we&apos;ll connect you with a local agent.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-blue-100 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-blue-100 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Zip Code */}
        <div>
          <label className="block text-sm font-medium text-blue-100 mb-1">
            ZIP Code
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              required
              pattern="[0-9]{5}"
              maxLength={5}
              value={formData.zip}
              onChange={(e) => setFormData({ ...formData, zip: e.target.value.replace(/\D/g, '') })}
              placeholder="12345"
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-400 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-blue-600 font-bold py-4 px-6 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Get My Free Quote
            </>
          )}
        </button>
      </form>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-blue-500/30 text-sm text-blue-100">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4" />
          <span>100% Secure</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>Response in 24h</span>
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-4 h-4" />
          <span>100% Free</span>
        </div>
      </div>

      {/* Privacy Note */}
      <p className="text-xs text-blue-200 text-center mt-4">
        By submitting, you agree to be contacted by licensed insurance agents. 
        Your information is secure and will never be sold.
      </p>
    </div>
  );
}
