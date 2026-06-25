'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/components/CartProvider';
import { formatCurrency } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalPrice,
    appliedCoupon,
    discountAmount,
    finalTotal,
  } = useCart();
  const { data: session } = useSession();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  // Pre-fill from session if logged in
  useEffect(() => {
    setIsClient(true);
    if (session?.user?.name) setCustomerName(session.user.name);
    if (session?.user?.email) setCustomerEmail(session.user.email);
  }, [session]);

  const fetchClientSecret = useCallback(async () => {
    if (items.length === 0) return null;
    setError('');
    
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          couponCode: appliedCoupon?.code || null,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to initialize checkout');
        return null;
      }
      return data.url;
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
      return null;
    }
  }, [items, appliedCoupon]);

  // Removed auto-fetch to only create session on button click

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <>
        <Navbar />
        <main className="pt-navbar min-h-screen">
          <div className="container py-2xl">
            <div className="skeleton" style={{ height: '60px', marginBottom: '2rem' }} />
            <div className="grid grid-2 gap-xl">
              <div className="skeleton" style={{ height: '400px' }} />
              <div className="skeleton" style={{ height: '400px' }} />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-navbar min-h-screen">
        <div className="container py-2xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-sm text-sm text-tertiary mb-xl">
            <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
            <span>/</span>
            <span className="text-secondary">Checkout</span>
          </nav>

          <h1 className="text-4xl font-heading text-primary glow-text mb-2xl">Secure Checkout</h1>

          {items.length === 0 ? (
            <div className="empty-state bg-card border border-subtle rounded-xl">
              <div className="empty-state-icon">🛒</div>
              <h3 className="text-xl">Your cart is empty</h3>
              <p className="mb-xl">Add some items from the store to get started.</p>
              <Link href="/store" className="btn btn-primary">Browse Store</Link>
            </div>
          ) : (
            <div className="grid grid-2 gap-2xl" style={{ alignItems: 'start' }}>
              {/* Left Column — Cart & Order Summary */}
              <div className="flex flex-col gap-2xl">
                {/* Cart Items */}
                <div className="bg-card border border-subtle rounded-xl p-xl shadow-md">
                  <div className="flex items-center justify-between mb-lg border-b border-subtle pb-sm">
                    <h2 className="text-xl font-heading text-primary">Order Items ({items.reduce((s, i) => s + i.quantity, 0)})</h2>
                    <Link href="/store" className="text-sm text-accent hover:underline font-mono">+ ADD MORE_</Link>
                  </div>

                  <div className="flex flex-col gap-md">
                    {items.map((item, idx) => (
                      <div
                        key={`${item.id}-${item.type}-${idx}`}
                        className="flex gap-md items-center p-md rounded-lg bg-tertiary border border-subtle hover:border-primary/30 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-md bg-secondary flex items-center justify-center border border-subtle flex-shrink-0 overflow-hidden">
                          {item.image && item.image.startsWith('/') ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">{item.type === 'PRODUCT' ? '📦' : '🚀'}</span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-primary truncate">{item.title}</h4>
                          <p className="text-xs text-secondary">{item.type}</p>
                          <p className="text-sm font-heading font-bold text-primary mt-xs">
                            {formatCurrency(item.price)} <span className="text-tertiary font-normal">each</span>
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-sm flex-shrink-0">
                          <button
                            onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                            className="w-8 h-8 rounded-md bg-secondary border border-subtle flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-colors"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-mono text-sm text-primary">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                            className="w-8 h-8 rounded-md bg-secondary border border-subtle flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Line Total & Remove */}
                        <div className="flex flex-col items-end gap-sm flex-shrink-0 min-w-[80px]">
                          <span className="font-heading font-bold text-primary">{formatCurrency(item.price * item.quantity)}</span>
                          <button
                            onClick={() => removeFromCart(item.id, item.type)}
                            className="text-xs text-tertiary hover:text-error transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Totals Summary */}
                  <div className="border-t border-subtle pt-lg mt-lg">
                    <div className="flex justify-between items-center mb-sm">
                      <span className="text-secondary">Subtotal</span>
                      <span className="text-primary font-mono">{formatCurrency(totalPrice)}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between items-center mb-sm">
                        <span className="text-success flex items-center gap-sm">
                          <span>Discount</span>
                          <span className="badge badge-success text-[10px]">{appliedCoupon.code}</span>
                        </span>
                        <span className="text-success font-mono">−{formatCurrency(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center mb-sm">
                      <span className="text-secondary">Taxes</span>
                      <span className="text-tertiary font-mono text-xs">Calculated at payment</span>
                    </div>
                  </div>

                  <div className="border-t border-subtle pt-lg mt-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-heading text-primary">Total</span>
                      <span className="text-3xl font-heading font-bold glow-text text-primary">{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column — Checkout Actions */}
              <div className="flex flex-col gap-2xl">
                <div className="bg-card border border-subtle rounded-xl p-xl shadow-md sticky" style={{ top: 'calc(var(--navbar-height) + 2rem)' }}>
                  <h3 className="text-xl font-heading text-primary mb-md">Payment Details</h3>
                  <p className="text-secondary text-sm mb-lg">
                    You will be redirected to Stripe's secure checkout page to complete your payment securely. We support all major credit cards, Apple Pay, and Google Pay.
                  </p>
                  
                  {error && (
                    <div className="mb-lg p-md bg-error/10 border-l-4 border-error text-error text-sm rounded">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      setIsClient(false); // Disable button
                      const url = await fetchClientSecret();
                      if (url) {
                        window.location.href = url;
                      } else {
                        setIsClient(true);
                      }
                    }}
                    disabled={!isClient}
                    className="btn btn-primary w-full py-lg text-lg flex justify-center items-center gap-sm"
                  >
                    {!isClient ? (
                      <>
                        <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        🔒 Proceed to Payment
                      </>
                    )}
                  </button>

                  <div className="mt-lg flex items-center justify-center gap-md opacity-70">
                    {/* Trust badges placeholders */}
                    <span className="text-xs text-tertiary uppercase tracking-wider font-bold">Guaranteed Safe & Secure</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
