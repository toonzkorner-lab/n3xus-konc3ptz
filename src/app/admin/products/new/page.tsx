import ProductForm from '../ProductForm';

export default function NewProductPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-heading text-primary mb-lg">Add New Product</h1>
      <ProductForm />
    </div>
  );
}
