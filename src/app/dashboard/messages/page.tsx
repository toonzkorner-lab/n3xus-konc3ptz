import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ChatInterface from './ChatInterface';

export const metadata = {
  title: 'Communications | N3xUs Konc3pt\'z',
  description: 'Project communications and messages.',
};

export default async function DashboardMessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  // Fetch projects with basic structure
  const projects = await prisma.project.findMany({
    where: { clientId: session.user.id },
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  // Map Date objects to strings for Client Component validation safety
  const formattedProjects = projects.map(p => ({
    id: p.id,
    title: p.title,
    createdAt: p.createdAt.toISOString(),
  }));

  const userInitials = session.user.name ? session.user.name.charAt(0) : 'C';

  return (
    <div className="flex flex-col gap-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary mb-xs">Communications</h1>
          <p className="text-secondary">Direct comm channels for your active projects.</p>
        </div>
      </div>

      {formattedProjects.length === 0 ? (
        <div className="bg-card border border-subtle rounded-xl p-3xl text-center">
          <div className="text-5xl mb-md">💬</div>
          <h3 className="text-xl text-primary mb-sm">No Active Channels</h3>
          <p className="text-secondary">Start a project to open a communication channel with our team.</p>
        </div>
      ) : (
        <ChatInterface
          projects={formattedProjects}
          currentUserId={session.user.id}
          currentUserInitials={userInitials}
        />
      )}
    </div>
  );
}
