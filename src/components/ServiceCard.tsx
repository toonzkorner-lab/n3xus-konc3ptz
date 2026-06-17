'use client';

import Link from 'next/link';
import styles from './ServiceCard.module.css';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { useCart } from './CartProvider';

interface ServiceCardProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  startingPrice: number;
  delay?: number;
}

export default function ServiceCard({
  id,
  slug,
  title,
  description,
  icon,
  features,
  startingPrice,
  delay = 0,
}: ServiceCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id,
      type: 'SERVICE',
      title,
      price: startingPrice,
      quantity: 1,
      image: icon,
    });
  };

  return (
    <div 
      className={cn('card', styles.card)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.iconWrapper}>
        {icon && (icon.startsWith('/uploads') || icon.startsWith('http')) ? (
          /\.(mp4|webm|ogg|mov)$/i.test(icon) ? (
            <video src={icon} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
          ) : (
            <img src={icon} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
          )
        ) : (
          <span className={styles.icon}>{icon}</span>
        )}
      </div>
      
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      
      <ul className={styles.features}>
        {features.slice(0, 4).map((feature, idx) => (
          <li key={idx} className={styles.feature}>
            <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
        {features.length > 4 && (
          <li className={styles.featureMore}>+ {features.length - 4} more features</li>
        )}
      </ul>
      
      <div className={styles.footer} style={{ flexDirection: 'column', gap: '1rem', alignItems: 'stretch' }}>
        <div className={styles.priceInfo} style={{ alignSelf: 'flex-start' }}>
          <span className={styles.priceLabel}>Base Deposit</span>
          <span className={styles.price}>{formatCurrency(startingPrice)}</span>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/services/${slug}`} className="btn btn-ghost flex-1 justify-center">
            Details
          </Link>
          <button 
            onClick={handleAddToCart} 
            className="btn btn-secondary flex-1 justify-center hover:bg-primary hover:text-inverse transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
