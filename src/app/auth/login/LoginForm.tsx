'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { startAuthentication } from '@simplewebauthn/browser';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasskeyLogin = async () => {
    if (!formData.email) {
      setError("Please enter your email first to use a Passkey.");
      return;
    }
    setLoading(true);
    setError('');

    try {
      const optionsRes = await fetch(`/api/webauthn/generate-authentication-options?email=${encodeURIComponent(formData.email)}`);
      if (!optionsRes.ok) throw new Error('No passkey found for this email');
      const options = await optionsRes.json();

      const authResp = await startAuthentication(options);

      const res = await signIn('webauthn', {
        email: formData.email,
        response: JSON.stringify(authResp),
        redirect: false
      });

      if (res?.error) {
        setError('Passkey verification failed');
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Passkey login failed');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (res?.error) {
        setError('Invalid email or password');
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-subtle rounded-xl p-3xl shadow-glow-primary max-w-md w-full mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary"></div>
      
      <div className="text-center mb-2xl">
        <h2 className="text-3xl text-primary mb-sm">Access Portal</h2>
        <p className="text-secondary text-sm">Enter your credentials to continue</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-md rounded-md mb-lg text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
        <div className="flex flex-col gap-xs">
          <label className="text-sm font-heading text-secondary" htmlFor="email">Email Designation</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="bg-input border border-subtle rounded-md p-md text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            placeholder="admin@n3xuskonc3ptz.com"
          />
        </div>

        <div className="flex flex-col gap-xs">
          <div className="flex justify-between items-center">
            <label className="text-sm font-heading text-secondary" htmlFor="password">Security Key</label>
            <Link href="/auth/forgot" className="text-xs text-primary hover:underline">Lost Key?</Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="bg-input border border-subtle rounded-md p-md text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary w-full mt-sm flex justify-center"
        >
          {loading ? <span className="spinner spinner-sm"></span> : 'Authenticate'}
        </button>

        <div className="relative flex py-sm items-center">
          <div className="flex-grow border-t border-subtle"></div>
          <span className="flex-shrink-0 mx-md text-tertiary text-xs">OR</span>
          <div className="flex-grow border-t border-subtle"></div>
        </div>
        
        <button 
          type="button" 
          onClick={handlePasskeyLogin}
          disabled={loading}
          className="btn btn-outline w-full flex justify-center gap-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <circle cx="12" cy="11" r="3"></circle>
          </svg>
          Sign in with Passkey / FaceID
        </button>
      </form>

    </div>
  );
}
