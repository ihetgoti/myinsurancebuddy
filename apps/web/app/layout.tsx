import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { OrganizationSchema, WebsiteSchema } from '@/components/SchemaMarkup'
import Providers from '@/components/Providers'

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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
                <Providers>
                    <OrganizationSchema />
                    <WebsiteSchema />
                    {children}
                </Providers>
            </body>
        </html>
    )
}
