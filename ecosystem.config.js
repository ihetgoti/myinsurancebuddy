module.exports = {
    apps: [
        {
            name: 'myinsurancebuddy-web',
            script: 'npm',
            args: 'run start',
            cwd: '/var/www/myinsurancebuddies.com/apps/web',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
                DATABASE_URL: 'postgresql://myuser:InsureBuddy2026!@localhost:5432/myinsurancebuddy?schema=public',
                NEXTAUTH_SECRET: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
                NEXTAUTH_URL: 'https://myinsurancebuddies.com',
                REVALIDATION_SECRET: 'super-secure-revalidation-token-2026',
                WEB_URL: 'http://localhost:3000'
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '500M'
        },
        {
            name: 'myinsurancebuddy-admin',
            script: '.next/standalone/apps/admin/server.js',
            cwd: '/var/www/myinsurancebuddies.com/apps/admin',
            env: {
                NODE_ENV: 'production',
                PORT: 3002,
                DATABASE_URL: 'postgresql://myuser:InsureBuddy2026!@localhost:5432/myinsurancebuddy?schema=public',
                NEXTAUTH_SECRET: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
                NEXTAUTH_URL: 'https://admin.myinsurancebuddies.com',
                REVALIDATION_SECRET: 'super-secure-revalidation-token-2026',
                WEB_URL: 'http://localhost:3000'
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '500M'
        }
    ]
};

