// PM2 process file for non-container deployments.
module.exports = {
  apps: [
    {
      name: 'wealthtrack-worker',
      script: 'src/index.js',
      instances: 1,
      autorestart: true,
      max_memory_restart: '512M',
      env: { NODE_ENV: 'production', LOG_LEVEL: 'info' },
    },
  ],
};
