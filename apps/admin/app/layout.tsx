'use client';

import './globals.css'
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-slate-50 text-slate-900`}>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </body>
        </html>
    )
}
