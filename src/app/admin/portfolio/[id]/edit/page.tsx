'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditPortfolioPage() {
  const router = useRouter();
  const params = useParams();
  const portfolioId = params.id as string;

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
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(`/api/portfolio/${portfolioId}`);
        if (!res.ok) throw new Error('Failed to fetch portfolio item');
        const data = await res.json();
        
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          description: data.description || '',
          shortDesc: data.shortDesc || '',
          category: data.category || '',
          featured: data.featured || false,
          liveUrl: data.liveUrl || '',
          githubUrl: data.githubUrl || '',
          images: data.images ? JSON.parse(data.images).join(', ') : '',
          tags: data.tags ? JSON.parse(data.tags).join(', ') : '',
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [portfolioId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    setError('');
    
    const data = new FormData();
    Array.from(e.target.files).forEach(file => {
      data.append('files', file);
    });

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }
      
      const { urls } = await res.json();
      
      const currentImages = formData.images ? formData.images.split(',').map(s => s.trim()).filter(Boolean) : [];
      const newImagesString = [...currentImages, ...urls].join(', ');
      
      setFormData({ ...formData, images: newImagesString });
      
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
        images: formData.images ? JSON.stringify(formData.images.split(',').map(s => s.trim()).filter(s => s)) : '[]',
        tags: formData.tags ? JSON.stringify(formData.tags.split(',').map(s => s.trim()).filter(s => s)) : '[]',
      };

      const res = await fetch(`/api/portfolio/${portfolioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        throw new Error('Failed to update portfolio item');
      }

      router.refresh();
      router.push('/admin/portfolio');
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) return <div className="text-secondary">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl text-primary mb-xl">Edit Portfolio Item</h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-md rounded-md mb-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card flex flex-col gap-lg">
        <div className="grid grid-cols-2 gap-md">
          <div className="form-group">
            <label className="label">Title</label>
            <input type="text" required className="input" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
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
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
}
