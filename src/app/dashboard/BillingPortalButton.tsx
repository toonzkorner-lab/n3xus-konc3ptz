'use client';

import { useState } from 'react';

export default function BillingPortalButton() {
  const [loading, setLoading] = useState(false);

  const handlePortalRedirect = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout/portal', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Unable to open billing portal.');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePortalRedirect}
      disabled={loading}
      className="flex items-center gap-md p-md rounded-md hover:bg-primary-subtle hover:text-primary transition-colors text-secondary w-full text-left"
    >
      <span>💳</span> {loading ? 'Loading Portal...' : 'Billing Portal'}
    </button>
  );
}
