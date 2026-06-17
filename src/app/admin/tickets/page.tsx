import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Manage Tickets | Admin Console',
};

export default async function AdminTicketsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    redirect('/');
  }

  const tickets = await prisma.ticket.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      client: { select: { name: true, email: true } },
      _count: { select: { replies: true } }
    }
  });

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex items-center justify-between border-b border-subtle pb-md">
        <div>
          <h1 className="text-3xl text-primary font-heading mb-xs">Support Tickets</h1>
          <p className="text-secondary font-mono text-sm">Manage incoming client inquiries and support requests.</p>
        </div>
      </div>

      <div className="bg-card border border-subtle rounded-xl overflow-hidden shadow-md">
        {tickets.length === 0 ? (
          <div className="p-2xl text-center text-secondary">
            <p>No support tickets found.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-tertiary text-primary border-b border-subtle">
              <tr>
                <th className="p-md font-heading">Client</th>
                <th className="p-md font-heading">Subject</th>
                <th className="p-md font-heading">Status</th>
                <th className="p-md font-heading">Priority</th>
                <th className="p-md font-heading">Replies</th>
                <th className="p-md font-heading">Last Updated</th>
                <th className="p-md font-heading text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle text-sm">
              {tickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-primary-subtle/20 transition-colors">
                  <td className="p-md">
                    <div className="font-bold text-primary">{ticket.client.name}</div>
                    <div className="text-xs text-secondary">{ticket.client.email}</div>
                  </td>
                  <td className="p-md font-bold text-primary">
                    {ticket.subject}
                  </td>
                  <td className="p-md">
                    <span className={`px-sm py-xs rounded-full text-xs font-bold ${
                      ticket.status === 'OPEN' ? 'bg-blue-500/20 text-blue-500' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-accent/20 text-accent' :
                      ticket.status === 'RESOLVED' ? 'bg-green-500/20 text-green-500' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-md">
                    <span className={`text-xs font-bold ${
                      ticket.priority === 'URGENT' ? 'text-red-500' :
                      ticket.priority === 'HIGH' ? 'text-orange-500' :
                      ticket.priority === 'NORMAL' ? 'text-blue-500' :
                      'text-gray-400'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-md text-secondary">
                    {ticket._count.replies}
                  </td>
                  <td className="p-md text-secondary">
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-md text-right">
                    <Link href={`/admin/tickets/${ticket.id}`} className="btn btn-sm btn-outline">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
