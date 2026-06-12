'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { cn } from '@/lib/utils';
import { useCart } from './CartProvider';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { items, itemCount } = useCart();

  useEffect(() => {
    setMounted(true);
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '20px';
    sentinel.style.left = '0';
    sentinel.style.width = '1px';
    sentinel.style.height = '1px';
    sentinel.style.visibility = 'hidden';
    sentinel.style.pointerEvents = 'none';
    document.body.appendChild(sentinel);

    const observer = new IntersectionObserver(([entry]) => {
      setScrolled(!entry.isIntersecting);
    });
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      if (document.body.contains(sentinel)) {
        document.body.removeChild(sentinel);
      }
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { 
      name: 'Services', 
      href: '/services',
      subLinks: [
        { name: 'Discord Bots', href: '/services#discord-bots' },
        { name: 'Telegram Bots', href: '/services#telegram-bots' },
        { name: 'Web Design', href: '/services#web-design' },
        { name: 'API Development', href: '/services#api-development' },
        { name: 'Custom Imagery', href: '/services#custom-imagery' },
        { name: 'Video Creation', href: '/services#video-creation' },
      ]
    },
    { 
      name: 'Portfolio', 
      href: '/portfolio',
      subLinks: [
        { name: 'All Work', href: '/portfolio' },
        { name: 'Bots & AI', href: '/portfolio' },
        { name: 'Web Experiences', href: '/portfolio' },
      ]
    },
    { name: 'Store', href: '/store' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className={cn(styles.header, scrolled && styles.scrolled)}>
      <div className={cn('container', styles.navContainer)}>
        <Link href="/" className={styles.logoLink}>
          <Image src="/logo.jpg" alt="N3xUs Konc3pt'z" width={150} height={50} className={styles.logo} />
        </Link>

        <nav className={cn(styles.navLinks, mobileMenuOpen && styles.mobileOpen)}>
          {navLinks.map((link) => (
            <div key={link.name} className={styles.navItem}>
              <Link
                href={link.href}
                className={cn(styles.link, pathname === link.href && styles.active)}
                onClick={() => !link.subLinks && setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
              {link.subLinks && (
                <div className={styles.dropdown}>
                  {link.subLinks.map(sub => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className={styles.dropdownLink}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className={styles.navActions}>
            <Link href="/auth/login" className={styles.loginLink} onClick={() => setMobileMenuOpen(false)}>Login</Link>
            <Link href="/book" className={cn('btn', 'btn-secondary', styles.ctaBtn)} onClick={() => setMobileMenuOpen(false)}>Book Consultation</Link>
            <Link href="/contact" className={cn('btn', 'btn-primary', styles.ctaBtn)} onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
          </div>
        </nav>

        {/* Right-side controls (Cart + Mobile Toggle + Theme) */}
        <div className={styles.rightControls}>
          <ThemeToggle />
          <Link
            href="/cart"
            className={styles.cartButton}
            aria-label="View cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {itemCount > 0 && (
              <span className={styles.cartBadge}>
                {itemCount}
              </span>
            )}
          </Link>

          <button className={styles.mobileToggle} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle mobile menu">
            <span className={cn(styles.hamburger, mobileMenuOpen && styles.hamburgerOpen)}></span>
          </button>
        </div>
      </div>
    </header>
    </>
  );
}
