import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Console | N3xUs Konc3pt\'z',
  description: 'System override and administration console.',
};

export default async function AdminPage() {
  const usersCount = await prisma.user.count({ where: { role: 'CLIENT' } });
  const projectsCount = await prisma.project.count();
  const activeProjectsCount = await prisma.project.count({ where: { status: 'IN_PROGRESS' } });
  const servicesCount = await prisma.service.count();

  const recentProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { client: { select: { name: true, company: true } } }
  });

  return (
    <div className="flex flex-col gap-2xl">
      <div>
        <h1 className="text-3xl text-primary mb-xs font-heading">Command Center</h1>
        <p className="text-secondary font-mono text-sm">System diagnostic and overview matrix</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-4 gap-xl">
        <div className="bg-card p-xl rounded-xl border border-accent/30 shadow-[0_0_15px_rgba(139,92,246,0.1)] relative overflow-hidden group hover:border-accent transition-colors">
          <div className="absolute -right-4 -top-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">👥</div>
          <p className="text-sm font-mono text-secondary uppercase tracking-widest mb-sm">Total Clients</p>
          <p className="text-5xl font-heading font-bold text-primary">{usersCount}</p>
        </div>
        
        <div className="bg-card p-xl rounded-xl border border-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.1)] relative overflow-hidden group hover:border-primary transition-colors">
          <div className="absolute -right-4 -top-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">🚀</div>
          <p className="text-sm font-mono text-secondary uppercase tracking-widest mb-sm">Active Projects</p>
          <p className="text-5xl font-heading font-bold text-primary">{activeProjectsCount} <span className="text-lg text-secondary">/ {projectsCount}</span></p>
        </div>
        
        <div className="bg-card p-xl rounded-xl border border-secondary/30 shadow-[0_0_15px_rgba(255,0,255,0.1)] relative overflow-hidden group hover:border-secondary transition-colors">
          <div className="absolute -right-4 -top-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">💰</div>
          <p className="text-sm font-mono text-secondary uppercase tracking-widest mb-sm">Monthly Revenue</p>
          <p className="text-4xl font-heading font-bold text-primary mt-sm">$12,450</p>
        </div>
        
        <div className="bg-card p-xl rounded-xl border border-success/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] relative overflow-hidden group hover:border-success transition-colors">
          <div className="absolute -right-4 -top-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">🛠️</div>
          <p className="text-sm font-mono text-secondary uppercase tracking-widest mb-sm">Services Online</p>
          <p className="text-5xl font-heading font-bold text-primary">{servicesCount}</p>
        </div>
      </div>

      <div className="grid grid-2 gap-2xl">
        {/* Recent Projects */}
        <div className="bg-card border border-subtle rounded-xl p-xl shadow-md">
          <div className="flex items-center justify-between mb-lg border-b border-subtle pb-sm">
            <h2 className="text-xl text-primary font-heading">Recent Transmissions (Projects)</h2>
            <Link href="/admin/projects" className="text-xs text-accent hover:underline font-mono">VIEW ALL_</Link>
          </div>
          
          {recentProjects.length === 0 ? (
            <p className="text-secondary italic text-sm">No recent projects.</p>
          ) : (
            <div className="flex flex-col gap-md">
              {recentProjects.map(project => (
                <div key={project.id} className="flex items-center justify-between p-md rounded-md bg-tertiary border border-subtle hover:border-primary transition-colors">
                  <div>
                    <h4 className="text-primary font-bold text-sm mb-xs">{project.title}</h4>
                    <p className="text-xs text-secondary">{project.client.name} {project.client.company ? `(${project.client.company})` : ''}</p>
                  </div>
                  <div className="flex items-center gap-md">
                    <div className="w-24 h-2 bg-input rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-primary" style={{ width: `${project.progress}%` }}></div>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider ${
                      project.status === 'COMPLETED' ? 'bg-success/20 text-success border border-success/30' :
                      project.status === 'IN_PROGRESS' ? 'bg-primary/20 text-primary border border-primary/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-subtle rounded-xl p-xl shadow-md">
          <div className="flex items-center justify-between mb-lg border-b border-subtle pb-sm">
            <h2 className="text-xl text-primary font-heading">Command Shortcuts</h2>
          </div>
          
          <div className="grid grid-2 gap-md">
            <Link href="/admin/projects/new" className="flex flex-col items-center justify-center gap-sm p-lg rounded-lg border border-subtle bg-tertiary hover:bg-primary-subtle hover:border-primary hover:text-primary transition-all text-secondary group">
              <span className="text-3xl group-hover:scale-110 transition-transform">🚀</span>
              <span className="text-sm font-bold">New Project</span>
            </Link>
            
            <Link href="/admin/users/new" className="flex flex-col items-center justify-center gap-sm p-lg rounded-lg border border-subtle bg-tertiary hover:bg-accent-subtle hover:border-accent hover:text-accent transition-all text-secondary group">
              <span className="text-3xl group-hover:scale-110 transition-transform">👥</span>
              <span className="text-sm font-bold">Add Client</span>
            </Link>
            
            <Link href="/admin/invoices/new" className="flex flex-col items-center justify-center gap-sm p-lg rounded-lg border border-subtle bg-tertiary hover:bg-secondary-subtle hover:border-secondary hover:text-secondary transition-all text-secondary group">
              <span className="text-3xl group-hover:scale-110 transition-transform">📝</span>
              <span className="text-sm font-bold">Create Invoice</span>
            </Link>
            
            <Link href="/admin/services/new" className="flex flex-col items-center justify-center gap-sm p-lg rounded-lg border border-subtle bg-tertiary hover:bg-success/10 hover:border-success hover:text-success transition-all text-secondary group">
              <span className="text-3xl group-hover:scale-110 transition-transform">🛠️</span>
              <span className="text-sm font-bold">Add Service</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
