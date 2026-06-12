import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, company, phone } = body;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        company,
        phone,
      },
    });

    return NextResponse.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Profile Update Error:', error);
    return NextResponse.json({ error: 'An error occurred while updating profile.' }, { status: 500 });
  }
}
