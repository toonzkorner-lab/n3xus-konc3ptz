import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact | N3xUs Konc3pt\'z',
  description: 'Get in touch with us to start your next digital project.',
  alternates: {
    canonical: 'https://n3xuskonc3ptz.com/contact',
  },
  openGraph: {
    title: 'Contact | N3xUs Konc3pt\'z',
    description: 'Get in touch with us to start your next digital project.',
    url: 'https://n3xuskonc3ptz.com/contact',
    siteName: 'N3xUs Konc3pt\'z',
    images: [{ url: 'https://n3xuskonc3ptz.com/logo.jpg', width: 800, height: 800, alt: 'N3xUs Logo' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | N3xUs Konc3pt\'z',
    description: 'Get in touch with us to start your next digital project.',
    images: ['https://n3xuskonc3ptz.com/logo.jpg'],
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-navbar">
        {/* Page Header */}
        <section className="section bg-secondary relative overflow-hidden" style={{ minHeight: '30vh', display: 'flex', alignItems: 'center' }}>
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'var(--gradient-card)' }}></div>
          <div className="container relative z-10 text-center">
            <h1 className="text-5xl mb-md glow-text">Establish Connection</h1>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              Ready to transcend the ordinary? Send us a transmission.
            </p>
          </div>
        </section>

        {/* Contact Layout */}
        <section className="section">
          <div className="container">
            <div className="grid grid-2 gap-2xl">
              <div>
                <h2 className="text-3xl mb-lg text-primary">Direct Comms</h2>
                <p className="text-lg text-secondary mb-xl leading-relaxed">
                  Whether you have a fully formed concept or just the spark of an idea, we're ready to listen. Our team is available for consulting, custom development, and full-scale digital transformations.
                </p>
                
                <div className="flex flex-col gap-lg mt-xl">
                  <div className="bg-card p-lg rounded-lg border border-subtle flex items-start gap-md">
                    <div className="text-3xl text-primary mt-1">📧</div>
                    <div>
                      <h4 className="text-lg font-heading text-primary mb-xs">Email Transmission</h4>
                      <p className="text-secondary text-sm mb-sm">For general inquiries and project proposals.</p>
                      <a href="mailto:contact@n3xuskonc3ptz.com" className="text-md font-mono text-accent hover:underline">contact@n3xuskonc3ptz.com</a>
                    </div>
                  </div>
                  
                  <div className="bg-card p-lg rounded-lg border border-subtle flex items-start gap-md">
                    <div className="text-3xl text-secondary mt-1">📘</div>
                    <div>
                      <h4 className="text-lg font-heading text-secondary mb-xs">Facebook Page</h4>
                      <p className="text-secondary text-sm mb-sm">Connect with us on Facebook for updates and messaging.</p>
                      <a href="https://www.facebook.com/profile.php?id=61590253607463" target="_blank" rel="noopener noreferrer" className="text-md font-mono text-primary hover:underline">N3xUs Konc3pt'z FB</a>
                    </div>
                  </div>

                  <div className="bg-card p-lg rounded-lg border border-subtle flex items-start gap-md">
                    <div className="text-3xl mt-1" style={{ color: '#5865F2' }}>💬</div>
                    <div>
                      <h4 className="text-lg font-heading mb-xs" style={{ color: '#5865F2' }}>Discord Server</h4>
                      <p className="text-secondary text-sm mb-sm">Join our community and chat with our team directly.</p>
                      <a href="https://discord.gg/3UHWMa7rC" target="_blank" rel="noopener noreferrer" className="text-md font-mono text-primary hover:underline">discord.gg/3UHWMa7rC</a>
                    </div>
                  </div>

                  <div className="bg-card p-lg rounded-lg border border-subtle flex items-start gap-md">
                    <div className="text-3xl mt-1" style={{ color: '#0088cc' }}>📱</div>
                    <div>
                      <h4 className="text-lg font-heading mb-xs" style={{ color: '#0088cc' }}>Telegram</h4>
                      <p className="text-secondary text-sm mb-sm">Message us directly on Telegram for fast responses.</p>
                      <a href="https://t.me/n3xusg" target="_blank" rel="noopener noreferrer" className="text-md font-mono text-primary hover:underline">t.me/n3xusg</a>
                    </div>
                  </div>
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
