module.exports = {
    apps: [
        {
            name: 'web',
            script: 'node',
            args: '.next/standalone/apps/web/server.js',
            cwd: './apps/web',
            env: {
                PORT: 3000,
                NODE_ENV: 'production',
                HOSTNAME: '0.0.0.0'
            }
        },
        {
            name: 'admin',
            script: 'node',
            args: '.next/standalone/apps/admin/server.js',
            cwd: './apps/admin',
            env: {
                PORT: 3001,
                NODE_ENV: 'production',
                HOSTNAME: '0.0.0.0'
            }
        }
    ]
};
