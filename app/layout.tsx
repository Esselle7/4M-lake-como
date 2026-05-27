import type { Metadata, Viewport } from 'next'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import ClientLayout from '@/components/ClientLayout'
import { OrganizationLd, WebsiteLd, LocalBusinessLd } from '@/components/seo/JsonLd'

const SITE_URL = 'https://4mboatlakecomo.com'

export const viewport: Viewport = {
  themeColor: '#0A1628',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '4M Luxury Boats — Private Boat Tours on Lake Como',
    template: '%s | 4M Luxury Boats',
  },
  description:
    'Exclusive private boat tours on Lake Como. Sunset aperitivo, breakfast on board, Villa Oleandra, Varenna & more. Book directly — no middlemen.',
  applicationName: '4M Luxury Boats',
  authors: [{ name: '4M Luxury Boats' }],
  generator: 'Next.js',
  keywords: [
    'private boat tour lake como',
    'luxury boat rental lake como',
    'sunset aperitivo lake como',
    'breakfast on board lake como',
    'villa oleandra boat tour',
    'lake como experience',
    'boat tour como italy',
    'bootstour comer see',
    'private yacht lake como',
    'lake como day trip',
  ],
  alternates: {
    canonical: '/',
    languages: {
      'it-IT': '/',
      'en-US': '/',
      'de-DE': '/',
      'x-default': '/',
    },
  },
  openGraph: {
    type: 'website',
    siteName: '4M Luxury Boats',
    title: '4M Luxury Boats — Private Boat Tours on Lake Como',
    description:
      'Exclusive private boat tours on Lake Como. Sunset aperitivo, breakfast on board, Villa Oleandra & iconic shores. Book directly.',
    url: SITE_URL,
    locale: 'en_US',
    alternateLocale: ['it_IT', 'de_DE'],
    images: [
      {
        url: '/images/hero-bg.webp',
        width: 1200,
        height: 630,
        alt: '4M Luxury Boats — Lake Como',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '4M Luxury Boats — Private Boat Tours on Lake Como',
    description: 'Exclusive private boat tours on Lake Como. Sunset aperitivo, breakfast on board & more.',
    images: ['/images/hero-bg.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/images/logo-original-rounded.png',
    apple: '/images/logo-original-rounded.png',
  },
  category: 'travel',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Search Console verification */}
        <meta name="google-site-verification" content="hsfMPs_e8ZZ-JEcVyuHdHpATrlz6NqsVCsL9P8MedzQ" />
        {/* Preconnect per risorse critiche */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {process.env.NEXT_PUBLIC_MEDIA_URL && (
          <link
            rel="preconnect"
            href={process.env.NEXT_PUBLIC_MEDIA_URL}
            crossOrigin="anonymous"
          />
        )}
        {/* DNS prefetch per domini secondari */}
        <link rel="dns-prefetch" href="https://maps.google.com" />
        <link rel="dns-prefetch" href="https://api.whatsapp.com" />
        <link rel="dns-prefetch" href="https://wa.me" />
        {/* Geo meta per SEO locale Lago di Como */}
        <meta name="geo.region" content="IT-CO" />
        <meta name="geo.placename" content="Como, Lago di Como, Lombardia" />
        <meta name="geo.position" content="45.8108;9.0836" />
        <meta name="ICBM" content="45.8108, 9.0836" />
        {/* Schema.org JSON-LD */}
        <OrganizationLd />
        <WebsiteLd />
        <LocalBusinessLd locale="en" />
      </head>
      <body suppressHydrationWarning>
        {/* Skip link accessibilità WCAG 2.1 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-gold focus:text-navy focus:rounded-lg focus:font-semibold focus:text-sm"
        >
          Skip to main content
        </a>
        <LanguageProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  )
}
