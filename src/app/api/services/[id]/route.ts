import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  return NextResponse.json(service);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, description, shortDesc, price, features, category, icon, order, active } = body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        shortDesc,
        price: price !== undefined ? Math.round(price * 100) : undefined,
        features: features ? JSON.stringify(features) : undefined,
        category,
        icon,
        order,
        active,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Service update error:", error);
    return NextResponse.json(
      { error: "Failed to update service." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Service deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete service." },
      { status: 500 }
    );
  }
}
