'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip tracking for admin panel
    if (pathname && pathname.startsWith('/admin')) {
      return;
    }

    // Determine unique session ID
    let sessionId = localStorage.getItem('n3xus_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
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
