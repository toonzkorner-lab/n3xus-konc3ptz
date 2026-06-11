import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact | N3xUs Konc3pt\'z',
  description: 'Get in touch with us to start your next digital project.',
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
                      <a href="mailto:hello@n3xuskonc3ptz.com" className="text-md font-mono text-accent hover:underline">hello@n3xuskonc3ptz.com</a>
                    </div>
                  </div>
                  
                  <div className="bg-card p-lg rounded-lg border border-subtle flex items-start gap-md">
                    <div className="text-3xl text-secondary mt-1">💬</div>
                    <div>
                      <h4 className="text-lg font-heading text-secondary mb-xs">Discord Server</h4>
                      <p className="text-secondary text-sm mb-sm">Join our community for faster response times and direct chat.</p>
                      <a href="#" className="text-md font-mono text-accent hover:underline">discord.gg/n3xus</a>
                    </div>
                  </div>
                  
                  <div className="bg-card p-lg rounded-lg border border-subtle flex items-start gap-md">
                    <div className="text-3xl text-accent mt-1">📱</div>
                    <div>
                      <h4 className="text-lg font-heading text-accent mb-xs">Telegram Portal</h4>
                      <p className="text-secondary text-sm mb-sm">Connect with our automated routing bot.</p>
                      <a href="#" className="text-md font-mono text-primary hover:underline">@N3xUs_Support_Bot</a>
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
        
        {/* FAQ Preview */}
        <section className="section bg-secondary">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Transmission Guidelines</h2>
              <p className="section-subtitle">Commonly requested coordinates</p>
            </div>
            
            <div className="max-w-3xl mx-auto flex flex-col gap-md">
              <div className="bg-card border border-subtle rounded-lg p-lg">
                <h4 className="text-lg text-primary mb-sm">What is your typical project timeline?</h4>
                <p className="text-secondary text-sm">Most custom Discord/Telegram bots take 2-4 weeks. Full web applications and design projects typically range from 4-8 weeks depending on complexity.</p>
              </div>
              <div className="bg-card border border-subtle rounded-lg p-lg">
                <h4 className="text-lg text-primary mb-sm">Do you offer ongoing maintenance?</h4>
                <p className="text-secondary text-sm">Yes. All our projects come with an optional cosmic maintenance plan ensuring your systems stay online, updated, and secure against digital threats.</p>
              </div>
              <div className="bg-card border border-subtle rounded-lg p-lg">
                <h4 className="text-lg text-primary mb-sm">What payment methods do you accept?</h4>
                <p className="text-secondary text-sm">We accept major credit cards via Stripe, wire transfers, and select cryptocurrencies (BTC, ETH, USDC) for web3 projects.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
