import RegisterForm from './RegisterForm';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Register | N3xUs Konc3pt\'z',
  description: 'Create your N3xUs portal account.',
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/dashboard');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-xl" style={{ background: 'var(--gradient-cosmic)' }}>
      <div className="absolute inset-0" style={{ background: 'var(--gradient-nebula)', pointerEvents: 'none' }}></div>
      
      <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
        <Link href="/" className="flex items-center gap-md mb-3xl group">
          <Image src="/logo.png" alt="N3xUs Konc3pt'z" width={48} height={48} className="group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-heading text-primary" style={{ textShadow: '0 0 20px var(--color-primary-glow)' }}>
            N3xUs Konc3pt&apos;z
          </span>
        </Link>
        
        <RegisterForm />
        
        <p className="mt-xl text-xs text-tertiary text-center">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
