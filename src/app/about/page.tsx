import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export const metadata = {
  title: 'About Us | N3xUs Konc3pt\'z',
  description: 'Learn about the vision and team behind N3xUs Konc3pt\'z digital design studio.',
  alternates: {
    canonical: 'https://n3xuskonceptz.com/about',
  },
  openGraph: {
    title: 'About Us | N3xUs Konc3pt\'z',
    description: 'Learn about the vision and team behind N3xUs Konc3pt\'z digital design studio.',
    url: 'https://n3xuskonceptz.com/about',
    siteName: 'N3xUs Konc3pt\'z',
    images: [{ url: 'https://n3xuskonceptz.com/logo.jpg', width: 800, height: 800, alt: 'N3xUs Logo' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | N3xUs Konc3pt\'z',
    description: 'Learn about the vision and team behind N3xUs Konc3pt\'z digital design studio.',
    images: ['https://n3xuskonceptz.com/logo.jpg'],
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-navbar">
        {/* Page Header */}
        <section className="section bg-secondary relative overflow-hidden" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center' }}>
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'var(--gradient-card)' }}></div>
          <div className="container relative z-10 text-center">
            <h1 className="text-5xl mb-md glow-text">About N3xUs</h1>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              Architecting the Digital Frontier: We engineer elite Discord infrastructures, high-performance APIs, and immersive web ecosystems that propel your brand beyond the ordinary.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="section">
          <div className="container">
            <div className="grid grid-2 gap-2xl items-center">
              <div>
                <h2 className="text-3xl mb-lg text-primary">Our Genesis</h2>
                <p className="text-lg text-secondary mb-md leading-relaxed">
                  N3xUs Konc3pt'z was founded to bridge the critical gap between high-performance engineering and visionary digital aesthetics. In an industry saturated with generic templates and uninspired functionality, we operate as an elite architectural firm for the digital frontier, engineering bespoke ecosystems that command attention and drive real business outcomes.
                </p>
                <p className="text-lg text-secondary mb-md leading-relaxed">
                  Our technical expertise spans a comprehensive suite of digital solutions. We specialize in scalable E-commerce platforms, immersive web applications, sophisticated Discord architectures, intelligent Telegram automation, custom CRMs, and seamless API integrations. By fusing cutting-edge backend technologies with our signature cyberpunk-inspired visual language, we deliver products that are as robust as they are striking.
                </p>
                <p className="text-lg text-secondary leading-relaxed font-bold text-primary">
                  Our mission is definitive: to engineer superior digital experiences that elevate your brand's presence far beyond the ordinary.
                </p>
              </div>
              
              <div className="relative aspect-square max-w-md mx-auto w-full">
                <div className="absolute inset-0 rounded-full border border-primary opacity-20 animate-spin" style={{ animationDuration: '20s' }}></div>
                <div className="absolute inset-4 rounded-full border border-secondary opacity-30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                <div className="absolute inset-0 flex items-center justify-center p-xl">
                  <Image 
                    src="/logo.jpg" 
                    alt="N3xUs Logo" 
                    width={400} 
                    height={400} 
                    className="rounded-full object-contain filter drop-shadow-lg"
                    style={{ filter: 'drop-shadow(0 0 30px var(--color-primary-glow))' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section bg-secondary">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Our Core Values</h2>
              <p className="section-subtitle">The principles that guide our digital craftsmanship</p>
            </div>
            
            <div className="grid grid-3 gap-xl">
              <div className="bg-card p-xl rounded-xl border border-subtle hover:border-primary transition-colors text-center shadow-md hover:shadow-glow-primary">
                <div className="text-4xl mb-md">✨</div>
                <h3 className="text-xl mb-md text-primary">Aesthetic Excellence</h3>
                <p className="text-secondary">We never compromise on design. Every pixel, every animation is meticulously crafted to inspire awe.</p>
              </div>
              
              <div className="bg-card p-xl rounded-xl border border-subtle hover:border-secondary transition-colors text-center shadow-md hover:shadow-glow-purple">
                <div className="text-4xl mb-md">⚙️</div>
                <h3 className="text-xl mb-md text-secondary">Robust Engineering</h3>
                <p className="text-secondary">Beautiful design must be backed by flawless code. We build scalable, secure, and highly performant architectures.</p>
              </div>
              
              <div className="bg-card p-xl rounded-xl border border-subtle hover:border-accent transition-colors text-center shadow-md hover:shadow-lg">
                <div className="text-4xl mb-md">🤝</div>
                <h3 className="text-xl mb-md text-accent">Client Partnership</h3>
                <p className="text-secondary">We don't just build for you; we build with you. Your vision combined with our expertise creates the ultimate nexus.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
