import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'Invalid password data.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'User not found or no password set.' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Incorrect current password.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { email: session.user.email },
      data: { passwordHash: hashedPassword },
    });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password Update Error:', error);
    return NextResponse.json({ error: 'An error occurred while updating password.' }, { status: 500 });
  }
}
