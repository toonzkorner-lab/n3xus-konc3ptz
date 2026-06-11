import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteCouponButton from './DeleteCouponButton';
import { formatCurrency } from '@/lib/utils';

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading text-primary glow-text">Promo Codes</h1>
        <Link href="/admin/coupons/new" className="btn btn-primary">
          + New Code
        </Link>
      </div>

      <div className="bg-card border border-subtle rounded-xl overflow-hidden shadow-lg">
        {coupons.length === 0 ? (
          <div className="p-xl text-center text-secondary">
            <p>No promo codes found.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary text-secondary text-sm">
                <th className="p-md font-medium border-b border-subtle">Code</th>
                <th className="p-md font-medium border-b border-subtle">Discount</th>
                <th className="p-md font-medium border-b border-subtle">Status</th>
                <th className="p-md font-medium border-b border-subtle">Uses</th>
                <th className="p-md font-medium border-b border-subtle text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id} className="border-b border-subtle hover:bg-tertiary/30 transition-colors">
                  <td className="p-md">
                    <span className="font-mono font-bold text-primary">{coupon.code}</span>
                  </td>
                  <td className="p-md text-sm text-secondary">
                    {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                  </td>
                  <td className="p-md">
                    <span className={`badge ${coupon.active ? 'badge-success' : 'badge-error'}`}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-md text-sm text-secondary">
                    {coupon.uses} {coupon.maxUses ? `/ ${coupon.maxUses}` : ''}
                  </td>
                  <td className="p-md text-right">
                    <div className="flex items-center justify-end gap-sm">
                      <Link href={`/admin/coupons/${coupon.id}/edit`} className="text-xs text-accent hover:underline">
                        Edit
                      </Link>
                      <DeleteCouponButton id={coupon.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
