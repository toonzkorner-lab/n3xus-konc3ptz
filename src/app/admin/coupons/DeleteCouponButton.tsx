'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteCouponButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this promo code? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete coupon.');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-xs text-error hover:text-error/80 transition-colors"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
