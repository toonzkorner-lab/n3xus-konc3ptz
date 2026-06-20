import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Upsert so if they try to subscribe again it just activates them or succeeds
    const isNew = await prisma.subscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    });

    // Send welcome email if they were just created or reactivated
    import("@/lib/email").then(({ sendEmail, buildNewsletterWelcomeEmail }) => {
      sendEmail({
        to: email,
        subject: "Welcome to the N3xUs! 🚀",
        html: buildNewsletterWelcomeEmail(),
      });
    }).catch(err => console.error("Failed to load email module:", err));

    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
