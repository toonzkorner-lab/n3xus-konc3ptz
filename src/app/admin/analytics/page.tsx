import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    redirect('/auth/signin');
  }

  // Fetch recent users
  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { id: true, name: true, email: true, createdAt: true, role: true }
  });

  // Fetch metrics over last 6 months (simplistic grouping by counting last 6 months)
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleString('default', { month: 'short' }),
      startDate: new Date(d.getFullYear(), d.getMonth(), 1),
      endDate: new Date(d.getFullYear(), d.getMonth() + 1, 1),
    });
  }

  const chartData = await Promise.all(
    months.map(async (m) => {
      const newUsers = await prisma.user.count({
        where: { createdAt: { gte: m.startDate, lt: m.endDate } }
      });
      const orders = await prisma.order.count({
        where: { createdAt: { gte: m.startDate, lt: m.endDate }, status: 'PAID' }
      });
      const orderRevenue = await prisma.order.aggregate({
        where: { createdAt: { gte: m.startDate, lt: m.endDate }, status: 'PAID' },
        _sum: { amountFinal: true }
      });
      
      const invoiceRevenue = await prisma.invoice.aggregate({
        where: { paidAt: { gte: m.startDate, lt: m.endDate }, status: 'PAID' },
        _sum: { amount: true }
      });

      const pageViewsCount = await prisma.pageView.count({
        where: { createdAt: { gte: m.startDate, lt: m.endDate } }
      });

      // To get unique visitors, we need to count distinct sessionIds
      // Since prisma.count doesn't support distinct in a simple way for grouping easily inside a map loop without raw queries sometimes,
      // we can do a findMany with distinct. Or use groupBy.
      const uniqueSessions = await prisma.pageView.findMany({
        where: { createdAt: { gte: m.startDate, lt: m.endDate } },
        distinct: ['sessionId'],
        select: { sessionId: true }
      });

      return {
        name: m.label,
        users: newUsers,
        orders: orders,
        revenue: ((orderRevenue._sum.amountFinal || 0) + (invoiceRevenue._sum.amount || 0)) / 100, // in dollars
        views: pageViewsCount,
        visitors: uniqueSessions.length,
      };
    })
  );

  const topPagesRaw = await prisma.pageView.groupBy({
    by: ['url'],
    _count: { url: true },
    orderBy: { _count: { url: 'desc' } },
    take: 10,
  });
  
  const topPages = topPagesRaw.map(p => ({
    url: p.url,
    views: p._count.url
  }));

  return (
    <div className="flex flex-col gap-2xl">
      <div>
        <h1 className="text-3xl font-heading text-primary drop-shadow-sm">Analytics Dashboard</h1>
        <p className="text-secondary font-mono text-sm mt-xs">Comprehensive metric deep-dive</p>
      </div>
      
      <div className="bg-card border border-subtle rounded-xl p-xl shadow-md">
        <h2 className="text-xl font-heading text-primary mb-lg border-b border-subtle pb-sm">Metrics Overview</h2>
        <AnalyticsClient data={chartData} />
      </div>

      <div className="grid grid-2 gap-2xl">
        <div className="bg-card border border-subtle rounded-xl p-xl shadow-md overflow-x-auto">
          <h2 className="text-xl font-heading text-primary mb-lg border-b border-subtle pb-sm">Recent Users</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-subtle text-secondary font-mono text-xs uppercase tracking-wider">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Joined</th>
                <th className="py-3 px-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(user => (
                <tr key={user.id} className="border-b border-subtle/50 hover:bg-tertiary transition-colors">
                  <td className="py-3 px-2 text-primary font-bold text-sm">{user.name || 'N/A'}</td>
                  <td className="py-3 px-2 text-secondary text-sm">{user.email}</td>
                  <td className="py-3 px-2 text-secondary text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-2">
                    <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider ${
                      user.role === 'ADMIN' || user.role === 'OWNER' ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-primary/20 text-primary border border-primary/30'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-secondary italic text-sm">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-card border border-subtle rounded-xl p-xl shadow-md overflow-x-auto">
          <h2 className="text-xl font-heading text-primary mb-lg border-b border-subtle pb-sm">Top Pages (All Time)</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-subtle text-secondary font-mono text-xs uppercase tracking-wider">
                <th className="py-3 px-2">URL</th>
                <th className="py-3 px-2 text-right">Views</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map(page => (
                <tr key={page.url} className="border-b border-subtle/50 hover:bg-tertiary transition-colors">
                  <td className="py-3 px-2 font-mono text-xs text-primary truncate max-w-[200px]">{page.url}</td>
                  <td className="py-3 px-2 text-right font-bold text-accent">{page.views}</td>
                </tr>
              ))}
              {topPages.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-secondary italic text-sm">No page views recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
