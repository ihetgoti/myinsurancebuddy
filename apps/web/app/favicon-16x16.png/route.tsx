import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
    return new ImageResponse(
        (
            <svg width="16" height="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="main" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0EA5E9"/>
                        <stop offset="50%" stopColor="#3B82F6"/>
                        <stop offset="100%" stopColor="#6366F1"/>
                    </linearGradient>
                </defs>
                <path d="M24 4L6 11V22C6 34.15 13.8 44.6 24 48C34.2 44.6 42 34.15 42 22V11L24 4Z" fill="url(#main)"/>
                <path d="M17 24L22 29L31 19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
        { width: 16, height: 16 }
    );
}
