'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CouponForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Setup initial values
  // We handle currency inputs in dollars for the UI, but store in cents in DB
  const isFixed = initialData?.type === 'FIXED';
  const initialValue = initialData ? (isFixed ? (initialData.value / 100).toString() : initialData.value.toString()) : '';
  const initialMinAmount = initialData && initialData.minOrderAmount ? (initialData.minOrderAmount / 100).toString() : '';

  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    description: initialData?.description || '',
    type: initialData?.type || 'PERCENTAGE',
    value: initialValue,
    minOrderAmount: initialMinAmount,
    maxUses: initialData?.maxUses ? initialData.maxUses.toString() : '',
    active: initialData ? initialData.active : true,
    expiresAt: initialData?.expiresAt ? new Date(initialData.expiresAt).toISOString().split('T')[0] : '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Prepare payload
      // Convert UI dollar amounts to cents for DB
      const isFixedType = formData.type === 'FIXED';
      const parsedValue = isFixedType 
        ? Math.round(parseFloat(formData.value) * 100) 
        : parseInt(formData.value);
        
      const parsedMinAmount = formData.minOrderAmount 
        ? Math.round(parseFloat(formData.minOrderAmount) * 100) 
        : 0;

      const payload = {
        ...formData,
        value: parsedValue,
        minOrderAmount: parsedMinAmount,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
      };

      const url = initialData ? `/api/coupons/${initialData.id}` : '/api/coupons';
      const method = initialData ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/coupons');
        router.refresh();
      } else {
        setError(data.error || 'Something went wrong');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-subtle rounded-xl p-xl shadow-lg">
      {error && (
        <div className="mb-lg p-md bg-error/10 border border-error/30 rounded-md text-error text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-2 gap-lg mb-lg">
        <div className="form-group">
          <label className="form-label" htmlFor="code">Code (e.g. SUMMER25)</label>
          <input
            id="code"
            name="code"
            type="text"
            required
            className="form-input font-mono uppercase"
            value={formData.code}
            onChange={handleChange}
            placeholder="SUMMER25"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Description (Optional)</label>
          <input
            id="description"
            name="description"
            type="text"
            className="form-input"
            value={formData.description}
            onChange={handleChange}
            placeholder="Internal description"
          />
        </div>
      </div>

      <div className="grid grid-2 gap-lg mb-lg">
        <div className="form-group">
          <label className="form-label" htmlFor="type">Discount Type</label>
          <select
            id="type"
            name="type"
            className="form-input"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FIXED">Fixed Amount ($)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="value">
            Discount Value {formData.type === 'PERCENTAGE' ? '(%)' : '($)'}
          </label>
          <input
            id="value"
            name="value"
            type="number"
            step={formData.type === 'PERCENTAGE' ? "1" : "0.01"}
            required
            className="form-input"
            value={formData.value}
            onChange={handleChange}
            placeholder={formData.type === 'PERCENTAGE' ? "25" : "10.00"}
          />
        </div>
      </div>

      <div className="grid grid-2 gap-lg mb-lg">
        <div className="form-group">
          <label className="form-label" htmlFor="minOrderAmount">Min. Order Amount ($) (Optional)</label>
          <input
            id="minOrderAmount"
            name="minOrderAmount"
            type="number"
            step="0.01"
            className="form-input"
            value={formData.minOrderAmount}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="maxUses">Max Uses (Optional)</label>
          <input
            id="maxUses"
            name="maxUses"
            type="number"
            step="1"
            className="form-input"
            value={formData.maxUses}
            onChange={handleChange}
            placeholder="Unlimited if left blank"
          />
        </div>
      </div>

      <div className="grid grid-2 gap-lg mb-xl">
        <div className="form-group">
          <label className="form-label" htmlFor="expiresAt">Expiration Date (Optional)</label>
          <input
            id="expiresAt"
            name="expiresAt"
            type="date"
            className="form-input"
            value={formData.expiresAt}
            onChange={handleChange}
          />
        </div>

        <div className="form-group flex items-center mt-lg">
          <label className="flex items-center gap-sm cursor-pointer">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-5 h-5 accent-primary"
            />
            <span className="text-secondary font-medium">Coupon is Active</span>
          </label>
        </div>
      </div>

      <div className="flex gap-md justify-end pt-lg border-t border-subtle">
        <Link href="/admin/coupons" className="btn btn-ghost">
          Cancel
        </Link>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Coupon' : 'Create Coupon')}
        </button>
      </div>
    </form>
  );
}
