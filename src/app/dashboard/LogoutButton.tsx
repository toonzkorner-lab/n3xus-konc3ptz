'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/auth/login' })}
      className="w-full flex items-center justify-center gap-sm p-sm rounded-md bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm font-bold border border-red-500/20"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      Terminate Session
    </button>
  );
}
