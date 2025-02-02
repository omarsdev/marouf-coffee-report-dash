module.exports = {
  apps: [
    {
      name: 'Vudedale-MaroufDashboard',
      script: 'npm',
      args: 'run start',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
