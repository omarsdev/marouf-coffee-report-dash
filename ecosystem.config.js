module.exports = {
  apps: [
    {
      name: 'Vudedale-MaroufDashboard',
      script: 'npm',
      args: 'start:prod',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
