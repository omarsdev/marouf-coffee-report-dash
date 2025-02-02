module.exports = {
  apps: [
    {
      name: 'ORKABIT',
      script: 'npm',
      args: 'start',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
