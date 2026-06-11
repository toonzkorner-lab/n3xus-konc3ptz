'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'PLANNING',
    budget: 0,
    progress: 0,
    deadline: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) throw new Error('Failed to fetch project');
        const data = await res.json();
        
        let formattedDate = '';
        if (data.deadline) {
          const d = new Date(data.deadline);
          formattedDate = d.toISOString().split('T')[0];
        }

        setFormData({
          title: data.title || '',
          description: data.description || '',
          status: data.status || 'PLANNING',
          budget: data.budget ? data.budget / 100 : 0, // Convert cents to dollars for display
          progress: data.progress || 0,
          deadline: formattedDate,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        budget: Math.round(formData.budget * 100), // Convert dollars to cents
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      };

      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        throw new Error('Failed to update project');
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) return <div className="text-secondary">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl text-primary mb-xl">Edit Project</h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-md rounded-md mb-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card flex flex-col gap-lg">
        <div className="form-group">
          <label className="label">Title</label>
          <input
            type="text"
            required
            className="input"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="label">Description</label>
          <textarea
            className="input min-h-[100px]"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-md">
          <div className="form-group">
            <label className="label">Status</label>
            <select
              className="input"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="PLANNING">Planning</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label">Budget ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-md">
          <div className="form-group">
            <label className="label">Progress (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="input"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="form-group">
            <label className="label">Deadline</label>
            <input
              type="date"
              className="input"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-md mt-md">
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            className="btn btn-outline"
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
