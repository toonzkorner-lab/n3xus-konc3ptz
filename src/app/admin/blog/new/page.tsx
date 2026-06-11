'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBlogPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    published: false,
    tags: '',
  });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ ...formData, title, slug: generateSlug(title) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        tags: formData.tags ? JSON.stringify(formData.tags.split(',').map(s => s.trim()).filter(s => s)) : '[]',
      };

      const res = await fetch(`/api/blog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        throw new Error('Failed to create blog post');
      }

      router.push('/admin/blog');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl text-primary mb-xl">Create Blog Post</h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-md rounded-md mb-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card flex flex-col gap-lg">
        <div className="grid grid-cols-2 gap-md">
          <div className="form-group">
            <label className="label">Title</label>
            <input type="text" required className="input" value={formData.title} onChange={handleTitleChange} />
          </div>
          <div className="form-group">
            <label className="label">Slug</label>
            <input type="text" required className="input" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
          </div>
        </div>

        <div className="form-group">
          <label className="label">Excerpt</label>
          <textarea className="input min-h-[100px]" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} />
        </div>

        <div className="form-group">
          <label className="label">Content (Markdown / HTML)</label>
          <textarea required className="input min-h-[400px] font-mono text-sm" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-md">
          <div className="form-group">
            <label className="label">Cover Image URL</label>
            <input type="text" className="input" value={formData.coverImage} onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Tags (comma separated)</label>
            <input type="text" className="input" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
          </div>
        </div>

        <div className="form-group flex items-center gap-sm mt-md">
          <input type="checkbox" id="published" className="w-5 h-5 accent-primary" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} />
          <label htmlFor="published" className="label mb-0 cursor-pointer">Publish Immediately</label>
        </div>

        <div className="flex justify-end gap-md mt-lg">
          <button type="button" onClick={() => router.push('/admin/blog')} className="btn btn-outline" disabled={saving}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Create Post'}</button>
        </div>
      </form>
    </div>
  );
}
