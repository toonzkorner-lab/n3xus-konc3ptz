import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, description, shortDesc, price, features, category, icon, order } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required." },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description: description || null,
        shortDesc: shortDesc || null,
        price: price ? Math.round(price * 100) : 0,
        features: JSON.stringify(features || []),
        category: category || null,
        icon: icon || "🚀",
        order: order || 0,
      },
    });

    revalidatePath('/');
    revalidatePath('/services');

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Service creation error:", error);
    return NextResponse.json(
      { error: "Failed to create service." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Service ID is required." },
        { status: 400 }
      );
    }

    if (data.price !== undefined) {
      data.price = Math.round(data.price * 100);
    }
    if (data.features !== undefined) {
      data.features = JSON.stringify(data.features);
    }

    const service = await prisma.service.update({
      where: { id },
      data,
    });

    revalidatePath('/');
    revalidatePath('/services');

    return NextResponse.json(service);
  } catch (error) {
    console.error("Service update error:", error);
    return NextResponse.json(
      { error: "Failed to update service." },
      { status: 500 }
    );
  }
}
