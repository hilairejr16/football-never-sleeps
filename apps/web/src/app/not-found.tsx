import Link from 'next/link';
import { Home, Search, Trophy } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="font-display text-8xl text-brand-red/20 mb-4 select-none">404</div>
        <h1 className="text-3xl font-display tracking-wider text-white mb-3">PAGE NOT FOUND</h1>
        <p className="text-brand-gray text-lg mb-8 leading-relaxed">
          This page doesn&apos;t exist or has moved. Football never sleeps — but this URL does.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="gr-btn-primary px-6 flex items-center gap-2 w-full sm:w-auto justify-center">
            <Home className="w-4 h-4" />Back to Home
          </Link>
          <Link href="/news" className="gr-btn-ghost px-6 flex items-center gap-2 w-full sm:w-auto justify-center">
            <Search className="w-4 h-4" />Latest News
          </Link>
          <Link href="/world-cup" className="gr-btn-ghost px-6 flex items-center gap-2 w-full sm:w-auto justify-center text-yellow-400 border-yellow-500/30 hover:border-yellow-400">
            <Trophy className="w-4 h-4" />World Cup Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
