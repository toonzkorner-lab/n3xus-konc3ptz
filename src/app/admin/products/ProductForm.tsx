'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';

export default function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    shortDesc: initialData?.shortDesc || '',
    description: initialData?.description || '',
    price: initialData ? (initialData.price / 100).toString() : '',
    category: initialData?.category || '',
    active: initialData !== undefined ? initialData.active : true,
    features: initialData?.features ? JSON.parse(initialData.features).join('\n') : '',
    imagePath: initialData?.images ? JSON.parse(initialData.images)[0] || '' : '',
    digitalFileUrl: initialData?.digitalFileUrl || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [digitalFile, setDigitalFile] = useState<File | null>(null);

  const handleSlugify = () => {
    setFormData(prev => ({
      ...prev,
      slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }));
  };

  const uploadFile = async (file: File) => {
    const newBlob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: '/api/blob-upload',
          multipart: true,
    });
    return newBlob.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let finalImagePath = formData.imagePath;
      if (imageFile) {
        finalImagePath = await uploadFile(imageFile);
      }

      let finalDigitalFileUrl = formData.digitalFileUrl;
      if (digitalFile) {
        finalDigitalFileUrl = await uploadFile(digitalFile);
      }

      const payload = {
        ...formData,
        price: Math.round(parseFloat(formData.price) * 100),
        images: finalImagePath ? [finalImagePath] : [],
        features: formData.features.split('\n').map((f: string) => f.trim()).filter(Boolean),
        digitalFileUrl: finalDigitalFileUrl,
      };

      const url = initialData ? `/api/products/${initialData.id}` : '/api/products';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      alert(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-subtle p-lg rounded-xl flex flex-col gap-lg">
      
      <div className="grid grid-2 gap-md">
        <div className="form-group">
          <label className="form-label">Title</label>
          <input 
            type="text" 
            required 
            className="form-input" 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            onBlur={!initialData ? handleSlugify : undefined}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Slug</label>
          <input 
            type="text" 
            required 
            className="form-input font-mono" 
            value={formData.slug}
            onChange={e => setFormData({...formData, slug: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-2 gap-md">
        <div className="form-group">
          <label className="form-label">Price (USD)</label>
          <input 
            type="number" 
            step="0.01"
            required 
            className="form-input" 
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <input 
            type="text" 
            className="form-input" 
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
            placeholder="e.g. Bots, Templates"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Short Description</label>
        <input 
          type="text" 
          className="form-input" 
          value={formData.shortDesc}
          onChange={e => setFormData({...formData, shortDesc: e.target.value})}
          maxLength={150}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Full Description</label>
        <textarea 
          rows={5}
          className="form-textarea" 
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        ></textarea>
      </div>

      <div className="form-group">
        <label className="form-label">Features (one per line)</label>
        <textarea 
          rows={5}
          className="form-textarea" 
          value={formData.features}
          onChange={e => setFormData({...formData, features: e.target.value})}
          placeholder="AI Moderation&#10;Ticket System&#10;24/7 Uptime"
        ></textarea>
      </div>

      <div className="grid grid-2 gap-md border-t border-subtle pt-md">
        <div className="form-group">
          <label className="form-label">Cover Image</label>
          {formData.imagePath && <img src={formData.imagePath} alt="Cover" className="w-24 h-24 object-cover rounded mb-2" />}
          <input 
            type="file" 
            accept="image/*,video/*"
            className="form-input"
            onChange={e => setImageFile(e.target.files?.[0] || null)}
          />
          <p className="text-xs text-tertiary mt-1">Upload a new image to replace the current one.</p>
        </div>

        <div className="form-group">
          <label className="form-label">Digital File (The Product)</label>
          {formData.digitalFileUrl && <p className="text-sm text-success mb-2">File already uploaded</p>}
          <input 
            type="file" 
            className="form-input"
            onChange={e => setDigitalFile(e.target.files?.[0] || null)}
          />
          <p className="text-xs text-tertiary mt-1">Upload a .zip or other file for the customer to download after purchase.</p>
        </div>
      </div>

      <div className="form-group mt-md border-t border-subtle pt-md">
        <label className="flex items-center gap-sm cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.active}
            onChange={e => setFormData({...formData, active: e.target.checked})}
            className="w-5 h-5 accent-primary rounded border-subtle bg-secondary"
          />
          <span className="text-primary font-bold">Active (Visible in Store)</span>
        </label>
      </div>

      <div className="flex gap-md pt-lg border-t border-subtle mt-lg">
        <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1">
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Product' : 'Create Product')}
        </button>
        <button type="button" onClick={() => router.push('/admin/products')} className="btn btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  );
}
