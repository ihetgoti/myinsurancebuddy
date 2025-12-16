'use client';

import './globals.css'
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Use basePath in production to match Next.js config
    const basePath = process.env.NODE_ENV === 'production' ? '/admin' : '';

    return (
        <html lang="en">
            <body>
                <SessionProvider basePath={`${basePath}/api/auth`}>
                    {children}
                </SessionProvider>
            </body>
        </html>
    )
}

