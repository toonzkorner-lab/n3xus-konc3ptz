import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import AnalyticsChart from './AnalyticsChart';

export const metadata = {
  title: "Admin Console | N3xUs Konc3pt'z",
  description: 'System override and administration console.',
};

function TrendBadge({ current, previous }: { current: number; previous: number }) {
  if (previous === 0 && current === 0) return null;
  if (previous === 0) return <p className="text-xs mt-sm flex items-center gap-xs"><span className="text-green-500">✦ New</span></p>;
  
  const pct = Math.round(((current - previous) / previous) * 100);
  const isUp = pct >= 0;
  
  return (
    <p className="text-xs mt-sm flex items-center gap-xs">
      <span className={isUp ? 'text-green-500' : 'text-red-500'}>
        {isUp ? '↑' : '↓'} {Math.abs(pct)}%
      </span>
      <span className="text-secondary">vs last week</span>
    </p>
  );
}

export default async function AdminPage() {
  const usersCount = await prisma.user.count({ where: { role: 'CLIENT' } });
  const projectsCount = await prisma.project.count();
  const activeProjectsCount = await prisma.project.count({ where: { status: 'IN_PROGRESS' } });
  const servicesCount = await prisma.service.count();

  // KPI trend data
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [clientsThisWeek, clientsLastWeek] = await Promise.all([
    prisma.user.count({ where: { role: 'CLIENT', createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({ where: { role: 'CLIENT', createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } }),
  ]);

  const [projectsThisWeek, projectsLastWeek] = await Promise.all([
    prisma.project.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.project.count({ where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } }),
  ]);

  const [revenueThisWeek, revenueLastWeek] = await Promise.all([
    prisma.order.aggregate({ where: { status: 'PAID', createdAt: { gte: sevenDaysAgo } }, _sum: { amountFinal: true } }),
    prisma.order.aggregate({ where: { status: 'PAID', createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } }, _sum: { amountFinal: true } }),
  ]);

  const revThisWeek = (revenueThisWeek._sum.amountFinal || 0) / 100;
  const revLastWeek = (revenueLastWeek._sum.amountFinal || 0) / 100;

  // Total revenue this month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyRevenue = await prisma.order.aggregate({
    where: { status: 'PAID', createdAt: { gte: startOfMonth } },
    _sum: { amountFinal: true },
  });
  const monthlyInvoiceRevenue = await prisma.invoice.aggregate({
    where: { status: 'PAID', paidAt: { gte: startOfMonth } },
    _sum: { amount: true },
  });
  const totalMonthlyRevenue = ((monthlyRevenue._sum.amountFinal || 0) + (monthlyInvoiceRevenue._sum.amount || 0)) / 100;

  const recentProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { client: { select: { name: true, company: true } } }
  });

  // Analytics for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const pageViews = await prisma.pageView.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } }
  });

  const viewsByDate = pageViews.reduce((acc: Record<string, { views: number, uniqueSessions: Set<string> }>, pv) => {
    const dateStr = new Date(pv.createdAt).toISOString().split('T')[0];
    if (!acc[dateStr]) {
      acc[dateStr] = { views: 0, uniqueSessions: new Set() };
    }
    acc[dateStr].views += 1;
    acc[dateStr].uniqueSessions.add(pv.sessionId);
    return acc;
  }, {});

  const chartData = Object.entries(viewsByDate)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
    .map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: data.views,
      visitors: data.uniqueSessions.size
    }));

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
          <TrendBadge current={clientsThisWeek} previous={clientsLastWeek} />
        </div>
        
        <div className="bg-card p-xl rounded-xl border border-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.1)] relative overflow-hidden group hover:border-primary transition-colors">
          <div className="absolute -right-4 -top-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">🚀</div>
          <p className="text-sm font-mono text-secondary uppercase tracking-widest mb-sm">Active Projects</p>
          <p className="text-5xl font-heading font-bold text-primary">{activeProjectsCount} <span className="text-lg text-secondary">/ {projectsCount}</span></p>
          <TrendBadge current={projectsThisWeek} previous={projectsLastWeek} />
        </div>
        
        <div className="bg-card p-xl rounded-xl border border-secondary/30 shadow-[0_0_15px_rgba(255,0,255,0.1)] relative overflow-hidden group hover:border-secondary transition-colors">
          <div className="absolute -right-4 -top-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">💰</div>
          <p className="text-sm font-mono text-secondary uppercase tracking-widest mb-sm">Monthly Revenue</p>
          <p className="text-4xl font-heading font-bold text-primary mt-sm">${totalMonthlyRevenue.toLocaleString()}</p>
          <TrendBadge current={revThisWeek} previous={revLastWeek} />
        </div>
        
        <div className="bg-card p-xl rounded-xl border border-success/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] relative overflow-hidden group hover:border-success transition-colors">
          <div className="absolute -right-4 -top-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">🛠️</div>
          <p className="text-sm font-mono text-secondary uppercase tracking-widest mb-sm">Services Online</p>
          <p className="text-5xl font-heading font-bold text-primary">{servicesCount}</p>
        </div>
      </div>

      <div className="grid grid-2 gap-2xl">
        {/* Analytics Chart */}
        <div className="bg-card border border-subtle rounded-xl p-xl shadow-md col-span-2">
          <AnalyticsChart data={chartData} />
        </div>

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
