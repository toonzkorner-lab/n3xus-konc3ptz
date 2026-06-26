import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | N3xUs Konc3pt\'z',
  description: 'Privacy Policy for N3xUs Konc3pt\'z Digital Design Studio',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="container py-20" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '120px' }}>
        <h1 className="neon-text" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Privacy Policy</h1>
        <div style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
          <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <h2 style={{ color: 'var(--foreground)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>1. Information We Collect</h2>
          <p>When you use our services, we may collect the following types of information:</p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', margin: '1rem 0' }}>
            <li><strong>Personal Information:</strong> Name, email address, and billing information when you register an account, make a purchase, or contact us.</li>
            <li><strong>Usage Data:</strong> Information on how you access and use our website, including your IP address, browser type, and page interactions.</li>
            <li><strong>Bot Data:</strong> For managed bot hosting, we temporarily process but do not permanently store end-user message data unless specifically requested and engineered into your custom bot requirements.</li>
          </ul>

          <h2 style={{ color: 'var(--foreground)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>2. How We Use Your Information</h2>
          <p>We use the collected information for various purposes:</p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', margin: '1rem 0' }}>
            <li>To provide and maintain our Service.</li>
            <li>To process your payments and manage your subscriptions (via our payment processor, Stripe).</li>
            <li>To notify you about changes to our Service.</li>
            <li>To provide customer support and respond to your inquiries.</li>
            <li>To send you newsletters and marketing communications (only if you have opted in).</li>
          </ul>

          <h2 style={{ color: 'var(--foreground)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>3. Data Storage and Security</h2>
          <p>The security of your data is important to us. We use commercially acceptable means to protect your Personal Information, including encrypted databases and secure communication protocols. However, remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure.</p>

          <h2 style={{ color: 'var(--foreground)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>4. Third-Party Service Providers</h2>
          <p>We may employ third-party companies and individuals to facilitate our Service, provide the Service on our behalf, or assist us in analyzing how our Service is used. These third parties include:</p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', margin: '1rem 0' }}>
            <li><strong>Stripe:</strong> For secure payment processing. We do not store your credit card details on our servers.</li>
            <li><strong>Vercel & Coolify:</strong> For website and application hosting analytics.</li>
          </ul>

          <h2 style={{ color: 'var(--foreground)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>5. Your Data Rights</h2>
          <p>Depending on your location, you may have the right to access, update, or delete the personal information we have on you. If you wish to be informed what Personal Information we hold about you and if you want it to be removed from our systems, please contact us via our support ticket system or email.</p>

          <h2 style={{ color: 'var(--foreground)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>6. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us by creating a support ticket in your client dashboard.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
