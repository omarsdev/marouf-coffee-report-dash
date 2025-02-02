module.exports = {
  apps: [
    {
      name: 'Vudedale-MaroufDashboard',
      script: 'npm',
      args: 'run dev',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
