import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeletePortfolioButton from './DeletePortfolioButton';
export const metadata = {
  title: 'Manage Portfolio | N3xUs Admin',
  description: 'Portfolio management console.',
};

export default async function AdminPortfolioPage() {
  const items = await prisma.portfolioItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex flex-col gap-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary mb-xs">Portfolio Console</h1>
          <p className="text-secondary">Manage your showcase projects and case studies.</p>
        </div>
        <div className="flex items-center gap-md">
          <span className="badge badge-primary">{items.length} Items</span>
          <Link href="/admin/portfolio/new" className="btn btn-primary btn-sm">+ Add Item</Link>
        </div>
      </div>

      <div className="grid grid-3 gap-xl">
        {items.map(item => (
          <div key={item.id} className="card">
            <div className="flex items-start justify-between mb-md">
              <h3 className="text-lg text-primary font-heading">{item.title}</h3>
              {item.featured && <span className="badge badge-warning">Featured</span>}
            </div>
            <p className="text-sm text-secondary mb-lg line-clamp-2">{item.shortDesc || item.description || 'No description'}</p>
            <div className="flex items-center gap-sm flex-wrap mb-md">
              <span className="tag">{item.category || 'General'}</span>
              {JSON.parse(item.tags).slice(0, 3).map((tag: string) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <div className="flex gap-sm mt-auto">
              {item.liveUrl && (
                <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">
                  Live ↗
                </a>
              )}
              {item.githubUrl && (
                <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">
                  Code ↗
                </a>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-subtle pt-md mt-md">
              <Link href={`/admin/portfolio/${item.id}/edit`} className="text-primary hover:text-primary-focus text-sm font-bold uppercase">
                Edit
              </Link>
              <DeletePortfolioButton portfolioId={item.id} />
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="bg-card border border-subtle rounded-xl p-3xl text-center">
          <div className="text-5xl mb-md">🖼️</div>
          <h3 className="text-xl text-primary mb-sm">No Portfolio Items</h3>
          <p className="text-secondary">Click "+ Add Item" to showcase your work.</p>
        </div>
      )}
    </div>
  );
}
