const SITE = 'https://4mboatlakecomo.com'
const BUSINESS_NAME = '4M Luxury Boats'
const PHONE = process.env.NEXT_PUBLIC_PHONE || '+39 031 000 0000'
const EMAIL = 'info@4mboatlakecomo.com'
const DEPARTURE_LAT = 45.8108
const DEPARTURE_LNG = 9.0836
const DEPARTURE_ADDRESS = 'Lungo Lario Trieste'
const DEPARTURE_CITY = 'Como'
const DEPARTURE_REGION = 'Lombardia'
const DEPARTURE_POSTAL = '22100'
const DEPARTURE_COUNTRY = 'IT'

const PACKAGES = [
  { id: 'golden-hour',  name: 'Golden Hour',        price: 250, duration: 'PT1H',   desc: 'Private boat tour on Lake Como with Prosecco at sunset. 1 hour.' },
  { id: 'breakfast',    name: 'Breakfast on Board',  price: 300, duration: 'PT1H',   desc: 'Breakfast on board on Lake Como. Morning cruise 8:30–10:30.' },
  { id: 'aperitivo',    name: 'Aperitivo Tour',      price: 350, duration: 'PT1H30M',desc: 'Italian aperitivo at sunset on a private boat on Lake Como.' },
  { id: 'sushi',        name: 'Sushi Experience',    price: 380, duration: 'PT1H30M',desc: 'Premium sushi box and drinks on a panoramic cruise on Lake Como.' },
  { id: 'como-luxury',  name: 'Como Luxury',         price: 450, duration: 'PT2H',   desc: '2-hour tour: Villa Pliniana, Villa Oleandra (George Clooney), Nesso.' },
  { id: 'dolce-vita',   name: 'La Dolce Vita',       price: 800, duration: 'PT4H',   desc: 'Grand 4-hour tour: Isola Comacina and Varenna — the full Lake Como experience.' },
] as const

const SOCIAL_LINKS: string[] = [
   'https://www.instagram.com/4mlakecomo',
  // 'https://www.facebook.com/4mluxuryboats',
  // 'https://www.tripadvisor.it/4mluxuryboats',
]

function jsonLdScript(data: object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationLd() {
  return jsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE}#organization`,
    name: BUSINESS_NAME,
    url: SITE,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE}/images/logo.png`,
      width: 200,
      height: 80,
    },
    image: `${SITE}/images/hero-bg.webp`,
    telephone: PHONE,
    email: EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: DEPARTURE_ADDRESS,
      addressLocality: DEPARTURE_CITY,
      addressRegion: DEPARTURE_REGION,
      postalCode: DEPARTURE_POSTAL,
      addressCountry: DEPARTURE_COUNTRY,
    },
    sameAs: SOCIAL_LINKS,
  })
}

export function WebsiteLd() {
  return jsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE}#website`,
    url: SITE,
    name: BUSINESS_NAME,
    description: 'Exclusive private boat tours on Lake Como. Sunset aperitivo, breakfast on board, historic villa tours and more.',
    publisher: { '@id': `${SITE}#organization` },
    inLanguage: ['it-IT', 'en-US', 'de-DE'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE}/booking`,
      },
      'query-input': 'required name=search_term_string',
    },
  })
}

export function LocalBusinessLd({ locale = 'it' }: { locale?: string }) {
  return jsonLdScript({
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TouristAttraction'],
    '@id': `${SITE}#business`,
    name: BUSINESS_NAME,
    description: 'Exclusive private boat tours on Lake Como with skipper. Sunset aperitivo, breakfast on board, Villa Oleandra and Varenna tours. Book via email or WhatsApp.',
    url: SITE,
    telephone: PHONE,
    email: EMAIL,
    priceRange: '€€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Bank Transfer',
    inLanguage: ['it-IT', 'en-US', 'de-DE'],
    image: [
      `${SITE}/images/hero-bg.webp`,
      `${SITE}/images/logo.png`,
    ],
    logo: {
      '@type': 'ImageObject',
      url: `${SITE}/images/logo.png`,
      width: 200,
      height: 80,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: DEPARTURE_ADDRESS,
      addressLocality: DEPARTURE_CITY,
      addressRegion: DEPARTURE_REGION,
      postalCode: DEPARTURE_POSTAL,
      addressCountry: DEPARTURE_COUNTRY,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: DEPARTURE_LAT,
      longitude: DEPARTURE_LNG,
    },
    hasMap: `https://maps.google.com/?q=${DEPARTURE_LAT},${DEPARTURE_LNG}`,
    areaServed: [
      { '@type': 'Place', name: 'Lago di Como' },
      { '@type': 'Place', name: 'Como' },
      { '@type': 'Place', name: 'Varenna' },
      { '@type': 'Place', name: 'Bellagio' },
      { '@type': 'Place', name: 'Isola Comacina' },
    ],
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
      opens: '08:00',
      closes: '21:00',
    }],
    knowsAbout: [
      'Boat tours Lake Como',
      'Private boat rental Lake Como',
      'Luxury experiences Lake Como',
      'Villa Oleandra tour',
      'Sunset aperitivo boat tour Lake Como',
      'Breakfast on board Lake Como',
      'Private boat charter Como',
    ],
    touristType: ['Luxury traveler', 'Couples', 'Groups', 'Corporate events'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Boat Tours & Experiences on Lake Como',
      itemListElement: PACKAGES.map(p => ({
        '@type': 'Offer',
        '@id': `${SITE}#offer-${p.id}`,
        name: p.name,
        description: p.desc,
        price: p.price,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        validFrom: '2025-04-01',
        validThrough: '2025-10-31',
        url: `${SITE}/booking`,
        itemOffered: {
          '@type': 'TouristTrip',
          name: p.name,
          description: p.desc,
          duration: p.duration,
          provider: { '@id': `${SITE}#business` },
          itinerary: {
            '@type': 'Place',
            name: 'Lago di Como',
            geo: {
              '@type': 'GeoCoordinates',
              latitude: DEPARTURE_LAT,
              longitude: DEPARTURE_LNG,
            },
          },
        },
      })),
    },
    sameAs: SOCIAL_LINKS,
  })
}

export function BreadcrumbLd({
  items,
}: { items: ReadonlyArray<{ name: string; url: string }> }) {
  return jsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  })
}

export function FaqLd({
  qa,
}: { qa: ReadonlyArray<{ q: string; a: string }> }) {
  return jsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  })
}

export function BookingPageFaqLd() {
  return FaqLd({
    qa: [
      {
        q: 'How do I book a private boat tour on Lake Como with 4M Luxury Boats?',
        a: 'Fill in the booking form selecting your package, date and time. From desktop you will receive confirmation by email; from mobile you can request directly via WhatsApp. No online payment is required in advance.',
      },
      {
        q: 'How much does a private boat tour on Lake Como cost?',
        a: 'Prices start from €250 for the Golden Hour (1-hour private tour with Prosecco) up to €800 for La Dolce Vita (4-hour tour stopping at Isola Comacina and Varenna). All prices are for the entire boat in private mode.',
      },
      {
        q: 'Where do the Lake Como boat tours depart from?',
        a: 'The departure point is Lungo Lario Trieste, Como (22100). The dock is easily reachable on foot from Como city centre.',
      },
      {
        q: 'Can children or pets come on board?',
        a: 'Yes, our boats welcome families with children. For pets and special requests please contact us directly before booking via WhatsApp or email.',
      },
      {
        q: 'What happens in case of bad weather?',
        a: 'In case of adverse weather conditions we manage rescheduling or a full refund directly via WhatsApp or email within 24 hours of the scheduled departure.',
      },
    ],
  })
}

export function WebPageLd({
  type,
  name,
  description,
  url,
  breadcrumb,
}: {
  type: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage'
  name: string
  description: string
  url: string
  breadcrumb?: ReadonlyArray<{ name: string; url: string }>
}) {
  return jsonLdScript({
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#webpage`,
    name,
    description,
    url,
    isPartOf: { '@id': `${SITE}#website` },
    about: { '@id': `${SITE}#business` },
    inLanguage: 'en-US',
    ...(breadcrumb ? {
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumb.map((it, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: it.name,
          item: it.url,
        })),
      },
    } : {}),
  })
}
