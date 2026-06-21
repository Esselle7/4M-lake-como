import type { MetadataRoute } from 'next'

const SITE_URL = 'https://4mboatlakecomo.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date('2025-05-01'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/booking`,
      lastModified: new Date('2025-05-01'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/story`,
      lastModified: new Date('2025-04-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // ISOLA COMACINA EVENT (remove after 2026-06-27)
    {
      url: `${SITE_URL}/book-isola-comacina`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'daily',
      priority: 0.95,
    },
  ]
}
