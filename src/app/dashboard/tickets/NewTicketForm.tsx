'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function NewTicketForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;
    setLoading(true);

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, description, priority }),
      });

      if (!res.ok) throw new Error('Failed to create ticket');

      toast.success('Ticket created successfully!');
      setIsOpen(false);
      setSubject('');
      setDescription('');
      setPriority('NORMAL');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn btn-primary">
        Create New Ticket
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-subtle p-xl rounded-xl w-full max-w-lg shadow-xl relative">
            <h2 className="text-xl text-primary font-heading mb-md">New Support Ticket</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              <div>
                <label className="block text-sm text-secondary mb-xs">Subject</label>
                <input
                  type="text"
                  required
                  className="w-full bg-primary border border-subtle rounded-md p-sm text-primary focus:border-primary focus:outline-none"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your issue"
                />
              </div>

              <div>
                <label className="block text-sm text-secondary mb-xs">Priority</label>
                <select
                  className="w-full bg-primary border border-subtle rounded-md p-sm text-primary focus:border-primary focus:outline-none"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-secondary mb-xs">Description</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-primary border border-subtle rounded-md p-sm text-primary focus:border-primary focus:outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about your request..."
                />
              </div>

              <div className="flex justify-end gap-sm mt-md">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
