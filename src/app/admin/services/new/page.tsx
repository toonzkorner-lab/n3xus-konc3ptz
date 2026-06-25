'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { upload } from '@vercel/blob/client';

export default function NewServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [features, setFeatures] = useState(['']);
  const [iconValue, setIconValue] = useState('🚀');

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      const file = e.target.files[0];
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/blob-upload',
          multipart: true,
      });
      setIconValue(newBlob.url);
      e.target.value = '';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => setFeatures([...features, '']);
  const removeFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      shortDesc: formData.get('shortDesc'),
      price: parseFloat(formData.get('price') as string) || 0,
      features: features.filter(f => f.trim() !== ''),
      category: formData.get('category'),
      icon: iconValue || '🚀',
      order: parseInt(formData.get('order') as string) || 0,
      recurring: formData.get('recurring') === 'none' ? null : formData.get('recurring'),
    };

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/admin/services');
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to create service');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-xl max-w-4xl">
      <div>
        <div className="mb-sm">
          <Link href="/admin/services" className="text-sm text-secondary hover:text-primary transition-colors">
            ← Back to Services
          </Link>
        </div>
        <h1 className="text-3xl text-primary font-heading">Add New Service</h1>
        <p className="text-secondary font-mono text-sm">Deploy a new service offering to the public matrix</p>
      </div>

      <div className="bg-card border border-subtle rounded-xl p-2xl">
        {error && <div className="bg-error/20 border border-error text-error p-md rounded-md mb-xl">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
          <div className="grid grid-2 gap-lg">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Service Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className="form-input" 
                required 
                placeholder="e.g. AI Integration"
                onChange={(e) => {
                  const name = e.target.value;
                  const slugInput = document.getElementById('slug') as HTMLInputElement;
                  if (slugInput && !slugInput.dataset.manual) {
                    slugInput.value = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  }
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="slug">URL Slug</label>
              <input 
                type="text" 
                id="slug" 
                name="slug" 
                className="form-input" 
                required 
                placeholder="e.g. ai-integration"
                onChange={(e) => {
                  e.target.dataset.manual = "true";
                }}
              />
            </div>
          </div>

          <div className="grid grid-3 gap-lg">
            <div className="form-group">
              <label className="form-label" htmlFor="price">Base Price ($)</label>
              <input type="number" id="price" name="price" className="form-input" min="0" step="0.01" required placeholder="499.00" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="recurring">Pricing Model</label>
              <select id="recurring" name="recurring" className="form-input">
                <option value="none">One-time Payment</option>
                <option value="month">Monthly Subscription</option>
                <option value="year">Yearly Subscription</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Category</label>
              <input type="text" id="category" name="category" className="form-input" placeholder="e.g. Bots" />
            </div>

            <div className="form-group">
              <label className="form-label">Service Icon</label>
              <div className="flex items-center gap-md mb-sm">
                <div className="w-16 h-16 rounded-lg border border-subtle bg-tertiary flex items-center justify-center overflow-hidden flex-shrink-0">
                  {iconValue && (iconValue.startsWith('/uploads') || iconValue.startsWith('http')) ? (
                    /\.(mp4|webm|ogg|mov)$/i.test(iconValue) ? (
                      <video src={iconValue} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                    ) : (
                      <img src={iconValue} alt="icon" className="w-full h-full object-cover" />
                    )
                  ) : (
                    <span className="text-3xl">{iconValue}</span>
                  )}
                </div>
                <div className="flex flex-col gap-xs flex-1">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleIconUpload}
                    disabled={uploading}
                    className="w-full text-xs text-secondary file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-subtle file:text-primary hover:file:bg-primary hover:file:text-inverse"
                  />
                  {uploading && <p className="text-xs text-primary animate-pulse">Uploading...</p>}
                  <input
                    type="text"
                    className="form-input text-sm"
                    placeholder="Or type emoji: 🤖"
                    value={iconValue}
                    onChange={(e) => setIconValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="shortDesc">Short Description</label>
            <input type="text" id="shortDesc" name="shortDesc" className="form-input" placeholder="Brief summary for cards" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Full Description</label>
            <textarea id="description" name="description" className="form-input min-h-[120px]" placeholder="Detailed description of the service..."></textarea>
          </div>

          <div className="border border-subtle rounded-lg p-md bg-primary-subtle/5 mt-sm">
            <label className="form-label mb-md">Features</label>
            <div className="flex flex-col gap-sm">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-sm">
                  <input 
                    type="text" 
                    value={feature} 
                    onChange={(e) => handleFeatureChange(index, e.target.value)} 
                    className="form-input flex-1 text-sm" 
                    placeholder="e.g. 24/7 Support"
                  />
                  <button type="button" onClick={() => removeFeature(index)} className="btn btn-secondary btn-sm" disabled={features.length === 1}>✕</button>
                </div>
              ))}
              <button type="button" onClick={addFeature} className="text-sm font-bold text-primary hover:text-accent transition-colors self-start mt-sm">
                + Add Feature
              </button>
            </div>
          </div>

          <div className="form-group w-1/3 mt-sm">
            <label className="form-label" htmlFor="order">Display Order</label>
            <input type="number" id="order" name="order" className="form-input" defaultValue="0" />
          </div>

          <div className="flex justify-end gap-md mt-xl pt-lg border-t border-subtle">
            <Link href="/admin/services" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Deploying...' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
