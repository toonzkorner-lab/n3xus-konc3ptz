import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteInvoiceButton from './DeleteInvoiceButton';
export const metadata = {
  title: 'Manage Invoices | N3xUs Admin',
  description: 'Invoice management console.',
};

export default async function AdminInvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: {
      client: { select: { name: true, email: true } },
      project: { select: { title: true } },
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const statusColors: Record<string, string> = {
    DRAFT: 'badge-secondary',
    SENT: 'badge-primary',
    PAID: 'badge-success',
    OVERDUE: 'badge-error',
  };

  const totalRevenue = invoices
    .filter(i => i.status === 'PAID')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPending = invoices
    .filter(i => i.status === 'SENT')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="flex flex-col gap-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary mb-xs">Invoice Console</h1>
          <p className="text-secondary">Track payments and manage billing.</p>
        </div>
        <div className="flex items-center gap-md">
          <span className="badge badge-primary">{invoices.length} Invoices</span>
          <Link href="/admin/invoices/new" className="btn btn-primary btn-sm">
            + Create Invoice
          </Link>
        </div>
      </div>

      <div className="grid grid-3 gap-xl">
        <div className="bg-card p-xl rounded-xl border border-subtle">
          <p className="text-sm text-tertiary font-heading mb-sm">Total Revenue</p>
          <p className="text-3xl font-heading text-primary" style={{ textShadow: '0 0 20px var(--color-primary-glow)' }}>
            ${(totalRevenue / 100).toLocaleString()}
          </p>
        </div>
        <div className="bg-card p-xl rounded-xl border border-subtle">
          <p className="text-sm text-tertiary font-heading mb-sm">Pending</p>
          <p className="text-3xl font-heading" style={{ color: 'var(--color-warning)' }}>
            ${(totalPending / 100).toLocaleString()}
          </p>
        </div>
        <div className="bg-card p-xl rounded-xl border border-subtle">
          <p className="text-sm text-tertiary font-heading mb-sm">Total Invoices</p>
          <p className="text-3xl font-heading text-secondary">{invoices.length}</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Project</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id}>
                <td className="font-mono text-primary font-bold">{invoice.number}</td>
                <td>
                  <div>
                    <div className="text-sm">{invoice.client.name}</div>
                    <div className="text-xs text-tertiary font-mono">{invoice.client.email}</div>
                  </div>
                </td>
                <td className="text-sm text-secondary">
                  {invoice.project?.title || '—'}
                </td>
                <td className="font-mono text-primary font-bold">
                  ${((invoice.amount + invoice.tax) / 100).toLocaleString()}
                </td>
                <td>
                  <span className={`badge ${statusColors[invoice.status] || 'badge-primary'}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="text-xs text-tertiary font-mono">
                  {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '—'}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-md">
                    <Link href={`/admin/invoices/${invoice.id}/edit`} className="text-primary hover:text-primary-focus text-sm font-bold uppercase">
                      Edit
                    </Link>
                    <DeleteInvoiceButton invoiceId={invoice.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invoices.length === 0 && (
        <div className="bg-card border border-subtle rounded-xl p-3xl text-center">
          <div className="text-5xl mb-md">💳</div>
          <h3 className="text-xl text-primary mb-sm">No Invoices Yet</h3>
          <p className="text-secondary">Create invoices via the API to track billing.</p>
        </div>
      )}
    </div>
  );
}
