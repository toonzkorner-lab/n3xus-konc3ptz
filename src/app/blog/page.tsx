import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Blog | N3xUs Konc3pt\'z',
  description: 'Insights, tutorials, and cosmic transmissions from the N3xUs team.',
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
            <div className="flex flex-col gap-lg max-w-5xl mx-auto">
              {posts.map(post => {
                const tags = JSON.parse(post.tags || '[]');
                
                return (
                  <article key={post.id} className="bg-card border border-subtle rounded-xl overflow-hidden hover:border-primary transition-colors flex flex-col md:flex-row shadow-md hover:shadow-glow-primary group">
                    <div className="w-full md:w-1/3 h-48 md:h-auto min-h-[200px] bg-tertiary relative overflow-hidden flex-shrink-0">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-tr from-primary-subtle to-secondary-subtle opacity-50"></div>
                          <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">N3xUs</div>
                        </>
                      )}
                    </div>
                    <div className="p-lg flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-sm">
                        <span className="text-xs font-mono text-primary uppercase">
                          {tags.length > 0 ? tags[0] : 'General'}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold mb-xs text-primary-hover leading-tight">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="text-secondary text-sm mb-md flex-grow line-clamp-2">
                        {post.excerpt || post.content.substring(0, 120) + '...'}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-sm border-t border-subtle">
                        <span className="text-xs text-tertiary">
                          {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        <Link href={`/blog/${post.slug}`} className="text-sm text-primary font-heading font-bold hover:underline">Read More →</Link>
                      </div>
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
