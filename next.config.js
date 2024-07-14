/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/your-first-run-path', // Replace this with your actual first run path
        permanent: false // Set to true if this is a permanent redirect
      }
    ]
  }
}
