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
      url: `${SITE_URL}/storia`,
      lastModified: new Date('2025-04-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
