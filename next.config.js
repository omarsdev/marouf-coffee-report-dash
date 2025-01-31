const withImages = require('next-images')
require('raw-loader')

module.exports = withImages({
  webpack: (config) => {
    config.module.rules.push({
      test: /\.unityweb$/,
      use: 'raw-loader',
    })

    return config
  },
  images: {
    domains: ['vuedalesmallapps.s3.us-east-2.amazonaws.com', 'i.ibb.co'],
  },
})
