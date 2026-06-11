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
        <Link href="/services" className="btn btn-primary">
          Start New Project
        </Link>
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
        <div>
          <h2 className="text-2xl text-primary mb-lg flex items-center gap-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"></path>
            </svg>
            Recent Projects
          </h2>
          
          {projects.length === 0 ? (
            <div className="bg-card border border-subtle rounded-xl p-2xl text-center">
              <div className="text-5xl mb-md">🌌</div>
              <h3 className="text-xl text-primary mb-sm">The void is empty</h3>
              <p className="text-secondary mb-lg">You don't have any active projects yet.</p>
              <Link href="/services" className="btn btn-secondary">Explore Services</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-xl">
              {projects.map(project => (
                <div key={project.id} className="bg-card border border-subtle rounded-xl p-xl shadow-md hover:border-primary transition-colors">
                  <div className="flex justify-between items-start mb-md">
                    <h3 className="text-xl text-primary font-heading">{project.title}</h3>
                    <span className={`px-sm py-xs rounded-full text-xs font-bold ${
                      project.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' :
                      project.status === 'IN_PROGRESS' ? 'bg-primary-subtle text-primary' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <p className="text-secondary text-sm mb-lg line-clamp-2">{project.description}</p>
                  
                  <div className="mb-lg">
                    <div className="flex justify-between text-xs mb-xs">
                      <span className="text-secondary">Progress</span>
                      <span className="text-primary font-bold">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-tertiary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-primary shadow-glow-primary rounded-full transition-all duration-1000" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="border-t border-subtle pt-md">
                    <h4 className="text-sm font-bold text-secondary mb-sm">Pending Tasks:</h4>
                    {project.tasks.length > 0 ? (
                      <ul className="flex flex-col gap-xs">
                        {project.tasks.map(task => (
                          <li key={task.id} className="text-sm text-secondary flex items-center gap-sm">
                            <span className="w-4 h-4 rounded-full border border-subtle flex-shrink-0"></span>
                            {task.title}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-tertiary italic">No pending tasks.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
