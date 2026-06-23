'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { getInitials } from '@/lib/utils';

interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string | null;
  clientCompany: string | null;
  content: string;
  rating: number;
  createdAt: Date | string;
}

export default function ReviewsClient({ initialReviews }: { initialReviews: Testimonial[] }) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'OWNER';

  const [reviews, setReviews] = useState<Testimonial[]>(initialReviews);
  
  // Form state
  const [name, setName] = useState(session?.user?.name || '');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      setError('Name and review content are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: name,
          clientCompany: company,
          clientRole: role,
          content,
          rating,
          featured: false
        }),
      });

      if (!res.ok) throw new Error('Failed to submit review');

      const newReview = await res.json();
      setReviews([newReview, ...reviews]);
      
      // Reset form (keep name if logged in)
      if (!session?.user) setName('');
      setCompany('');
      setRole('');
      setContent('');
      setRating(5);
      setSuccess(true);
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setReviews(reviews.filter(r => r.id !== id));
    } catch (error) {
      alert('Failed to delete review');
    }
  };

  return (
    <div className="flex flex-col gap-2xl">
      {/* Submit Form */}
      <div className="bg-card p-xl rounded-2xl border border-subtle">
        <h3 className="text-2xl text-primary mb-lg">Leave a Review</h3>
        
        {error && <div className="text-red-500 mb-md">{error}</div>}
        {success && <div className="text-green-500 mb-md bg-green-500/10 p-md rounded-md border border-green-500/20">Your review has been successfully posted. Thank you!</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label className="block text-sm text-tertiary mb-2">Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-background border border-subtle rounded-md px-4 py-2 text-primary focus:border-primary focus:outline-none"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm text-tertiary mb-2">Rating</label>
              <div className="flex items-center gap-1 py-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`text-3xl transition-all hover:scale-110 active:scale-90 focus:outline-none ${star <= (hoveredRating || rating) ? 'text-yellow-400 drop-shadow-sm' : 'text-tertiary/50'}`}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-3 text-sm font-medium text-secondary">
                  {rating > 0 ? `${rating} / 5 Selected` : 'Select rating'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label className="block text-sm text-tertiary mb-2">Role (Optional)</label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-background border border-subtle rounded-md px-4 py-2 text-primary focus:border-primary focus:outline-none"
                placeholder="e.g. CEO, Developer"
              />
            </div>
            <div>
              <label className="block text-sm text-tertiary mb-2">Company (Optional)</label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full bg-background border border-subtle rounded-md px-4 py-2 text-primary focus:border-primary focus:outline-none"
                placeholder="Your Company"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-tertiary mb-2">Review *</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={5}
              className="w-full bg-background border border-subtle rounded-md px-4 py-2 text-primary focus:border-primary focus:outline-none"
              placeholder="What was it like working with us?"
            />
          </div>
          
          <button type="submit" disabled={isSubmitting} className="btn btn-primary self-start">
            {isSubmitting ? 'Submitting...' : 'Post Review'}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-lg">
        <h3 className="text-2xl text-primary mb-md">All Reviews ({reviews.length})</h3>
        
        {reviews.length === 0 ? (
          <p className="text-tertiary">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {reviews.map(review => (
              <div key={review.id} className="bg-card/50 p-lg rounded-xl border border-subtle flex flex-col gap-md">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {getInitials(review.clientName)}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">{review.clientName}</h4>
                      <p className="text-xs text-tertiary">
                        {review.clientRole} {review.clientCompany ? `at ${review.clientCompany}` : ''}
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleDelete(review.id)} className="text-red-500 hover:text-red-400 text-sm">
                      Delete
                    </button>
                  )}
                </div>
                
                <div className="text-yellow-400 text-sm tracking-widest">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                
                <p className="text-secondary whitespace-pre-wrap flex-grow">
                  "{review.content}"
                </p>
                
                <p className="text-xs text-tertiary text-right mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
