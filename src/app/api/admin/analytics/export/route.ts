import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pageViews = await prisma.pageView.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const header = 'Date,URL,Session ID,Referrer,User Agent\n';
  const rows = pageViews.map(pv => {
    const date = new Date(pv.createdAt).toISOString();
    const url = `"${(pv.url || '').replace(/"/g, '""')}"`;
    const session = `"${(pv.sessionId || '').replace(/"/g, '""')}"`;
    const referrer = `"${(pv.referrer || '').replace(/"/g, '""')}"`;
    const ua = `"${(pv.userAgent || '').replace(/"/g, '""')}"`;
    return `${date},${url},${session},${referrer},${ua}`;
  }).join('\n');

  const csv = header + rows;

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="analytics-export-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
