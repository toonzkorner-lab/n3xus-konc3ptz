import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard | N3xUs Konc3pt\'z',
  description: 'Client dashboard overview.',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) return null;

  const projects = await prisma.project.findMany({
    where: { clientId: session.user.id },
    include: {
      tasks: {
        where: { status: { not: 'DONE' } },
        take: 3
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  const tickets = await prisma.ticket.findMany({
    where: { clientId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    take: 5
  });

  const orders = await prisma.order.findMany({
    where: { customerEmail: session.user.email },
    include: {
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Extract downloads from PAID orders
  const downloads = orders
    .filter(o => o.status === 'PAID' || o.status === 'DELIVERED')
    .flatMap(o => o.items)
    .filter(i => i.itemType === 'PRODUCT' && i.product?.digitalFileUrl)
    .map(i => ({
      title: i.title,
      url: i.product!.digitalFileUrl,
      orderId: i.orderId
    }));

  // Remove duplicates by title
  const uniqueDownloads = Array.from(new Map(downloads.map(d => [d.title, d])).values());

  const activeProjectsCount = projects.filter(p => p.status === 'IN_PROGRESS').length;
  
  return (
    <div className="flex flex-col gap-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary mb-xs">Welcome back, {session.user.name?.split(' ')[0]}</h1>
          <p className="text-secondary">Here's the current status of your digital assets.</p>
        </div>
        <div className="flex gap-md">
          <Link href="/dashboard/onboarding" className="btn btn-primary bg-accent hover:bg-accent/90 border-transparent shadow-glow-sm">
            ✨ Start Custom Project
          </Link>
          <Link href="/services" className="btn btn-outline">
            Browse Services
          </Link>
        </div>
      </div>

      <div className="grid grid-3 gap-xl">
        <div className="bg-card p-xl rounded-xl border border-subtle shadow-md">
          <div className="flex items-center gap-md mb-md">
            <div className="w-12 h-12 rounded-full bg-primary-subtle text-primary flex items-center justify-center text-xl">🚀</div>
            <h3 className="text-lg text-primary">Active Projects</h3>
          </div>
          <p className="text-4xl font-heading font-bold">{activeProjectsCount}</p>
        </div>
        
        <div className="bg-card p-xl rounded-xl border border-subtle shadow-md">
          <div className="flex items-center gap-md mb-md">
            <div className="w-12 h-12 rounded-full bg-secondary-subtle text-secondary flex items-center justify-center text-xl">💳</div>
            <h3 className="text-lg text-primary">Pending Invoices</h3>
          </div>
          <p className="text-4xl font-heading font-bold">0</p>
        </div>
        
        <div className="bg-card p-xl rounded-xl border border-subtle shadow-md">
          <div className="flex items-center gap-md mb-md">
            <div className="w-12 h-12 rounded-full bg-accent-subtle text-accent flex items-center justify-center text-xl">💬</div>
            <h3 className="text-lg text-primary">Unread Messages</h3>
          </div>
          <p className="text-4xl font-heading font-bold">2</p>
        </div>
      </div>

      <div className="grid grid-2 gap-2xl mt-xl">
        {/* Recent Projects Column */}
        <div className="flex flex-col gap-2xl">
          <div>
            <h2 className="text-2xl text-primary mb-lg flex items-center gap-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              Recent Projects
            </h2>
            
            {projects.length === 0 ? (
              <div className="bg-tertiary p-xl rounded-xl border border-subtle text-center">
                <p className="text-secondary mb-md">No active projects yet.</p>
                <Link href="/services" className="btn btn-sm btn-outline">Explore Services</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-md">
                {projects.map(project => (
                  <div key={project.id} className="bg-card p-lg rounded-xl border border-subtle hover:border-primary transition-colors group">
                    <div className="flex justify-between items-start mb-md">
                      <div>
                        <Link href={`/dashboard/projects/${project.id}`} className="text-lg text-primary font-bold hover:underline">
                          {project.title}
                        </Link>
                        <p className="text-xs text-secondary mt-1 font-mono">ID: {project.id}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider ${
                        project.status === 'COMPLETED' ? 'bg-success/20 text-success border border-success/30' :
                        project.status === 'IN_PROGRESS' ? 'bg-primary/20 text-primary border border-primary/30' :
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="mb-md">
                      <div className="flex justify-between text-xs mb-xs">
                        <span className="text-secondary">Progress</span>
                        <span className="text-primary font-bold">{project.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-input rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-primary transition-all duration-1000" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {project.tasks.length > 0 && (
                      <div className="mt-md pt-md border-t border-subtle">
                        <p className="text-xs text-secondary uppercase font-bold tracking-wider mb-sm">Active Tasks</p>
                        <ul className="flex flex-col gap-xs">
                          {project.tasks.map(task => (
                            <li key={task.id} className="text-sm flex items-start gap-sm">
                              <span className="text-accent mt-0.5">•</span>
                              <span className="text-tertiary">{task.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Support Helpdesk Column */}
        <div className="flex flex-col gap-2xl">
          <div>
            <div className="flex items-center justify-between mb-lg">
              <h2 className="text-2xl text-primary flex items-center gap-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                Support Helpdesk
              </h2>
              <Link href="/dashboard/tickets/new" className="btn btn-sm btn-outline">
                + New Ticket
              </Link>
            </div>
            
            {tickets.length === 0 ? (
              <div className="bg-tertiary p-xl rounded-xl border border-subtle text-center">
                <p className="text-secondary mb-md">You have no open support tickets.</p>
                <p className="text-sm text-tertiary mb-md">Need assistance with a project or digital product?</p>
                <Link href="/dashboard/tickets/new" className="btn btn-sm btn-primary">Open a Ticket</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-md">
                {tickets.map(ticket => (
                  <Link href={`/dashboard/tickets/${ticket.id}`} key={ticket.id} className="bg-card p-md rounded-xl border border-subtle hover:border-accent transition-colors group flex flex-col gap-sm">
                    <div className="flex justify-between items-start">
                      <h4 className="text-primary font-bold group-hover:text-accent transition-colors">{ticket.subject}</h4>
                      <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider ${
                        ticket.status === 'OPEN' ? 'bg-blue-500/20 text-blue-500' :
                        ticket.status === 'IN_PROGRESS' ? 'bg-accent/20 text-accent' :
                        ticket.status === 'RESOLVED' ? 'bg-green-500/20 text-green-500' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-secondary font-mono mt-sm border-t border-subtle pt-sm">
                      <span>ID: {ticket.id.slice(0, 8)}...</span>
                      <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
                {tickets.length === 5 && (
                  <Link href="/dashboard/tickets" className="text-sm text-center text-accent hover:underline mt-sm font-mono">
                    VIEW ALL TICKETS_
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Orders & Downloads Column */}
        <div className="flex flex-col gap-2xl">
          {/* Downloads */}
          <div>
            <h2 className="text-2xl text-primary mb-lg flex items-center gap-sm">
              <span className="text-2xl">📦</span>
              Digital Downloads
            </h2>
            {uniqueDownloads.length === 0 ? (
              <div className="bg-card border border-subtle rounded-xl p-xl text-center text-secondary">
                <p>No digital products purchased yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-md">
                {uniqueDownloads.map((dl, idx) => (
                  <div key={idx} className="bg-card border border-subtle rounded-xl p-md flex items-center justify-between shadow-sm">
                    <span className="font-heading text-primary">{dl.title}</span>
                    <a href={dl.url || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline text-xs">
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order History */}
          <div>
            <h2 className="text-2xl text-primary mb-lg flex items-center gap-sm">
              <span className="text-2xl">🧾</span>
              Order History
            </h2>
            {orders.length === 0 ? (
              <div className="bg-card border border-subtle rounded-xl p-xl text-center text-secondary">
                <p>No past orders found.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-md">
                {orders.map(order => (
                  <div key={order.id} className="bg-card border border-subtle rounded-xl p-md shadow-sm text-sm">
                    <div className="flex justify-between items-center mb-sm">
                      <span className="text-tertiary font-mono">{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className={`badge ${order.status === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-xs mb-sm">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-secondary">
                          <span>{item.quantity}x {item.title}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-subtle pt-sm flex justify-between font-bold text-primary">
                      <span>Total</span>
                      <span>${(order.amountFinal / 100).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
