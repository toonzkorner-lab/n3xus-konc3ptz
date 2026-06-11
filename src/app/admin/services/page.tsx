import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteServiceButton from './DeleteServiceButton';

export const metadata = {
  title: 'Manage Services | N3xUs Admin',
  description: 'Service management console.',
};

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="flex flex-col gap-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary mb-xs">Services Console</h1>
          <p className="text-secondary">Manage your digital service offerings.</p>
        </div>
        <div className="flex items-center gap-md">
          <span className="badge badge-primary">{services.length} Services</span>
          <Link href="/admin/services/new" className="btn btn-primary btn-sm">
            + Add Service
          </Link>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>
                  <div className="flex items-center gap-md">
                    <span className="text-xl">{service.icon || '🚀'}</span>
                    <div>
                      <div className="text-primary font-heading text-sm">{service.name}</div>
                      <div className="text-xs text-tertiary font-mono">{service.slug}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="tag">{service.category || 'General'}</span>
                </td>
                <td className="font-mono text-primary">
                  ${(service.price / 100).toLocaleString()}
                </td>
                <td>
                  <span className={`badge ${service.active ? 'badge-success' : 'badge-error'}`}>
                    {service.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="font-mono text-tertiary">{service.order}</td>
                <td>
                  <div className="flex gap-sm items-center">
                    <Link href={`/admin/services/${service.id}/edit`} className="text-accent hover:text-accent/80 transition-colors text-sm font-bold">
                      Edit
                    </Link>
                    <span className="text-subtle">|</span>
                    <DeleteServiceButton id={service.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {services.length === 0 && (
        <div className="bg-card border border-subtle rounded-xl p-3xl text-center">
          <div className="text-5xl mb-md">⚡</div>
          <h3 className="text-xl text-primary mb-sm">No Services Configured</h3>
          <p className="text-secondary">Add services via the API to populate this console.</p>
        </div>
      )}
    </div>
  );
}
