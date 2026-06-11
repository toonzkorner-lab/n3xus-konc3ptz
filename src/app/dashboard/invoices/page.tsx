import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'My Invoices | N3xUs Konc3pt\'z',
  description: 'View and track your invoices.',
};

export default async function DashboardInvoicesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const invoices = await prisma.invoice.findMany({
    where: { clientId: session.user.id },
    include: {
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

  const totalOwed = invoices
    .filter(i => i.status === 'SENT' || i.status === 'OVERDUE')
    .reduce((sum, i) => sum + i.amount + i.tax, 0);

  return (
    <div className="flex flex-col gap-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary mb-xs">My Invoices</h1>
          <p className="text-secondary">Track your billing and payment history.</p>
        </div>
        {totalOwed > 0 && (
          <div className="bg-card border border-subtle rounded-xl p-lg text-center">
            <p className="text-xs text-tertiary font-heading">Outstanding Balance</p>
            <p className="text-2xl font-heading" style={{ color: 'var(--color-warning)' }}>
              ${(totalOwed / 100).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {invoices.length === 0 ? (
        <div className="bg-card border border-subtle rounded-xl p-3xl text-center">
          <div className="text-5xl mb-md">💳</div>
          <h3 className="text-xl text-primary mb-sm">No Invoices</h3>
          <p className="text-secondary">You don&apos;t have any invoices yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-lg">
          {invoices.map(invoice => (
            <div key={invoice.id} className="bg-card border border-subtle rounded-xl p-xl hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-md">
                <div>
                  <h3 className="text-lg font-heading text-primary font-mono">{invoice.number}</h3>
                  <p className="text-sm text-secondary">{invoice.project?.title || 'General'}</p>
                </div>
                <span className={`badge ${statusColors[invoice.status] || 'badge-primary'}`}>
                  {invoice.status}
                </span>
              </div>

              <div className="border-t border-subtle pt-md">
                <div className="flex flex-col gap-xs mb-md">
                  {invoice.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-secondary">{item.description} × {item.quantity}</span>
                      <span className="text-primary font-mono">${(item.unitPrice * item.quantity / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-md border-t border-subtle">
                  <div className="text-sm text-tertiary">
                    {invoice.dueDate && (
                      <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-tertiary">Subtotal: ${(invoice.amount / 100).toFixed(2)}</div>
                    <div className="text-xs text-tertiary">Tax: ${(invoice.tax / 100).toFixed(2)}</div>
                    <div className="text-lg font-heading text-primary font-bold mt-xs">
                      ${((invoice.amount + invoice.tax) / 100).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
