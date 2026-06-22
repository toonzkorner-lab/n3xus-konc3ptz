'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn, formatCurrency } from '@/lib/utils';
import { useCart } from './CartProvider';

interface StoreItemCardProps {
  id: string;
  type: 'PRODUCT' | 'SERVICE';
  title: string;
  description: string;
  images?: string[];
  icon?: string;
  features: string[];
  price: number;
  delay?: number;
  recurring?: string;
}

export default function StoreItemCard({
  id,
  type,
  title,
  description,
  images,
  icon,
  features,
  price,
  delay = 0,
  recurring,
}: StoreItemCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      type,
      title,
      price,
      quantity: 1,
      image: (images && images.length > 0) ? images[0] : icon,
      recurring: recurring as any,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div 
      className="card flex flex-col h-full"
      style={{ animationDelay: `${delay}ms`, animation: 'fadeInUp 0.6s ease backwards' }}
    >
      <div className="w-full h-48 mb-lg bg-tertiary rounded-lg border border-subtle overflow-hidden relative">
        {images && images.length > 0 ? (
          <img src={images[0]} alt={title} className="w-full h-full object-cover" />
        ) : icon ? (
           <div className="w-full h-full flex items-center justify-center text-5xl bg-secondary">
             {icon.startsWith('/') || icon.startsWith('http') ? (
                /\.(mp4|webm|ogg|mov)$/i.test(icon) ? (
                  <video src={icon} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                ) : (
                  <img src={icon} alt={title} className="w-full h-full object-cover" />
                )
             ) : (
               <span>{icon}</span>
             )}
           </div>
        ) : (
          <div className="w-full h-full bg-gradient-card"></div>
        )}
      </div>
      
      <h3 className="text-xl text-primary font-bold mb-xs">{title}</h3>
      <p className="text-sm text-secondary mb-lg flex-grow">{description}</p>
      
      <ul className="flex flex-col gap-sm mb-xl">
        {features.slice(0, 4).map((feature, idx) => (
          <li key={idx} className="flex items-start gap-sm text-sm text-tertiary">
            <svg className="w-4 h-4 text-primary mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      
      <div className="flex items-center justify-between pt-lg border-t border-subtle mt-auto">
        <div className="flex flex-col">
          <span className="text-xs text-tertiary uppercase tracking-wide">
            {type === 'SERVICE' ? 'Base Price' : 'Price'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-lg font-bold text-primary">
              {formatCurrency(price)}
            </span>
            {recurring && (
              <span className="text-sm text-tertiary">
                /{recurring === 'month' ? 'mo' : 'yr'}
              </span>
            )}
          </div>
        </div>
        
        <button 
          onClick={handleAddToCart} 
          disabled={added}
          className={cn(
            "btn btn-sm flex items-center gap-2 transition-colors",
            added ? "btn-primary" : "btn-secondary hover:bg-primary hover:text-inverse"
          )}
        >
          {added ? (
            '✓ Added!'
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

