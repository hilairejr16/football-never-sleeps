import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Search } from 'lucide-react';
import SearchResults from './SearchResults';

export const metadata: Metadata = {
  title: 'Search — GoalRush Global',
  description: 'Search for football news, players, teams, fixtures, and more on GoalRush Global.',
  alternates: { canonical: '/search' },
  robots: { index: false, follow: false },
};

function SearchSkeleton() {
  return (
    <div className="gr-card p-12 text-center">
      <Search className="w-12 h-12 text-brand-muted mx-auto mb-4 animate-pulse" />
      <p className="text-brand-gray text-sm">Searching...</p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-wider text-white flex items-center gap-3 mb-2">
          <Search className="w-7 h-7 text-brand-gold" />SEARCH
        </h1>
        <p className="text-brand-gray">Find players, teams, news, fixtures, and more</p>
      </div>

      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
