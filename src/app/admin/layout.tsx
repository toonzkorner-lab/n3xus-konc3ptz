import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import LogoutButton from '../dashboard/LogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  // Must be ADMIN
  if ((session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    redirect('/dashboard');
  }

  return (
    <div className="flex h-screen bg-primary overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-accent/30 flex flex-col z-20 shadow-lg relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none"></div>
        <div className="p-xl border-b border-subtle relative z-10">
          <Link href="/admin" className="flex justify-center">
            <Image 
              src="/logo.jpg" 
              alt="N3xUs Konc3pt'z" 
              width={160} 
              height={50} 
              className="object-contain filter drop-shadow-sm"
            />
          </Link>
          <div className="mt-md text-center">
            <span className="text-xs font-mono text-accent uppercase tracking-widest border border-accent/50 bg-accent/10 px-sm py-xs rounded-sm">Admin Nexus</span>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-lg flex flex-col gap-sm relative z-10">
          <Link href="/admin" className="flex items-center gap-md p-md rounded-md hover:bg-accent/10 hover:text-accent transition-colors text-secondary">
            <span>🌐</span> Command Center
          </Link>
          <Link href="/admin/users" className="flex items-center gap-md p-md rounded-md hover:bg-accent/10 hover:text-accent transition-colors text-secondary">
            <span>👥</span> Client Database
          </Link>
          <Link href="/admin/projects" className="flex items-center gap-md p-md rounded-md hover:bg-accent/10 hover:text-accent transition-colors text-secondary">
            <span>🚀</span> Active Projects
          </Link>
          <Link href="/admin/messages" className="flex items-center gap-md p-md rounded-md hover:bg-accent/10 hover:text-accent transition-colors text-secondary">
            <span>💬</span> Transmissions
          </Link>
          <Link href="/admin/services" className="flex items-center gap-md p-md rounded-md hover:bg-accent/10 hover:text-accent transition-colors text-secondary">
            <span>🛠️</span> Service Editor
          </Link>
          <Link href="/admin/products" className="flex items-center gap-md p-md rounded-md hover:bg-accent/10 hover:text-accent transition-colors text-secondary">
            <span>📦</span> Products & Assets
          </Link>
          <Link href="/admin/invoices" className="flex items-center gap-md p-md rounded-md hover:bg-accent/10 hover:text-accent transition-colors text-secondary">
            <span>💰</span> Revenue Stream
          </Link>
          <Link href="/admin/coupons" className="flex items-center gap-md p-md rounded-md hover:bg-accent/10 hover:text-accent transition-colors text-secondary">
            <span>🎟️</span> Promo Codes
          </Link>
          <Link href="/admin/portfolio" className="flex items-center gap-md p-md rounded-md hover:bg-accent/10 hover:text-accent transition-colors text-secondary">
            <span>✨</span> Portfolio Showcase
          </Link>
          <Link href="/admin/blog" className="flex items-center gap-md p-md rounded-md hover:bg-accent/10 hover:text-accent transition-colors text-secondary">
            <span>📡</span> Blog & News
          </Link>
          <Link href="/admin/testimonials" className="flex items-center gap-md p-md rounded-md hover:bg-accent/10 hover:text-accent transition-colors text-secondary">
            <span>⭐</span> Testimonials
          </Link>
        </nav>
        
        <div className="p-lg border-t border-subtle relative z-10 flex flex-col gap-sm">
          <div className="flex items-center gap-md mb-xs">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-heading font-bold text-inverse shadow-glow-purple">
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-primary">System Admin</p>
              <p className="text-xs text-secondary truncate">{session.user.email}</p>
            </div>
          </div>
          <Link href="/" className="btn btn-outline w-full text-center mb-xs" style={{ padding: '0.5rem', fontSize: '0.875rem' }}>
            🏠 Return to Site
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-subtle flex items-center justify-between px-xl z-10 shadow-sm">
          <h2 className="text-lg font-heading text-primary">System Override Console</h2>
          <div className="flex items-center gap-md">
            <div className="text-xs font-mono text-success flex items-center gap-xs border border-success/30 bg-success/10 px-sm py-xs rounded-md">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
              SYSTEM ONLINE
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-2xl bg-primary relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary-subtle/5 pointer-events-none"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
