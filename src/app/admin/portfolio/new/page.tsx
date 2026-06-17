'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';

export default function NewPortfolioPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDesc: '',
    category: '',
    featured: false,
    liveUrl: '',
    githubUrl: '',
    images: '',
    tags: '',
  });
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ ...formData, title, slug: generateSlug(title) });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    setError('');
    
    try {
      const urls: string[] = [];
      for (const file of Array.from(e.target.files)) {
        const newBlob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/blob-upload',
          multipart: true,
        });
        urls.push(newBlob.url);
      }
      
      // Append new URLs to the existing images string
      const currentImages = formData.images ? formData.images.split(',').map(s => s.trim()).filter(Boolean) : [];
      const newImagesString = [...currentImages, ...urls].join(', ');
      
      setFormData({ ...formData, images: newImagesString });
      
      // Clear the input
      e.target.value = '';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        images: formData.images ? JSON.stringify(formData.images.split(',').map(s => s.trim())) : '[]',
        tags: formData.tags ? JSON.stringify(formData.tags.split(',').map(s => s.trim())) : '[]',
      };

      const res = await fetch(`/api/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        throw new Error('Failed to create portfolio item');
      }

      router.push('/admin/portfolio');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl text-primary mb-xl">Add Portfolio Item</h1>
      
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
          <label className="label">Short Description</label>
          <input type="text" className="input" value={formData.shortDesc} onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })} />
        </div>

        <div className="form-group">
          <label className="label">Full Description</label>
          <textarea className="input min-h-[150px]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-md">
          <div className="form-group">
            <label className="label">Category</label>
            <input type="text" className="input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
          </div>
          <div className="form-group flex items-center gap-sm mt-lg">
            <input type="checkbox" id="featured" className="w-5 h-5 accent-primary" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
            <label htmlFor="featured" className="label mb-0 cursor-pointer">Featured Item</label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-md">
          <div className="form-group">
            <label className="label">Live URL</label>
            <input type="url" className="input" value={formData.liveUrl} onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">GitHub URL</label>
            <input type="url" className="input" value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} />
          </div>
        </div>

        <div className="form-group border border-subtle p-md rounded-md bg-tertiary">
          <label className="label">Upload Media (Images & Videos)</label>
          <input 
            type="file" 
            multiple 
            accept="image/*,video/*" 
            onChange={handleFileUpload} 
            disabled={uploading}
            className="w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-subtle file:text-primary hover:file:bg-primary hover:file:text-inverse"
          />
          {uploading && <p className="text-sm text-primary mt-sm animate-pulse">Uploading files...</p>}
        </div>

        <div className="form-group">
          <label className="label">Media URLs (comma separated)</label>
          <input type="text" className="input" value={formData.images} onChange={(e) => setFormData({ ...formData, images: e.target.value })} />
        </div>

        <div className="form-group">
          <label className="label">Tags (comma separated)</label>
          <input type="text" className="input" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
        </div>

        <div className="flex justify-end gap-md mt-md">
          <button type="button" onClick={() => router.push('/admin/portfolio')} className="btn btn-outline" disabled={saving}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Create Item'}</button>
        </div>
      </form>
    </div>
  );
}
