'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, X, ArrowRight } from 'lucide-react';

interface LocationData {
    city: string;
    region: string;
    region_code: string;
    displayName?: string;
    type?: string;
    targetUrl?: string;
}

export default function UserLocationBanner() {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user dismissed it previously
        const dismissed = localStorage.getItem('mib_location_banner_dismissed');
        if (dismissed) return;

        // Check for cached location
        const cached = localStorage.getItem('mib_user_location');
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                // Check if stale (older than 24h)
                if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
                    setLocation(parsed.data);
                    setIsVisible(true);
                    return;
                }
            } catch (e) {
                // Invalid cache
            }
        }

        // Fetch location
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(async (data) => {
                if (data.region && data.country_code === 'US') {
                    // Resolve best URL
                    try {
                        const params = new URLSearchParams({
                            city: data.city,
                            region: data.region,
                            region_code: data.region_code,
                            country_code: data.country_code
                        });

                        const resolveRes = await fetch(`/api/location/resolve?${params}`);
                        const resolveData = await resolveRes.json();

                        const locData = {
                            city: data.city,
                            region: data.region,
                            region_code: data.region_code,
                            targetUrl: resolveData.url,
                            displayName: resolveData.name || data.region,
                            type: resolveData.type || 'STATE'
                        };

                        setLocation(locData);
                        setIsVisible(true);

                        // Cache it
                        localStorage.setItem('mib_user_location', JSON.stringify({
                            data: locData,
                            timestamp: Date.now()
                        }));
                    } catch (e) {
                        console.error('Failed to resolve location URL', e);
                    }
                }
            })
            .catch(err => console.error('Failed to get location', err));
    }, []);

    const dismiss = () => {
        setIsVisible(false);
        localStorage.setItem('mib_location_banner_dismissed', 'true');
    };

    if (!isVisible || !location) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full animate-fade-in-up">
            <div className="bg-white rounded-lg shadow-xl border border-blue-100 p-4 relative">
                <button
                    onClick={dismiss}
                    className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                >
                    <X size={16} />
                </button>

                <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-full text-blue-600 mt-1">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 mb-1">
                            Shopping for Insurance in {location.displayName}?
                        </h3>
                        <p className="text-sm text-slate-500 mb-3">
                            {location.type === 'CITY'
                                ? `We have specialized guides and local rates for ${location.city}.`
                                : `We have specialized guides and rate comparisons for ${location.region}.`
                            }
                        </p>
                        <Link
                            href={location.targetUrl || '/states'}
                            className="inline-flex items-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors shadow-sm"
                        >
                            View {location.displayName} Rates
                            <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
