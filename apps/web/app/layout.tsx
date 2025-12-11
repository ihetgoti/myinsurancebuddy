import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'MyInsuranceBuddies',
    description: 'Find the best insurance deals',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
