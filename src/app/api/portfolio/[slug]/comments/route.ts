import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const item = await prisma.portfolioItem.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!item) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    const comments = await prisma.portfolioComment.findMany({
      where: { portfolioItemId: item.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        rating: true,
        authorName: true,
        createdAt: true,
      }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const { content, rating, authorName, authorEmail } = await request.json();

    if (!content || !authorName) {
      return NextResponse.json({ error: 'Name and comment are required' }, { status: 400 });
    }

    const item = await prisma.portfolioItem.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!item) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    const comment = await prisma.portfolioComment.create({
      data: {
        content,
        rating: rating ? parseInt(rating) : null,
        authorName,
        authorEmail,
        portfolioItemId: item.id,
      },
      select: {
        id: true,
        content: true,
        rating: true,
        authorName: true,
        createdAt: true,
      }
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}
