'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './PortfolioGrid.module.css';
import { cn } from '@/lib/utils';

interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  imagePlaceholder?: boolean;
  images?: string[];
  clientProject?: boolean;
}

interface PortfolioGridProps {
  items: PortfolioItem[];
  limit?: number;
}

export default function PortfolioGrid({ items, limit }: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const categories = ['All', ...Array.from(new Set(items.map(item => item.category)))];
  
  const filteredItems = items
    .filter(item => activeFilter === 'All' || item.category === activeFilter)
    .slice(0, limit || items.length);

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        {categories.map((category) => (
          <button
            key={category}
            className={cn(styles.filterBtn, activeFilter === category && styles.active)}
            onClick={() => setActiveFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className={styles.grid}>
        {filteredItems.map((item, idx) => (
          <div 
            key={item.id} 
            className={styles.card}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className={styles.imageWrapper}>
              {item.images && item.images.length > 0 ? (
                (() => {
                  const mediaUrl = item.images[0];
                  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl);
                  return isVideo ? (
                    <video 
                      src={mediaUrl} 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      className="absolute inset-0 w-full h-full object-contain bg-[#0a0a1a]"
                    />
                  ) : (
                    <img 
                      src={mediaUrl} 
                      alt={item.title} 
                      className="absolute inset-0 w-full h-full object-contain bg-[#0a0a1a]"
                    />
                  );
                })()
              ) : (
                <div className={styles.gradientPlaceholder} />
              )}
              <div className={styles.overlay}>
                <Link href={`/portfolio/${item.slug}`} className={cn('btn', 'btn-primary')}>
                  View Project
                </Link>
              </div>
            </div>
            
            <div className={styles.content}>
              <h3 className={styles.title}>{item.title}</h3>
              <div className="flex items-center gap-sm mb-xs">
                <p className={styles.category} style={{ margin: 0 }}>{item.category}</p>
                {item.clientProject ? (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Client Project</span>
                ) : (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Studio Project</span>
                )}
              </div>
              <div className={styles.tags}>
                {item.tags.slice(0, 3).map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="empty-state">
          <p>No projects found in this category.</p>
        </div>
      )}
    </div>
  );
}
