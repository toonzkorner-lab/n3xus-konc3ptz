import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import NewTicketForm from './NewTicketForm';

export const metadata = {
  title: 'Support Tickets | Dashboard',
};

export default async function ClientTicketsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) return null;

  const tickets = await prisma.ticket.findMany({
    where: { clientId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: {
        select: { replies: true }
      }
    }
  });

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary mb-xs font-heading">Support Tickets</h1>
          <p className="text-secondary">Manage your support requests and inquiries.</p>
        </div>
        <NewTicketForm />
      </div>

      <div className="bg-card border border-subtle rounded-xl overflow-hidden shadow-md">
        {tickets.length === 0 ? (
          <div className="p-2xl text-center text-secondary">
            <div className="text-4xl mb-sm">🎫</div>
            <p>You have no support tickets.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-primary-subtle text-primary border-b border-subtle">
              <tr>
                <th className="p-md font-heading">Subject</th>
                <th className="p-md font-heading">Status</th>
                <th className="p-md font-heading">Priority</th>
                <th className="p-md font-heading">Replies</th>
                <th className="p-md font-heading">Last Updated</th>
                <th className="p-md font-heading text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle">
              {tickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-primary-subtle/50 transition-colors">
                  <td className="p-md">
                    <div className="font-bold text-primary">{ticket.subject}</div>
                  </td>
                  <td className="p-md">
                    <span className={`px-sm py-xs rounded-full text-xs font-bold ${
                      ticket.status === 'OPEN' ? 'bg-blue-500/20 text-blue-500' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-accent-subtle text-accent' :
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
                  <td className="p-md text-secondary text-sm">
                    {ticket._count.replies}
                  </td>
                  <td className="p-md text-secondary text-sm">
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-md text-right">
                    <Link href={`/dashboard/tickets/${ticket.id}`} className="btn btn-sm btn-outline">
                      View Ticket
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
