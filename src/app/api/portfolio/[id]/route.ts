import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.portfolioItem.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
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
    
    const item = await prisma.portfolioItem.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        shortDesc: data.shortDesc,
        images: data.images,
        tags: data.tags,
        category: data.category,
        featured: data.featured,
        liveUrl: data.liveUrl,
        githubUrl: data.githubUrl,
      },
    });

    return NextResponse.json(item);
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
    await prisma.portfolioItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Portfolio deletion error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
