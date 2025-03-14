/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*'
      }
    ],
    domains: ['localhost']
  },
  experimental: {
    turbo: {
      enabled: true
    }
  }
};

module.exports = nextConfig; 