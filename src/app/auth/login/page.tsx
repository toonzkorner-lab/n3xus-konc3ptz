import LoginForm from './LoginForm';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Login | N3xUs Konc3pt\'z',
  description: 'Access the N3xUs portal.',
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-xl relative overflow-hidden bg-primary">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary opacity-20 pointer-events-none"></div>
      
      <Link href="/" className="absolute top-xl left-xl flex items-center gap-sm text-secondary hover:text-primary transition-colors z-10">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Return to Surface
      </Link>

      <div className="relative z-10 mb-2xl">
        <Image 
          src="/logo.jpg" 
          alt="N3xUs Konc3pt'z" 
          width={250} 
          height={80} 
          className="object-contain filter drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 0 15px var(--color-primary-glow))' }}
        />
      </div>

      <div className="w-full relative z-10">
        <LoginForm />
      </div>
    </main>
  );
}
