import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const metadata = {
  title: 'Messages | Admin | N3xUs Konc3pt\'z',
};

export default async function AdminMessagesPage() {
  const messages = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading text-primary glow-text mb-xs">Transmissions</h1>
          <p className="text-secondary">Messages received from the contact portal.</p>
        </div>
      </div>

      <div className="bg-card border border-subtle rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-secondary text-primary border-b border-subtle">
            <tr>
              <th className="p-md font-heading">Status</th>
              <th className="p-md font-heading">Date</th>
              <th className="p-md font-heading">From</th>
              <th className="p-md font-heading">Subject</th>
              <th className="p-md font-heading">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-xl text-center text-secondary">
                  No transmissions received yet.
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-md">
                    <span className={`badge ${msg.status === 'NEW' ? 'badge-primary' : 'badge-secondary'}`}>
                      {msg.status}
                    </span>
                  </td>
                  <td className="p-md text-sm text-secondary font-mono">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-md">
                    <div className="font-bold text-primary">{msg.name}</div>
                    <div className="text-xs text-accent">
                      <a href={`mailto:${msg.email}`}>{msg.email}</a>
                    </div>
                  </td>
                  <td className="p-md font-bold text-secondary">{msg.subject || 'No Subject'}</td>
                  <td className="p-md text-sm text-secondary max-w-xs truncate" title={msg.message}>
                    {msg.message}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
