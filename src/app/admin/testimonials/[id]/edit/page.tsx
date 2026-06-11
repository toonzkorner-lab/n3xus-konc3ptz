'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const testimonialId = params.id as string;

  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: '',
    clientCompany: '',
    content: '',
    rating: 5,
    avatar: '',
    featured: false,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const res = await fetch(`/api/testimonials/${testimonialId}`);
        if (!res.ok) throw new Error('Failed to fetch testimonial');
        const data = await res.json();
        
        setFormData({
          clientName: data.clientName || '',
          clientRole: data.clientRole || '',
          clientCompany: data.clientCompany || '',
          content: data.content || '',
          rating: data.rating || 5,
          avatar: data.avatar || '',
          featured: data.featured || false,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonial();
  }, [testimonialId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to update testimonial');
      }

      router.push('/admin/testimonials');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) return <div className="text-secondary">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl text-primary mb-xl">Edit Testimonial</h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-md rounded-md mb-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card flex flex-col gap-lg">
        <div className="grid grid-cols-2 gap-md">
          <div className="form-group">
            <label className="label">Client Name</label>
            <input type="text" required className="input" value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Client Role</label>
            <input type="text" className="input" value={formData.clientRole} onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-md">
          <div className="form-group">
            <label className="label">Client Company</label>
            <input type="text" className="input" value={formData.clientCompany} onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Avatar URL</label>
            <input type="text" className="input" value={formData.avatar} onChange={(e) => setFormData({ ...formData, avatar: e.target.value })} />
          </div>
        </div>

        <div className="form-group">
          <label className="label">Testimonial Content</label>
          <textarea required className="input min-h-[100px]" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-md">
          <div className="form-group">
            <label className="label">Rating (1-5)</label>
            <input type="number" min="1" max="5" required className="input" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })} />
          </div>
          <div className="form-group flex items-center gap-sm mt-lg">
            <input type="checkbox" id="featured" className="w-5 h-5 accent-primary" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
            <label htmlFor="featured" className="label mb-0 cursor-pointer">Featured Testimonial</label>
          </div>
        </div>

        <div className="flex justify-end gap-md mt-md">
          <button type="button" onClick={() => router.push('/admin/testimonials')} className="btn btn-outline" disabled={saving}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
}
