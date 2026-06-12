import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const item = await prisma.portfolioItem.findUnique({
    where: { slug: params.slug },
  });

  if (!item) return { title: "Not Found" };

  return {
    title: `${item.title} | Portfolio | N3xUs Konc3pt'z`,
    description: item.shortDesc || item.description?.substring(0, 160),
  };
}

export default async function PortfolioItemPage(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const item = await prisma.portfolioItem.findUnique({
    where: { slug: params.slug },
  });

  if (!item) {
    notFound();
  }

  const tags: string[] = item.tags ? JSON.parse(item.tags) : [];
  const images: string[] = item.images ? JSON.parse(item.images) : [];

  return (
    <>
      <Navbar />
      <main className="pt-navbar min-h-screen">
        {/* Header Section */}
        <section className="section bg-secondary relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'var(--gradient-card)' }}></div>
          <div className="container relative z-10 py-xl">
            <Link href="/portfolio" className="text-accent hover:text-accent-focus font-mono text-sm mb-lg inline-block transition-colors">
              &larr; Back to Portfolio
            </Link>
            
            <div className="flex flex-col gap-md">
              {item.category && (
                <span className="badge badge-primary self-start font-mono uppercase tracking-widest">{item.category}</span>
              )}
              <h1 className="text-4xl md:text-6xl text-primary glow-text font-heading">{item.title}</h1>
              {item.shortDesc && (
                <p className="text-xl text-secondary max-w-3xl mt-sm">{item.shortDesc}</p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-sm mt-lg">
              {tags.map((tag) => (
                <span key={tag} className="px-sm py-xs border border-primary/30 text-primary-subtle rounded-md text-xs font-mono uppercase tracking-wider bg-card/50 backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Media & Details Section */}
        <section className="section container py-3xl">
          <div className="grid md:grid-cols-[2fr_1fr] gap-3xl">
            {/* Left Column: Media */}
            <div className="flex flex-col gap-xl">
              {images.length > 0 ? (
                images.map((url, idx) => {
                  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);
                  return (
                    <div key={idx} className="rounded-xl overflow-hidden border border-subtle shadow-glow-primary relative aspect-video bg-card">
                      {isVideo ? (
                        <video src={url} autoPlay muted loop playsInline controls className="absolute inset-0 w-full h-full object-contain" />
                      ) : (
                        <Image src={url} alt={`${item.title} preview ${idx + 1}`} fill className="object-contain" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-subtle aspect-video flex items-center justify-center bg-card/30">
                  <span className="text-tertiary font-mono">No media provided for this project</span>
                </div>
              )}
            </div>

            {/* Right Column: Project Info */}
            <div className="sticky top-32 self-start flex flex-col gap-xl bg-card p-xl rounded-xl border border-subtle shadow-lg">
              <div>
                <h3 className="text-2xl text-primary mb-md font-heading border-b border-subtle pb-sm">Project Details</h3>
                <div className="prose prose-invert max-w-none text-secondary">
                  {item.description ? (
                    item.description.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-sm">{paragraph}</p>
                    ))
                  ) : (
                    <p className="text-tertiary italic">No detailed description provided.</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-md pt-lg border-t border-subtle">
                {item.liveUrl && (
                  <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full text-center">
                    View Live Site
                  </a>
                )}
                {item.githubUrl && (
                  <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full text-center">
                    Source Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
