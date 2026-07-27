import type { NextConfig } from 'next'

const useCDN = !!process.env.NEXT_PUBLIC_MEDIA_URL

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: useCDN
    ? {
        loader: 'custom',
        loaderFile: './lib/cf-image-loader.ts',
      }
    : {
        formats: ['image/avif', 'image/webp'],
        qualities: [75, 80, 85, 90, 95],
        deviceSizes: [375, 640, 750, 828, 1080, 1200, 1440, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24 * 365,
      },

  experimental: {
    optimizePackageImports: ['framer-motion', 'lenis', 'clsx'],
  },

  async headers() {
    return [
      {
        source: '/(.*)\\.(jpg|jpeg|png|webp|avif|svg|ico|woff|woff2|mp4|webm)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          // CSP: solo le direttive a rischio-zero di rottura per un sito marketing.
          // ponytail: niente script-src — con GA + Meta Pixel + gli inline script di Next
          //           servirebbe 'unsafe-inline' (protezione quasi nulla) o i nonce via middleware.
          //           Aggiungilo quando il sito accetterà contenuto di terzi, testandolo prima in staging.
          {
            key: 'Content-Security-Policy',
            value: [
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "object-src 'none'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },
}

export default nextConfig
