const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    transpilePackages: ['@myinsurancebuddy/ui'],

    experimental: {
        // Required for monorepo standalone builds - tells Next.js where to find dependencies
        outputFileTracingRoot: path.join(__dirname, '../../'),
    },

    // Prevent bundling Prisma - let it resolve at runtime (Next.js 14.x syntax)
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
}

module.exports = nextConfig
