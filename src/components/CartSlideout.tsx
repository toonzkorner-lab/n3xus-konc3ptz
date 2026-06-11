'use client';

import React from 'react';
import { useCart } from './CartProvider';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartSlideout() {
  const { items, isOpen, toggleCart, removeFromCart, totalPrice, itemCount } = useCart();
  const router = useRouter();

  if (!isOpen) return null;

  const goToCheckout = () => {
    toggleCart();
    router.push('/checkout');
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[90] transition-opacity"
        onClick={toggleCart}
      />
      
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-secondary border-l border-subtle shadow-glow-lg z-[100] flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="p-lg border-b border-subtle flex justify-between items-center bg-card">
          <div>
            <h2 className="text-2xl font-heading text-primary glow-text">Your Cart</h2>
            <p className="text-xs text-secondary mt-xs">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          </div>
          <button 
            onClick={toggleCart}
            className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-secondary hover:text-primary hover:bg-primary-subtle transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-md">
          {items.length === 0 ? (
            <div className="text-center text-secondary mt-2xl flex flex-col items-center gap-md">
              <span className="text-5xl opacity-50">🛒</span>
              <p>Your cart is empty.</p>
              <button onClick={toggleCart} className="btn btn-secondary mt-md">Continue Browsing</button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.id}-${item.type}-${idx}`} className="bg-card border border-subtle rounded-xl p-md flex gap-md items-center">
                <div className="w-16 h-16 rounded-md bg-tertiary flex items-center justify-center border border-subtle flex-shrink-0 overflow-hidden">
                  {item.image && item.image.startsWith('/') ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">{item.type === 'PRODUCT' ? '📦' : '🚀'}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-primary truncate">{item.title}</h4>
                  <p className="text-xs text-secondary mb-xs">{item.type}</p>
                  <div className="flex justify-between items-center mt-sm">
                    <div className="flex items-baseline gap-1">
                      <span className="font-heading font-bold text-lg">{formatCurrency(item.price * item.quantity)}</span>
                      {item.recurring && (
                        <span className="text-sm text-tertiary">
                          /{item.recurring === 'month' ? 'mo' : 'yr'}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-tertiary">Qty: {item.quantity}</span>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id, item.type)}
                  className="w-8 h-8 rounded-md bg-error/10 text-error flex items-center justify-center hover:bg-error hover:text-inverse transition-colors flex-shrink-0"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-lg border-t border-subtle bg-card flex flex-col gap-md">
            <div className="flex justify-between items-center mb-md">
              <span className="text-lg text-secondary">Subtotal</span>
              <span className="text-2xl font-heading font-bold glow-text text-primary">{formatCurrency(totalPrice)}</span>
            </div>
            
            <button onClick={goToCheckout} className="btn btn-primary w-full py-md text-lg">
              Review & Checkout
            </button>
            <Link 
              href="/cart" 
              onClick={toggleCart}
              className="btn btn-ghost w-full text-center text-sm"
            >
              View Full Cart →
            </Link>
            <p className="text-xs text-center text-tertiary mt-sm">
              Shipping & taxes calculated at next step
            </p>
          </div>
        )}
      </div>
    </>
  );
}
