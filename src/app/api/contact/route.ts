import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    // Limit to 3 requests per hour (3600000 ms)
    if (!rateLimit(ip, 3, 3600000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const submission = await prisma.contactSubmission.create({
      data: { name, email, subject: subject || null, message },
    });

    // Send emails in the background
    import("@/lib/email").then(({ sendEmail, buildContactNotificationEmail, buildContactAutoReplyEmail, CONTACT_EMAIL }) => {
      // 1. Notify the site owner
      sendEmail({
        to: CONTACT_EMAIL,
        subject: `New Contact: ${subject || 'Website Inquiry'}`,
        html: buildContactNotificationEmail(name, email, subject || 'Website Inquiry', message),
        replyTo: email,
      });

      // 2. Send auto-reply to the customer
      sendEmail({
        to: email,
        subject: "We received your message! 👋",
        html: buildContactAutoReplyEmail(name),
      });
    }).catch(err => console.error("Failed to load email module:", err));

    return NextResponse.json(
      { success: true, id: submission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
