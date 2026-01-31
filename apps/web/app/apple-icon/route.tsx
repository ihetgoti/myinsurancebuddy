import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
    return new ImageResponse(
        (
            <svg width="180" height="180" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="main" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0EA5E9"/>
                        <stop offset="50%" stopColor="#3B82F6"/>
                        <stop offset="100%" stopColor="#6366F1"/>
                    </linearGradient>
                    <linearGradient id="buddy" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981"/>
                        <stop offset="100%" stopColor="#06B6D4"/>
                    </linearGradient>
                </defs>
                <rect width="48" height="48" rx="10" fill="#1e293b"/>
                {/* Main Shield */}
                <path d="M20 8L8 12V20C8 28 13 35 20 38C27 35 32 28 32 20V12L20 8Z" fill="url(#main)"/>
                {/* Buddy Shield */}
                <path d="M36 14L28 17V23C28 29 32 34 36 36C40 34 44 29 44 23V17L36 14Z" fill="url(#buddy)"/>
                {/* Checkmarks */}
                <path d="M14 20L18 24L26 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M32 22L34.5 24.5L39 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
        { width: 180, height: 180 }
    );
}
