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
  { id: 'golden-hour',  name: 'Golden Hour',        price: 250, duration: 'PT1H',   desc: 'Tour privato in barca sul Lago di Como con Prosecco al tramonto. 1 ora.' },
  { id: 'breakfast',    name: 'Breakfast on Board',  price: 300, duration: 'PT1H',   desc: 'Colazione a bordo sul Lago di Como. Navigazione mattutina 8:30-10:30.' },
  { id: 'aperitivo',    name: 'Aperitivo Tour',      price: 350, duration: 'PT1H30M',desc: 'Aperitivo italiano al tramonto in barca privata sul Lago di Como.' },
  { id: 'sushi',        name: 'Sushi Experience',    price: 380, duration: 'PT1H30M',desc: 'Sushi box premium e drink in crociera panoramica sul Lago di Como.' },
  { id: 'como-luxury',  name: 'Como Luxury',         price: 450, duration: 'PT2H',   desc: 'Tour di 2 ore: Villa Pliniana, Villa Oleandra (George Clooney), Nesso.' },
  { id: 'dolce-vita',   name: 'La Dolce Vita',       price: 800, duration: 'PT4H',   desc: 'Grand tour 4 ore: Isola Comacina e Varenna — esperienza completa Lago di Como.' },
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
    description: 'Esperienze esclusive in barca sul Lago di Como. Tour privati, aperitivo al tramonto, colazione a bordo, gite alle ville storiche.',
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
    description: 'Esperienze esclusive in barca sul Lago di Como. Tour privati con skipper, aperitivo al tramonto, colazione a bordo, gite a Villa Oleandra e Varenna. Prenota via email o WhatsApp.',
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
      'Private boat rental Como',
      'Luxury experiences Lake Como',
      'Villa Oleandra tour',
      'Aperitivo in barca Lago di Como',
      'Colazione a bordo Como',
      'Tour privato barca Como',
    ],
    touristType: ['Luxury traveler', 'Couples', 'Groups', 'Corporate events'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Tour ed Esperienze in Barca sul Lago di Como',
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
        q: 'Come si prenota un tour in barca sul Lago di Como con 4M Luxury Boats?',
        a: 'Compila il modulo di prenotazione scegliendo pacchetto, data e orario. Da desktop riceverai conferma via email; da smartphone puoi richiedere direttamente via WhatsApp. Non è richiesto alcun pagamento anticipato online.',
      },
      {
        q: 'Quanto costa un tour privato in barca sul Lago di Como?',
        a: 'I prezzi partono da €250 per la Golden Hour (1 ora privata con Prosecco) fino a €800 per La Dolce Vita (4 ore con tappa a Isola Comacina e Varenna). Tutti i prezzi si riferiscono alla barca intera in modalità privata.',
      },
      {
        q: 'Da dove parte il tour in barca sul Lago di Como?',
        a: 'Il punto di imbarco è Lungo Lario Trieste, Como (22100). Il molo è facilmente raggiungibile a piedi dal centro di Como.',
      },
      {
        q: 'È possibile portare bambini o animali a bordo?',
        a: 'Sì, le imbarcazioni accolgono famiglie con bambini. Per animali e richieste speciali contattaci direttamente prima della prenotazione via WhatsApp o email.',
      },
      {
        q: 'Cosa succede in caso di maltempo?',
        a: 'In caso di condizioni meteo avverse, gestiamo riprogrammazione o rimborso direttamente via WhatsApp o email entro 24 ore dalla partenza prevista.',
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
    inLanguage: 'it-IT',
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
