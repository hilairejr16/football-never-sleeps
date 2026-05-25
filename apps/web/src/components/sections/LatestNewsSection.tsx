import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import NewsCard from '@/components/cards/NewsCard';
import type { NewsArticle } from '@/lib/types';

const CATEGORIES = ['All', 'Breaking', 'Transfers', 'Analysis', 'Match Reports', 'Women'];

const MOCK_NEWS: NewsArticle[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 10),
  title: [
    'Ten Hag Faces the Sack as Man United Board Meets — Full Report',
    'Bellingham Injury Update: Real Madrid Star Could Miss El Clasico',
    'The Tactical Revolution Behind Arsenal\'s Title Push',
    'Why Haaland Is Still the Most Complete Striker in World Football',
    'Woman\'s World Cup Preview: USWNT, England, and Spain Battle for Glory',
    'The Stats That Prove Liverpool\'s High Press Is Back to Its Best',
    'Transfer Window: Every Confirmed Deal and Latest Rumours',
    'Bundesliga Roundup: Leverkusen\'s Incredible Unbeaten Season Continues',
  ][i],
  slug: `article-${i + 10}`,
  excerpt: 'Latest football news and analysis from GoalRush Global — the most trusted source for football content worldwide.',
  content: '',
  category: (['breaking', 'analysis', 'analysis', 'analysis', 'women', 'analysis', 'transfer', 'match-report'] as const)[i],
  tags: ['Football', 'News'],
  imageUrl: `/news/article-${i + 1}.jpg`,
  imageAlt: 'Football news image',
  author: 'GoalRush AI',
  publishedAt: new Date(Date.now() - 1000 * 60 * (i * 30 + 20)).toISOString(),
  isBreaking: i === 0 || i === 2,
  views: Math.floor(Math.random() * 200000) + 10000,
  readTime: Math.floor(Math.random() * 6) + 2,
}));

export default function LatestNewsSection() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="gr-section-title">Latest News</h2>
        <Link
          href="/news"
          className="text-brand-red text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all"
        >
          All News <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
              i === 0
                ? 'bg-brand-red text-white'
                : 'bg-brand-card border border-brand-border text-brand-gray hover:text-white hover:border-brand-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured + Grid */}
      <div className="space-y-6">
        {/* Top story full width */}
        <NewsCard article={MOCK_NEWS[0]} variant="hero" />

        {/* News grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOCK_NEWS.slice(1, 7).map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>

        {/* Horizontal list */}
        <div className="gr-card divide-y divide-brand-border">
          {MOCK_NEWS.slice(7).map(article => (
            <NewsCard key={article.id} article={article} variant="horizontal" />
          ))}
        </div>
      </div>
    </div>
  );
}
