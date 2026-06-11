'use client';

import { useState } from 'react';
import { useCart, CartItemType } from './CartProvider';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  id: string;
  title: string;
  price: number;
  type: CartItemType;
  image?: string;
  className?: string;
}

export default function AddToCartButton({
  id,
  title,
  price,
  type,
  image,
  className
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id,
      title,
      price,
      type,
      quantity: 1,
      image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button 
      onClick={handleAddToCart} 
      className={cn("btn", added ? "btn-primary" : "btn-secondary", className)}
      disabled={added}
    >
      {added ? '✓ Added!' : 'Add to Cart'}
    </button>
  );
}
