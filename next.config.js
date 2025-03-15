/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*'
      }
    ],
    domains: ['localhost', 'your-domain.com', 'restaurant-xi-silk.vercel.app'],
    unoptimized: true
  },
  experimental: {
    turbo: {
      enabled: true
    }
  },
  // Добавляем перенаправление для изображений
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads_filtered/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 