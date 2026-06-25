'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared) {
      clearCart();
      setCleared(true);
    }
  }, [clearCart, cleared]);

  return (
    <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
      {/* Success Icon */}
      <div style={{
        width: '96px', height: '96px', borderRadius: '50%',
        background: 'rgba(16, 185, 129, 0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto var(--space-2xl)',
        boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
        animation: 'scaleIn 0.6s ease'
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>

      <h1 className="text-4xl font-heading glow-text" style={{ color: 'var(--color-success)', marginBottom: 'var(--space-md)' }}>
        Payment Successful!
      </h1>
      <p className="text-xl" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2xl)' }}>
        Thank you for your purchase. Your order has been securely processed via Stripe.
      </p>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-xl)',
        marginBottom: 'var(--space-2xl)',
        textAlign: 'left'
      }}>
        <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: 'var(--space-md)' }}>What happens next?</h3>
        <ul className="text-left text-secondary space-y-md list-none mb-xl bg-primary-subtle/5 p-lg rounded-xl border border-subtle">
          <li>• A receipt has been sent to your email.</li>
          <li>• For <strong>Digital Products</strong>, you can download them directly from your Client Dashboard.</li>
          <li>• For <strong>Services</strong>, a member of our team will review your payment and contact you to begin scoping.</li>
        </ul>
        {sessionId && (
          <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
              Transaction ID: <span style={{ fontFamily: 'var(--font-mono)' }}>{sessionId.substring(0, 20)}...</span>
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/store" className="btn btn-primary">Return to Store</Link>
        <Link href="/" className="btn btn-outline">Back to Home</Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="pt-navbar min-h-screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Suspense fallback={<div style={{ textAlign: 'center' }}><div className="spinner-lg" style={{ margin: '0 auto' }}></div></div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
