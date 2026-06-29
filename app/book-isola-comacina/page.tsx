// ─────────────────────────────────────────────────────────────────────────────
// /book-isola-comacina — dedicated page for the limited Isola Comacina fireworks package.
// ISOLA COMACINA EVENT (remove after 2026-06-27) — also remove this file.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import IsolaComacinaHero from './IsolaComacinaHero'
import IsolaComacinaContent from './IsolaComacinaContent'
import { BreadcrumbLd, WebPageLd } from '@/components/seo/JsonLd'

const SITE = 'https://4mboatlakecomo.com'

export const metadata: Metadata = {
  title: 'Book Isola Comacina — Notte di Fuochi | 4M Luxury Boats',
  description:
    'Esperienza esclusiva per i fuochi d\'artificio di Isola Comacina sul Lago di Como, 27 giugno 2026. Skipper, carburante e due bottiglie di Moët & Chandon inclusi. €1.200 per barca privata.',
  alternates: { canonical: '/book-isola-comacina' },
  openGraph: {
    title: 'Book Isola Comacina — Notte di Fuochi | 4M Luxury Boats',
    description:
      'Esperienza esclusiva per i fuochi d\'artificio di Isola Comacina sul Lago di Como. Skipper, carburante e Moët & Chandon inclusi.',
    url: `${SITE}/book-isola-comacina`,
    type: 'website',
    locale: 'it_IT',
    images: [
      {
        url: `${SITE}/images/bellagio-fire.jpg`,
        width: 1200,
        height: 630,
        alt: 'Fuochi d\'artificio a Isola Comacina sul Lago di Como — 4M Luxury Boats',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Isola Comacina — Notte di Fuochi | 4M Luxury Boats',
    description: 'Fuochi d\'artificio di Isola Comacina sul Lago di Como. €1.200 barca privata, skipper e Moët & Chandon inclusi.',
    images: [`${SITE}/images/bellagio-fire.jpg`],
  },
  // ISOLA COMACINA EVENT — noindex until next season. Set back to index:true to relaunch.
  robots: { index: false, follow: true },
}

export default function BookIsolaComacinaPage() {
  const breadcrumb = [
    { name: 'Home', url: SITE },
    { name: 'Book Isola Comacina', url: `${SITE}/book-isola-comacina` },
  ] as const

  return (
    <main id="main-content" className="min-h-screen bg-white-warm">
      <BreadcrumbLd items={breadcrumb} />
      <WebPageLd
        type="WebPage"
        name="Book Isola Comacina — Notte di Fuochi | 4M Luxury Boats"
        description="Esperienza esclusiva per i fuochi d'artificio di Isola Comacina sul Lago di Como. Skipper, carburante e Moët & Chandon inclusi."
        url={`${SITE}/book-isola-comacina`}
        breadcrumb={breadcrumb}
      />
      {/* Wallpaper hero — top half of the page */}
      <IsolaComacinaHero />
      {/* Package description + quote form — bottom half */}
      <IsolaComacinaContent />
    </main>
  )
}
