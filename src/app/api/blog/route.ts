import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true, email: true } },
      }
    });
    return NextResponse.json(posts);
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
    
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        published: data.published,
        tags: data.tags,
        authorId: session.user.id as string,
      },
    });

    if (post.published) {
      import("@/lib/discord").then(({ sendDiscordNotification }) => {
        sendDiscordNotification('📢 **New Blog Post Published!**', [
          {
            title: post.title,
            description: post.excerpt || 'Check out our latest update.',
            url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
            color: 0x00f0ff,
            timestamp: new Date().toISOString()
          }
        ]);
      }).catch(err => console.error(err));
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
