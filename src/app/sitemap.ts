import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://n3xuskonc3ptz.com';

  // Fetch dynamic content
  const blogPosts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true }
  });

  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true }
  });

  const services = await prisma.service.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true }
  });

  const portfolioItems = await prisma.portfolioItem.findMany({
    select: { slug: true, updatedAt: true }
  });

  // Static routes
  const routes = ['', '/store', '/services', '/portfolio', '/blog', '/about', '/contact', '/book'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date('2025-01-01'),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/store/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: service.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const portfolioRoutes = portfolioItems.map((item) => ({
    url: `${baseUrl}/portfolio/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...blogRoutes, ...productRoutes, ...serviceRoutes, ...portfolioRoutes];
}
