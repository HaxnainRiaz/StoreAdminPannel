/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      }
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production'
      ? 'https://store-backend-neon.vercel.app'
      : 'http://localhost:5000',
  },
};

export default nextConfig;
