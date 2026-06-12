import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(testimonials);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { clientName, clientRole, clientCompany, content, rating, avatar, featured } = body;

    if (!clientName || !content) {
      return NextResponse.json(
        { error: "Client name and content are required." },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName,
        clientRole: clientRole || null,
        clientCompany: clientCompany || null,
        content,
        rating: rating || 5,
        avatar: avatar || null,
        featured: featured || false,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Testimonial creation error:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial." },
      { status: 500 }
    );
  }
}
