import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://n3xuskonc3ptz.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/dashboard/', '/auth/', '/cart/', '/checkout/', '/book/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
