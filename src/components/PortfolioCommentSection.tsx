'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type Comment = {
  id: string;
  content: string;
  rating: number | null;
  authorName: string;
  createdAt: string;
};

export default function PortfolioCommentSection({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/portfolio/${slug}/comments`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load comments', err);
        setLoading(false);
      });
  }, [slug]);

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const res = await fetch(`/api/portfolio/${slug}/comments/${commentId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete comment');
      
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      setError('Name and comment are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/portfolio/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: name, content, rating }),
      });

      if (!res.ok) {
        throw new Error('Failed to post comment');
      }

      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setName('');
      setContent('');
      setRating(0);
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-2xl border-t border-subtle pt-xl w-full max-w-4xl mx-auto">
      <h3 className="text-2xl font-heading text-primary mb-lg">Reviews & Feedback ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className="bg-card p-lg rounded-xl border border-subtle mb-xl">
        <h4 className="text-lg text-secondary mb-md">Leave a Review</h4>
        
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        
        <div className="mb-md">
          <label className="block text-sm text-tertiary mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={`text-2xl transition-colors focus:outline-none ${star <= (hoveredRating || rating) ? 'text-yellow-400' : 'text-tertiary'}`}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mb-md">
          <label htmlFor="name" className="block text-sm text-tertiary mb-2">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-background border border-subtle rounded-md px-4 py-2 text-primary focus:border-primary focus:outline-none transition-colors"
            placeholder="Your name"
            required
          />
        </div>
        
        <div className="mb-md">
          <label htmlFor="content" className="block text-sm text-tertiary mb-2">Feedback</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-background border border-subtle rounded-md px-4 py-2 text-primary focus:border-primary focus:outline-none transition-colors"
            placeholder="Write your thoughts..."
            rows={4}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? 'Posting...' : 'Post Review'}
        </button>
      </form>

      <div className="space-y-md">
        {loading ? (
          <p className="text-tertiary">Loading reviews...</p>
        ) : comments.length === 0 ? (
          <p className="text-tertiary italic">No reviews yet. Be the first to share your feedback!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-card/50 p-md rounded-lg border border-subtle flex flex-col gap-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <span className="font-bold text-primary">{comment.authorName}</span>
                  <span className="text-xs text-tertiary">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-red-500 hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
              {comment.rating && comment.rating > 0 && (
                <div className="text-yellow-400 text-sm">
                  {'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}
                </div>
              )}
              <p className="text-secondary whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
