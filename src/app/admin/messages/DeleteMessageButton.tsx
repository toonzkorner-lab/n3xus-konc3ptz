'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteMessageButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this transmission?')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete transmission');
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error deleting transmission');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="btn btn-sm btn-ghost text-error hover:bg-error/20"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
