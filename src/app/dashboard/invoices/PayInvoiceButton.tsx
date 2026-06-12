'use client';

import { useState } from 'react';

export default function PayInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/invoices/${invoiceId}/pay`, {
        method: 'POST',
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to initialize payment');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePay}
      disabled={loading}
      className="text-primary hover:underline text-sm font-bold disabled:opacity-50"
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
}
