import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import AdminProductList from './AdminProductList';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-lg">
        <h1 className="text-3xl font-heading text-primary">Products & Assets</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          Add Product
        </Link>
      </div>
      
      <div className="bg-card border border-subtle rounded-xl overflow-hidden">
        <AdminProductList initialProducts={products} />
      </div>
    </div>
  );
}
