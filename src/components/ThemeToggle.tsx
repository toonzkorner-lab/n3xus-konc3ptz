'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  return (
    <button
      onClick={() => {
        if (theme === 'dark') setTheme('light');
        else if (theme === 'light') setTheme('neon');
        else setTheme('dark');
      }}
      className="btn btn-icon relative group"
      aria-label="Toggle Theme"
    >
      <div className="absolute inset-0 bg-primary/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <span className="relative z-10 text-xl flex items-center justify-center">
        {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '⚡️'}
      </span>
    </button>
  );
}
