import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { url, sessionId, referrer } = await req.json();

    if (!url || !sessionId) {
      return NextResponse.json({ error: 'Missing required tracking data' }, { status: 400 });
    }

    // Attempt to parse the user agent for better analytics later if needed
    const userAgent = req.headers.get('user-agent') || '';

    // Ignore likely bot traffic simple check
    if (userAgent.toLowerCase().includes('bot') || userAgent.toLowerCase().includes('crawler')) {
      return NextResponse.json({ success: true, note: 'ignored bot' });
    }

    await prisma.pageView.create({
      data: {
        url,
        sessionId,
        referrer: referrer || null,
        userAgent,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to log page view:', error);
    // Don't leak errors to client for tracking API
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
