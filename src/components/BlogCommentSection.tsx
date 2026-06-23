'use client';

import { useState, useEffect } from 'react';

type Comment = {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
};

export default function BlogCommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/blog/${slug}/comments`)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      setError('Name and comment are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: name, content }),
      });

      if (!res.ok) {
        throw new Error('Failed to post comment');
      }

      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setName('');
      setContent('');
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-2xl border-t border-subtle pt-xl">
      <h3 className="text-2xl font-heading text-primary mb-lg">Comments ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className="bg-card p-lg rounded-xl border border-subtle mb-xl">
        <h4 className="text-lg text-secondary mb-md">Leave a Comment</h4>
        
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        
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
          <label htmlFor="content" className="block text-sm text-tertiary mb-2">Comment</label>
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
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="space-y-md">
        {loading ? (
          <p className="text-tertiary">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-tertiary italic">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-card/50 p-md rounded-lg border border-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-primary">{comment.authorName}</span>
                <span className="text-xs text-tertiary">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-secondary whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
