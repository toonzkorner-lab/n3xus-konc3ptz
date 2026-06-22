'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'menu' | 'form' | 'success'>('menu');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: session } = useSession();

  const discordLink = "https://discord.gg/3UHWMa7rC";
  const telegramLink = "https://t.me/n3xusg";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    if (!session && (!guestEmail || !guestName)) return;

    setIsSubmitting(true);

    try {
      if (session) {
        // Logged in user: Create a Ticket
        const res = await fetch('/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject, description: message, priority: 'NORMAL' })
        });
        if (res.ok) setView('success');
      } else {
        // Guest user: Create a Contact Submission
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: guestName, email: guestEmail, subject, message })
        });
        if (res.ok) setView('success');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setView('menu');
      setSubject('');
      setMessage('');
      setGuestEmail('');
      setGuestName('');
    }
  };

  return (
    <>
      <style>{`
        .chat-widget-container {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
          pointer-events: none;
        }
        .chat-menu {
          background-color: #141432;
          border: 1px solid rgba(0, 240, 255, 0.2);
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.15);
          margin-bottom: 16px;
          width: 320px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-origin: bottom right;
          pointer-events: auto;
          max-height: 500px;
          overflow-y: auto;
        }
        .chat-menu.closed {
          transform: scale(0) translateY(32px);
          opacity: 0;
          pointer-events: none;
        }
        .chat-menu.open {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
        .chat-menu h4 {
          color: #00f0ff;
          font-weight: bold;
          margin-top: 0;
          margin-bottom: 8px;
        }
        .chat-menu p {
          color: #e8e8f0;
          font-size: 14px;
          margin-bottom: 16px;
          opacity: 0.8;
        }
        .chat-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .chat-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          text-decoration: none;
          transition: background-color 0.2s;
          cursor: pointer;
          background: none;
          text-align: left;
          width: 100%;
        }
        .chat-btn.discord { background-color: rgba(88, 101, 242, 0.1); border: 1px solid rgba(88, 101, 242, 0.3); }
        .chat-btn.discord:hover { background-color: rgba(88, 101, 242, 0.2); }
        .chat-btn.telegram { background-color: rgba(0, 136, 204, 0.1); border: 1px solid rgba(0, 136, 204, 0.3); }
        .chat-btn.telegram:hover { background-color: rgba(0, 136, 204, 0.2); }
        .chat-btn.ticket { background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); }
        .chat-btn.ticket:hover { background-color: rgba(16, 185, 129, 0.2); }
        .chat-btn span { font-weight: 600; font-size: 14px; }
        
        .chat-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .chat-input {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 10px;
          color: white;
          font-size: 14px;
          width: 100%;
        }
        .chat-input:focus {
          outline: none;
          border-color: #00f0ff;
        }
        .chat-submit {
          background-color: #00f0ff;
          color: #0a0a1a;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .chat-submit:hover { background-color: #00d0e0; }
        .chat-submit:disabled { background-color: #666; cursor: not-allowed; }
        .chat-back {
          background: none;
          border: none;
          color: #00f0ff;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 12px;
          text-align: left;
          padding: 0;
        }

        .chat-fab {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #00f0ff;
          color: #0a0a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 25px rgba(0, 240, 255, 0.4);
          cursor: pointer;
          transition: transform 0.2s, background-color 0.2s;
          pointer-events: auto;
        }
        .chat-fab:hover { transform: scale(1.05); background-color: #00d0e0; }
        .chat-fab:active { transform: scale(0.95); }
      `}</style>
      <div className="chat-widget-container" style={{ pointerEvents: 'none' }}>
        <div className={`chat-menu ${isOpen ? 'open' : 'closed'}`} style={{ pointerEvents: isOpen ? 'auto' : 'none' }}>
          
          {view === 'menu' && (
            <>
              <h4>N3xUs Support 🚀</h4>
              <p>We're online! Choose your preferred platform or open a ticket directly.</p>
              <div className="chat-options">
                <Link href={discordLink} target="_blank" rel="noopener noreferrer" className="chat-btn discord">
                  <span style={{ color: '#5865F2' }}>Join our Discord</span>
                </Link>
                <Link href={telegramLink} target="_blank" rel="noopener noreferrer" className="chat-btn telegram">
                  <span style={{ color: '#0088cc' }}>Join our Telegram</span>
                </Link>
                <button onClick={() => setView('form')} className="chat-btn ticket">
                  <span style={{ color: '#10B981' }}>🎫 Open a Support Ticket</span>
                </button>
              </div>
            </>
          )}

          {view === 'form' && (
            <>
              <button onClick={() => setView('menu')} className="chat-back">← Back</button>
              <h4>Open a Ticket 🎫</h4>
              <p>Describe your issue and our team will get back to you shortly.</p>
              <form onSubmit={handleSubmit} className="chat-form">
                {!session && (
                  <>
                    <input required type="text" placeholder="Your Name" className="chat-input" value={guestName} onChange={e => setGuestName(e.target.value)} />
                    <input required type="email" placeholder="Your Email" className="chat-input" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
                  </>
                )}
                <input required type="text" placeholder="Subject" className="chat-input" value={subject} onChange={e => setSubject(e.target.value)} />
                <textarea required placeholder="How can we help?" className="chat-input" rows={4} value={message} onChange={e => setMessage(e.target.value)} />
                <button type="submit" disabled={isSubmitting} className="chat-submit">
                  {isSubmitting ? 'Submitting...' : 'Send Ticket'}
                </button>
              </form>
            </>
          )}

          {view === 'success' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
              <h4 style={{ color: '#10B981' }}>Ticket Created!</h4>
              <p>We have received your request and will be in touch shortly.</p>
              {session && <Link href="/dashboard/tickets" style={{ color: '#00f0ff', textDecoration: 'underline' }}>View in Dashboard</Link>}
            </div>
          )}

        </div>

        <button onClick={handleToggle} className="chat-fab" aria-label="Toggle Live Chat" style={{ pointerEvents: 'auto' }}>
          {isOpen ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
