import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | N3xUs Konc3pt\'z',
  description: 'Terms of Service for N3xUs Konc3pt\'z Digital Design Studio',
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="container py-20" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '120px' }}>
        <h1 className="neon-text" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Terms of Service</h1>
        <div style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
          <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <h2 style={{ color: 'var(--foreground)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>1. Agreement to Terms</h2>
          <p>By accessing or using the services provided by N3xUs Konc3pt'z, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.</p>
          
          <h2 style={{ color: 'var(--foreground)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>2. Services Provided</h2>
          <p>N3xUs Konc3pt'z provides digital design, API development, custom bot development (Discord/Telegram), and managed hosting services. The specific deliverables, timeline, and cost for custom projects will be outlined in a separate Statement of Work or invoice.</p>
          
          <h2 style={{ color: 'var(--foreground)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>3. Payment and Subscriptions</h2>
          <p>Payments for one-off projects and recurring hosting services are processed securely via Stripe. Recurring subscriptions are billed in advance on a monthly or annual basis. You may cancel your subscription at any time through your client dashboard. No refunds are provided for partial subscription periods.</p>

          <h2 style={{ color: 'var(--foreground)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>4. Intellectual Property</h2>
          <p>Upon full payment, you are granted a non-exclusive license to use the custom software, bots, or designs created for you. N3xUs Konc3pt'z retains the right to use non-confidential components, templates, and concepts in future projects, and reserves the right to display the completed work in our portfolio unless a Non-Disclosure Agreement (NDA) is signed.</p>

          <h2 style={{ color: 'var(--foreground)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>5. Limitation of Liability</h2>
          <p>In no event shall N3xUs Konc3pt'z, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

          <h2 style={{ color: 'var(--foreground)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>6. Acceptable Use of Hosted Bots</h2>
          <p>Bots hosted on our managed infrastructure must not be used to violate the Terms of Service of their respective platforms (e.g., Discord, Telegram). We reserve the right to suspend or terminate hosting services for bots found to be engaging in spam, malicious activities, or illegal behavior.</p>

          <h2 style={{ color: 'var(--foreground)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>7. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
