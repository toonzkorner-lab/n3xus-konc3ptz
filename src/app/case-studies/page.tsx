import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: "Case Studies | N3xUs Konc3pt'z",
  description: 'Explore detailed case studies of our most impactful projects. See real results from real clients.',
};

export default async function CaseStudiesPage() {
  const items = await prisma.portfolioItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <Navbar />
      <main>
        <section className="section" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-4xl))' }}>
          <div className="container">
            <div className="text-center mb-3xl">
              <h1 className="text-5xl font-heading glow-text mb-md">Case Studies</h1>
              <p className="text-lg text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
                Deep dives into our most impactful projects. Real problems, real solutions, real results.
              </p>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-3xl">
                <div className="text-6xl mb-lg opacity-50">📂</div>
                <p className="text-secondary text-lg">Case studies coming soon.</p>
              </div>
            ) : (
              <div className="grid grid-2 gap-xl">
                {items.map(item => {
                  const tags = (() => { try { return JSON.parse(item.tags); } catch { return []; } })();
                  return (
                    <Link href={`/portfolio/${item.slug}`} key={item.id} className="bg-card border border-subtle rounded-xl overflow-hidden hover:border-primary transition-all group shadow-md">
                      <div className="w-full h-48 overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-primary-subtle), var(--color-accent-subtle))' }}>
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-5xl opacity-30">🚀</span>
                          </div>
                        )}
                      </div>
                      <div className="p-xl">
                        <div className="flex items-center gap-sm mb-md">
                          {item.category && (
                            <span className="text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider bg-primary/20 text-primary border border-primary/30">
                              {item.category}
                            </span>
                          )}
                          {item.client && (
                            <span className="text-xs text-secondary font-mono">Client: {item.client}</span>
                          )}
                        </div>
                        <h2 className="text-xl font-heading text-primary mb-sm group-hover:text-accent transition-colors">{item.title}</h2>
                        <p className="text-secondary text-sm mb-lg" style={{ lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.description}
                        </p>
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-xs mb-md">
                            {tags.slice(0, 5).map((tag: string) => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-tertiary text-secondary border border-subtle">{tag}</span>
                            ))}
                          </div>
                        )}
                        <span className="text-sm text-accent font-bold group-hover:underline">View Case Study →</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
