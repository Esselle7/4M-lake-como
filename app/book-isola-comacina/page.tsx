// ─────────────────────────────────────────────────────────────────────────────
// /book-bellagio — dedicated page for the limited Bellagio fireworks package.
// BELLAGIO EVENT (remove after 2026-06-27) — also remove this file.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import BellagioHero from './BellagioHero'
import BellagioContent from './BellagioContent'
import { BreadcrumbLd, WebPageLd } from '@/components/seo/JsonLd'

const SITE = 'https://4mboatlakecomo.com'

export const metadata: Metadata = {
  title: 'Book Bellagio — Notte di Fuochi | 4M Luxury Boats',
  description:
    'Esperienza esclusiva per i fuochi d\'artificio di Bellagio sul Lago di Como, 27 giugno 2026. Skipper, carburante e due bottiglie di Moët & Chandon inclusi. €1.200 per barca privata.',
  alternates: { canonical: '/book-bellagio' },
  openGraph: {
    title: 'Book Bellagio — Notte di Fuochi | 4M Luxury Boats',
    description:
      'Esperienza esclusiva per i fuochi d\'artificio di Bellagio sul Lago di Como. Skipper, carburante e Moët & Chandon inclusi.',
    url: `${SITE}/book-bellagio`,
    type: 'website',
    locale: 'it_IT',
    images: [
      {
        url: `${SITE}/images/bellagio-fire.jpg`,
        width: 1200,
        height: 630,
        alt: 'Fuochi d\'artificio a Bellagio sul Lago di Como — 4M Luxury Boats',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Bellagio — Notte di Fuochi | 4M Luxury Boats',
    description: 'Fuochi d\'artificio di Bellagio sul Lago di Como. €1.200 barca privata, skipper e Moët & Chandon inclusi.',
    images: [`${SITE}/images/bellagio-fire.jpg`],
  },
  robots: { index: true, follow: true },
}

export default function BookBellagioPage() {
  const breadcrumb = [
    { name: 'Home', url: SITE },
    { name: 'Book Bellagio', url: `${SITE}/book-bellagio` },
  ] as const

  return (
    <main id="main-content" className="min-h-screen bg-white-warm">
      <BreadcrumbLd items={breadcrumb} />
      <WebPageLd
        type="WebPage"
        name="Book Bellagio — Notte di Fuochi | 4M Luxury Boats"
        description="Esperienza esclusiva per i fuochi d'artificio di Bellagio sul Lago di Como. Skipper, carburante e Moët & Chandon inclusi."
        url={`${SITE}/book-bellagio`}
        breadcrumb={breadcrumb}
      />
      {/* Wallpaper hero — top half of the page */}
      <BellagioHero />
      {/* Package description + quote form — bottom half */}
      <BellagioContent />
    </main>
  )
}
