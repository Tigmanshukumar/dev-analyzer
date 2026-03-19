'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Analyze() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if accessed directly
    router.push('/');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-8 text-xl font-mono">Redirecting to home...</p>
    </div>
  );
}
