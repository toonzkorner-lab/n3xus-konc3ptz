'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState, useMemo } from 'react';

type AnalyticsData = {
  date: string;
  views: number;
  visitors: number;
};

export default function AnalyticsChart({ data }: { data: AnalyticsData[] }) {
  const [timeframe, setTimeframe] = useState<'7D' | '30D'>('7D');

  const filteredData = useMemo(() => {
    if (timeframe === '7D') {
      return data.slice(-7);
    }
    return data;
  }, [data, timeframe]);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-tertiary rounded-lg border border-subtle">
        <p className="text-secondary font-mono text-sm">No analytics data available yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-md">
        <h3 className="text-lg text-primary font-heading">Traffic Overview</h3>
        <div className="flex bg-tertiary rounded-md p-1 border border-subtle">
          <button 
            onClick={() => setTimeframe('7D')}
            className={`px-3 py-1 text-xs font-bold rounded ${timeframe === '7D' ? 'bg-primary text-black' : 'text-secondary hover:text-primary'}`}
          >
            7D
          </button>
          <button 
            onClick={() => setTimeframe('30D')}
            className={`px-3 py-1 text-xs font-bold rounded ${timeframe === '30D' ? 'bg-primary text-black' : 'text-secondary hover:text-primary'}`}
          >
            30D
          </button>
        </div>
      </div>
      
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="var(--text-secondary)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="var(--text-secondary)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-primary)'
              }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Area 
              type="monotone" 
              dataKey="views" 
              name="Page Views"
              stroke="var(--color-primary)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorViews)" 
            />
            <Area 
              type="monotone" 
              dataKey="visitors" 
              name="Unique Visitors"
              stroke="var(--color-accent)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorVisitors)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
