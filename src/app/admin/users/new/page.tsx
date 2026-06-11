'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      company: formData.get('company'),
      phone: formData.get('phone'),
      role: formData.get('role') || 'CLIENT',
    };

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/admin/users');
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to create user');
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
          <Link href="/admin/users" className="text-sm text-secondary hover:text-primary transition-colors">
            ← Back to Users
          </Link>
        </div>
        <h1 className="text-3xl text-primary font-heading">Register Client</h1>
        <p className="text-secondary font-mono text-sm">Create a new access profile for the system</p>
      </div>

      <div className="bg-card border border-subtle rounded-xl p-2xl">
        {error && <div className="bg-error/20 border border-error text-error p-md rounded-md mb-xl">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
          <div className="grid grid-2 gap-lg">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" className="form-input" required placeholder="John Doe" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" className="form-input" required placeholder="john@company.com" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Temporary Password</label>
            <input type="text" id="password" name="password" className="form-input" required placeholder="Will be used for first login" />
          </div>

          <div className="grid grid-2 gap-lg border-t border-subtle pt-lg mt-sm">
            <div className="form-group">
              <label className="form-label" htmlFor="company">Company (Optional)</label>
              <input type="text" id="company" name="company" className="form-input" placeholder="e.g. Acme Corp" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone (Optional)</label>
              <input type="text" id="phone" name="phone" className="form-input" placeholder="+1 (555) 000-0000" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="role">System Role</label>
            <select id="role" name="role" className="form-input bg-primary-subtle border-primary text-primary font-bold">
              <option value="CLIENT">CLIENT</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div className="flex justify-end gap-md mt-xl pt-lg border-t border-subtle">
            <Link href="/admin/users" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
