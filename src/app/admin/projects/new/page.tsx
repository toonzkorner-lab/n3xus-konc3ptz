'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();
  const [clients, setClients] = useState<{ id: string; name: string; email: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch clients for the dropdown
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setClients(data.filter(u => u.role === 'CLIENT'));
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      clientId: formData.get('clientId'),
      budget: Number(formData.get('budget')),
      deadline: formData.get('deadline'),
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/admin/projects');
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to create project');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-xl max-w-3xl">
      <div>
        <div className="mb-sm">
          <Link href="/admin/projects" className="text-sm text-secondary hover:text-primary transition-colors">
            ← Back to Projects
          </Link>
        </div>
        <h1 className="text-3xl text-primary font-heading">New Project Initialization</h1>
        <p className="text-secondary font-mono text-sm">Create a new transmission channel for a client</p>
      </div>

      <div className="bg-card border border-subtle rounded-xl p-2xl">
        {error && <div className="bg-error/20 border border-error text-error p-md rounded-md mb-xl">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
          <div className="form-group">
            <label className="form-label" htmlFor="title">Project Title</label>
            <input type="text" id="title" name="title" className="form-input" required placeholder="e.g. Neon E-commerce Platform" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="clientId">Client</label>
            <select id="clientId" name="clientId" className="form-input" required defaultValue="">
              <option value="" disabled>Select a client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description (Optional)</label>
            <textarea id="description" name="description" className="form-input min-h-[100px]" placeholder="Brief project overview..."></textarea>
          </div>

          <div className="grid grid-2 gap-lg">
            <div className="form-group">
              <label className="form-label" htmlFor="budget">Estimated Budget ($)</label>
              <input type="number" id="budget" name="budget" className="form-input" min="0" step="1" placeholder="5000" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="deadline">Target Deadline</label>
              <input type="date" id="deadline" name="deadline" className="form-input" />
            </div>
          </div>

          <div className="flex justify-end gap-md mt-xl pt-lg border-t border-subtle">
            <Link href="/admin/projects" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Initializing...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
