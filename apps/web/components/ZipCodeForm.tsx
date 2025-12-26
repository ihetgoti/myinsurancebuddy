'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ZipCodeForm() {
    const [zipCode, setZipCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (zipCode.length === 5) {
            setIsLoading(true);
            router.push(`/get-quote?zip=${zipCode}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex items-center bg-white rounded-full p-2 shadow-2xl shadow-black/20">
                <div className="flex-1 flex items-center gap-3 pl-4">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Enter your ZIP code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                        className="w-full py-2 text-slate-900 placeholder-slate-400 focus:outline-none text-lg"
                        maxLength={5}
                    />
                </div>
                <button
                    type="submit"
                    disabled={zipCode.length !== 5 || isLoading}
                    className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold px-8 py-3 rounded-full transition-all disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading
                        </span>
                    ) : (
                        'See My Quotes'
                    )}
                </button>
            </div>
        </form>
    );
}

