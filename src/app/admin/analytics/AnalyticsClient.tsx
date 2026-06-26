'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartDataPoint {
  name: string;
  users: number;
  orders: number;
  revenue: number;
  views?: number;
  visitors?: number;
}

export default function AnalyticsClient({ data }: { data: ChartDataPoint[] }) {
  if (!data || data.length === 0) {
    return <div className="text-secondary italic">No data available</div>;
  }

  // Define colors from our design system
  const colors = {
    revenue: 'var(--color-accent)',
    users: 'var(--color-primary)',
    orders: '#10b981', // green-500
    views: '#8b5cf6', // violet-500
    visitors: '#f59e0b', // amber-500
    text: 'var(--text-secondary)',
    grid: 'var(--border-subtle)',
    bg: 'var(--bg-card)'
  };

  return (
    <div className="flex flex-col gap-2xl">
      {/* Revenue Line Chart */}
      <div>
        <h3 className="text-lg font-heading mb-md" style={{ color: colors.revenue }}>Revenue ($)</h3>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
              <XAxis dataKey="name" stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: colors.bg, borderColor: colors.grid, borderRadius: '8px', color: 'var(--text-primary)' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="revenue" name="Total Revenue" stroke={colors.revenue} strokeWidth={3} activeDot={{ r: 6, fill: colors.revenue }} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2xl pt-lg border-t border-subtle">
        {/* New Users */}
        <div>
          <h3 className="text-lg font-heading mb-md" style={{ color: colors.users }}>New Users</h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                <XAxis dataKey="name" stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: colors.bg, borderColor: colors.grid, borderRadius: '8px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="users" name="New Signups" fill={colors.users} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Paid Orders */}
        <div>
          <h3 className="text-lg font-heading mb-md" style={{ color: colors.orders }}>Paid Orders</h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                <XAxis dataKey="name" stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: colors.bg, borderColor: colors.grid, borderRadius: '8px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="orders" name="Completed Orders" fill={colors.orders} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2xl pt-lg border-t border-subtle">
        {/* Page Views */}
        <div>
          <h3 className="text-lg font-heading mb-md" style={{ color: colors.views }}>Page Views</h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                <XAxis dataKey="name" stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: colors.bg, borderColor: colors.grid, borderRadius: '8px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="views" name="Total Views" fill={colors.views} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Unique Visitors */}
        <div>
          <h3 className="text-lg font-heading mb-md" style={{ color: colors.visitors }}>Unique Visitors</h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                <XAxis dataKey="name" stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: colors.bg, borderColor: colors.grid, borderRadius: '8px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="visitors" name="Unique Sessions" fill={colors.visitors} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
