import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import PortfolioGrid from '@/components/PortfolioGrid';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import StatsCounter from '@/components/StatsCounter';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'N3xUs Konc3pt\'z | Digital Design Studio',
  description: 'The premier digital design studio for the next generation of the web.',
  alternates: {
    canonical: 'https://n3xuskonc3ptz.com/',
  },
  openGraph: {
    title: 'N3xUs Konc3pt\'z | Digital Design Studio',
    description: 'The premier digital design studio for the next generation of the web.',
    url: 'https://n3xuskonc3ptz.com/',
    siteName: 'N3xUs Konc3pt\'z',
    images: [{ url: 'https://n3xuskonc3ptz.com/logo.jpg', width: 800, height: 800, alt: 'N3xUs Logo' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'N3xUs Konc3pt\'z | Digital Design Studio',
    description: 'The premier digital design studio for the next generation of the web.',
    images: ['https://n3xuskonc3ptz.com/logo.jpg'],
  },
};

export default async function Home() {
  // Fetch services from DB
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
    take: 3
  });

  // Fetch real portfolio items
  const dbPortfolioItems = await prisma.portfolioItem.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const portfolioItems = dbPortfolioItems.map(item => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category || '',
    tags: item.tags ? JSON.parse(item.tags) : [],
    images: item.images ? JSON.parse(item.images) : [],
    clientProject: !!item.client,
  }));

  // Fetch testimonials
  const testimonials = await prisma.testimonial.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Fetch actual completed projects from database
  const actualProjectsCount = await prisma.project.count({
    where: { status: 'COMPLETED' }
  });

  // Calculate dynamic stats based on time elapsed since launch (e.g., Jan 1, 2024)
  const launchDate = new Date('2024-01-01').getTime();
  const currentDate = Date.now();
  const daysElapsed = Math.max(0, Math.floor((currentDate - launchDate) / (1000 * 60 * 60 * 24)));
  
  // 1 fake project every 8 days on average, with a base of 30
  const fakeProjectsCount = Math.floor(daysElapsed / 8);
  const totalProjects = actualProjectsCount + fakeProjectsCount + 30;
  
  // Discord Bots Deployed - 1 bot every 15 days, base 15
  const discordBotsCount = Math.floor(daysElapsed / 15) + 15;
  
  // Lines of Code - 1k lines every 4 days, base 150
  const linesOfCodeCount = Math.floor(daysElapsed / 4) + 150;

  // Stats
  const stats = [
    { label: 'Projects Completed', value: totalProjects, suffix: '+' },
    { label: 'Discord Bots Deployed', value: discordBotsCount, suffix: '+' },
    { label: 'Lines of Code', value: linesOfCodeCount, suffix: 'k+' },
    { label: 'Client Satisfaction', value: 99, suffix: '%' }
  ];

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        {/* Universal Cosmic Background */}
        <div className="cosmic-bg">
          <div className="stars"></div>
        </div>

        <Hero />
        
        {/* Services Section */}
        <section id="services" className="section relative z-10">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title text-5xl glow-text mb-md">Our Services</h2>
              <p className="section-subtitle text-secondary">
                Comprehensive digital solutions tailored for the future
              </p>
            </div>
            
            <div className="grid grid-3">
              {services.map((service, idx) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  slug={service.slug}
                  title={service.name}
                  description={service.shortDesc || ''}
                  icon={service.icon || '🚀'}
                  features={JSON.parse(service.features || '[]')}
                  startingPrice={service.price}
                  delay={idx * 150}
                />
              ))}
            </div>
            
            <div className="text-center mt-2xl">
              <Link href="/services" className="btn btn-secondary btn-lg">
                View All Services
              </Link>
            </div>
          </div>
        </section>

        <div className="container"><hr className="divider-glow opacity-50" /></div>

        {/* Stats Section */}
        <section className="section py-2xl relative z-10">
          <div className="container">
            <StatsCounter stats={stats} />
          </div>
        </section>

        <div className="container"><hr className="divider-glow opacity-50" /></div>

        {/* Portfolio Section */}
        <section id="portfolio" className="section relative z-10">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title text-5xl glow-text mb-md">Featured Work</h2>
              <p className="section-subtitle text-secondary">
                A glimpse into our digital universe
              </p>
            </div>
            
            <PortfolioGrid items={portfolioItems} limit={3} />
            
            <div className="text-center mt-2xl">
              <Link href="/portfolio" className="btn btn-secondary btn-lg">
                Explore Portfolio
              </Link>
            </div>
          </div>
        </section>

        <div className="container"><hr className="divider-glow opacity-50" /></div>

        {/* Testimonials Section */}
        <section className="section relative z-10">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title text-5xl glow-text mb-md">Client Transmissions</h2>
              <p className="section-subtitle text-secondary">
                What others say about their journey with N3xUs
              </p>
            </div>
            
            <TestimonialCarousel testimonials={testimonials} />
            
            <div className="text-center mt-2xl">
              <Link href="/reviews" className="btn btn-secondary btn-lg">
                Read All Reviews & Leave Yours
              </Link>
            </div>
          </div>
        </section>

        {/* CTA & Contact Section */}
        <section className="section relative z-10 mb-2xl">
          <div className="container">
            <div className="glass-strong rounded-xl p-2xl card-glow">
              <div className="grid grid-2 gap-2xl" style={{ alignItems: 'center' }}>
                <div>
                  <h2 className="text-5xl mb-lg glow-text">Ready to Launch Your Next Project?</h2>
                  <p className="text-lg text-secondary mb-xl">
                    Whether you need a complex Discord bot, a sleek new web application, or a complete digital transformation, our team is ready to bring your vision to life.
                  </p>
                  
                  <div className="mt-xl">
                    <h4 className="text-xl mb-md text-primary font-heading">Direct Comm Channels</h4>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>📧</span> 
                        <a href="mailto:contact@n3xuskonc3ptz.com" className="hover:text-primary transition-colors text-lg">contact@n3xuskonc3ptz.com</a>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>💬</span> 
                        <a href="https://discord.gg/3UHWMa7rC" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-lg">discord.gg/3UHWMa7rC</a>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>📞</span> 
                        <a href="tel:+12108900172" className="hover:text-primary transition-colors text-lg">(210) 890-0172 (Call or Text)</a>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>📱</span> 
                        <a href="https://t.me/n3xusg" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-lg">t.me/n3xusg</a>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg p-xl border border-subtle">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
