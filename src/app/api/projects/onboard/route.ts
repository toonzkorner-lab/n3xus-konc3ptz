import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendDiscordNotification } from '@/lib/discord';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, type, budget, timeline, description, brandAssets, socialHandles, targetReferences } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const fullDescription = `
**Project Type:** ${type}
**Budget:** ${budget}
**Timeline:** ${timeline}

**Description:**
${description}
    `.trim();

    const project = await prisma.project.create({
      data: {
        title,
        description: fullDescription,
        status: 'PLANNING',
        clientId: session.user.id,
        brandAssets: brandAssets ? JSON.stringify(brandAssets) : "[]",
        socialHandles: socialHandles ? JSON.stringify(socialHandles) : "[]",
        targetReferences: targetReferences || "",
      },
    });

    // Notify Discord
    await sendDiscordNotification('🚀 **New Project Onboarded!**', [{
      title,
      description: `**Client:** ${session.user.name} (${session.user.email})\n**Type:** ${type}\n**Budget:** ${budget}\n**Timeline:** ${timeline}`,
      color: 0x9D4EDD,
      timestamp: new Date().toISOString(),
    }]);

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error('Project onboarding error:', error);
    return NextResponse.json({ error: 'Failed to save project details' }, { status: 500 });
  }
}
