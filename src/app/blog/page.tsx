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

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <Navbar />
      <main className="pt-navbar">
        {/* Page Header */}
        <section className="bg-secondary relative overflow-hidden py-3xl">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'var(--gradient-card)' }}></div>
          <div className="container relative z-10 text-center">
            <h1 className="text-4xl mb-sm glow-text">Transmissions Log</h1>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Insights, updates, and tutorials from the bleeding edge of the digital frontier.
            </p>
          </div>
        </section>

        {/* Blog Feed */}
        <section className="section">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg max-w-7xl mx-auto">
              {posts.map((post, idx) => {
                const tags = JSON.parse(post.tags || '[]');
                const delay = idx * 100;
                
                return (
                  <article 
                    key={post.id} 
                    className="card flex flex-col h-full hover:border-primary transition-colors shadow-md hover:shadow-glow-primary group"
                    style={{ animationDelay: `${delay}ms`, animation: 'fadeInUp 0.6s ease backwards' }}
                  >
                    <Link href={`/blog/${post.slug}`} className="block w-full h-48 mb-lg bg-tertiary rounded-lg border border-subtle overflow-hidden relative flex-shrink-0">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-tr from-primary-subtle to-secondary-subtle opacity-50 group-hover:scale-105 transition-transform duration-500"></div>
                          <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">N3xUs</div>
                        </>
                      )}
                    </Link>
                    
                    <div className="flex items-center justify-between mb-sm">
                      <span className="text-xs font-mono text-primary uppercase border border-primary/20 bg-primary/5 px-2 py-1 rounded-full">
                        {tags.length > 0 ? tags[0] : 'General'}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-xs text-primary-hover leading-tight">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    
                    <p className="text-secondary text-sm mb-lg flex-grow line-clamp-3">
                      {post.excerpt || post.content.substring(0, 120) + '...'}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-lg border-t border-subtle">
                      <span className="text-xs text-tertiary font-mono">
                        {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      <Link href={`/blog/${post.slug}`} className="text-sm text-primary font-heading font-bold hover:underline flex items-center gap-1">
                        Read More <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
