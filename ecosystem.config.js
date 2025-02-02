module.exports = {
  apps: [
    {
      name: 'Vudedale-MaroufDashboard',
      script: 'npm',
      args: 'start',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
      interpreter: '/home/Mattia/.nvm/versions/node/v18.18.0/bin/node',
    },
  ],
}
