import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendProjectMilestoneEmail } from '@/lib/notifications';

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
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
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

    // Get current project state for comparison
    const currentProject = await prisma.project.findUnique({
      where: { id },
      include: { client: { select: { email: true } } },
    });
    
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        budget: data.budget,
        progress: data.progress,
        deadline: data.deadline,
      },
    });

    // Send email if status changed or progress hit a milestone (25%, 50%, 75%, 100%)
    if (currentProject?.client.email) {
      const statusChanged = data.status && data.status !== currentProject.status;
      const progressMilestones = [25, 50, 75, 100];
      const progressHitMilestone = data.progress && progressMilestones.includes(data.progress) && data.progress !== currentProject.progress;

      if (statusChanged) {
        const milestone = data.status === 'COMPLETED' ? 'Project Completed! 🎉' : `Status updated to ${data.status.replace('_', ' ')}`;
        sendProjectMilestoneEmail(currentProject.client.email, project.title, milestone, data.progress || project.progress, id).catch(() => {});
      } else if (progressHitMilestone) {
        sendProjectMilestoneEmail(currentProject.client.email, project.title, `Progress reached ${data.progress}%`, data.progress, id).catch(() => {});
      }
    }

    return NextResponse.json(project);
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

    // Use transaction to clean up related records
    await prisma.$transaction(async (tx) => {
      // Unlink invoices from this project (don't delete them)
      await tx.invoice.updateMany({ where: { projectId: id }, data: { projectId: null } });
      // Tasks, messages, and files cascade-delete via schema
      await tx.project.delete({ where: { id } });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Project deletion error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
