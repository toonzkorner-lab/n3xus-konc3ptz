'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { cn } from '@/lib/utils';
import { useCart } from './CartProvider';
import { useSession } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { items, itemCount } = useCart();
  const { data: session, status } = useSession();

  const [servicesList, setServicesList] = useState<{name: string, href: string}[]>([
    { name: 'Discord Bots', href: '/services#discord-bots' },
    { name: 'Telegram Bots', href: '/services#telegram-bots' },
    { name: 'Web Design', href: '/services#web-design' },
    { name: 'API Development', href: '/services#api-development' },
    { name: 'Custom Imagery', href: '/services#custom-imagery' },
    { name: 'Video Creation', href: '/services#video-creation' },
  ]);

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

    // Fetch dynamic services for the navbar
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setServicesList(data.map((s: any) => ({ name: s.name, href: `/services/${s.slug}` })));
        }
      })
      .catch(e => console.error("Failed to load services for navbar:", e));

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
      subLinks: servicesList
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
    { name: 'Reviews', href: '/reviews' },
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
                onClick={() => {
                  if (!link.subLinks) setMobileMenuOpen(false);
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
                }}
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
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
                      }}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className={styles.navActions}>
            {status === 'loading' ? (
              <span className={styles.loginLink}>...</span>
            ) : session ? (
              <>
                {(session.user?.role === 'ADMIN' || session.user?.role === 'OWNER') && (
                  <Link href="/admin" className={cn(styles.loginLink, 'text-accent hover:text-accent-glow')} onClick={() => { setMobileMenuOpen(false); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50); }}>Admin Panel</Link>
                )}
                <Link href="/dashboard" className={styles.loginLink} onClick={() => { setMobileMenuOpen(false); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50); }}>Client Portal</Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className={styles.loginLink} onClick={() => { setMobileMenuOpen(false); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50); }}>Login</Link>
                <Link href="/auth/register" className={cn('btn', 'btn-secondary', styles.ctaBtn, 'hidden md:inline-flex')} onClick={() => { setMobileMenuOpen(false); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50); }}>Register</Link>
              </>
            )}
            <Link href="/book" className={cn('btn', 'btn-primary', styles.ctaBtn)} onClick={() => { setMobileMenuOpen(false); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50); }}>Book Consultation</Link>
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
