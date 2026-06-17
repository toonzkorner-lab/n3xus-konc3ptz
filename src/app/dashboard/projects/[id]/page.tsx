import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Project Timeline | N3xUs Konc3pt\'z',
  description: 'View your project timeline and approve files.',
};

export default async function ProjectTimelinePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      tasks: { orderBy: { createdAt: 'asc' } },
      files: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!project || project.clientId !== session.user.id) {
    notFound();
  }

  const statusColors: Record<string, string> = {
    PLANNING: 'badge-primary',
    IN_PROGRESS: 'badge-warning',
    REVIEW: 'badge-secondary',
    COMPLETED: 'badge-success',
    ON_HOLD: 'badge-error',
    CANCELLED: 'badge-error',
  };

  return (
    <div className="flex flex-col gap-2xl max-w-4xl mx-auto w-full">
      <div className="mb-md flex justify-between items-start">
        <div>
          <Link href="/dashboard/projects" className="text-sm text-tertiary hover:text-primary transition-colors inline-block mb-md">
            ← Back to Projects
          </Link>
          <h1 className="text-3xl font-heading text-primary mb-xs">{project.title}</h1>
          <p className="text-secondary">{project.description}</p>
        </div>
        <span className={`badge ${statusColors[project.status] || 'badge-primary'}`}>
          {project.status.replace('_', ' ')}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="bg-card p-xl rounded-xl border border-subtle">
        <div className="flex justify-between text-sm mb-sm">
          <span className="text-secondary font-heading">Overall Progress</span>
          <span className="text-primary font-bold">{project.progress}%</span>
        </div>
        <div className="progress-bar h-3 bg-tertiary rounded-full overflow-hidden">
          <div className="progress-bar-fill h-full bg-primary" style={{ width: `${project.progress}%`, boxShadow: '0 0 10px var(--color-primary-glow)' }}></div>
        </div>
      </div>

      <div className="grid grid-2 gap-2xl">
        {/* Timeline (Tasks) */}
        <div className="card">
          <h3 className="text-xl text-primary font-heading mb-lg">Project Timeline</h3>
          <div className="flex flex-col gap-lg relative">
            <div className="absolute left-3 top-2 bottom-2 w-[2px] bg-subtle"></div>
            {project.tasks.length === 0 ? (
              <p className="text-tertiary text-sm pl-xl">No timeline events yet.</p>
            ) : (
              project.tasks.map((task, index) => (
                <div key={task.id} className="relative pl-xl">
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center ${
                    task.status === 'DONE' ? 'bg-green-500 text-white' :
                    task.status === 'IN_PROGRESS' ? 'bg-yellow-500' :
                    'bg-gray-600'
                  }`}>
                    {task.status === 'DONE' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className={`font-bold ${task.status === 'DONE' ? 'text-secondary' : 'text-primary'}`}>{task.title}</h4>
                    {task.description && <p className="text-sm text-tertiary mt-xs">{task.description}</p>}
                    <p className="text-xs text-tertiary mt-xs font-mono">{new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Files & Deliverables */}
        <div className="card">
          <h3 className="text-xl text-primary font-heading mb-lg">Deliverables</h3>
          {project.files.length === 0 ? (
            <p className="text-tertiary text-sm">No files or deliverables have been uploaded yet.</p>
          ) : (
            <div className="flex flex-col gap-md">
              {project.files.map(file => (
                <div key={file.id} className="bg-background border border-subtle rounded-md p-md flex items-center justify-between">
                  <div className="flex items-center gap-sm overflow-hidden">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary flex-shrink-0">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                    <div className="truncate">
                      <a href={file.url} target="_blank" className="text-sm font-bold text-primary hover:underline truncate block">
                        {file.name}
                      </a>
                      <span className="text-xs text-tertiary font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
