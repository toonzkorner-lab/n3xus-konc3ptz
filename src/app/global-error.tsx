'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-background text-primary min-h-screen flex items-center justify-center font-sans">
        <div className="bg-card border border-error rounded-xl p-3xl shadow-glow-error max-w-lg w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-error"></div>
          
          <div className="text-6xl mb-md">🔥</div>
          <h2 className="text-2xl text-error font-heading mb-sm">Critical Failure</h2>
          <p className="text-secondary mb-lg">
            A fatal error occurred at the root layout level. The application could not recover.
          </p>

          <div className="bg-background rounded-md p-md mb-xl text-left border border-subtle overflow-x-auto">
            <p className="text-xs font-mono text-tertiary">Error digest: {error.digest || 'Unknown'}</p>
          </div>

          <button
            onClick={() => reset()}
            className="btn btn-primary"
          >
            Force Restart
          </button>
        </div>
      </body>
    </html>
  );
}
