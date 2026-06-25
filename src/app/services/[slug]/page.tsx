import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddToCartButton from '@/components/AddToCartButton';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ServiceJsonLd } from '@/components/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  
  if (!service) return { title: 'Service Not Found' };

  let ogImage = '/logo.jpg';
  if (service.icon && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(service.icon)) {
    ogImage = service.icon.startsWith('http') ? service.icon : `https://n3xuskonceptz.com${service.icon}`;
  } else {
    ogImage = 'https://n3xuskonceptz.com/logo.jpg';
  }

  const siteUrl = 'https://n3xuskonceptz.com';

  return {
    title: `${service.name} | N3xUs Konc3pt'z`,
    description: service.shortDesc || service.description,
    alternates: {
      canonical: `${siteUrl}/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.name} | N3xUs Konc3pt'z`,
      description: service.shortDesc || service.description,
      url: `${siteUrl}/services/${service.slug}`,
      siteName: "N3xUs Konc3pt'z",
      images: [{ url: ogImage, width: 800, height: 800, alt: service.name }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: `${service.name} | N3xUs Konc3pt'z`,
      description: service.shortDesc || service.description,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { active: true },
    select: { slug: true },
  });
  return services.map((service) => ({ slug: service.slug }));
}

export const revalidate = 3600; // Revalidate every hour

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const service = await prisma.service.findUnique({
    where: { slug }
  });

  if (!service || !service.active) {
    notFound();
  }

  let features = [];
  try {
    features = JSON.parse(service.features || '[]');
  } catch (e) {
    console.error("Failed to parse features for service", service.slug, e);
  }

  return (
    <>
      <ServiceJsonLd
        name={service.name}
        description={service.shortDesc || service.description || ''}
        slug={slug}
        price={service.price}
      />
      <Navbar />
      <main className="pt-navbar min-h-screen flex flex-col">
        <section className="section flex-1">
          <div className="container max-w-5xl mx-auto">
            
            <Link href="/services" className="text-secondary hover:text-primary mb-xl inline-block transition-colors border border-subtle px-sm py-xs rounded-md">
              &larr; Back to all Services
            </Link>

            <div className="bg-card border border-subtle rounded-xl p-2xl shadow-xl flex flex-col lg:flex-row gap-2xl">
              <div className="flex-1">
                {service.icon && (service.icon.startsWith('/uploads') || service.icon.startsWith('http')) ? (
                  <div className="w-24 h-24 rounded-xl overflow-hidden mb-lg border border-subtle">
                    {/\.(mp4|webm|ogg|mov)$/i.test(service.icon) ? (
                      <video src={service.icon} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <img src={service.icon} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                ) : (
                  <div className="text-7xl mb-lg">{service.icon}</div>
                )}
                
                <h1 className="text-4xl mb-md text-primary font-heading glow-text">{service.name}</h1>
                
                <div className="bg-primary/50 border border-subtle p-lg rounded-lg mb-xl mt-lg">
                  <p className="text-xl text-secondary leading-relaxed">
                    {service.description}
                  </p>
                </div>
                
                <h4 className="text-xl mb-md font-heading text-primary">Key Features</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-md mb-2xl">
                  {features.map((feature: string, fIdx: number) => (
                    <li key={fIdx} className="flex items-center gap-sm text-secondary bg-primary/30 p-md rounded-md border border-subtle">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="var(--color-accent)">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap items-center gap-xl mt-xl pt-xl border-t border-subtle">
                  <div className="flex flex-col">
                    <span className="text-xs text-tertiary uppercase tracking-wide">{service.recurring ? 'Subscription' : 'Full Price'}</span>
                    <span className="text-3xl font-heading font-bold glow-text">${(service.price / 100).toLocaleString()}{service.recurring ? ` / ${service.recurring === 'year' ? 'yr' : 'mo'}` : ''}</span>
                  </div>
                  <div className="flex gap-md flex-1 md:flex-none">
                    <Link href={`/contact?service=${service.slug}`} className="btn btn-primary flex-1 text-center">
                      Request Proposal
                    </Link>
                    <AddToCartButton 
                      id={service.id}
                      title={service.name}
                      price={service.price}
                      type="SERVICE"
                      image={service.icon || undefined}
                      recurring={service.recurring || undefined}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
