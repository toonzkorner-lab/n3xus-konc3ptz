import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const items = await prisma.portfolioItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    const item = await prisma.portfolioItem.create({
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
        client: data.client,
      },
    });

    revalidatePath('/');
    revalidatePath('/portfolio');

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
