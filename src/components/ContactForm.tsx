'use client';

import { useState } from 'react';
import styles from './ContactForm.module.css';
import { cn } from '@/lib/utils';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.title}>Send Us a Message</h3>
      <p className={styles.subtitle}>We'll get back to you within 24 hours.</p>
      
      {status === 'success' && (
        <div className={styles.successMessage}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <div>
            <p style={{ margin: 0 }}>Your message has been sent successfully! We'll be in touch soon.</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.85em', opacity: 0.9 }}>
              (Please check your spam/junk folder if you don't see our auto-reply)
            </p>
          </div>
        </div>
      )}
      
      {status === 'error' && (
        <div className={styles.errorMessage}>
          <p>There was an error sending your message. Please try again later.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            required
            placeholder="John Doe"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            required
            placeholder="john@example.com"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="subject" className={styles.label}>Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={styles.input}
            required
            placeholder="Project Inquiry"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={styles.textarea}
            required
            placeholder="Tell us about your project..."
            rows={5}
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className={cn('btn', 'btn-primary', styles.submitBtn)}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <span className={styles.loadingWrapper}>
              <span className="spinner spinner-sm"></span> Sending...
            </span>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
}
