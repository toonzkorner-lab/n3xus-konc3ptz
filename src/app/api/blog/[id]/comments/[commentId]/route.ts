import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.blogComment.delete({
      where: { id: params.commentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
