'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LeaveReviewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: '',
    clientCompany: '',
    rating: 5,
    content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess(true);
      setFormData({
        clientName: '',
        clientRole: '',
        clientCompany: '',
        rating: 5,
        content: '',
      });
      
      // Auto-dismiss success message
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  return (
    <div className="max-w-2xl mx-auto animation-fade-in">
      <div className="flex items-center gap-md mb-xl">
        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-xl shadow-glow-sm">
          ⭐
        </div>
        <div>
          <h1 className="text-3xl font-heading text-primary glow-text">Leave a Review</h1>
          <p className="text-secondary text-sm">Tell us about your experience working with N3xUs.</p>
        </div>
      </div>

      <div className="card">
        {success ? (
          <div className="text-center py-xl">
            <div className="w-20 h-20 rounded-full bg-success-subtle border border-success mx-auto flex items-center justify-center text-4xl mb-lg animate-bounce">
              🎉
            </div>
            <h2 className="text-2xl text-success font-heading mb-sm">Thank You!</h2>
            <p className="text-secondary">Your review has been securely transmitted. Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
            {error && (
              <div className="p-md bg-error-subtle border border-error rounded-md text-error text-sm">
                {error}
              </div>
            )}

            <div className="form-group mb-0">
              <label className="form-label">Your Rating</label>
              <div className="flex items-center gap-xs">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="text-3xl focus:outline-none transition-transform hover:scale-110"
                    style={{ color: star <= formData.rating ? 'var(--color-warning)' : 'var(--text-tertiary)' }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="form-group mb-0">
                <label htmlFor="clientName" className="form-label">Your Name *</label>
                <input
                  type="text"
                  id="clientName"
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label htmlFor="clientCompany" className="form-label">Company / Project (Optional)</label>
                <input
                  type="text"
                  id="clientCompany"
                  className="form-input"
                  placeholder="e.g. Acme Corp"
                  value={formData.clientCompany}
                  onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group mb-0">
              <label htmlFor="clientRole" className="form-label">Your Role (Optional)</label>
              <input
                type="text"
                id="clientRole"
                className="form-input"
                placeholder="e.g. CEO, Founder"
                value={formData.clientRole}
                onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
              />
            </div>

            <div className="form-group mb-0">
              <label htmlFor="content" className="form-label">Testimonial *</label>
              <textarea
                id="content"
                className="form-textarea"
                placeholder="Share your thoughts on the design, communication, and overall outcome..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={5}
              />
            </div>

            <div className="pt-md border-t border-subtle flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
              >
                {isSubmitting ? 'Transmitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
