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
    default: '4M Luxury Boats — Tour Privati Barca Lago di Como',
    template: '%s | 4M Luxury Boats',
  },
  description:
    'Esperienze esclusive in barca sul Lago di Como. Tour privati e condivisi: aperitivo al tramonto, colazione a bordo, Villa Oleandra, Varenna. Prenota direttamente.',
  applicationName: '4M Luxury Boats',
  authors: [{ name: '4M Luxury Boats' }],
  generator: 'Next.js',
  keywords: [
    'tour barca lago di como',
    'noleggio barca privata como',
    'aperitivo in barca lago di como',
    'gita in barca como',
    'luxury boat lake como',
    'private boat tour lake como',
    'bootstour comer see',
    'villa oleandra tour barca',
    'colazione in barca como',
    'breakfast on board lake como',
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
    title: '4M Luxury Boats — Tour Privati Barca Lago di Como',
    description:
      'Esperienze esclusive in barca sul Lago di Como. Tour privati con o senza skipper, aperitivo al tramonto, Villa Oleandra.',
    url: SITE_URL,
    locale: 'it_IT',
    alternateLocale: ['en_US', 'de_DE'],
    images: [
      {
        url: '/images/hero-bg.webp',
        width: 1200,
        height: 630,
        alt: '4M Luxury Boats — Lago di Como',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '4M Luxury Boats — Tour Privati Barca Lago di Como',
    description: 'Esperienze esclusive in barca sul Lago di Como.',
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
    <html lang="it" suppressHydrationWarning>
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
        <LocalBusinessLd locale="it" />
      </head>
      <body suppressHydrationWarning>
        {/* Skip link accessibilità WCAG 2.1 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-gold focus:text-navy focus:rounded-lg focus:font-semibold focus:text-sm"
        >
          Vai al contenuto principale
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
