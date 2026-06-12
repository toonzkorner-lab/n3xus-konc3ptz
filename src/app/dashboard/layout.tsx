import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import LogoutButton from './LogoutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  // Redirect admins to admin portal
  if ((session.user.role === 'ADMIN' || session.user.role === 'OWNER')) {
    redirect('/admin');
  }

  return (
    <div className="flex h-screen bg-primary overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-subtle flex flex-col z-20 shadow-lg">
        <div className="p-xl border-b border-subtle">
          <Link href="/dashboard" className="flex justify-center">
            <Image 
              src="/logo.jpg" 
              alt="N3xUs Konc3pt'z" 
              width={160} 
              height={50} 
              className="object-contain filter drop-shadow-sm"
            />
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-lg flex flex-col gap-sm">
          <Link href="/dashboard" className="flex items-center gap-md p-md rounded-md hover:bg-primary-subtle hover:text-primary transition-colors text-secondary">
            <span>📊</span> Overview
          </Link>
          <Link href="/dashboard/projects" className="flex items-center gap-md p-md rounded-md hover:bg-primary-subtle hover:text-primary transition-colors text-secondary">
            <span>🚀</span> Active Projects
          </Link>
          <Link href="/dashboard/invoices" className="flex items-center gap-md p-md rounded-md hover:bg-primary-subtle hover:text-primary transition-colors text-secondary">
            <span>💳</span> Invoices
          </Link>
          <Link href="/dashboard/messages" className="flex items-center gap-md p-md rounded-md hover:bg-primary-subtle hover:text-primary transition-colors text-secondary">
            <span>💬</span> Communications
          </Link>
        </nav>
        
        <div className="p-lg border-t border-subtle">
          <div className="flex items-center gap-md mb-md">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center font-heading font-bold text-inverse">
              {session.user.name?.charAt(0) || 'C'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-primary">{session.user.name}</p>
              <p className="text-xs text-secondary truncate">{session.user.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-subtle flex items-center justify-between px-xl z-10 shadow-sm">
          <h2 className="text-lg font-heading text-primary">Client Portal</h2>
          <div className="flex items-center gap-md">
            <button className="text-secondary hover:text-primary transition-colors relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 01-3.46 0"></path>
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></span>
            </button>
            <Link href="/" className="text-sm text-secondary hover:text-primary transition-colors border border-subtle px-sm py-xs rounded-md">
              Public Site
            </Link>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-2xl bg-primary relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-subtle/5 to-secondary-subtle/5 pointer-events-none"></div>
          <div className="relative z-10 max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
