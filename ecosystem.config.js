module.exports = {
    apps: [
        {
            name: 'myinsurancebuddy-web',
            script: 'npm',
            args: 'run start',
            cwd: '/var/www/myinsurancebuddies.com/apps/web',
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '500M'
        },
        {
            name: 'myinsurancebuddy-admin',
            script: 'npm',
            args: 'run start',
            cwd: '/var/www/myinsurancebuddies.com/apps/admin',
            env: {
                NODE_ENV: 'production',
                PORT: 3001
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '500M'
        }
    ]
};
