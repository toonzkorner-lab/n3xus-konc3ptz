'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    role: 'CLIENT',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setFormData({
          name: data.name || '',
          company: data.company || '',
          phone: data.phone || '',
          role: data.role || 'CLIENT',
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to update user');
      }

      router.push('/admin/users');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) return <div className="text-secondary">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl text-primary mb-xl">Edit User</h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-md rounded-md mb-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card flex flex-col gap-lg">
        <div className="form-group">
          <label className="label">Name</label>
          <input
            type="text"
            className="input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="label">Company</label>
          <input
            type="text"
            className="input"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="label">Phone</label>
          <input
            type="text"
            className="input"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-secondary">Role</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="select w-full bg-primary text-primary border-subtle focus:border-accent"
          >
            <option value="CLIENT">Client</option>
            <option value="ADMIN">Admin</option>
            <option value="OWNER">Owner</option>
          </select>
        </div>

        <div className="flex justify-end gap-md mt-md">
          <button
            type="button"
            onClick={() => router.push('/admin/users')}
            className="btn btn-outline"
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
