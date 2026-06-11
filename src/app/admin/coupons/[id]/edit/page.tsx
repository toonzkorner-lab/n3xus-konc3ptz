import { prisma } from '@/lib/prisma';
import CouponForm from '../../CouponForm';
import { notFound } from 'next/navigation';

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coupon = await prisma.coupon.findUnique({
    where: { id }
  });

  if (!coupon) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-heading text-primary mb-lg glow-text">Edit Promo Code</h1>
      <CouponForm initialData={coupon} />
    </div>
  );
}
