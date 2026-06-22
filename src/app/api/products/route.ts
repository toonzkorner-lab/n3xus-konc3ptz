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

    if (product.active) {
      import("@/lib/discord").then(({ sendDiscordNotification }) => {
        sendDiscordNotification('🚀 **New Product Added to Store!**', [
          {
            title: product.title,
            description: product.shortDesc || 'Check out our latest product.',
            url: `${process.env.NEXT_PUBLIC_APP_URL}/store/${product.slug}`,
            color: 0x39ff14, // Neon Green
            fields: [
              { name: 'Price', value: `$${(product.price / 100).toFixed(2)}`, inline: true },
              { name: 'Category', value: product.category || 'Digital', inline: true }
            ],
            timestamp: new Date().toISOString()
          }
        ]);
      }).catch(err => console.error(err));
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
