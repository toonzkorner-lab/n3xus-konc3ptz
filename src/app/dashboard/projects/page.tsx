import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const metadata = {
  title: 'My Projects | N3xUs Konc3pt\'z',
  description: 'View all your active projects.',
};

export default async function DashboardProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const projects = await prisma.project.findMany({
    where: { clientId: session.user.id },
    include: {
      tasks: { orderBy: { createdAt: 'desc' } },
      _count: { select: { messages: true, invoices: true } },
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
      <div>
        <h1 className="text-3xl text-primary mb-xs">My Projects</h1>
        <p className="text-secondary">Track the status and progress of your digital assets.</p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-card border border-subtle rounded-xl p-3xl text-center">
          <div className="text-5xl mb-md">🌌</div>
          <h3 className="text-xl text-primary mb-sm">No Active Projects</h3>
          <p className="text-secondary mb-lg">Start a new project to see it tracked here.</p>
          <Link href="/services" className="btn btn-primary">Explore Services</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-xl">
          {projects.map(project => (
            <div key={project.id} className="bg-card border border-subtle rounded-xl p-xl hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-lg">
                <div>
                  <h2 className="text-xl text-primary font-heading mb-xs">{project.title}</h2>
                  <p className="text-sm text-secondary mb-md">{project.description}</p>
                  <Link href={`/dashboard/projects/${project.id}`} className="btn btn-secondary btn-sm inline-flex">
                    View Timeline
                  </Link>
                </div>
                <span className={`badge ${statusColors[project.status] || 'badge-primary'}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>

              <div className="mb-lg">
                <div className="flex justify-between text-xs mb-xs">
                  <span className="text-secondary">Overall Progress</span>
                  <span className="text-primary font-bold">{project.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>

              <div className="grid grid-3 gap-md mb-lg">
                <div className="bg-tertiary rounded-lg p-md text-center">
                  <p className="text-2xl font-heading text-primary">{project.tasks.length}</p>
                  <p className="text-xs text-tertiary">Tasks</p>
                </div>
                <div className="bg-tertiary rounded-lg p-md text-center">
                  <p className="text-2xl font-heading text-secondary">{project._count.messages}</p>
                  <p className="text-xs text-tertiary">Messages</p>
                </div>
                <div className="bg-tertiary rounded-lg p-md text-center">
                  <p className="text-2xl font-heading" style={{ color: 'var(--color-accent)' }}>{project._count.invoices}</p>
                  <p className="text-xs text-tertiary">Invoices</p>
                </div>
              </div>

              {project.tasks.length > 0 && (
                <div className="border-t border-subtle pt-md">
                  <h4 className="text-sm font-heading text-secondary mb-sm">Task Breakdown</h4>
                  <div className="flex flex-col gap-xs">
                    {project.tasks.slice(0, 5).map(task => (
                      <div key={task.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-sm">
                          <span className={`w-3 h-3 rounded-full ${
                            task.status === 'DONE' ? 'bg-green-500' :
                            task.status === 'IN_PROGRESS' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`} style={{
                            background: task.status === 'DONE' ? 'var(--color-success)' :
                                       task.status === 'IN_PROGRESS' ? 'var(--color-warning)' :
                                       'var(--text-tertiary)',
                          }}></span>
                          <span className={task.status === 'DONE' ? 'text-tertiary line-through' : 'text-secondary'}>
                            {task.title}
                          </span>
                        </div>
                        <span className={`badge badge-sm ${
                          task.priority === 'URGENT' ? 'badge-error' :
                          task.priority === 'HIGH' ? 'badge-warning' :
                          'badge-primary'
                        }`} style={{ fontSize: '0.65rem' }}>{task.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
