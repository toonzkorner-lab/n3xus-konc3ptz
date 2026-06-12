import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { error: "projectId is required." },
      { status: 400 }
    );
  }

  // Verify access
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { clientId: true },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const isAdmin = (session.user.role === 'ADMIN' || session.user.role === 'OWNER');
  if (!isAdmin && project.clientId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { projectId },
    include: {
      sender: { select: { id: true, name: true, role: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { projectId, content } = body;

    if (!projectId || !content) {
      return NextResponse.json(
        { error: "projectId and content are required." },
        { status: 400 }
      );
    }

    // Verify access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { clientId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isAdmin = (session.user.role === 'ADMIN' || session.user.role === 'OWNER');
    if (!isAdmin && project.clientId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        projectId,
        senderId: session.user.id,
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Message creation error:", error);
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}
