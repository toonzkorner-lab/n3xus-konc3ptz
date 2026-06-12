'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type ProfileData = {
  name: string | null;
  email: string | null;
  company: string | null;
  phone: string | null;
  image: string | null;
};

export default function ProfileForm({ initialData }: { initialData: ProfileData }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    company: initialData.company || '',
    phone: initialData.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('Profile updated successfully.');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/users/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (res.ok) {
        setMessage('Password updated successfully.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update password.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2xl">
      {message && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 p-md rounded-md text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-md rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
        <h3 className="text-xl text-primary font-heading border-b border-subtle pb-sm">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div className="flex flex-col gap-xs">
            <label className="text-sm font-heading text-secondary" htmlFor="name">Full Name</label>
            <input
              id="name" name="name" type="text"
              value={formData.name} onChange={handleChange}
              className="bg-input border border-subtle rounded-md p-md text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="text-sm font-heading text-secondary" htmlFor="email">Email (Read Only)</label>
            <input
              id="email" type="email"
              value={initialData.email || ''} readOnly disabled
              className="bg-input opacity-50 border border-subtle rounded-md p-md text-primary"
            />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="text-sm font-heading text-secondary" htmlFor="company">Company</label>
            <input
              id="company" name="company" type="text"
              value={formData.company} onChange={handleChange}
              className="bg-input border border-subtle rounded-md p-md text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="text-sm font-heading text-secondary" htmlFor="phone">Phone Number</label>
            <input
              id="phone" name="phone" type="tel"
              value={formData.phone} onChange={handleChange}
              className="bg-input border border-subtle rounded-md p-md text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary self-start mt-sm">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-lg pt-xl border-t border-subtle">
        <h3 className="text-xl text-primary font-heading border-b border-subtle pb-sm">Change Password</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div className="flex flex-col gap-xs">
            <label className="text-sm font-heading text-secondary" htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword" name="currentPassword" type="password" required
              value={passwordData.currentPassword} onChange={handlePasswordChange}
              className="bg-input border border-subtle rounded-md p-md text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div className="hidden md:block"></div>
          <div className="flex flex-col gap-xs">
            <label className="text-sm font-heading text-secondary" htmlFor="newPassword">New Password</label>
            <input
              id="newPassword" name="newPassword" type="password" required minLength={8}
              value={passwordData.newPassword} onChange={handlePasswordChange}
              className="bg-input border border-subtle rounded-md p-md text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="text-sm font-heading text-secondary" htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword" name="confirmPassword" type="password" required minLength={8}
              value={passwordData.confirmPassword} onChange={handlePasswordChange}
              className="bg-input border border-subtle rounded-md p-md text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-secondary self-start mt-sm">
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
