/** @type {import('next').NextConfig} */
const nextConfig = {
    // https://www.freecodecamp.org/news/how-to-deploy-next-js-app-to-github-pages/
    basePath: "/pwa-offline-music-vc",
    output: "export",  // <=== enables static exports

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
  