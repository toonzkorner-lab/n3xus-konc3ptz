import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <h1 className="neon-text" style={{ fontSize: '6rem', marginBottom: '1rem', letterSpacing: '0.1em' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--foreground)' }}>Lost in Space</h2>
      <p style={{ maxWidth: '600px', margin: '0 auto 3rem auto', color: 'var(--muted)', fontSize: '1.2rem', lineHeight: '1.6' }}>
        The cosmic coordinates you requested seem to lead nowhere. 
        It looks like this page has been swallowed by a black hole or never existed.
      </p>
      <Link href="/" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
        Return to Base
      </Link>
    </div>
  );
}
