'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { upload } from '@vercel/blob/client';

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [features, setFeatures] = useState(['']);
  const [service, setService] = useState<any>(null);
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
  
  const { id } = use(params);

  useEffect(() => {
    fetch(`/api/services/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Service not found');
        return res.json();
      })
      .then(data => {
        setService(data);
        setIconValue(data.icon || '🚀');
        if (data.features) {
          try {
            const parsed = JSON.parse(data.features);
            setFeatures(Array.isArray(parsed) && parsed.length > 0 ? parsed : ['']);
          } catch (e) {
            setFeatures(['']);
          }
        }
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setFetching(false));
  }, [id]);

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
      active: formData.get('active') === 'on',
    };

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/admin/services');
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to update service');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-xl text-center text-secondary">Loading...</div>;
  if (!service && error) return <div className="p-xl text-error bg-error/10 border border-error/30 rounded-lg">{error}</div>;

  return (
    <div className="flex flex-col gap-xl max-w-4xl">
      <div>
        <div className="mb-sm">
          <Link href="/admin/services" className="text-sm text-secondary hover:text-primary transition-colors">
            ← Back to Services
          </Link>
        </div>
        <h1 className="text-3xl text-primary font-heading">Edit Service</h1>
        <p className="text-secondary font-mono text-sm">Update the configuration of {service.name}</p>
      </div>

      <div className="bg-card border border-subtle rounded-xl p-2xl">
        {error && <div className="bg-error/20 border border-error text-error p-md rounded-md mb-xl">{error}</div>}
        
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-lg">
          <div className="grid grid-2 gap-lg">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Service Name</label>
              <input type="text" id="name" name="name" className="form-input" required defaultValue={service.name} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="slug">URL Slug</label>
              <input type="text" id="slug" name="slug" className="form-input" required defaultValue={service.slug} />
            </div>
          </div>

          <div className="grid grid-3 gap-lg">
            <div className="form-group">
              <label className="form-label" htmlFor="price">Base Price ($)</label>
              <input type="number" id="price" name="price" className="form-input" min="0" step="0.01" required defaultValue={(service.price / 100).toFixed(2)} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Category</label>
              <input type="text" id="category" name="category" className="form-input" defaultValue={service.category || ''} />
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
            <input type="text" id="shortDesc" name="shortDesc" className="form-input" defaultValue={service.shortDesc || ''} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Full Description</label>
            <textarea id="description" name="description" className="form-input min-h-[120px]" defaultValue={service.description || ''}></textarea>
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
                  />
                  <button type="button" onClick={() => removeFeature(index)} className="btn btn-secondary btn-sm" disabled={features.length === 1}>✕</button>
                </div>
              ))}
              <button type="button" onClick={addFeature} className="text-sm font-bold text-primary hover:text-accent transition-colors self-start mt-sm">
                + Add Feature
              </button>
            </div>
          </div>

          <div className="flex gap-xl mt-sm items-center">
            <div className="form-group w-1/3">
              <label className="form-label" htmlFor="order">Display Order</label>
              <input type="number" id="order" name="order" className="form-input" defaultValue={service.order || 0} />
            </div>
            
            <div className="flex items-center gap-sm mt-md">
              <input type="checkbox" id="active" name="active" defaultChecked={service.active} className="w-5 h-5 accent-primary" />
              <label htmlFor="active" className="text-sm font-bold text-primary">Service Active</label>
            </div>
          </div>

          <div className="flex justify-end gap-md mt-xl pt-lg border-t border-subtle">
            <Link href="/admin/services" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
