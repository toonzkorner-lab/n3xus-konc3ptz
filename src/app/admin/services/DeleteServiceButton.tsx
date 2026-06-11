'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteServiceButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete service.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      className="text-error hover:text-error/80 transition-colors text-sm font-bold"
    >
      {loading ? '...' : 'Delete'}
    </button>
  );
}
