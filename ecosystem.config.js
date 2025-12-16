module.exports = {
    apps: [
        {
            name: 'web',
            script: 'npm',
            args: 'start',
            cwd: './apps/web',
            env: {
                PORT: 3000,
                NODE_ENV: 'production'
            }
        },
        {
            name: 'admin',
            script: 'npm',
            args: 'start',
            cwd: './apps/admin',
            env: {
                PORT: 3001,
                NODE_ENV: 'production'
            }
        }
    ]
};

