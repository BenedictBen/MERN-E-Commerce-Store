// next.config.js
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Keep this false to catch type errors
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dp4dqtywa/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
  // Enable React Strict Mode
  reactStrictMode: true,
};

module.exports = nextConfig;