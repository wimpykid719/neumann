/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'lh*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: process.env.BIZRANK_BUCKET_DOMAIN,
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.st-note.com',
        port: '',
        pathname: '/production/uploads/images/**',
      },
    ],
  },
  output: 'standalone',
};

export default nextConfig;
