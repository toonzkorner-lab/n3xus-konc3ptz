import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import SecurityContent from '../../dashboard/security/SecurityContent';

export const metadata = {
  title: 'Security | Admin Console',
};

export default async function AdminSecurityPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { authenticators: true, accounts: true }
  });

  if (!user) return null;

  const authenticators = user.authenticators.map(a => ({
    credentialID: a.credentialID,
    deviceType: a.credentialDeviceType
  }));

  const hasGoogleAccount = user.accounts.some(a => a.provider === 'google');

  return (
    <div className="flex flex-col gap-lg">
      <div className="mb-md">
        <h1 className="text-3xl font-heading text-primary mb-xs">Security Settings</h1>
        <p className="text-secondary">Manage your authenticators and linked accounts for the Admin panel.</p>
      </div>

      <SecurityContent 
        authenticators={authenticators} 
        hasGoogleAccount={hasGoogleAccount} 
      />
    </div>
  );
}
