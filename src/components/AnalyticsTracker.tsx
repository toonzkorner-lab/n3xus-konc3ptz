'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip tracking for admin panel and dashboard
    const currentPath = pathname || window.location.pathname;
    if (currentPath.startsWith('/admin') || currentPath.startsWith('/dashboard')) {
      return;
    }

    // Determine unique session ID
    let sessionId = localStorage.getItem('n3xus_session_id');
    if (!sessionId) {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        sessionId = crypto.randomUUID();
      } else {
        // Fallback for HTTP / non-secure contexts where randomUUID is unavailable
        sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      }
      localStorage.setItem('n3xus_session_id', sessionId);
    }

    // Ping the tracking API
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: window.location.href,
        sessionId,
        referrer: document.referrer || null,
      }),
    }).catch((err) => {
      console.error('Failed to track page view:', err);
    });
  }, [pathname]);

  // Render nothing, this is purely functional
  return null;
}
