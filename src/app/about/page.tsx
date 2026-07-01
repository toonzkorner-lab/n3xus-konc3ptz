import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export const metadata = {
  title: 'About Us | N3xUs Konc3pt\'z',
  description: 'Learn about the vision, process, and engineering standards behind N3xUs Konc3pt\'z digital design studio.',
  alternates: {
    canonical: 'https://n3xuskonc3ptz.com/about',
  },
  openGraph: {
    title: 'About Us | N3xUs Konc3pt\'z',
    description: 'Learn about the vision, process, and engineering standards behind N3xUs Konc3pt\'z digital design studio.',
    url: 'https://n3xuskonc3ptz.com/about',
    siteName: 'N3xUs Konc3pt\'z',
    images: [{ url: 'https://n3xuskonc3ptz.com/logo.jpg', width: 800, height: 800, alt: 'N3xUs Logo' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | N3xUs Konc3pt\'z',
    description: 'Learn about the vision, process, and engineering standards behind N3xUs Konc3pt\'z digital design studio.',
    images: ['https://n3xuskonc3ptz.com/logo.jpg'],
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-navbar overflow-hidden">
        
        {/* Enhanced Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center py-2xl border-b border-subtle">
          <div className="absolute inset-0 bg-secondary/20 overflow-hidden pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, var(--color-primary-subtle) 0%, transparent 50%)',
              opacity: 0.1
            }}></div>
            <div className="absolute w-full h-full" style={{
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              perspective: '1000px',
              transform: 'rotateX(60deg) scale(2.5) translateY(-50%)',
              transformOrigin: 'top center'
            }}></div>
          </div>
          
          <div className="container relative z-10 text-center">
            <div className="inline-block px-md py-xs mb-lg border border-primary/30 rounded-full bg-primary/10 text-primary text-sm font-mono tracking-widest uppercase">
              The Matrix Unveiled
            </div>
            <h1 className="text-5xl md:text-7xl mb-lg font-heading glow-text font-black tracking-tight">
              About N3xUs
            </h1>
            <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto font-light leading-relaxed">
              Architecting the Digital Frontier. We engineer elite digital infrastructure, high-performance APIs, and immersive ecosystems that propel your brand beyond the ordinary.
            </p>
          </div>
        </section>

        {/* Our Genesis & Mission */}
        <section className="section bg-card">
          <div className="container">
            <div className="grid grid-2 gap-2xl items-center">
              <div className="order-2 md:order-1 space-y-lg">
                <div className="flex items-center gap-sm text-primary mb-xs">
                  <span className="w-8 h-px bg-primary"></span>
                  <span className="font-mono text-sm uppercase tracking-widest">Our Genesis</span>
                </div>
                <h2 className="text-4xl text-inverse font-heading">Engineering the Future</h2>
                
                <p className="text-lg text-secondary leading-relaxed">
                  N3xUs Konc3pt'z was founded to bridge the critical gap between high-performance engineering and visionary digital aesthetics. In an industry saturated with generic templates and uninspired functionality, we operate as an elite architectural firm for the digital frontier.
                </p>
                <p className="text-lg text-secondary leading-relaxed">
                  Our technical expertise spans a comprehensive suite of digital solutions. We specialize in scalable E-commerce platforms, immersive web applications, sophisticated Discord architectures, intelligent Telegram automation, custom CRMs, and seamless API integrations. 
                </p>
                <div className="p-lg border-l-2 border-primary bg-primary/5 rounded-r-lg mt-xl">
                  <p className="text-xl text-primary font-heading italic leading-relaxed">
                    "Our mission is definitive: to engineer superior digital experiences that elevate your brand's presence far beyond the ordinary."
                  </p>
                </div>
              </div>
              
              <div className="order-1 md:order-2 relative aspect-square max-w-md mx-auto w-full">
                <div className="absolute inset-0 rounded-full border border-primary opacity-20 animate-spin" style={{ animationDuration: '25s' }}></div>
                <div className="absolute inset-4 rounded-full border border-secondary opacity-30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                <div className="absolute inset-8 rounded-full border border-accent opacity-10 animate-spin" style={{ animationDuration: '35s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center p-2xl">
                  <div className="relative w-full h-full">
                    <Image 
                      src="/logo.jpg" 
                      alt="N3xUs Logo" 
                      fill
                      className="rounded-full object-contain filter drop-shadow-lg"
                      style={{ filter: 'drop-shadow(0 0 40px var(--color-primary-glow))' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Marquee */}
        <section className="py-2xl border-y border-subtle bg-secondary/10 overflow-hidden relative">
          <div className="container text-center mb-xl">
            <h3 className="font-mono text-sm uppercase tracking-widest text-secondary">Powered By Elite Technologies</h3>
          </div>
          <div className="flex gap-2xl px-xl opacity-50 font-heading text-2xl md:text-4xl uppercase tracking-wider whitespace-nowrap overflow-x-hidden">
            {/* Simple CSS animation would go here ideally, but we'll simulate a static spread for now */}
            <div className="flex gap-2xl justify-around w-full flex-wrap">
              <span>Next.js</span>
              <span className="text-primary">•</span>
              <span>PostgreSQL</span>
              <span className="text-primary">•</span>
              <span>Prisma</span>
              <span className="text-primary">•</span>
              <span>React</span>
              <span className="text-primary">•</span>
              <span>Node.js</span>
              <span className="text-primary">•</span>
              <span>Stripe</span>
              <span className="text-primary">•</span>
              <span>Discord API</span>
            </div>
          </div>
        </section>

        {/* The Pipeline (Development Process) */}
        <section className="section relative">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-2xl">
              <h2 className="text-4xl text-primary font-heading mb-md">The N3xUs Pipeline</h2>
              <p className="text-secondary text-lg">Our systematic approach to engineering digital supremacy. Transparency and precision at every phase.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-lg relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-12 left-10 right-10 h-px bg-subtle z-0"></div>

              {[
                { step: '01', title: 'Discovery & Architecture', desc: 'Deep dive into your requirements to architect a scalable, robust blueprint.' },
                { step: '02', title: 'UI/UX Design', desc: 'Crafting premium, cyberpunk-inspired visual language tailored to your brand.' },
                { step: '03', title: 'Full-Stack Engineering', desc: 'Building the infrastructure using cutting-edge technologies and best practices.' },
                { step: '04', title: 'Deployment & Scaling', desc: 'Launching to the public matrix with ongoing monitoring and seamless scaling.' }
              ].map((phase, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center bg-card p-xl rounded-2xl border border-subtle shadow-md">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center border-2 border-primary text-primary font-mono text-xl font-bold mb-lg shadow-glow-primary">
                    {phase.step}
                  </div>
                  <h3 className="text-xl font-bold mb-sm text-inverse">{phase.title}</h3>
                  <p className="text-secondary text-sm leading-relaxed">{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upgraded Core Values */}
        <section className="section bg-card border-t border-subtle">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Core Principles</h2>
              <p className="section-subtitle">The foundation of our digital craftsmanship</p>
            </div>
            
            <div className="grid grid-3 gap-xl">
              <div className="group bg-secondary/20 p-2xl rounded-2xl border border-subtle hover:border-primary transition-all duration-300 hover:-translate-y-2 text-center shadow-lg hover:shadow-glow-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10 transition-transform group-hover:scale-150"></div>
                <div className="text-5xl mb-lg">✨</div>
                <h3 className="text-2xl font-bold mb-md text-primary font-heading">Aesthetic Excellence</h3>
                <p className="text-secondary leading-relaxed">We never compromise on design. Every pixel, gradient, and micro-animation is meticulously crafted to inspire awe and capture attention immediately.</p>
              </div>
              
              <div className="group bg-secondary/20 p-2xl rounded-2xl border border-subtle hover:border-secondary transition-all duration-300 hover:-translate-y-2 text-center shadow-lg hover:shadow-glow-purple relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full -z-10 transition-transform group-hover:scale-150"></div>
                <div className="text-5xl mb-lg">⚙️</div>
                <h3 className="text-2xl font-bold mb-md text-secondary font-heading">Robust Engineering</h3>
                <p className="text-secondary leading-relaxed">Beautiful design must be backed by flawless code. We architect systems that are scalable, highly performant, and impervious to compromise.</p>
              </div>
              
              <div className="group bg-secondary/20 p-2xl rounded-2xl border border-subtle hover:border-accent transition-all duration-300 hover:-translate-y-2 text-center shadow-lg hover:shadow-glow-accent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full -z-10 transition-transform group-hover:scale-150"></div>
                <div className="text-5xl mb-lg">🤝</div>
                <h3 className="text-2xl font-bold mb-md text-accent font-heading">Strategic Partnership</h3>
                <p className="text-secondary leading-relaxed">We don't just build for you; we build with you. Your domain knowledge combined with our technical supremacy creates the ultimate nexus.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
