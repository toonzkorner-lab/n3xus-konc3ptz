import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProfileForm from './ProfileForm';

export const metadata = {
  title: 'Profile Settings | Client Portal',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      company: true,
      phone: true,
      image: true,
    }
  });

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div>
      <div className="mb-xl">
        <h1 className="text-3xl font-heading text-primary mb-xs">Profile Settings</h1>
        <p className="text-secondary text-sm">Manage your personal information and contact details.</p>
      </div>

      <div className="bg-card border border-subtle rounded-xl p-xl shadow-md max-w-2xl">
        <ProfileForm initialData={user} />
      </div>
    </div>
  );
}
