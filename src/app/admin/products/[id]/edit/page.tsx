import { prisma } from '@/lib/prisma';
import ProductForm from '../../ProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-heading text-primary mb-lg">Edit Product: {product.title}</h1>
      <ProductForm initialData={product} />
    </div>
  );
}
