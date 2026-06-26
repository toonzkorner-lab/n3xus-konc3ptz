'use client';

import { useState, FormEvent } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function QuotePage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'quote_form' }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <>
        <Navbar />
        <main>
          <section className="section" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-4xl))', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
            <div className="container container-sm text-center">
              <div className="text-6xl mb-lg">🚀</div>
              <h1 className="text-4xl font-heading glow-text mb-md">Quote Request Received!</h1>
              <p className="text-lg text-secondary mb-xl">We&apos;ll review your project details and get back to you within 24 hours with a custom proposal.</p>
              <a href="/" className="btn btn-primary btn-lg">Back to Home</a>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="section" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-4xl))' }}>
          <div className="container container-md">
            <div className="text-center mb-3xl">
              <h1 className="text-5xl font-heading glow-text mb-md">Request a Quote</h1>
              <p className="text-lg text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
                Tell us about your project and we&apos;ll craft a custom proposal tailored to your needs and budget.
              </p>
            </div>

            <div className="bg-card border border-subtle rounded-xl p-2xl shadow-lg" style={{ maxWidth: '700px', margin: '0 auto' }}>
              <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
                <div className="grid grid-2 gap-lg">
                  <div className="flex flex-col gap-xs">
                    <label className="text-sm font-bold text-primary">Full Name *</label>
                    <input name="name" type="text" required placeholder="Your name" className="input" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="text-sm font-bold text-primary">Email *</label>
                    <input name="email" type="email" required placeholder="you@example.com" className="input" />
                  </div>
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="text-sm font-bold text-primary">Company / Organization</label>
                  <input name="company" type="text" placeholder="Optional" className="input" />
                </div>

                <div className="grid grid-3 gap-lg">
                  <div className="flex flex-col gap-xs">
                    <label className="text-sm font-bold text-primary">Service Type *</label>
                    <select name="serviceType" required className="input" defaultValue="">
                      <option value="" disabled>Select...</option>
                      <option value="web-development">Web Development</option>
                      <option value="discord-bot">Discord Bot</option>
                      <option value="telegram-bot">Telegram Bot</option>
                      <option value="api-development">API Development</option>
                      <option value="e-commerce">E-Commerce</option>
                      <option value="custom-crm">Custom CRM</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="text-sm font-bold text-primary">Budget Range *</label>
                    <select name="budget" required className="input" defaultValue="">
                      <option value="" disabled>Select...</option>
                      <option value="under-500">Under $500</option>
                      <option value="500-1000">$500 – $1,000</option>
                      <option value="1000-2500">$1,000 – $2,500</option>
                      <option value="2500-5000">$2,500 – $5,000</option>
                      <option value="5000-plus">$5,000+</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="text-sm font-bold text-primary">Timeline</label>
                    <select name="timeline" className="input" defaultValue="">
                      <option value="" disabled>Select...</option>
                      <option value="asap">ASAP</option>
                      <option value="1-2-weeks">1–2 Weeks</option>
                      <option value="2-4-weeks">2–4 Weeks</option>
                      <option value="1-2-months">1–2 Months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="text-sm font-bold text-primary">Project Description *</label>
                  <textarea name="message" required rows={5} placeholder="Describe your project, goals, and any specific features you need..." className="input" style={{ resize: 'vertical', minHeight: '120px' }}></textarea>
                </div>

                {status === 'error' && (
                  <p className="text-red-500 text-sm">Something went wrong. Please try again or contact us directly.</p>
                )}

                <button type="submit" disabled={status === 'loading'} className="btn btn-primary btn-lg w-full" style={{ marginTop: 'var(--space-sm)' }}>
                  {status === 'loading' ? 'Sending...' : 'Submit Quote Request'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
