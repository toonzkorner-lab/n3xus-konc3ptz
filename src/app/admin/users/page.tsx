import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteUserButton from './DeleteUserButton';

export const metadata = {
  title: 'Manage Users | N3xUs Admin',
  description: 'User management console.',
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: { select: { projects: true, invoices: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex flex-col gap-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary mb-xs">User Console</h1>
          <p className="text-secondary">Manage clients and administrators.</p>
        </div>
        <div className="flex items-center gap-md">
          <span className="badge badge-primary">{users.length} Users</span>
          <Link href="/admin/users/new" className="btn btn-primary btn-sm">
            + Add Client
          </Link>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Company</th>
              <th>Projects</th>
              <th>Invoices</th>
              <th>Joined</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ 
                        background: (user.role === 'ADMIN' || user.role === 'OWNER') ? 'var(--color-secondary-subtle)' : 'var(--color-primary-subtle)',
                        color: (user.role === 'ADMIN' || user.role === 'OWNER') ? 'var(--color-secondary)' : 'var(--color-primary)',
                        border: `1px solid ${(user.role === 'ADMIN' || user.role === 'OWNER') ? 'rgba(139, 92, 246, 0.3)' : 'rgba(0, 240, 255, 0.3)'}`,
                      }}
                    >
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-primary text-sm font-heading">{user.name || 'Unnamed'}</div>
                      <div className="text-xs text-tertiary font-mono">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${(user.role === 'ADMIN' || user.role === 'OWNER') ? 'badge-secondary' : 'badge-primary'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="text-sm text-secondary">{user.company || '—'}</td>
                <td className="font-mono text-primary">{user._count.projects}</td>
                <td className="font-mono text-primary">{user._count.invoices}</td>
                <td className="text-xs text-tertiary font-mono">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-md">
                    <Link href={`/admin/users/${user.id}/edit`} className="text-primary hover:text-primary-focus text-sm font-bold uppercase">
                      Edit
                    </Link>
                    <DeleteUserButton userId={user.id} />
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
