import type { Metadata } from 'next'
import BookingForm from '@/components/sections/BookingForm'
import { BreadcrumbLd, BookingPageFaqLd, WebPageLd } from '@/components/seo/JsonLd'

const SITE = 'https://4mboatlakecomo.com'

export const metadata: Metadata = {
  title: 'Prenota Tour in Barca Lago di Como',
  description:
    'Prenota il tuo tour privato in barca sul Lago di Como. Da €250. Scegli pacchetto, data e orario — conferma rapida via email o WhatsApp. Nessun pagamento online.',
  alternates: { canonical: '/booking' },
  openGraph: {
    title: 'Prenota Tour in Barca Lago di Como | 4M Luxury Boats',
    description:
      'Tour privati in barca sul Lago di Como da €250. Aperitivo, colazione, gite alle ville storiche. Risposta in poche ore.',
    url: `${SITE}/booking`,
    type: 'website',
    locale: 'it_IT',
    images: [
      {
        url: `${SITE}/images/hero-bg.jpg`,
        width: 1200,
        height: 630,
        alt: 'Prenota tour privato in barca sul Lago di Como — 4M Luxury Boats',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prenota Tour in Barca Lago di Como | 4M Luxury Boats',
    description: 'Tour privati in barca sul Lago di Como da €250. Conferma rapida.',
    images: [`${SITE}/images/hero-bg.jpg`],
  },
}

export default function BookingPage() {
  const breadcrumb = [
    { name: 'Home', url: SITE },
    { name: 'Prenotazione', url: `${SITE}/booking` },
  ] as const
  return (
    <main id="main-content" className="min-h-screen bg-white-warm">
      <BreadcrumbLd items={breadcrumb} />
      <WebPageLd
        type="WebPage"
        name="Prenota Tour in Barca Lago di Como | 4M Luxury Boats"
        description="Prenota il tuo tour privato in barca sul Lago di Como. Da €250. Scegli pacchetto, data e orario — conferma rapida via email o WhatsApp."
        url={`${SITE}/booking`}
        breadcrumb={breadcrumb}
      />
      <BookingPageFaqLd />
      <div className="pt-28" />
      <BookingForm />
    </main>
  )
}
