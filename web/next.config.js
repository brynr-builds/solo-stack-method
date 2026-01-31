/** @type {import('next').NextConfig} */
const nextConfig = {
  /* 
   * DEV NOTES:
   * - Why: Next.js 14 with App Router for hybrid static/dynamic rendering
   * - Phase 1: Basic config, no advanced features
   * - Phase 2+: Add rewrites, redirects, middleware for auth
   */
  output: 'standalone',
  images: {
    unoptimized: true, // For Netlify static export
  },
}

module.exports = nextConfig
