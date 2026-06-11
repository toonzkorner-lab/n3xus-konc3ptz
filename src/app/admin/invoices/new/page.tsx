'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<{ id: string; name: string; email: string }[]>([]);
  const [projects, setProjects] = useState<{ id: string; title: string; clientId: string }[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  
  const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setClients(data.filter(u => u.role === 'CLIENT'));
      })
      .catch(console.error);

    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(console.error);
  }, []);

  const handleAddItem = () => setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  
  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      clientId: formData.get('clientId'),
      projectId: formData.get('projectId') || null,
      dueDate: formData.get('dueDate'),
      notes: formData.get('notes'),
      items: items.filter(item => item.description.trim() !== ''),
    };

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/admin/invoices');
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to generate invoice');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => p.clientId === selectedClient);

  return (
    <div className="flex flex-col gap-xl max-w-4xl">
      <div>
        <div className="mb-sm">
          <Link href="/admin/invoices" className="text-sm text-secondary hover:text-primary transition-colors">
            ← Back to Invoices
          </Link>
        </div>
        <h1 className="text-3xl text-primary font-heading">Generate Invoice</h1>
        <p className="text-secondary font-mono text-sm">Create a new billing statement</p>
      </div>

      <div className="bg-card border border-subtle rounded-xl p-2xl">
        {error && <div className="bg-error/20 border border-error text-error p-md rounded-md mb-xl">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
          <div className="grid grid-2 gap-lg">
            <div className="form-group">
              <label className="form-label" htmlFor="clientId">Client</label>
              <select 
                id="clientId" 
                name="clientId" 
                className="form-input" 
                required 
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                <option value="" disabled>Select a client...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name} ({client.email})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="projectId">Project (Optional)</label>
              <select id="projectId" name="projectId" className="form-input" disabled={!selectedClient || filteredProjects.length === 0} defaultValue="">
                <option value="">-- No specific project --</option>
                {filteredProjects.map(project => (
                  <option key={project.id} value={project.id}>{project.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border border-subtle rounded-lg overflow-hidden mt-md">
            <div className="bg-primary-subtle/10 p-md border-b border-subtle grid grid-cols-12 gap-sm font-bold text-xs text-secondary uppercase tracking-wider">
              <div className="col-span-6">Description</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-3">Unit Price ($)</div>
              <div className="col-span-1"></div>
            </div>
            
            <div className="p-md flex flex-col gap-sm">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-sm items-center">
                  <div className="col-span-6">
                    <input 
                      type="text" 
                      className="form-input text-sm" 
                      placeholder="Service description" 
                      required
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="number" 
                      className="form-input text-sm" 
                      min="1" 
                      required
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-3">
                    <input 
                      type="number" 
                      className="form-input text-sm" 
                      min="0" 
                      step="0.01" 
                      required
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button 
                      type="button" 
                      className="text-error hover:text-error/80 transition-colors p-sm"
                      onClick={() => handleRemoveItem(index)}
                      disabled={items.length === 1}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-primary-subtle/5 p-sm border-t border-subtle text-center">
              <button type="button" onClick={handleAddItem} className="text-sm font-bold text-primary hover:text-accent transition-colors">
                + Add Line Item
              </button>
            </div>
          </div>

          <div className="grid grid-2 gap-lg mt-md">
            <div className="form-group">
              <label className="form-label" htmlFor="dueDate">Due Date (Optional)</label>
              <input type="date" id="dueDate" name="dueDate" className="form-input" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="notes">Notes (Optional)</label>
            <textarea id="notes" name="notes" className="form-input" placeholder="Thank you for your business..."></textarea>
          </div>

          <div className="flex justify-end gap-md mt-xl pt-lg border-t border-subtle">
            <Link href="/admin/invoices" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
