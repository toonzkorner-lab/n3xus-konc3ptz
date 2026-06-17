import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post) return { title: 'Post Not Found' };

  const ogImage = post.coverImage || '/logo.jpg';
  const desc = post.excerpt || 'Read more on the N3xUs blog.';

  return {
    title: `${post.title} | N3xUs Konc3pt'z Blog`,
    description: desc,
    openGraph: {
      title: `${post.title} | N3xUs Konc3pt'z Blog`,
      description: desc,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | N3xUs Konc3pt'z Blog`,
      description: desc,
      images: [ogImage],
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, image: true } },
    },
  });

  if (!post || !post.published) {
    notFound();
  }

  const tags = JSON.parse(post.tags);

  return (
    <>
      <Navbar />
      <main>
        <article className="section" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-4xl))' }}>
          <div className="container container-md">
            <div className="mb-xl">
              <Link href="/blog" className="text-sm text-tertiary hover:text-primary transition-colors">
                ← Back to Blog
              </Link>
            </div>

            <header className="mb-3xl">
              <div className="flex gap-sm flex-wrap mb-lg">
                {tags.map((tag: string) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>

              <h1 className="text-4xl mb-lg" style={{ lineHeight: '1.2' }}>{post.title}</h1>
              
              {post.excerpt && (
                <p className="text-lg text-secondary mb-xl">{post.excerpt}</p>
              )}

              <div className="flex items-center gap-md text-sm text-tertiary border-t border-b border-subtle py-md">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
                  {(post.author.name || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-primary text-sm">{post.author.name}</p>
                  <p className="text-xs">{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </header>

            <div className="prose" style={{
              fontSize: 'var(--text-lg)',
              lineHeight: 'var(--leading-relaxed)',
              color: 'var(--text-secondary)',
            }}>
              {post.content.split('\n').map((paragraph: string, idx: number) => (
                paragraph.trim() ? <p key={idx} className="mb-lg">{paragraph}</p> : null
              ))}
            </div>

            <div className="mt-3xl pt-xl border-t border-subtle text-center">
              <Link href="/blog" className="btn btn-secondary">
                ← More Transmissions
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
