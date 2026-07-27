'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.particleContainer}>
        {mounted && Array.from({ length: 30 }).map((_, i) => (
          <span 
            key={i} 
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 3}s`,
              animationDelay: `${Math.random() * 5}s`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
            }}
          ></span>
        ))}
      </div>

      <div className={styles.floatingShapes}>
        <div className={cn(styles.shape, styles.hexagon)}></div>
        <div className={cn(styles.shape, styles.triangle)}></div>
        <div className={cn(styles.shape, styles.circle)}></div>
      </div>

      <div className={cn('container', styles.content)}>
        <div className={styles.logoWrapper}>
          <Image 
            src="/logo.jpg" 
            alt="N3xUs Konc3pt'z" 
            width={900} 
            height={300} 
            priority
            className={styles.logo}
          />
        </div>
        
        <h1 className={styles.title}>
          <span className={styles.glitch} data-text="Design. Development. Deployment.">Design. Development. Deployment.</span>
        </h1>
        
        <p className={styles.subtitle}>
          Mastering the 3 D's of digital success. We craft stunning website designs, build robust custom web applications, and handle seamless global deployments to propel your brand beyond the ordinary.
        </p>
        
        <div className={styles.actions}>
          <Link href="/services" className={cn('btn', 'btn-primary', 'btn-lg', styles.btnPrimary)}>
            Explore Services
          </Link>
          <Link href="/portfolio" className={cn('btn', 'btn-secondary', 'btn-lg', styles.btnSecondary)}>
            View Portfolio
          </Link>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span className={styles.scrollText}>Scroll Down</span>
        <div className={styles.scrollArrow}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
