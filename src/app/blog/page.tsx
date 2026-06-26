import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog | N3xUs Konc3pt\'z',
  description: 'Insights, tutorials, and cosmic transmissions from the N3xUs team.',
  alternates: {
    canonical: 'https://n3xuskonceptz.com/blog',
  },
  openGraph: {
    title: 'Blog | N3xUs Konc3pt\'z',
    description: 'Insights, tutorials, and cosmic transmissions from the N3xUs team.',
    url: 'https://n3xuskonceptz.com/blog',
    siteName: 'N3xUs Konc3pt\'z',
    images: [{ url: 'https://n3xuskonceptz.com/logo.jpg', width: 800, height: 800, alt: 'N3xUs Logo' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | N3xUs Konc3pt\'z',
    description: 'Insights, tutorials, and cosmic transmissions from the N3xUs team.',
    images: ['https://n3xuskonceptz.com/logo.jpg'],
  },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page || '1');
  const limit = 6;
  const skip = (page - 1) * limit;

  const [posts, totalPosts] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({
      where: { published: true },
    })
  ]);

  const totalPages = Math.ceil(totalPosts / limit);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-xl))' }}>
        {/* Page Header */}
        <section className="bg-secondary relative overflow-hidden py-3xl">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'var(--gradient-card)' }}></div>
          <div className="container relative z-10 text-center">
            <h1 className="text-4xl mb-sm glow-text">Transmissions Log</h1>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Insights, updates, and tutorials from the bleeding edge of the digital frontier. New articles and transmissions are added weekly.
            </p>
          </div>
        </section>

        {/* Blog Feed */}
        <section className="section">
          <div className="container">
            <div className="grid grid-3">
              {posts.map((post, idx) => {
                const tags = JSON.parse(post.tags || '[]');
                const delay = idx * 100;
                
                return (
                  <article 
                    key={post.id} 
                    className="card flex flex-col h-full hover:border-primary transition-colors shadow-md hover:shadow-glow-primary group"
                    style={{ animationDelay: `${delay}ms`, animation: 'fadeInUp 0.6s ease backwards' }}
                  >
                    <Link href={`/blog/${post.slug}`} className="block overflow-hidden relative flex-shrink-0" style={{ width: '100%', height: '200px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-lg)', border: '1px solid var(--border-subtle)', transition: 'all var(--transition-base)' }}>
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} className="group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <span style={{ fontSize: '32px' }} className="group-hover:scale-105 transition-transform duration-500">📡</span>
                      )}
                    </Link>
                    
                    <h2 className="text-xl font-bold mb-xs text-primary-hover leading-tight transition-colors group-hover:text-primary">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    
                    <p className="text-secondary text-sm mb-lg flex-grow line-clamp-3">
                      {post.excerpt || post.content.substring(0, 120) + '...'}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-lg border-t border-subtle">
                      <span className="text-xs font-mono text-primary uppercase">
                        {tags.length > 0 ? tags[0] : 'General'}
                      </span>
                      <span className="text-xs text-tertiary font-mono">
                        {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-3xl">
                <div className="text-5xl mb-md opacity-50">📡</div>
                <h3 className="text-xl text-primary mb-sm">Awaiting Transmissions...</h3>
                <p className="text-secondary">No blog posts have been published yet. Check back soon!</p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-subtle">
                <Link 
                  href={`/blog?page=${page > 1 ? page - 1 : 1}`}
                  className={`btn-secondary ${page <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  Previous
                </Link>
                <span className="text-secondary font-mono">
                  Page {page} of {totalPages}
                </span>
                <Link 
                  href={`/blog?page=${page < totalPages ? page + 1 : totalPages}`}
                  className={`btn-secondary ${page >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  Next
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
