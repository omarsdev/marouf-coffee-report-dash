module.exports = {
  apps: [
    {
      name: 'Vudedale-MaroufDashboard',
      script: 'npm',
      args: 'dev',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
