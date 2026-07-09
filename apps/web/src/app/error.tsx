'use client';

import { useEffect } from 'react';
import { RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GoalRush] Unhandled error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="font-display text-7xl text-brand-red/20 mb-4 select-none">500</div>
        <h1 className="text-3xl font-display tracking-wider text-white mb-3">SOMETHING WENT WRONG</h1>
        <p className="text-brand-gray text-lg mb-8 leading-relaxed">
          An unexpected error occurred. Our team has been notified. Football never stops — try refreshing.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="gr-btn-primary px-6 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <RefreshCw className="w-4 h-4" />Try Again
          </button>
          <Link href="/" className="gr-btn-ghost px-6 flex items-center gap-2 w-full sm:w-auto justify-center">
            <Home className="w-4 h-4" />Back to Home
          </Link>
        </div>
        {error.digest && (
          <p className="text-brand-muted text-xs mt-6">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
