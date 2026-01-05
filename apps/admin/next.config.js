/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    transpilePackages: ['@myinsurancebuddy/ui'],
    // No basePath needed - admin is served on subdomain admin.myinsurancebuddies.com
}

module.exports = nextConfig
