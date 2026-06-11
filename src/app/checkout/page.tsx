'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/components/CartProvider';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalPrice,
    clearCart,
    appliedCoupon,
    discountAmount,
    finalTotal,
  } = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Pre-fill from session if logged in
  useEffect(() => {
    setIsClient(true);
    if (session?.user?.name) setCustomerName(session.user.name);
    if (session?.user?.email) setCustomerEmail(session.user.email);
  }, [session]);

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setError('');
    setIsLoading(true);

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

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Checkout failed. Please try again.');
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred during checkout. Please try again.');
      setIsLoading(false);
    }
  };

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
              {/* Left Column — Cart & Customer Info */}
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
                </div>

                {/* Applied Coupon (if any) */}
                {appliedCoupon && (
                  <div className="bg-card border border-subtle rounded-xl p-xl shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-heading text-primary mb-sm">Promo Code Applied</h2>
                        <div className="flex items-center gap-sm">
                          <span className="badge badge-success">{appliedCoupon.code}</span>
                          <span className="text-sm text-secondary">
                            {appliedCoupon.type === 'PERCENTAGE'
                              ? `${appliedCoupon.value}% off`
                              : `${formatCurrency(appliedCoupon.value)} off`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-secondary">You save</p>
                        <p className="text-xl font-heading font-bold text-success">{formatCurrency(discountAmount)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Info */}
                <div className="bg-card border border-subtle rounded-xl p-xl shadow-md">
                  <h2 className="text-xl font-heading text-primary mb-lg">Customer Information</h2>

                  <div className="grid grid-2 gap-lg">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" htmlFor="customerName">Full Name</label>
                      <input
                        id="customerName"
                        type="text"
                        className="form-input"
                        placeholder="John Doe"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" htmlFor="customerEmail">Email Address</label>
                      <input
                        id="customerEmail"
                        type="email"
                        className="form-input"
                        placeholder="john@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {!session && (
                    <p className="text-xs text-tertiary mt-lg">
                      Already have an account?{' '}
                      <Link href="/auth/login" className="text-accent hover:underline">Log in</Link>{' '}
                      for faster checkout.
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column — Order Summary */}
              <div className="flex flex-col gap-2xl">
                <div className="bg-card border border-subtle rounded-xl p-xl shadow-md sticky" style={{ top: 'calc(var(--navbar-height) + 2rem)' }}>
                  <h2 className="text-xl font-heading text-primary mb-lg">Order Summary</h2>

                  {/* Line items */}
                  <div className="flex flex-col gap-sm mb-lg">
                    {items.map((item, idx) => (
                      <div key={`summary-${item.id}-${item.type}-${idx}`} className="flex justify-between text-sm">
                        <span className="text-secondary">
                          {item.title} <span className="text-tertiary">× {item.quantity}</span>
                        </span>
                        <span className="text-primary font-mono">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-subtle pt-lg mb-lg">
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

                  <div className="border-t border-subtle pt-lg mb-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-heading text-primary">Total</span>
                      <span className="text-3xl font-heading font-bold glow-text text-primary">{formatCurrency(finalTotal)}</span>
                    </div>
                    <p className="text-xs text-tertiary text-right mt-xs">USD</p>
                  </div>

                  {error && (
                    <div className="bg-error/10 border border-error/30 rounded-md p-md mb-lg">
                      <p className="text-sm text-error">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="btn btn-primary w-full py-lg text-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-sm">
                        <span className="spinner spinner-sm" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-sm">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        Proceed to Payment
                      </span>
                    )}
                  </button>

                  <p className="text-xs text-center text-tertiary mt-lg">
                    Payments processed securely via Stripe. Your card details are never stored on our servers.
                  </p>

                  <div className="flex items-center justify-center gap-md mt-lg">
                    <span className="text-tertiary text-lg">🔒</span>
                    <span className="text-xs text-tertiary">SSL Encrypted</span>
                    <span className="text-tertiary">•</span>
                    <span className="text-xs text-tertiary">PCI Compliant</span>
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
