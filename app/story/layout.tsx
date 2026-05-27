import type { Metadata } from 'next'
import { BreadcrumbLd, WebPageLd } from '@/components/seo/JsonLd'

const SITE = 'https://4mboatlakecomo.com'

export const metadata: Metadata = {
  title: 'Our Story — Private Boat Tours on Lake Como',
  description:
    'Discover the story of 4M Luxury Boats and Lake Como seen from the water: historic villas, medieval villages, alpine landscapes. Every private tour is a unique experience.',
  alternates: { canonical: '/story' },
  openGraph: {
    title: 'Our Story — Private Boat Tours on Lake Como | 4M Luxury Boats',
    description:
      'A visual journey on Lake Como: Villa Pliniana, Villa Oleandra, Nesso, Varenna. Private boat tours with 4M Luxury Boats.',
    url: `${SITE}/story`,
    type: 'article',
    locale: 'en_US',
    images: [
      {
        url: `${SITE}/images/story-1.jpg`,
        width: 1200,
        height: 630,
        alt: 'Lake Como seen from the water — 4M Luxury Boats private boat tours',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Story — Private Boat Tours on Lake Como | 4M Luxury Boats',
    description: 'Historic villas, villages and alpine landscapes on Lake Como by private boat.',
    images: [`${SITE}/images/story-1.jpg`],
  },
}

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = [
    { name: 'Home', url: SITE },
    { name: 'Our Story', url: `${SITE}/story` },
  ] as const
  return (
    <>
      <BreadcrumbLd items={breadcrumb} />
      <WebPageLd
        type="AboutPage"
        name="Our Story — Private Boat Tours on Lake Como | 4M Luxury Boats"
        description="Discover the story of 4M Luxury Boats and Lake Como seen from the water: historic villas, medieval villages, alpine landscapes."
        url={`${SITE}/story`}
        breadcrumb={breadcrumb}
      />
      {/* Visually hidden H1 for SEO and accessibility */}
      <h1 className="sr-only">Our Story — Private Boat Tours on Lake Como</h1>
      {children}
    </>
  )
}
