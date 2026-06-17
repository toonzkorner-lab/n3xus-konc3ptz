import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AddToCartButton from '@/components/AddToCartButton';

export const metadata = {
  title: 'Services | N3xUs Konc3pt\'z',
  description: 'Explore our premium digital design and development services.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  });

  return (
    <>
      <Navbar />
      <main className="pt-navbar">
        {/* Page Header */}
        <section className="section bg-secondary relative overflow-hidden" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center' }}>
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'var(--gradient-card)' }}></div>
          <div className="container relative z-10 text-center">
            <h1 className="text-5xl mb-md glow-text">Our Services</h1>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              Premium digital solutions crafted for visionary brands and communities.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="section">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-xl">
              {services.map((service, idx) => {
                const features = JSON.parse(service.features || '[]');
                
                return (
                  <div key={service.id} id={service.slug}>
                    <ServiceCard
                      id={service.id}
                      slug={service.slug}
                      title={service.name}
                      description={service.description || ''}
                      icon={service.icon || ''}
                      features={features}
                      startingPrice={service.price}
                      delay={idx * 100}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-secondary text-center">
          <div className="container">
            <h2 className="text-3xl mb-lg">Need a custom solution?</h2>
            <p className="text-xl text-secondary mb-xl max-w-2xl mx-auto">
              If your project doesn't fit neatly into these categories, don't worry. We specialize in bespoke digital architecture.
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Let's Discuss Your Vision
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
