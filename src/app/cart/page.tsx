'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/components/CartProvider';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalPrice,
    clearCart,
    appliedCoupon,
    discountAmount,
    finalTotal,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponMessage('');
    setCouponError(false);

    const result = await applyCoupon(couponCode.trim().toUpperCase());

    setCouponLoading(false);
    setCouponMessage(result.message);
    setCouponError(!result.success);
    if (result.success) {
      setCouponCode('');
    }
  };

  if (!isClient) {
    return (
      <>
        <Navbar />
        <main className="pt-navbar min-h-screen">
          <div className="container py-2xl">
            <div className="skeleton" style={{ height: '60px', marginBottom: '2rem' }} />
            <div className="grid grid-3 gap-xl">
              <div className="skeleton" style={{ height: '300px' }} />
              <div className="skeleton" style={{ height: '300px' }} />
              <div className="skeleton" style={{ height: '300px' }} />
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
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-secondary">Cart</span>
          </nav>

          <h1 className="text-4xl font-heading text-primary glow-text mb-2xl">Your Cart</h1>

          {items.length === 0 ? (
            <div className="empty-state bg-card border border-subtle rounded-xl py-4xl">
              <div className="empty-state-icon">🛒</div>
              <h3 className="text-xl">Your cart is empty</h3>
              <p className="mb-xl max-w-md mx-auto">
                Looks like you haven't added anything yet. Explore our store to find digital products and services.
              </p>
              <div className="flex gap-md justify-center">
                <Link href="/store" className="btn btn-primary">Browse Store</Link>
                <Link href="/services" className="btn btn-secondary">View Services</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-3 gap-2xl" style={{ alignItems: 'start' }}>
              {/* Left Column — Cart Items (spans 2 cols) */}
              <div className="col-span-2 flex flex-col gap-xl">
                {/* Cart Header */}
                <div className="flex items-center justify-between">
                  <p className="text-secondary">
                    {items.reduce((s, i) => s + i.quantity, 0)} {items.reduce((s, i) => s + i.quantity, 0) === 1 ? 'item' : 'items'} in your cart
                  </p>
                  <button
                    onClick={clearCart}
                    className="text-sm text-tertiary hover:text-error transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-md">
                  {items.map((item, idx) => (
                    <div
                      key={`${item.id}-${item.type}-${idx}`}
                      className="bg-card border border-subtle rounded-xl p-lg flex gap-lg items-start hover:border-primary/30 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="w-24 h-24 rounded-lg bg-tertiary flex items-center justify-center border border-subtle flex-shrink-0 overflow-hidden">
                        {item.image && item.image.startsWith('/') ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl">{item.type === 'PRODUCT' ? '📦' : '🚀'}</span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-md mb-sm">
                          <div>
                            <h4 className="font-bold text-primary text-lg">{item.title}</h4>
                            <span className="badge badge-primary mt-sm">{item.type}</span>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.type)}
                            className="w-8 h-8 rounded-md bg-error/10 text-error flex items-center justify-center hover:bg-error hover:text-inverse transition-colors flex-shrink-0"
                            title="Remove from cart"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-md">
                          {/* Quantity */}
                          <div className="flex items-center gap-sm">
                            <span className="text-xs text-tertiary uppercase tracking-wider mr-sm">Qty</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                              className="w-9 h-9 rounded-md bg-secondary border border-subtle flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-colors"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-10 text-center font-mono text-primary">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                              className="w-9 h-9 rounded-md bg-secondary border border-subtle flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-colors"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="flex items-baseline justify-end gap-1">
                              <p className="font-heading font-bold text-xl text-primary">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                              {item.recurring && (
                                <span className="text-sm text-tertiary">
                                  /{item.recurring === 'month' ? 'mo' : 'yr'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-tertiary">
                              {formatCurrency(item.price)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="flex gap-md">
                  <Link href="/store" className="btn btn-ghost">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Right Column — Order Summary */}
              <div className="flex flex-col gap-xl">
                <div className="bg-card border border-subtle rounded-xl p-xl shadow-md">
                  <h2 className="text-xl font-heading text-primary mb-lg">Order Summary</h2>

                  {/* Line items */}
                  <div className="flex flex-col gap-sm mb-lg">
                    {items.map((item, idx) => (
                      <div key={`summary-${item.id}-${item.type}-${idx}`} className="flex justify-between text-sm">
                        <span className="text-secondary truncate max-w-[180px]">
                          {item.title}
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
                      <span className="text-tertiary font-mono text-xs">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="border-t border-subtle pt-lg mb-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-heading text-primary">Estimated Total</span>
                      <span className="text-2xl font-heading font-bold glow-text text-primary">{formatCurrency(finalTotal)}</span>
                    </div>
                    <p className="text-xs text-tertiary text-right mt-xs">USD</p>
                  </div>

                  <button
                    onClick={() => router.push('/checkout')}
                    className="btn btn-primary w-full py-lg text-lg mb-md"
                  >
                    <span className="flex items-center gap-sm justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      Proceed to Checkout
                    </span>
                  </button>

                  <Link href="/store" className="btn btn-ghost w-full text-center">
                    Continue Shopping
                  </Link>

                  <p className="text-xs text-center text-tertiary mt-lg">
                    Shipping & taxes calculated at checkout. Payments processed securely via Stripe.
                  </p>

                  <div className="flex items-center justify-center gap-md mt-lg">
                    <span className="text-tertiary text-lg">🔒</span>
                    <span className="text-xs text-tertiary">SSL Encrypted</span>
                    <span className="text-tertiary">•</span>
                    <span className="text-xs text-tertiary">PCI Compliant</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="bg-card border border-subtle rounded-xl p-xl shadow-md">
                  <h3 className="text-sm font-heading text-primary mb-md uppercase tracking-wider">Promo Code</h3>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-md rounded-lg bg-success/10 border border-success/30">
                      <div>
                        <p className="text-sm text-success font-bold">{appliedCoupon.code}</p>
                        <p className="text-xs text-success/70">
                          {appliedCoupon.type === 'PERCENTAGE'
                            ? `${appliedCoupon.value}% off`
                            : `${formatCurrency(appliedCoupon.value)} off`}
                        </p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-error hover:text-error/80 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-sm">
                        <input
                          type="text"
                          className="form-input flex-1"
                          placeholder="Enter code..."
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          disabled={couponLoading}
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                          className="btn btn-secondary btn-sm"
                        >
                          {couponLoading ? (
                            <span className="spinner spinner-sm" />
                          ) : (
                            'Apply'
                          )}
                        </button>
                      </div>
                      {couponMessage && (
                        <p className={`text-xs mt-sm ${couponError ? 'text-error' : 'text-success'}`}>
                          {couponMessage}
                        </p>
                      )}
                    </>
                  )}
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
