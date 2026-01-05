/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure static files are properly served
  staticPageGenerationTimeout: 60
};

module.exports = nextConfig;


