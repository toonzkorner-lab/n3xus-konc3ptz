import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const projects = await prisma.project.findMany({
    where: isAdmin ? {} : { clientId: session.user.id },
    include: {
      client: { select: { id: true, name: true, email: true } },
      tasks: true,
      _count: { select: { invoices: true, messages: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, clientId, budget, deadline } = body;

    if (!title || !clientId) {
      return NextResponse.json(
        { error: "Title and client are required." },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description: description || null,
        clientId,
        budget: budget ? Math.round(budget * 100) : 0,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { error: "Failed to create project." },
      { status: 500 }
    );
  }
}
