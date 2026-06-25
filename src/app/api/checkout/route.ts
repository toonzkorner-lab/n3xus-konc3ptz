import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { items, couponCode } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
    }

    // Separate one-time items from subscription items
    const oneTimeItems = items.filter((i: any) => !i.recurring);
    const subscriptionItems = items.filter((i: any) => i.recurring);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // If there are subscription items, we need mode: 'subscription'
    // Stripe doesn't allow mixing one-time and recurring in the same session easily,
    // so if we have both, we add one-time items as fixed-price add-ons
    const hasSubscriptions = subscriptionItems.length > 0;
    const mode = hasSubscriptions ? 'subscription' : 'payment';

    // Build line items
    const lineItems: any[] = [];

    for (const item of oneTimeItems) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            description: item.type === 'SERVICE' ? 'Service Payment' : 'Digital Product',
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      });
    }

    for (const item of subscriptionItems) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            description: `Monthly subscription — ${item.title}`,
          },
          unit_amount: item.price,
          recurring: {
            interval: item.recurring || 'month',
          },
        },
        quantity: item.quantity,
      });
    }

    const sessionParams: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode,
      ui_mode: 'embedded_page',
      return_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        itemsSummary: items.map((i: any) => `${i.title} x${i.quantity}`).join(', ').substring(0, 500),
      },
    };

    // Calculate total for coupon validation
    const amountTotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    // Apply coupon if provided
    if (couponCode && typeof couponCode === 'string') {
      try {
        const coupon = await prisma.coupon.findUnique({
          where: { code: couponCode.toUpperCase() },
        });

        if (coupon && coupon.active) {
          const now = new Date();
          const notExpired = !coupon.expiresAt || now < coupon.expiresAt;
          const underLimit = coupon.maxUses === null || coupon.uses < coupon.maxUses;
          const meetsMin = amountTotal >= coupon.minOrderAmount;

          if (notExpired && underLimit && meetsMin) {
            let stripeCoupon;
            if (coupon.type === 'PERCENTAGE') {
              stripeCoupon = await stripe.coupons.create({
                percent_off: coupon.value,
                duration: hasSubscriptions ? 'once' : 'once',
                name: `Promo: ${coupon.code}`,
              });
            } else {
              const discountAmount = Math.min(coupon.value, amountTotal);
              stripeCoupon = await stripe.coupons.create({
                amount_off: discountAmount,
                currency: 'usd',
                duration: 'once',
                name: `Promo: ${coupon.code}`,
              });
            }

            sessionParams.discounts = [{ coupon: stripeCoupon.id }];

            await prisma.coupon.update({
              where: { id: coupon.id },
              data: { uses: { increment: 1 } },
            });
          }
        }
      } catch (couponError) {
        console.error('Coupon processing error (continuing without discount):', couponError);
      }
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ clientSecret: session.client_secret });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during checkout.' },
      { status: 500 }
    );
  }
}
