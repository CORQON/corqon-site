/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimize for mobile performance
  compress: true,
  poweredByHeader: false,
  // Ensure proper mobile rendering
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig

