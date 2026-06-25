'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminTicketActions({ ticketId, currentStatus }: { ticketId: string, currentStatus: string }) {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setStatus(newStatus);
      toast.success(`Status updated to ${newStatus}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
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
    <div className="flex flex-col gap-lg mt-xl border-t border-subtle pt-xl">
      <div className="flex items-center gap-md bg-tertiary p-md rounded-lg border border-subtle">
        <label className="text-sm text-secondary font-bold">Update Status:</label>
        <select
          value={status}
          onChange={(e) => handleUpdateStatus(e.target.value)}
          disabled={loading}
          className="bg-card border border-subtle rounded-md p-sm text-primary text-sm focus:border-accent focus:outline-none flex-1"
        >
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        <button
          onClick={async () => {
            if (!confirm('Are you sure you want to delete this ticket? This cannot be undone.')) return;
            setLoading(true);
            try {
              const res = await fetch(`/api/tickets/${ticketId}`, { method: 'DELETE' });
              if (!res.ok) throw new Error('Failed to delete ticket');
              toast.success('Ticket deleted');
              router.push('/admin/tickets');
              router.refresh();
            } catch (err: any) {
              toast.error(err.message || 'Error deleting ticket');
              setLoading(false);
            }
          }}
          disabled={loading}
          className="btn btn-sm bg-error/10 text-error hover:bg-error/20 border-error/20 ml-auto"
        >
          🗑️ Delete Ticket
        </button>
      </div>

      <form onSubmit={handleReply}>
        <h3 className="text-lg text-primary font-heading mb-sm">Add a Reply</h3>
        <textarea
          required
          rows={5}
          className="w-full bg-card border border-subtle rounded-md p-md text-primary focus:border-accent focus:outline-none mb-sm shadow-sm"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your response to the client..."
        />
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary bg-accent hover:bg-accent/80 text-white border-accent" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </form>
    </div>
  );
}
