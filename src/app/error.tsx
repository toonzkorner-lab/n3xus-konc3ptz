'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Next.js caught an error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-xl">
      <div className="bg-card border border-error rounded-xl p-3xl shadow-glow-error max-w-lg w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-error"></div>
        
        <div className="text-6xl mb-md">⚠️</div>
        <h2 className="text-2xl text-error font-heading mb-sm">System Malfunction</h2>
        <p className="text-secondary mb-lg">
          An unexpected error occurred in the module you were trying to access.
        </p>

        <div className="bg-background rounded-md p-md mb-xl text-left border border-subtle overflow-x-auto">
          <p className="text-xs font-mono text-tertiary">Error digest: {error.digest || 'Unknown'}</p>
          <p className="text-xs font-mono text-error mt-xs">{error.message}</p>
        </div>

        <div className="flex gap-md justify-center">
          <button
            onClick={() => reset()}
            className="btn btn-primary"
          >
            Reboot Module
          </button>
          <Link href="/" className="btn btn-outline">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
