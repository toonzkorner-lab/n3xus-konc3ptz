'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ReplyForm({ ticketId }: { ticketId: string }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/tickets/${ticketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error('Failed to send reply');

      toast.success('Reply sent!');
      setContent('');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-xl">
      <h3 className="text-lg text-primary font-heading mb-sm">Add a Reply</h3>
      <textarea
        required
        rows={4}
        className="w-full bg-card border border-subtle rounded-md p-md text-primary focus:border-primary focus:outline-none mb-sm shadow-sm"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your reply here..."
      />
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reply'}
        </button>
      </div>
    </form>
  );
}
