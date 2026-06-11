import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteTestimonialButton from './DeleteTestimonialButton';

export const metadata = {
  title: 'Manage Testimonials | N3xUs Admin',
  description: 'Testimonial management console.',
};

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex flex-col gap-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary mb-xs">Testimonials</h1>
          <p className="text-secondary">Manage client testimonials and reviews.</p>
        </div>
        <div className="flex items-center gap-md">
          <span className="badge badge-primary">{testimonials.length} Testimonials</span>
          <Link href="/admin/testimonials/new" className="btn btn-primary btn-sm">
            + Add Testimonial
          </Link>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Rating</th>
              <th>Testimonial</th>
              <th>Company</th>
              <th>Featured</th>
              <th>Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map(testimonial => (
              <tr key={testimonial.id}>
                <td>
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ 
                        background: 'var(--color-primary-subtle)',
                        color: 'var(--color-primary)',
                        border: '1px solid rgba(0, 240, 255, 0.3)',
                      }}
                    >
                      {testimonial.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-primary text-sm font-heading">{testimonial.clientName}</div>
                      <div className="text-xs text-tertiary">{testimonial.clientRole || '—'}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-yellow-400 font-mono text-sm">
                    {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                  </span>
                </td>
                <td className="text-sm text-secondary max-w-[300px] truncate">
                  {testimonial.content.substring(0, 80)}{testimonial.content.length > 80 ? '...' : ''}
                </td>
                <td className="text-sm text-secondary">{testimonial.clientCompany || '—'}</td>
                <td>
                  {testimonial.featured ? (
                    <span className="badge badge-secondary">Featured</span>
                  ) : (
                    <span className="text-xs text-tertiary">—</span>
                  )}
                </td>
                <td className="text-xs text-tertiary font-mono">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-md">
                    <Link href={`/admin/testimonials/${testimonial.id}/edit`} className="text-primary hover:text-primary-focus text-sm font-bold uppercase">
                      Edit
                    </Link>
                    <DeleteTestimonialButton testimonialId={testimonial.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
