/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.vercel-blob.com'], // Allow images from Vercel Blob
  },
  // Configure environment variables if needed
  env: {
    // Add your environment variables here once you have them
  },
};

module.exports = nextConfig; 