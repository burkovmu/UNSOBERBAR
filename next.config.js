/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*'
      }
    ],
    domains: ['localhost', 'your-domain.com'],
    unoptimized: true
  },
  experimental: {
    turbo: {
      enabled: true
    }
  }
};

module.exports = nextConfig; 