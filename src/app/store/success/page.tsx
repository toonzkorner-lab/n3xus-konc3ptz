'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart once they land on success
    clearCart();
  }, [clearCart]);

  return (
    <div className="container max-w-2xl text-center">
      <div className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-xl">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      
      <h1 className="text-4xl font-heading text-primary glow-text mb-md">Payment Successful!</h1>
      <p className="text-xl text-secondary mb-2xl">
        Thank you for your purchase. Your order has been securely processed.
      </p>
      
      <div className="bg-card border border-subtle rounded-xl p-lg mb-2xl text-left">
        <h3 className="font-bold text-lg mb-sm">What happens next?</h3>
        <ul className="space-y-sm text-secondary">
          <li>• For <strong>Digital Products</strong>, you will receive an email with your download links shortly.</li>
          <li>• For <strong>Services</strong>, a member of our team will review your deposit and contact you to begin scoping.</li>
        </ul>
        {orderId && (
          <div className="mt-lg pt-md border-t border-subtle">
            <p className="text-sm text-tertiary">Order Reference: <span className="font-mono">{orderId}</span></p>
          </div>
        )}
      </div>

      <Link href="/store" className="btn btn-primary btn-lg">
        Return to Store
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="pt-navbar min-h-screen flex items-center justify-center">
        <Suspense fallback={<div className="container max-w-2xl text-center"><div className="spinner-lg mx-auto"></div></div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

