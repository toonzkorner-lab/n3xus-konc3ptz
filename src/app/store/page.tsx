import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import StoreItemCard from '@/components/StoreItemCard';

export const metadata = {
  title: 'Store | N3xUs Konc3pt\'z',
  description: 'Purchase pre-made Discord bots, digital assets, and cosmic design kits.',
};

export default async function StorePage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <Navbar />
      <main className="pt-navbar">
        {/* Page Header */}
        <section className="section bg-secondary relative overflow-hidden" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center' }}>
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'var(--gradient-card)' }}></div>
          <div className="container relative z-10 text-center">
            <h1 className="text-5xl mb-md glow-text">Digital Storefront</h1>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              Ready-to-deploy bots, scripts, and premium digital assets.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="section">
          <div className="container">
            {products.length === 0 ? (
              <div className="text-center py-2xl">
                <p className="text-2xl text-secondary mb-md">No products available at the moment.</p>
                <p className="text-tertiary">Check back soon as we continuously expand our digital armory.</p>
              </div>
            ) : (
              <div className="grid grid-3">
                {products.map((product, idx) => (
                  <StoreItemCard
                    key={product.id}
                    id={product.id}
                    type="PRODUCT"
                    title={product.title}
                    description={product.shortDesc || ''}
                    images={JSON.parse(product.images || '[]')}
                    features={JSON.parse(product.features || '[]')}
                    price={product.price}
                    recurring={product.recurring || undefined}
                    delay={idx * 150}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Cross-Sell CTA */}
        <section className="section bg-secondary text-center">
          <div className="container">
            <h2 className="text-3xl mb-lg">Need something unique?</h2>
            <p className="text-xl text-secondary mb-xl max-w-2xl mx-auto">
              Our pre-made products are powerful, but sometimes you need a solution built entirely from scratch to fit your exact vision.
            </p>
            <div className="flex gap-md justify-center">
              <Link href="/services" className="btn btn-primary btn-lg">
                View Custom Services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
