'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Import dynamically to avoid SSR issues with TipTap
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

export default function NewsletterPage() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send newsletter');

      setMessage(`Success! Newsletter sent to ${data.count} subscribers.`);
      setSubject('');
      setContent('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-2xl">
        <h1 className="text-3xl text-primary mb-xs">Email Marketing</h1>
        <p className="text-secondary">Compose and broadcast newsletters to all active subscribers.</p>
      </div>

      {message && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-md rounded-md mb-xl">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-md rounded-md mb-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSend} className="card flex flex-col gap-lg">
        <div className="form-group">
          <label className="label">Subject Line</label>
          <input
            type="text"
            className="input"
            placeholder="N3xUs Konc3pt'z: New Project Drop!"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="label">Content</label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Write your newsletter here..."
          />
        </div>

        <div className="flex justify-end mt-md">
          <button type="submit" className="btn btn-primary" disabled={loading || !subject || !content}>
            {loading ? 'Broadcasting...' : 'Blast Newsletter'}
          </button>
        </div>
      </form>
    </div>
  );
}
