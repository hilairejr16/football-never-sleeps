import type { Metadata } from 'next';
import NewsCard from '@/components/cards/NewsCard';
import type { NewsArticle } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Football News',
  description: 'Latest football news, match reports, transfer updates, and analysis from every major league worldwide.',
};

export const revalidate = 60;

const CATEGORIES = [
  { id: 'all',           label: 'All' },
  { id: 'breaking',      label: 'Breaking' },
  { id: 'match-report',  label: 'Match Reports' },
  { id: 'transfer',      label: 'Transfers' },
  { id: 'analysis',      label: 'Analysis' },
  { id: 'preview',       label: 'Previews' },
  { id: 'women',         label: "Women's Football" },
  { id: 'youth',         label: 'Youth Football' },
];

const MOCK_ARTICLES: NewsArticle[] = Array.from({ length: 18 }, (_, i) => ({
  id: String(i + 1),
  title: [
    'BREAKING: Mbappe Signs New Deal as Real Madrid Dominate Transfer Market',
    'Champions League Draw: The Ties That Will Define European Football',
    'Tactical Analysis: How Arsenal Are Building a Championship-Winning System',
    'Transfer Rumour: Premier League Giants Circle Serie A Sensation',
    'Match Report: Liverpool Destroy City in Title Six-Pointer',
    'The Rise of African Football: Why the Continent Is Producing World-Class Talent',
    "Women's Champions League: Barcelona's Dynasty and Who Can Stop Them",
    "Haaland vs Darwin: Who's the Better Striker for 2025-26 Season?",
    'World Cup 2026: Every Nation\'s Chances Ranked by AI Prediction Model',
    'The 10 Most Expensive Transfers in Football History — Updated',
    'From Haiti to the World: The Football Journey of Haitian Talent Abroad',
    'Bundesliga Preview: Can Anyone Stop Leverkusen This Season?',
    'Premier League VAR Controversy: Fans React to Latest Scandal',
    'Ronaldo at Al Nassr: Was It the Right Call? Two Years On',
    'MLS Growing Pains: How the League Is Building for the 2026 World Cup',
    'The Psychology of Penalty Kicks: Why Some Players Always Score',
    'Serie A Resurgence: Why Italian Football Is Back on the World Stage',
    'Copa América: South American Superpowers Meet in Historic Final',
  ][i % 18],
  slug: `article-${i + 1}`,
  excerpt: 'Comprehensive coverage from GoalRush Global — the AI-powered football media platform delivering the news that matters, when it matters.',
  content: '',
  category: ['breaking', 'analysis', 'analysis', 'transfer', 'match-report', 'analysis', 'women', 'analysis', 'analysis', 'stats', 'analysis', 'analysis', 'breaking', 'analysis', 'analysis', 'analysis', 'analysis', 'match-report'][i % 18] as NewsArticle['category'],
  tags: ['Football', 'News', 'GoalRush'],
  imageUrl: `/news/article-${(i % 6) + 1}.jpg`,
  imageAlt: 'Football news',
  author: 'GoalRush AI',
  publishedAt: new Date(Date.now() - 1000 * 60 * (i * 47 + 5)).toISOString(),
  isBreaking: i === 0 || i === 12,
  views: Math.floor(Math.random() * 300000) + 5000,
  readTime: Math.floor(Math.random() * 7) + 2,
}));

export default function NewsPage() {
  const featured = MOCK_ARTICLES[0];
  const rest = MOCK_ARTICLES.slice(1);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-wider text-white mb-2">FOOTBALL NEWS</h1>
        <p className="text-brand-gray">AI-powered coverage from every major league, 24/7</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.id}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
              i === 0
                ? 'bg-brand-red text-white'
                : 'bg-brand-card border border-brand-border text-brand-gray hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Hero article */}
      <div className="mb-8">
        <NewsCard article={featured} variant="hero" className="max-h-[500px]" />
      </div>

      {/* News grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {rest.map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-10">
        <button className="gr-btn-primary px-10">Load More Stories</button>
      </div>
    </div>
  );
}
