import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = (session.user.role === 'ADMIN' || session.user.role === 'OWNER');
  const invoices = await prisma.invoice.findMany({
    where: isAdmin ? {} : { clientId: session.user.id },
    include: {
      client: { select: { id: true, name: true, email: true } },
      project: { select: { id: true, title: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { clientId, projectId, items, dueDate, notes } = body;

    if (!clientId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Client and at least one item are required." },
        { status: 400 }
      );
    }

    // Generate invoice number
    const count = await prisma.invoice.count();
    const number = `NX-${String(count + 1).padStart(4, "0")}`;

    const totalAmount = items.reduce(
      (sum: number, item: { quantity: number; unitPrice: number }) =>
        sum + item.quantity * Math.round(item.unitPrice * 100),
      0
    );
    const tax = Math.round(totalAmount * 0.1); // 10% tax

    const invoice = await prisma.invoice.create({
      data: {
        number,
        amount: totalAmount,
        tax,
        clientId,
        projectId: projectId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        notes: notes || null,
        status: "SENT",
        items: {
          create: items.map(
            (item: {
              description: string;
              quantity: number;
              unitPrice: number;
            }) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: Math.round(item.unitPrice * 100),
            })
          ),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Invoice creation error:", error);
    return NextResponse.json(
      { error: "Failed to create invoice." },
      { status: 500 }
    );
  }
}
