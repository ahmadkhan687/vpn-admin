/** @type {import('next').NextConfig} */
const nextConfig = {}

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
})

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true', // Enable analysis when ANALYZE=true
  openAnalyzer: true, // Automatically open the report in a browser
})

module.exports = withBundleAnalyzer(
  withPWA({
    reactStrictMode: true,
    transpilePackages: ['@mui/x-charts'],
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'ipgeolocation.io',
          pathname: '/static/flags/**', // Adjusts for images in the `/static/flags/` path
        },
      ],
    },
  })
)
