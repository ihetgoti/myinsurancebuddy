/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Only use basePath in production, not local dev
    ...(process.env.NODE_ENV === 'production' && { basePath: '/admin' }),
}

module.exports = nextConfig
