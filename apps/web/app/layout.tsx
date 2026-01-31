import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { OrganizationSchema, WebsiteSchema } from '@/components/SchemaMarkup'
import Providers from '@/components/Providers'
import { prisma } from '@/lib/prisma'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myinsurancebuddies.com';

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: 'MyInsuranceBuddies - Your Guide to Finding the Best Insurance',
        template: '%s | MyInsuranceBuddies',
    },
    description: 'Expert insurance guides, tips, and insights to help you make informed decisions about your coverage. Compare rates, find deals, and get personalized recommendations.',
    keywords: ['insurance', 'insurance guide', 'insurance tips', 'insurance comparison', 'auto insurance', 'health insurance', 'home insurance', 'life insurance'],
    authors: [{ name: 'MyInsuranceBuddies' }],
    creator: 'MyInsuranceBuddies',
    publisher: 'MyInsuranceBuddies',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/icon.svg', type: 'image/svg+xml' },
        ],
        shortcut: ['/favicon.ico'],
        apple: [
            { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        other: [
            { rel: 'mask-icon', url: '/icon.svg', color: '#3B82F6' },
        ],
    },
    manifest: '/site.webmanifest',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: baseUrl,
        siteName: 'MyInsuranceBuddies',
        title: 'MyInsuranceBuddies - Your Guide to Finding the Best Insurance',
        description: 'Expert insurance guides, tips, and insights to help you make informed decisions about your coverage.',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MyInsuranceBuddies - Your Guide to Finding the Best Insurance',
        description: 'Expert insurance guides, tips, and insights to help you make informed decisions about your coverage.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: baseUrl,
    },
    verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
        other: {
            'msvalidate.01': process.env.BING_SITE_VERIFICATION || '',
        },
    },
}

async function getAnalyticsId() {
    try {
        const settings = await prisma.siteSettings.findFirst();
        return settings?.googleAnalyticsId || null;
    } catch (error) {
        console.error('Failed to fetch analytics ID:', error);
        return null;
    }
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const gaId = await getAnalyticsId();

    return (
        <html lang="en">
            <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
                <Providers>
                    <GoogleAnalytics gaId={gaId} />
                    <OrganizationSchema />
                    <WebsiteSchema />
                    {children}
                </Providers>
            </body>
        </html>
    )
}
