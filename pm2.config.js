module.exports = {
    apps: [
        {
            name: '@template',
            script: './dist/main.js',
            args: 'start',
            cwd: 'app/path',
            instances: 1,
            exec_mode: 'fork',
            max_memory_restart: '1000M',
            autorestart: true,
            max_restarts: 10,
            restart_delay: 5000,
            wait_ready: false,
            listen_timeout: 30000,
            kill_timeout: 20000,
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            out_file: './logs/blue-out.log',
            error_file: './logs/blue-error.log',
            combine_logs: true,
            time: true,
        },
    ],
};
