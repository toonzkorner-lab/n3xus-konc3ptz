import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortfolioGrid from '@/components/PortfolioGrid';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Portfolio | N3xUs Konc3pt\'z',
  description: 'Explore our portfolio of custom Discord bots, web applications, API integrations, and digital design projects.',
  alternates: { canonical: 'https://n3xuskonceptz.com/portfolio' },
  openGraph: {
    title: 'Portfolio | N3xUs Konc3pt\'z',
    description: 'Explore our portfolio of custom Discord bots, web applications, API integrations, and digital design projects.',
    url: 'https://n3xuskonceptz.com/portfolio',
    siteName: 'N3xUs Konc3pt\'z',
    images: [{ url: 'https://n3xuskonceptz.com/logo.jpg', width: 800, height: 800, alt: 'N3xUs Logo' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | N3xUs Konc3pt\'z',
    description: 'Explore our portfolio of custom Discord bots, web applications, API integrations, and digital design projects.',
    images: ['https://n3xuskonceptz.com/logo.jpg'],
  },
};

export default async function PortfolioPage() {
  const dbItems = await prisma.portfolioItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const portfolioItems = dbItems.map(item => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category || '',
    tags: item.tags ? JSON.parse(item.tags) : [],
    images: item.images ? JSON.parse(item.images) : [],
  }));

  return (
    <>
      <Navbar />
      <main className="pt-navbar">
        {/* Page Header */}
        <section className="section bg-secondary relative overflow-hidden" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center' }}>
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'var(--gradient-card)' }}></div>
          <div className="container relative z-10 text-center">
            <h1 className="text-5xl mb-md glow-text">Our Portfolio</h1>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              A showcase of our digital craftsmanship across the cosmic web.
            </p>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="section">
          <div className="container">
            {portfolioItems.length > 0 ? (
              <PortfolioGrid items={portfolioItems} />
            ) : (
               <div className="text-center py-3xl">
                 <div className="text-5xl mb-md opacity-50">✨</div>
                 <h3 className="text-xl text-primary mb-sm">Awaiting Cosmic Creations...</h3>
                 <p className="text-secondary">No portfolio projects have been published yet.</p>
               </div>
            )}
          </div>
        </section>

        {/* Process Section */}
        <section className="section bg-secondary">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Our Creation Process</h2>
              <p className="section-subtitle">How we turn concepts into digital reality</p>
            </div>
            
            <div className="grid grid-4 gap-xl">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-subtle text-primary border border-primary flex items-center justify-center text-2xl mx-auto mb-md font-heading font-bold shadow-glow-primary">1</div>
                <h3 className="text-xl mb-sm">Discovery</h3>
                <p className="text-secondary text-sm">We explore your vision, requirements, and the cosmic possibilities.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-subtle text-primary border border-primary flex items-center justify-center text-2xl mx-auto mb-md font-heading font-bold shadow-glow-primary">2</div>
                <h3 className="text-xl mb-sm">Blueprint</h3>
                <p className="text-secondary text-sm">Architecting the solution, designing the UI, and planning the infrastructure.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-subtle text-primary border border-primary flex items-center justify-center text-2xl mx-auto mb-md font-heading font-bold shadow-glow-primary">3</div>
                <h3 className="text-xl mb-sm">Development</h3>
                <p className="text-secondary text-sm">Writing pristine code to forge your custom bots, APIs, or web apps.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-subtle text-primary border border-primary flex items-center justify-center text-2xl mx-auto mb-md font-heading font-bold shadow-glow-primary">4</div>
                <h3 className="text-xl mb-sm">Launch</h3>
                <p className="text-secondary text-sm">Deploying to the stars with comprehensive testing and ongoing support.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
