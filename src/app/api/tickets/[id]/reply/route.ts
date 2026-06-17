import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: ticketId } = await params;
    const userId = session.user.id as string;
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER' && ticket.clientId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const reply = await prisma.ticketReply.create({
      data: {
        content,
        ticketId,
        senderId: userId,
      },
    });

    return NextResponse.json({ success: true, reply }, { status: 201 });
  } catch (error) {
    console.error('Create ticket reply error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
