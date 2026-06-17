import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "RESEND_API_KEY environment variable is missing" },
        { status: 500 }
      );
    }

    const { subject, content } = await req.json();

    if (!subject || !content) {
      return NextResponse.json(
        { error: "Subject and content are required" },
        { status: 400 }
      );
    }

    // Fetch all active subscribers
    const subscribers = await prisma.subscriber.findMany({
      where: { active: true },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No active subscribers found" }, { status: 400 });
    }

    const emails = subscribers.map((sub) => sub.email);
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Bcc all subscribers or use batch sending if list is huge.
    // For small lists, Bcc works. For better deliverability, loop or use batch API.
    // Resend allows up to 50 recipients per request in standard `to/bcc`.
    // A better approach is to send individually, but for simplicity we can send in a single BCC for now if < 50,
    // or just loop through them. Let's send individually to avoid BCC limits and spam filters.
    
    let sentCount = 0;
    
    // Using Promise.all with chunking would be better for massive lists, 
    // but a basic loop is fine for starting out.
    for (const email of emails) {
      await resend.emails.send({
        from: "N3xUs Konc3pt'z <hello@n3xuskonceptz.com>", // You must verify this domain in Resend
        to: email,
        subject: subject,
        html: content,
      });
      sentCount++;
    }

    return NextResponse.json({ success: true, count: sentCount });
  } catch (error: any) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send newsletter" },
      { status: 500 }
    );
  }
}
