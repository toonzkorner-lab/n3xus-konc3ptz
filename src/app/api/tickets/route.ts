import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = session.user.role;
    const userId = session.user.id as string;

    let tickets;

    if (userRole === 'ADMIN' || userRole === 'OWNER') {
      tickets = await prisma.ticket.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } else {
      tickets = await prisma.ticket.findMany({
        where: { clientId: userId },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Fetch tickets error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;
    const body = await req.json();
    const { subject, description, priority } = body;

    if (!subject || !description) {
      return NextResponse.json({ error: 'Subject and description are required' }, { status: 400 });
    }

    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description,
        priority: priority || 'NORMAL',
        clientId: userId,
      },
    });

    return NextResponse.json({ success: true, ticket }, { status: 201 });
  } catch (error) {
    console.error('Create ticket error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
