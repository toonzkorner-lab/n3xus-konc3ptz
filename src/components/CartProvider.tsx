'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItemType = 'PRODUCT' | 'SERVICE' | 'SUBSCRIPTION';

export interface CartItem {
  id: string;
  title: string;
  price: number; // in cents
  type: CartItemType;
  quantity: number;
  image?: string;
  recurring?: 'month' | 'year';
}

export interface AppliedCoupon {
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  description?: string;
}

interface CartContextProps {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, type: CartItemType) => void;
  updateQuantity: (id: string, type: CartItemType, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  totalPrice: number;
  itemCount: number;
  appliedCoupon: AppliedCoupon | null;
  discountAmount: number;
  finalTotal: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('nexus_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to parse cart or access localStorage', e);
    }

    try {
      const savedCoupon = localStorage.getItem('nexus_coupon');
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error('Failed to parse coupon or access localStorage', e);
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('nexus_cart', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to localStorage', e);
      }
    }
  }, [items, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      try {
        if (appliedCoupon) {
          localStorage.setItem('nexus_coupon', JSON.stringify(appliedCoupon));
        } else {
          localStorage.removeItem('nexus_coupon');
        }
      } catch (e) {
        console.error('Failed to save coupon to localStorage', e);
      }
    }
  }, [appliedCoupon, isInitialized]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existingItem = prev.find((i) => i.id === newItem.id && i.type === newItem.type);
      if (existingItem) {
        return prev.map((i) =>
          i.id === newItem.id && i.type === newItem.type
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string, type: CartItemType) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
  };

  const updateQuantity = (id: string, type: CartItemType, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id, type);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.type === type ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderTotal: totalPrice }),
      });
      const data = await res.json();

      if (data.valid) {
        setAppliedCoupon({
          code: data.code,
          type: data.type,
          value: data.value,
          description: data.description,
        });
        return { success: true, message: `Coupon applied! You saved ${data.discountFormatted}.` };
      } else {
        return { success: false, message: data.error || 'Invalid coupon code.' };
      }
    } catch (e) {
      console.error('Coupon validation error:', e);
      return { success: false, message: 'Failed to validate coupon. Please try again.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate discount
  const discountAmount = (() => {
    if (!appliedCoupon || totalPrice === 0) return 0;
    if (appliedCoupon.type === 'PERCENTAGE') {
      return Math.floor((totalPrice * appliedCoupon.value) / 100);
    }
    // FIXED
    return Math.min(appliedCoupon.value, totalPrice);
  })();

  const finalTotal = totalPrice - discountAmount;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        totalPrice,
        itemCount,
        appliedCoupon,
        discountAmount,
        finalTotal,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
