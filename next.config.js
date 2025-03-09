/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.vercel-blob.com'], // Allow images from Vercel Blob
    unoptimized: process.env.NODE_ENV === 'development', // Only optimize in production
  },
  // Configure environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://your-vercel-app-url.vercel.app',
    MAX_UPLOAD_SIZE: process.env.MAX_UPLOAD_SIZE || 5 * 1024 * 1024, // 5MB default
  },
  // Production optimizations
  swcMinify: true,
  poweredByHeader: false,
  // Handle trailing slashes consistently
  trailingSlash: false,
  // TypeScript checking is now enabled
  typescript: {
    // Only warning for type errors, not failing build
    ignoreBuildErrors: false, 
  },
  // ESLint is now enabled
  eslint: {
    // Only warning for linting errors, not failing build
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig; 