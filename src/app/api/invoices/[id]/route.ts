import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();
    
    // If setting to PAID, update paidAt
    const updateData: any = {
      status: data.status,
      notes: data.notes,
    };

    if (data.status === 'PAID') {
      const existing = await prisma.invoice.findUnique({ where: { id } });
      if (existing?.status !== 'PAID') {
        updateData.paidAt = new Date();
      }
    } else {
      updateData.paidAt = null;
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(invoice);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    // InvoiceItems cascade-delete via schema
    await prisma.invoice.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Invoice deletion error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
