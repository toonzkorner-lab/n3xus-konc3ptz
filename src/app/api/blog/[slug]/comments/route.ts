import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const comments = await prisma.blogComment.findMany({
      where: { blogPostId: post.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
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
    const { content, authorName, authorEmail } = await request.json();

    if (!content || !authorName) {
      return NextResponse.json({ error: 'Name and comment are required' }, { status: 400 });
    }

    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const comment = await prisma.blogComment.create({
      data: {
        content,
        authorName,
        authorEmail,
        blogPostId: post.id,
      },
      select: {
        id: true,
        content: true,
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
