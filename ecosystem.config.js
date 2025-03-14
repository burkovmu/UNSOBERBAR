module.exports = {
  apps: [
    {
      name: 'restbar',
      script: 'npm',
      args: 'start',
      watch: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      exp_backoff_restart_delay: 100,
      max_restarts: 10
    }
  ]
}; 