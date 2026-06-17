import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import AdminTicketActions from './AdminTicketActions';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) return { title: 'Ticket Not Found | Admin Console' };
  return { title: `Manage Ticket: ${ticket.subject} | Admin Console` };
}

export default async function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    redirect('/');
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      client: { select: { name: true, email: true, image: true, company: true } },
      replies: {
        include: { sender: { select: { name: true, role: true, image: true } } },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!ticket) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-xl max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-md">
        <div className="flex items-center gap-md text-sm">
          <Link href="/admin/tickets" className="text-secondary hover:text-accent transition-colors flex items-center gap-xs">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Tickets
          </Link>
        </div>
      </div>

      <div className="bg-card border border-subtle rounded-xl p-xl shadow-md">
        <div className="flex items-start justify-between border-b border-subtle pb-md mb-md">
          <div>
            <h1 className="text-3xl text-primary font-heading mb-xs">{ticket.subject}</h1>
            <div className="flex items-center gap-md text-sm text-secondary">
              <span>Opened on {new Date(ticket.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="font-mono text-xs">ID: {ticket.id}</span>
              <span>•</span>
              <span className={`px-xs py-1 rounded text-xs font-bold ${
                ticket.status === 'OPEN' ? 'text-blue-500 bg-blue-500/10' :
                ticket.status === 'IN_PROGRESS' ? 'text-accent bg-accent/20' :
                ticket.status === 'RESOLVED' ? 'text-green-500 bg-green-500/10' :
                'text-gray-400 bg-gray-500/10'
              }`}>
                {ticket.status.replace('_', ' ')}
              </span>
              <span>•</span>
              <span className="text-secondary font-bold">Priority: {ticket.priority}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-md mb-2xl border-b border-subtle pb-xl">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex-shrink-0 overflow-hidden flex items-center justify-center font-bold text-primary border border-primary/20">
            {ticket.client.image ? (
              <img src={ticket.client.image} alt={ticket.client.name || 'User'} className="w-full h-full object-cover" />
            ) : (
              ticket.client.name?.charAt(0) || 'U'
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between mb-xs">
              <div className="flex items-baseline gap-sm">
                <span className="font-bold text-primary">{ticket.client.name || 'Unknown User'}</span>
                {ticket.client.company && <span className="text-xs text-secondary bg-tertiary px-2 py-0.5 rounded-full">{ticket.client.company}</span>}
              </div>
              <span className="text-xs text-tertiary">{new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
            <div className="text-xs text-secondary mb-sm">{ticket.client.email}</div>
            <div className="text-secondary whitespace-pre-wrap bg-tertiary p-md rounded-md border border-subtle mt-sm">{ticket.description}</div>
          </div>
        </div>

        <div className="flex flex-col gap-xl">
          <h3 className="text-xl text-primary font-heading">Thread</h3>
          
          {ticket.replies.length === 0 ? (
            <p className="text-secondary italic">No replies yet.</p>
          ) : (
            <div className="flex flex-col gap-lg">
              {ticket.replies.map(reply => {
                const isAdmin = reply.sender.role === 'ADMIN' || reply.sender.role === 'OWNER';
                return (
                  <div key={reply.id} className={`flex gap-md p-md rounded-lg ${isAdmin ? 'bg-accent/10 border border-accent/20' : 'bg-primary-subtle/5 border border-subtle'}`}>
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center font-bold ${isAdmin ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
                      {reply.sender.image ? (
                        <img src={reply.sender.image} alt={reply.sender.name || 'User'} className="w-full h-full object-cover" />
                      ) : (
                        reply.sender.name?.charAt(0) || (isAdmin ? 'A' : 'U')
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between mb-xs">
                        <div className="flex items-baseline gap-sm">
                          <span className={`font-bold ${isAdmin ? 'text-accent' : 'text-primary'}`}>
                            {reply.sender.name}
                          </span>
                          {isAdmin && <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full uppercase tracking-wider">Staff</span>}
                        </div>
                        <span className="text-xs text-tertiary">{new Date(reply.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="text-secondary whitespace-pre-wrap mt-sm">{reply.content}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <AdminTicketActions ticketId={ticket.id} currentStatus={ticket.status} />
      </div>
    </div>
  );
}
