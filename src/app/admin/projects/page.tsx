import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteProjectButton from './DeleteProjectButton';
export const metadata = {
  title: 'Manage Projects | N3xUs Admin',
  description: 'Project management console.',
};

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      client: { select: { name: true, email: true } },
      _count: { select: { tasks: true, invoices: true, messages: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const statusColors: Record<string, string> = {
    PLANNING: 'badge-primary',
    IN_PROGRESS: 'badge-warning',
    REVIEW: 'badge-secondary',
    COMPLETED: 'badge-success',
    ON_HOLD: 'badge-error',
    CANCELLED: 'badge-error',
  };

  return (
    <div className="flex flex-col gap-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary mb-xs">Projects Console</h1>
          <p className="text-secondary">Track and manage all client projects.</p>
        </div>
        <div className="flex items-center gap-md">
          <span className="badge badge-primary">{projects.length} Projects</span>
          <Link href="/admin/projects/new" className="btn btn-primary btn-sm">
            + Add Project
          </Link>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Budget</th>
              <th>Tasks</th>
              <th>Updated</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id}>
                <td>
                  <div className="text-primary font-heading text-sm">{project.title}</div>
                </td>
                <td>
                  <div>
                    <div className="text-sm">{project.client.name}</div>
                    <div className="text-xs text-tertiary font-mono">{project.client.email}</div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${statusColors[project.status] || 'badge-primary'}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-sm" style={{ minWidth: '120px' }}>
                    <div className="progress-bar flex-1">
                      <div className="progress-bar-fill" style={{ width: `${project.progress}%` }}></div>
                    </div>
                    <span className="text-xs font-mono text-primary">{project.progress}%</span>
                  </div>
                </td>
                <td className="font-mono text-primary">
                  ${(project.budget / 100).toLocaleString()}
                </td>
                <td className="font-mono text-secondary">{project._count.tasks}</td>
                <td className="text-xs text-tertiary font-mono">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-md">
                    <Link href={`/admin/projects/${project.id}/edit`} className="text-primary hover:text-primary-focus text-sm font-bold uppercase">
                      Edit
                    </Link>
                    <DeleteProjectButton projectId={project.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {projects.length === 0 && (
        <div className="bg-card border border-subtle rounded-xl p-3xl text-center">
          <div className="text-5xl mb-md">🌐</div>
          <h3 className="text-xl text-primary mb-sm">No Projects Yet</h3>
          <p className="text-secondary">Projects will appear here once clients start commissioning work.</p>
        </div>
      )}
    </div>
  );
}
