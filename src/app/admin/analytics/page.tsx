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

      return {
        name: m.label,
        users: newUsers,
        orders: orders,
        revenue: ((orderRevenue._sum.amountFinal || 0) + (invoiceRevenue._sum.amount || 0)) / 100, // in dollars
      };
    })
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-orbitron text-neon-cyan drop-shadow-neon">Analytics Dashboard</h1>
      
      <div className="card">
        <h2 className="text-xl font-bold mb-6 font-orbitron">Metrics Overview</h2>
        <AnalyticsClient data={chartData} />
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4 font-orbitron">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Joined</th>
                <th className="py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(user => (
                <tr key={user.id} className="border-b border-white/5">
                  <td className="py-2">{user.name || 'N/A'}</td>
                  <td className="py-2 text-white/70">{user.email}</td>
                  <td className="py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="py-2">
                    <span className="badge badge-outline">{user.role}</span>
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-white/50">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
