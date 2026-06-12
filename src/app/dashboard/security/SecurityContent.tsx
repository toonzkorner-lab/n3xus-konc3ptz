'use client';

import { useState } from 'react';
import { startRegistration } from '@simplewebauthn/browser';
import { useRouter } from 'next/navigation';

export default function SecurityContent({
  authenticators,
  hasGoogleAccount
}: {
  authenticators: any[];
  hasGoogleAccount: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const registerPasskey = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const resp = await fetch('/api/webauthn/generate-registration-options');
      if (!resp.ok) {
        throw new Error('Failed to fetch registration options');
      }

      const options = await resp.json();
      
      let attResp;
      try {
        attResp = await startRegistration(options);
      } catch (err: any) {
        if (err.name === 'InvalidStateError') {
          throw new Error('Authenticator was probably already registered');
        }
        throw err;
      }

      const verificationResp = await fetch('/api/webauthn/verify-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attResp),
      });

      if (verificationResp.ok) {
        setSuccess('Passkey registered successfully! You can now use it to sign in.');
        router.refresh();
      } else {
        const result = await verificationResp.json();
        throw new Error(result.error || 'Verification failed');
      }

    } catch (err: any) {
      setError(err.message || 'An error occurred during passkey registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-xl">
      {/* Passkeys Section */}
      <div className="bg-card border border-subtle rounded-xl p-xl shadow-sm relative overflow-hidden">
        <h2 className="text-xl font-heading text-primary mb-md">Passkeys (WebAuthn)</h2>
        <p className="text-secondary mb-lg">
          Passkeys allow you to securely sign in using your device's fingerprint, face scan, or screen lock. 
          They are phishing-resistant and more secure than traditional passwords.
        </p>

        {error && <div className="bg-red-500/10 text-red-500 border border-red-500 rounded-md p-md mb-md">{error}</div>}
        {success && <div className="bg-green-500/10 text-green-500 border border-green-500 rounded-md p-md mb-md">{success}</div>}

        <div className="flex flex-col gap-sm mb-lg">
          {authenticators.length === 0 ? (
            <div className="bg-input border border-subtle rounded-md p-lg text-center text-secondary">
              No passkeys registered yet.
            </div>
          ) : (
            authenticators.map((auth, idx) => (
              <div key={idx} className="flex items-center justify-between bg-input border border-subtle rounded-md p-md">
                <div className="flex items-center gap-md">
                  <span className="text-2xl">🔐</span>
                  <div>
                    <p className="font-bold text-primary">Passkey Device</p>
                    <p className="text-xs text-tertiary">Type: {auth.deviceType}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button 
          onClick={registerPasskey}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Registering...' : 'Register New Passkey'}
        </button>
      </div>

      {/* Linked Accounts Section */}
      <div className="bg-card border border-subtle rounded-xl p-xl shadow-sm relative overflow-hidden">
        <h2 className="text-xl font-heading text-primary mb-md">Linked Accounts</h2>
        <p className="text-secondary mb-lg">
          Link external accounts to sign in securely without a password.
        </p>

        <div className="flex flex-col gap-sm">
          <div className="flex items-center justify-between bg-input border border-subtle rounded-md p-md">
            <div className="flex items-center gap-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div>
                <p className="font-bold text-primary">Google</p>
                <p className="text-xs text-tertiary">
                  {hasGoogleAccount ? 'Account linked' : 'Not linked'}
                </p>
              </div>
            </div>
            {hasGoogleAccount ? (
              <span className="text-green-500 font-bold text-sm bg-green-500/10 px-sm py-xs rounded-full">Connected</span>
            ) : (
              <span className="text-tertiary text-sm">Sign in with Google on the login page to link</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
