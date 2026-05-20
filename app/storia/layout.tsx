import type { Metadata } from 'next'
import { BreadcrumbLd, WebPageLd } from '@/components/seo/JsonLd'

const SITE = 'https://4mboatlakecomo.com'

export const metadata: Metadata = {
  title: 'La Nostra Storia — Tour in Barca Lago di Como',
  description:
    'Scopri la storia di 4M Luxury Boats e il Lago di Como visto dall\'acqua: ville storiche, borghi medievali, paesaggi alpini. Ogni tour privato è un\'esperienza unica.',
  alternates: { canonical: '/storia' },
  openGraph: {
    title: 'La Nostra Storia — Tour in Barca Lago di Como | 4M Luxury Boats',
    description:
      'Il viaggio visivo sul Lago di Como: Villa Pliniana, Villa Oleandra, Nesso, Varenna. Tour privati in barca con 4M Luxury Boats.',
    url: `${SITE}/storia`,
    type: 'article',
    locale: 'it_IT',
    images: [
      {
        url: `${SITE}/images/story-1.jpg`,
        width: 1200,
        height: 630,
        alt: 'Lago di Como visto dall\'acqua — 4M Luxury Boats tour privati in barca',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Nostra Storia — Tour in Barca Lago di Como | 4M Luxury Boats',
    description: 'Ville storiche, borghi, paesaggi alpini sul Lago di Como in barca privata.',
    images: [`${SITE}/images/story-1.jpg`],
  },
}

export default function StoriaLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = [
    { name: 'Home', url: SITE },
    { name: 'La Nostra Storia', url: `${SITE}/storia` },
  ] as const
  return (
    <>
      <BreadcrumbLd items={breadcrumb} />
      <WebPageLd
        type="AboutPage"
        name="La Nostra Storia — Tour in Barca Lago di Como | 4M Luxury Boats"
        description="Scopri la storia di 4M Luxury Boats e il Lago di Como visto dall'acqua: ville storiche, borghi medievali, paesaggi alpini."
        url={`${SITE}/storia`}
        breadcrumb={breadcrumb}
      />
      {/* H1 visualmente nascosto per SEO e accessibilità — il design usa h2 nei pannelli */}
      <h1 className="sr-only">La Nostra Storia — Tour Privati in Barca sul Lago di Como</h1>
      {children}
    </>
  )
}
