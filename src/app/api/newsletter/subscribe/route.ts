import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resend, DEFAULT_SENDER } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email }
    });

    if (existingSubscriber) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 });
    }

    const subscriber = await prisma.subscriber.create({
      data: { email }
    });

    if (resend) {
      await resend.emails.send({
        from: DEFAULT_SENDER,
        to: email,
        subject: "Welcome to N3xUs Konc3pt'z!",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a1a; color: white; padding: 40px; border-radius: 12px; border: 1px solid #333;">
            <h1 style="color: #00f0ff; text-align: center; font-size: 28px;">Welcome Aboard! 🚀</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #ccc;">
              Thank you for subscribing to the N3xUs Konc3pt'z newsletter. We're thrilled to have you here!
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #ccc;">
              You'll now be the first to know about our latest digital design projects, new bot features, and exclusive tech insights.
            </p>
            <div style="text-align: center; margin-top: 40px;">
              <a href="https://n3xuskonc3ptz.com" style="background-color: #00f0ff; color: #0a0a1a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Visit Our Site</a>
            </div>
            <p style="font-size: 12px; color: #666; text-align: center; margin-top: 40px;">
              © ${new Date().getFullYear()} N3xUs Konc3pt'z Digital Design Studio.
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, subscriber }, { status: 201 });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
