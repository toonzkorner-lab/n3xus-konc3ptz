import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const metadata = {
  title: 'Communications | N3xUs Konc3pt\'z',
  description: 'Project communications and messages.',
};

export default async function DashboardMessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  // Fetch projects with their messages
  const projects = await prisma.project.findMany({
    where: { clientId: session.user.id },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1, // Get latest message for summary
        include: { sender: { select: { name: true, role: true } } }
      },
      _count: { select: { messages: true } }
    },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="flex flex-col gap-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary mb-xs">Communications</h1>
          <p className="text-secondary">Direct comm channels for your active projects.</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-card border border-subtle rounded-xl p-3xl text-center">
          <div className="text-5xl mb-md">💬</div>
          <h3 className="text-xl text-primary mb-sm">No Active Channels</h3>
          <p className="text-secondary">Start a project to open a communication channel with our team.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          {/* Project List / Channels */}
          <div className="md:col-span-1 flex flex-col gap-md">
            <h2 className="text-lg font-heading text-secondary mb-xs">Active Channels</h2>
            {projects.map(project => (
              <div key={project.id} className="bg-card border border-primary/30 rounded-xl p-md cursor-pointer hover:border-primary transition-colors bg-primary-subtle/10 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <h3 className="font-heading text-primary truncate pr-xl">{project.title}</h3>
                
                {project.messages.length > 0 ? (
                  <div className="mt-sm">
                    <p className="text-xs text-secondary truncate">
                      <span className="font-bold text-tertiary">{project.messages[0].sender.name}: </span>
                      {project.messages[0].content}
                    </p>
                    <p className="text-xs text-tertiary mt-xs">
                      {new Date(project.messages[0].createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-tertiary mt-sm italic">No messages yet.</p>
                )}
                
                {project._count.messages > 0 && (
                  <span className="absolute right-md top-md bg-accent text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-glow-purple">
                    {project._count.messages}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Chat Window Mockup */}
          <div className="md:col-span-2 bg-card border border-subtle rounded-xl flex flex-col h-[600px] overflow-hidden">
            {projects[0] ? (
              <>
                <div className="p-md border-b border-subtle bg-primary-subtle/5 flex justify-between items-center">
                  <div>
                    <h3 className="font-heading text-primary text-lg">{projects[0].title}</h3>
                    <p className="text-xs text-secondary">Encrypted comm channel</p>
                  </div>
                  <span className="badge badge-success">Online</span>
                </div>
                
                <div className="flex-1 p-lg overflow-y-auto flex flex-col gap-lg">
                  <div className="text-center">
                    <span className="text-xs text-tertiary bg-tertiary/20 px-sm py-xs rounded-full">Channel established: {new Date(projects[0].createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Mock Messages */}
                  <div className="flex flex-col gap-sm self-start max-w-[80%]">
                    <div className="flex items-end gap-sm">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">N</div>
                      <div className="bg-tertiary/40 border border-subtle p-md rounded-2xl rounded-bl-none">
                        <p className="text-sm">Welcome to the project portal! We've received your requirements and are currently in the planning phase. Let us know if you have any immediate questions.</p>
                      </div>
                    </div>
                    <span className="text-xs text-tertiary ml-10">Admin • Yesterday</span>
                  </div>
                  
                  <div className="flex flex-col gap-sm self-end max-w-[80%]">
                    <div className="flex items-end gap-sm flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs text-inverse font-bold">
                        {session.user.name?.charAt(0) || 'C'}
                      </div>
                      <div className="bg-primary-subtle border border-primary/30 p-md rounded-2xl rounded-br-none">
                        <p className="text-sm">Thanks! I'm looking forward to seeing the initial designs. Do you have an ETA on the first milestone?</p>
                      </div>
                    </div>
                    <span className="text-xs text-tertiary mr-10 text-right">You • Today, 10:30 AM</span>
                  </div>
                </div>
                
                <div className="p-md border-t border-subtle bg-primary-subtle/5">
                  <form className="flex gap-md" onSubmit={(e) => e.preventDefault()}>
                    <input 
                      type="text" 
                      placeholder="Transmit message..." 
                      className="flex-1 bg-input border border-subtle rounded-md p-sm text-sm focus:border-primary focus:outline-none"
                    />
                    <button type="button" className="btn btn-primary btn-sm px-lg">Send</button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-tertiary flex-col gap-md">
                <span className="text-4xl">📡</span>
                <p>Select a channel to transmit</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
