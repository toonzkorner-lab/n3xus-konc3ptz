import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-11-20.acacia" as any,
});

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
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

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        items: true,
        client: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.paymentLinkUrl) {
      return NextResponse.json({ url: invoice.paymentLinkUrl });
    }

    const productName = `Invoice #${invoice.number}`;

    const product = await stripe.products.create({
      name: productName,
      description: `Payment for Invoice #${invoice.number}`,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: invoice.amount + invoice.tax,
      currency: "usd",
    });

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.number,
      },
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://n3xuskonceptz.com'}/dashboard/invoices`,
        },
      },
    });

    const updated = await prisma.invoice.update({
      where: { id: invoice.id },
      data: { paymentLinkUrl: paymentLink.url },
    });

    return NextResponse.json({ url: updated.paymentLinkUrl });
  } catch (error: any) {
    console.error("Stripe payment link error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment link" },
      { status: 500 }
    );
  }
}
