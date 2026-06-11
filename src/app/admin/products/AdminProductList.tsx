'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function AdminProductList({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        router.refresh();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting product');
    }
  };

  return (
    <div className="table-wrapper">
      <table className="table w-full text-left">
        <thead>
          <tr className="border-b border-subtle">
            <th className="p-md">Product</th>
            <th className="p-md">Price</th>
            <th className="p-md">Category</th>
            <th className="p-md">Status</th>
            <th className="p-md">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-xl text-center text-secondary">
                No products found. Add your first digital product!
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="border-b border-subtle hover:bg-white/5 transition-colors">
                <td className="p-md">
                  <div className="font-bold text-primary">{product.title}</div>
                  <div className="text-xs text-secondary">{product.slug}</div>
                </td>
                <td className="p-md font-mono">{formatCurrency(product.price)}</td>
                <td className="p-md text-sm">{product.category || '-'}</td>
                <td className="p-md">
                  <span className={`px-2 py-1 text-xs rounded-full ${product.active ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                    {product.active ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="p-md">
                  <div className="flex gap-sm">
                    <Link href={`/admin/products/${product.id}/edit`} className="btn btn-sm btn-ghost">
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="btn btn-sm btn-ghost text-error hover:bg-error/20"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
