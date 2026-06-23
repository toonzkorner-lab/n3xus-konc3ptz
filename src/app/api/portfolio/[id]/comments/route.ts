import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const item = await prisma.portfolioItem.findUnique({
      where: { slug: params.id },
      include: {
        comments: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item.comments);
  } catch (error) {
    console.error('Error fetching portfolio comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    const body = await request.json();
    const { content, authorName, rating } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    if (!authorName || typeof authorName !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const item = await prisma.portfolioItem.findUnique({
      where: { slug: params.id },
      select: { id: true },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const comment = await prisma.portfolioComment.create({
      data: {
        content,
        authorName,
        rating: rating ? parseInt(rating) : null,
        userId: session?.user?.id || null,
        portfolioItemId: item.id,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}
