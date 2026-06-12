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
    canonical: 'https://n3xuskonceptz.com/',
  },
  openGraph: {
    title: 'N3xUs Konc3pt\'z | Digital Design Studio',
    description: 'The premier digital design studio for the next generation of the web.',
    url: 'https://n3xuskonceptz.com/',
    siteName: 'N3xUs Konc3pt\'z',
    images: [{ url: 'https://n3xuskonceptz.com/logo.jpg', width: 800, height: 800, alt: 'N3xUs Logo' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'N3xUs Konc3pt\'z | Digital Design Studio',
    description: 'The premier digital design studio for the next generation of the web.',
    images: ['https://n3xuskonceptz.com/logo.jpg'],
  },
};

export default async function Home() {
  // Fetch services from DB
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
    take: 3
  });

  // Mock portfolio items for the homepage
  const portfolioItems = [
    {
      id: '1',
      slug: 'neon-nexus-bot',
      title: 'Neon Nexus Discord Bot',
      category: 'Bots',
      tags: ['Discord', 'Node.js', 'AI Integration']
    },
    {
      id: '2',
      slug: 'cyber-trade-platform',
      title: 'Cyber Trade Platform',
      category: 'Web Design',
      tags: ['Next.js', 'Web3', 'Tailwind CSS']
    },
    {
      id: '3',
      slug: 'stellar-api-gateway',
      title: 'Stellar API Gateway',
      category: 'API',
      tags: ['Express', 'Redis', 'Docker']
    }
  ];

  // Mock testimonials
  const testimonials = [
    {
      id: 't1',
      clientName: 'Alex Mercer',
      clientRole: 'Community Manager',
      clientCompany: 'Cyber Gaming',
      content: 'N3xUs Konc3pt\'z built us a Discord bot that completely transformed our community engagement. The custom economy system and AI moderation are flawless.',
      rating: 5
    },
    {
      id: 't2',
      clientName: 'Sarah Jenkins',
      clientRole: 'CEO',
      clientCompany: 'Future Tech Solutions',
      content: 'The web design they delivered for our new SaaS platform was nothing short of spectacular. They truly understand the cosmic cyberpunk aesthetic.',
      rating: 5
    },
    {
      id: 't3',
      clientName: 'Marcus Wright',
      clientRole: 'Operations Director',
      clientCompany: 'Global Trade',
      content: 'Our Telegram automation workflows are now seamless. What used to take hours is now handled instantly by the custom bot they developed.',
      rating: 4
    }
  ];

  // Stats
  const stats = [
    { label: 'Projects Completed', value: 150, suffix: '+' },
    { label: 'Discord Bots Deployed', value: 45, suffix: '+' },
    { label: 'Lines of Code', value: 500, suffix: 'k+' },
    { label: 'Client Satisfaction', value: 99, suffix: '%' }
  ];

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        
        {/* Services Section */}
        <section id="services" className="section bg-secondary">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Our Services</h2>
              <p className="section-subtitle">
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
            
            <div className="text-center mt-xl">
              <Link href="/services" className="btn btn-secondary">
                View All Services
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section pb-0">
          <div className="container">
            <StatsCounter stats={stats} />
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Featured Work</h2>
              <p className="section-subtitle">
                A glimpse into our digital universe
              </p>
            </div>
            
            <PortfolioGrid items={portfolioItems} limit={3} />
            
            <div className="text-center mt-xl">
              <Link href="/portfolio" className="btn btn-secondary">
                Explore Portfolio
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section bg-secondary">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Client Transmissions</h2>
              <p className="section-subtitle">
                What others say about their journey with N3xUs
              </p>
            </div>
            
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>

        {/* CTA & Contact Section */}
        <section className="section">
          <div className="container">
            <div className="grid grid-2" style={{ alignItems: 'center' }}>
              <div>
                <h2 className="text-4xl mb-lg glow-text">Ready to Launch Your Next Project?</h2>
                <p className="text-lg text-secondary mb-xl">
                  Whether you need a complex Discord bot, a sleek new web application, or a complete digital transformation, our team is ready to bring your vision to life.
                </p>
                
                <div className="mt-xl">
                  <h4 className="text-xl mb-md text-primary">Direct Comm Channels</h4>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--color-primary)' }}>📧</span> hello@n3xuskonc3ptz.com
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--color-primary)' }}>💬</span> discord.gg/n3xus
                    </li>
                  </ul>
                </div>
              </div>
              
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
