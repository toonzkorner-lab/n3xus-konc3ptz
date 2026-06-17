'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;

  const [formData, setFormData] = useState({
    status: 'DRAFT',
    notes: '',
  });
  const [paymentLinkUrl, setPaymentLinkUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/invoices/${invoiceId}`);
        if (!res.ok) throw new Error('Failed to fetch invoice');
        const data = await res.json();
        
        setFormData({
          status: data.status || 'DRAFT',
          notes: data.notes || '',
        });
        if (data.paymentLinkUrl) setPaymentLinkUrl(data.paymentLinkUrl);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [invoiceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to update invoice');
      }

      router.push('/admin/invoices');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  const handleGenerateLink = async () => {
    setGeneratingLink(true);
    setError('');
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/stripe`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate link');
      setPaymentLinkUrl(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGeneratingLink(false);
    }
  };

  if (loading) return <div className="text-secondary">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl text-primary mb-xl">Edit Invoice</h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-md rounded-md mb-xl">
          {error}
        </div>
      )}

      {paymentLinkUrl && (
        <div className="bg-primary/10 border border-primary/50 text-primary p-md rounded-md mb-xl break-all">
          <strong>Payment Link:</strong> <a href={paymentLinkUrl} target="_blank" className="underline">{paymentLinkUrl}</a>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card flex flex-col gap-lg">
        <div className="form-group">
          <label className="label">Status</label>
          <select
            className="input"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>

        <div className="form-group">
          <label className="label">Notes</label>
          <textarea
            className="input min-h-[100px]"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-md mt-md">
          <button
            type="button"
            onClick={handleGenerateLink}
            className="btn btn-secondary mr-auto"
            disabled={generatingLink}
          >
            {generatingLink ? 'Generating...' : 'Generate Stripe Link'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/invoices')}
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
