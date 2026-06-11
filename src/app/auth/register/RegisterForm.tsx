'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Security keys do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          company: formData.company || undefined,
          phone: formData.phone || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      // Auto-login after registration
      const loginRes = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (loginRes?.error) {
        router.push('/auth/login');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-subtle rounded-xl p-3xl shadow-glow-primary max-w-lg w-full mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary"></div>
      
      <div className="text-center mb-2xl">
        <h2 className="text-3xl text-primary mb-sm">Initialize Account</h2>
        <p className="text-secondary text-sm">Create your portal credentials to get started</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-md rounded-md mb-lg text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
        <div className="grid grid-2 gap-md">
          <div className="flex flex-col gap-xs">
            <label className="text-sm font-heading text-secondary" htmlFor="name">Designation</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="bg-input border border-subtle rounded-md p-md text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Full Name"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-sm font-heading text-secondary" htmlFor="reg-email">Email Frequency</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="bg-input border border-subtle rounded-md p-md text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              placeholder="you@domain.com"
            />
          </div>
        </div>

        <div className="grid grid-2 gap-md">
          <div className="flex flex-col gap-xs">
            <label className="text-sm font-heading text-secondary" htmlFor="reg-password">Security Key</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              className="bg-input border border-subtle rounded-md p-md text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Min 8 characters"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-sm font-heading text-secondary" htmlFor="confirmPassword">Confirm Key</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-input border border-subtle rounded-md p-md text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Repeat security key"
            />
          </div>
        </div>

        <div className="grid grid-2 gap-md">
          <div className="flex flex-col gap-xs">
            <label className="text-sm font-heading text-secondary" htmlFor="company">Organization <span className="text-tertiary">(optional)</span></label>
            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              className="bg-input border border-subtle rounded-md p-md text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Company name"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-sm font-heading text-secondary" htmlFor="phone">Comm Channel <span className="text-tertiary">(optional)</span></label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="bg-input border border-subtle rounded-md p-md text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary w-full mt-sm flex justify-center"
        >
          {loading ? <span className="spinner spinner-sm"></span> : 'Create Portal Access'}
        </button>
      </form>

      <div className="mt-xl text-center text-sm text-secondary">
        <p>Already have credentials? <Link href="/auth/login" className="text-primary hover:underline">Access Portal</Link></p>
      </div>
    </div>
  );
}
