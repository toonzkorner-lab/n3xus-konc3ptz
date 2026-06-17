export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "N3xUs Konc3pt'z",
    url: 'https://n3xuskonceptz.com',
    logo: 'https://n3xuskonceptz.com/logo.jpg',
    description: 'Premium digital design studio engineering custom Discord bots, Telegram automation, high-performance APIs, e-commerce platforms, and immersive web experiences.',
    founder: {
      '@type': 'Person',
      name: 'Juan Socarras',
      jobTitle: 'Founder & Principal Designer',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'jsocarras499@outlook.com',
    },
    sameAs: [
      'https://www.facebook.com/profile.php?id=61590253607463',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "N3xUs Konc3pt'z",
    url: 'https://n3xuskonceptz.com',
    description: 'Premium digital design studio engineering custom Discord bots, Telegram automation, high-performance APIs, and immersive web experiences.',
    publisher: {
      '@type': 'Organization',
      name: "N3xUs Konc3pt'z",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BlogPostJsonLd({ title, description, slug, datePublished, dateModified, coverImage }: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  coverImage?: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url: `https://n3xuskonceptz.com/blog/${slug}`,
    datePublished,
    dateModified,
    image: coverImage || 'https://n3xuskonceptz.com/logo.jpg',
    author: {
      '@type': 'Person',
      name: 'Juan Socarras',
      jobTitle: 'Founder & Principal Designer',
    },
    publisher: {
      '@type': 'Organization',
      name: "N3xUs Konc3pt'z",
      logo: {
        '@type': 'ImageObject',
        url: 'https://n3xuskonceptz.com/logo.jpg',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ServiceJsonLd({ name, description, slug, price }: {
  name: string;
  description: string;
  slug: string;
  price?: number;
}) {
  const data: any = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `https://n3xuskonceptz.com/services/${slug}`,
    provider: {
      '@type': 'Organization',
      name: "N3xUs Konc3pt'z",
    },
  };

  if (price && price > 0) {
    data.offers = {
      '@type': 'Offer',
      price: (price / 100).toFixed(2),
      priceCurrency: 'USD',
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
