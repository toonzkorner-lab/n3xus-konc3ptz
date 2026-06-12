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
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        phone: true,
        role: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
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
    
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        company: data.company,
        phone: data.phone,
        role: data.role,
      },
    });

    return NextResponse.json(user);
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

    // Check if we are deleting ourselves
    if (session.user.id === id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    // Delete related records first to avoid foreign key constraint errors
    await prisma.$transaction(async (tx) => {
      // Delete messages sent by this user
      await tx.message.deleteMany({ where: { senderId: id } });
      // Delete files uploaded by this user
      await tx.file.deleteMany({ where: { uploadedById: id } });
      // Delete blog posts by this user
      await tx.blogPost.deleteMany({ where: { authorId: id } });
      // Delete invoices (and their items via cascade) for this user
      await tx.invoiceItem.deleteMany({ where: { invoice: { clientId: id } } });
      await tx.invoice.deleteMany({ where: { clientId: id } });
      // Delete projects (and their tasks/messages/files via cascade) for this user
      const userProjects = await tx.project.findMany({ where: { clientId: id }, select: { id: true } });
      const projectIds = userProjects.map(p => p.id);
      if (projectIds.length > 0) {
        await tx.task.deleteMany({ where: { projectId: { in: projectIds } } });
        await tx.message.deleteMany({ where: { projectId: { in: projectIds } } });
        await tx.file.deleteMany({ where: { projectId: { in: projectIds } } });
        await tx.invoice.updateMany({ where: { projectId: { in: projectIds } }, data: { projectId: null } });
        await tx.project.deleteMany({ where: { clientId: id } });
      }
      // Finally delete the user
      await tx.user.delete({ where: { id } });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('User deletion error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
