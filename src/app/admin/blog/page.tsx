import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteBlogButton from './DeleteBlogButton';
export const metadata = {
  title: 'Manage Blog | N3xUs Admin',
  description: 'Blog management console.',
};

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    include: {
      author: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex flex-col gap-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary mb-xs">Blog Console</h1>
          <p className="text-secondary">Manage your cosmic transmissions and articles.</p>
        </div>
        <div className="flex items-center gap-md">
          <span className="badge badge-primary">{posts.length} Posts</span>
          <Link href="/admin/blog/new" className="btn btn-primary btn-sm">+ New Post</Link>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Tags</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td>
                  <div>
                    <div className="text-primary font-heading text-sm">{post.title}</div>
                    <div className="text-xs text-tertiary font-mono">/{post.slug}</div>
                  </div>
                </td>
                <td className="text-sm">{post.author.name}</td>
                <td>
                  <div className="flex gap-xs flex-wrap">
                    {JSON.parse(post.tags).slice(0, 3).map((tag: string) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`badge ${post.published ? 'badge-success' : 'badge-warning'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="text-xs text-tertiary font-mono">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-md">
                    <Link href={`/admin/blog/${post.id}/edit`} className="text-primary hover:text-primary-focus text-sm font-bold uppercase">
                      Edit
                    </Link>
                    <DeleteBlogButton postId={post.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {posts.length === 0 && (
        <div className="bg-card border border-subtle rounded-xl p-3xl text-center">
          <div className="text-5xl mb-md">📡</div>
          <h3 className="text-xl text-primary mb-sm">No Transmissions Yet</h3>
          <p className="text-secondary">Click "+ New Post" to start writing.</p>
        </div>
      )}
    </div>
  );
}
