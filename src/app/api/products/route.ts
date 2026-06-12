import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Ensure slug is unique
    const existing = await prisma.product.findUnique({
      where: { slug: data.slug }
    });

    if (existing) {
      return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        shortDesc: data.shortDesc,
        price: Number(data.price),
        images: JSON.stringify(data.images || []),
        features: JSON.stringify(data.features || []),
        category: data.category,
        active: data.active ?? true,
        digitalFileUrl: data.digitalFileUrl,
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
