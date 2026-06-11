import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { code, orderTotal } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, error: 'Coupon code is required.' });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({ valid: false, error: 'Invalid coupon code.' });
    }

    if (!coupon.active) {
      return NextResponse.json({ valid: false, error: 'This coupon is no longer active.' });
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ valid: false, error: 'This coupon has expired.' });
    }

    if (coupon.maxUses !== null && coupon.uses >= coupon.maxUses) {
      return NextResponse.json({ valid: false, error: 'This coupon has reached its usage limit.' });
    }

    const total = orderTotal || 0;
    if (total < coupon.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order of ${formatCents(coupon.minOrderAmount)} required to use this coupon.`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = Math.floor((total * coupon.value) / 100);
    } else {
      discount = Math.min(coupon.value, total);
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      description: coupon.description,
      discount,
      discountFormatted: formatCents(discount),
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ valid: false, error: 'Failed to validate coupon.' });
  }
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}
