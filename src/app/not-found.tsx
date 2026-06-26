import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: '404 — Signal Lost | N3xUs Konc3pt\'z',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="cosmic-bg"><div className="stars"></div></div>
        
        <style>{`
          @keyframes glitch {
            0% { text-shadow: 2px 0 var(--color-accent), -2px 0 var(--color-primary); transform: translate(0); }
            20% { text-shadow: -3px 0 var(--color-accent), 3px 0 var(--color-primary); transform: translate(-2px, 2px); }
            40% { text-shadow: 3px 0 var(--color-accent), -3px 0 var(--color-primary); transform: translate(2px, -1px); }
            60% { text-shadow: -2px 0 var(--color-accent), 2px 0 var(--color-primary); transform: translate(1px, 1px); }
            80% { text-shadow: 5px 0 var(--color-accent), -5px 0 var(--color-primary); transform: translate(-1px, -2px); }
            100% { text-shadow: 2px 0 var(--color-accent), -2px 0 var(--color-primary); transform: translate(0); }
          }
          .glitch-text {
            animation: glitch 2s infinite;
            font-size: clamp(8rem, 20vw, 16rem);
            font-weight: 900;
            color: var(--text-primary);
            line-height: 1;
            letter-spacing: -0.05em;
          }
          @keyframes scanline {
            0% { top: -100%; }
            100% { top: 100%; }
          }
          .scanline::after {
            content: '';
            position: absolute;
            top: -100%;
            left: 0;
            width: 100%;
            height: 50%;
            background: linear-gradient(transparent, rgba(0,240,255,0.03), transparent);
            animation: scanline 4s linear infinite;
            pointer-events: none;
          }
        `}</style>

        <div className="relative z-10 text-center scanline" style={{ padding: 'var(--space-2xl)' }}>
          <div className="glitch-text font-heading">404</div>
          
          <h1 className="text-3xl font-heading text-primary mb-md mt-lg glow-text">
            Signal Lost in the Digital Void
          </h1>
          
          <p className="text-lg text-secondary mb-2xl" style={{ maxWidth: '500px', margin: '0 auto var(--space-2xl)' }}>
            The transmission you&apos;re looking for doesn&apos;t exist or has been moved to another dimension.
          </p>
          
          <div className="flex gap-md justify-center flex-wrap">
            <Link href="/" className="btn btn-primary btn-lg">
              Return to Base
            </Link>
            <Link href="/contact" className="btn btn-secondary btn-lg">
              Report Issue
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
