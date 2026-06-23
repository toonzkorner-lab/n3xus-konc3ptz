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
                
                <div className="flex flex-wrap gap-md mt-xl">
                  {/* Email */}
                  <a href="mailto:contact@n3xuskonc3ptz.com" className="w-16 h-16 rounded-full bg-card border border-subtle flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all hover:-translate-y-1 group" aria-label="Email Us">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </a>

                  {/* Phone */}
                  <a href="tel:+12108900172" className="w-16 h-16 rounded-full bg-card border border-subtle flex items-center justify-center hover:border-green-500 hover:bg-green-500/10 transition-all hover:-translate-y-1 group" aria-label="Call or Text Us">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary group-hover:text-green-500 transition-colors">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </a>
                  
                  {/* Facebook */}
                  <a href="https://www.facebook.com/profile.php?id=61590253607463" target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-full bg-card border border-subtle flex items-center justify-center hover:border-[#1877F2] hover:bg-[#1877F2]/10 transition-all hover:-translate-y-1 group" aria-label="Facebook">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-secondary group-hover:text-[#1877F2] transition-colors">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>

                  {/* Discord */}
                  <a href="https://discord.gg/3UHWMa7rC" target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-full bg-card border border-subtle flex items-center justify-center hover:border-[#5865F2] hover:bg-[#5865F2]/10 transition-all hover:-translate-y-1 group" aria-label="Discord">
                    <svg width="28" height="28" viewBox="0 0 127.14 96.36" fill="currentColor" className="text-secondary group-hover:text-[#5865F2] transition-colors">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.68,65.33C38.08,65.33,34.2,61,34.2,55.77s3.79-9.56,8.48-9.56c4.71,0,8.54,4.36,8.48,9.56C51.16,61,47.39,65.33,42.68,65.33Zm41.83,0c-4.6,0-8.48-4.36-8.48-9.56s3.79-9.56,8.48-9.56c4.71,0,8.54,4.36,8.48,9.56C84.51,61,80.74,65.33,84.51,65.33Z"/>
                    </svg>
                  </a>

                  {/* Telegram */}
                  <a href="https://t.me/n3xusg" target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-full bg-card border border-subtle flex items-center justify-center hover:border-[#0088cc] hover:bg-[#0088cc]/10 transition-all hover:-translate-y-1 group" aria-label="Telegram">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-secondary group-hover:text-[#0088cc] transition-colors">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.46.93-4.12 2.73-.39.27-.74.41-1.05.4-.34-.01-1-.19-1.49-.35-.6-.2-1.08-.31-1.04-.66.02-.18.27-.36.75-.55 2.94-1.28 4.9-2.12 5.88-2.53 2.79-1.16 3.37-1.36 3.75-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
                    </svg>
                  </a>
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
