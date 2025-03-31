module.exports = {
  apps: [
    {
      name: 'unsoberbar',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      watch: false,
      autorestart: true,
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
  ],
}; 