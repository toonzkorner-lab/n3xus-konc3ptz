import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: invoiceId } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { items: true, project: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (invoice.status === 'PAID') {
      return NextResponse.json({ error: 'Invoice already paid' }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const lineItems = invoice.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.description,
        },
        unit_amount: item.unitPrice,
      },
      quantity: item.quantity,
    }));

    if (invoice.tax > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
          },
          unit_amount: invoice.tax,
        },
        quantity: 1,
      });
    }

    const sessionParams: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/dashboard/invoices?success=true`,
      cancel_url: `${baseUrl}/dashboard/invoices?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        invoiceId: invoice.id,
        projectId: invoice.projectId,
      },
    };

    const stripeSession = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: any) {
    console.error('Invoice payment error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during checkout' },
      { status: 500 }
    );
  }
}
