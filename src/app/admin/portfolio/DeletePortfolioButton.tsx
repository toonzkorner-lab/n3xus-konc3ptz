'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeletePortfolioButton({ portfolioId }: { portfolioId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this portfolio item?')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/portfolio/${portfolioId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete portfolio item');
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error deleting portfolio item');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-400 text-sm font-bold uppercase disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
