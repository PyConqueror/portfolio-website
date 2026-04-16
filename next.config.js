import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const mediaCacheControlHeader = {
  key: 'Cache-Control',
  value: 'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400',
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 2592000,
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  async headers() {
    return [
      {
        source: '/media/:path*',
        headers: [mediaCacheControlHeader],
      },
      {
        source: '/api/media/:path*',
        headers: [mediaCacheControlHeader],
      },
      {
        source: '/background.jpg',
        headers: [mediaCacheControlHeader],
      },
      {
        source: '/placeholder.svg',
        headers: [mediaCacheControlHeader],
      },
    ]
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
