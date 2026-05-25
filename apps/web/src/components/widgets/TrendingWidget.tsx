import Link from 'next/link';
import { TrendingUp, Hash } from 'lucide-react';

const TRENDING = [
  { rank: 1, topic: 'El Clasico', posts: '2.4M', category: 'Match' },
  { rank: 2, topic: '#Mbappe', posts: '890K', category: 'Player' },
  { rank: 3, topic: 'Champions League Draw', posts: '654K', category: 'UCL' },
  { rank: 4, topic: 'Bellingham Injury', posts: '412K', category: 'News' },
  { rank: 5, topic: 'Premier League Title Race', posts: '389K', category: 'PL' },
  { rank: 6, topic: '#TransferNews', posts: '274K', category: 'Transfers' },
  { rank: 7, topic: 'World Cup 2026', posts: '198K', category: 'FIFA' },
  { rank: 8, topic: 'Haaland Hat-Trick', posts: '156K', category: 'Goals' },
];

export default function TrendingWidget() {
  return (
    <div className="gr-card">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-brand-border">
        <TrendingUp className="w-4 h-4 text-brand-red" />
        <h3 className="text-white font-semibold text-sm">Trending in Football</h3>
      </div>

      <div className="divide-y divide-brand-border/50">
        {TRENDING.map(item => (
          <Link
            key={item.rank}
            href={`/search?q=${encodeURIComponent(item.topic)}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-brand-card transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="font-display text-brand-red text-lg w-5 leading-none">
                {item.rank}
              </span>
              <div>
                <div className="text-white text-sm font-medium group-hover:text-brand-gold transition-colors flex items-center gap-1">
                  {item.topic.startsWith('#') && <Hash className="w-3 h-3 text-brand-gray" />}
                  {item.topic.replace('#', '')}
                </div>
                <div className="text-brand-gray text-xs">{item.category} · {item.posts} posts</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
