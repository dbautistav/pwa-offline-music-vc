/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // Enable service worker registration
    async headers() {
      return [
        {
          source: '/sw.js',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, must-revalidate',
            },
            {
              key: 'Service-Worker-Allowed',
              value: '/',
            },
          ],
        },
      ];
    },
  }
  
  module.exports = nextConfig
  