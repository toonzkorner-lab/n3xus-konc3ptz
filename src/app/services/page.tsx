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

        {/* Services Detail List */}
        <section className="section">
          <div className="container">
            <div className="flex flex-col gap-3xl">
              {services.map((service, idx) => {
                const isEven = idx % 2 === 0;
                const features = JSON.parse(service.features || '[]');
                
                return (
                  <div key={service.id} id={service.slug} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-2xl items-center`}>
                    <div className="flex-1">
                      {service.icon && (service.icon.startsWith('/uploads') || service.icon.startsWith('http')) ? (
                        <div className="w-20 h-20 rounded-xl overflow-hidden mb-md border border-subtle">
                          {/\.(mp4|webm|ogg|mov)$/i.test(service.icon) ? (
                            <video src={service.icon} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <img src={service.icon} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                        </div>
                      ) : (
                        <div className="text-6xl mb-md">{service.icon}</div>
                      )}
                      <h2 className="text-3xl mb-md text-primary">{service.name}</h2>
                      <p className="text-lg text-secondary mb-xl leading-relaxed">
                        {service.description}
                      </p>
                      
                      <div className="bg-card border border-subtle p-lg rounded-lg mb-xl">
                        <h4 className="text-lg mb-md">Key Features</h4>
                        <ul className="grid grid-2 gap-md">
                          {features.map((feature: string, fIdx: number) => (
                            <li key={fIdx} className="flex items-center gap-sm text-secondary">
                              <svg width="16" height="16" viewBox="0 0 20 20" fill="var(--color-primary)">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center gap-lg mt-xl">
                        <div className="flex flex-col">
                          <span className="text-xs text-tertiary uppercase tracking-wide">Base Deposit</span>
                          <span className="text-2xl font-heading font-bold glow-text">${(service.price / 100).toLocaleString()}</span>
                        </div>
                        <div className="flex gap-sm">
                          <Link href={`/contact?service=${service.slug}`} className="btn btn-primary">
                            Request Proposal
                          </Link>
                          <AddToCartButton 
                            id={service.id}
                            title={service.name}
                            price={service.price}
                            type="SERVICE"
                            image={service.icon || undefined}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 w-full">
                      <div className="aspect-video bg-tertiary rounded-xl border border-subtle flex items-center justify-center overflow-hidden relative group">
                         <div className="absolute inset-0 bg-gradient-card opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                         <div className="relative z-10 text-center p-xl">
                            <h3 className="text-2xl mb-sm font-heading">{service.name} Representation</h3>
                            <p className="text-secondary font-mono text-sm">Visualizing digital excellence</p>
                         </div>
                      </div>
                    </div>
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
