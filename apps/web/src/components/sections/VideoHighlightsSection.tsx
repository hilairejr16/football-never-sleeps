'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Youtube, X, ExternalLink } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

interface Highlight {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  publishedAt: string;
  ytSearchQuery?: string;
  matchLabel?: string;
  gradientFrom?: string;
  gradientTo?: string;
  homeFlag?: string;
  awayFlag?: string;
  score?: string;
  isLive?: boolean;
}

function formatAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// Curated WC 2026 highlights — shown when YouTube API key not configured
const WC_HIGHLIGHTS_FALLBACK: Highlight[] = [
  {
    id: 'qf1',
    title: 'France vs Morocco — Quarter-Final | World Cup 2026',
    thumbnail: '',
    channelName: 'Fox Sports Soccer',
    publishedAt: new Date('2026-07-09T20:00:00Z').toISOString(),
    ytSearchQuery: 'France Morocco World Cup 2026 quarter final highlights Fox Sports',
    matchLabel: 'LIVE TODAY',
    gradientFrom: '#002395',
    gradientTo: '#C1272D',
    homeFlag: '🇫🇷',
    awayFlag: '🇲🇦',
    isLive: true,
  },
  {
    id: 'qf2',
    title: 'Spain vs Belgium — Quarter-Final | World Cup 2026',
    thumbnail: '',
    channelName: 'ESPN FC',
    publishedAt: new Date('2026-07-10T19:00:00Z').toISOString(),
    ytSearchQuery: 'Spain Belgium World Cup 2026 quarter final highlights',
    matchLabel: 'Thu Jul 10 · 3 PM ET',
    gradientFrom: '#AA151B',
    gradientTo: '#1a1a2e',
    homeFlag: '🇪🇸',
    awayFlag: '🇧🇪',
  },
  {
    id: 'qf3',
    title: 'Norway vs England — Quarter-Final | World Cup 2026',
    thumbnail: '',
    channelName: 'Fox Sports Soccer',
    publishedAt: new Date('2026-07-11T21:00:00Z').toISOString(),
    ytSearchQuery: 'Norway England World Cup 2026 quarter final Haaland highlights',
    matchLabel: 'Fri Jul 11 · 5 PM ET',
    gradientFrom: '#EF2B2D',
    gradientTo: '#003087',
    homeFlag: '🇳🇴',
    awayFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  },
  {
    id: 'qf4',
    title: 'Argentina vs Switzerland — Quarter-Final | World Cup 2026',
    thumbnail: '',
    channelName: 'FIFA World Cup',
    publishedAt: new Date('2026-07-12T01:00:00Z').toISOString(),
    ytSearchQuery: 'Argentina Switzerland World Cup 2026 quarter final Messi highlights',
    matchLabel: 'Fri Jul 11 · 9 PM ET',
    gradientFrom: '#74ACDF',
    gradientTo: '#FF0000',
    homeFlag: '🇦🇷',
    awayFlag: '🇨🇭',
  },
  {
    id: 'r16-nor-bra',
    title: 'Norway 2–0 Brazil — R16 | The Biggest Shock of WC 2026',
    thumbnail: '',
    channelName: 'Fox Sports Soccer',
    publishedAt: new Date('2026-07-05T19:00:00Z').toISOString(),
    ytSearchQuery: 'Norway Brazil 2-0 World Cup 2026 round of 16 Haaland highlights',
    matchLabel: 'R16 Result',
    gradientFrom: '#EF2B2D',
    gradientTo: '#009c3b',
    homeFlag: '🇳🇴',
    awayFlag: '🇧🇷',
    score: '2 – 0',
  },
  {
    id: 'r16-bel-usa',
    title: 'Belgium 4–1 USA — R16 | De Bruyne Dismantles the Hosts',
    thumbnail: '',
    channelName: 'ESPN FC',
    publishedAt: new Date('2026-07-06T23:00:00Z').toISOString(),
    ytSearchQuery: 'Belgium USA 4-1 World Cup 2026 round of 16 De Bruyne highlights',
    matchLabel: 'R16 Result',
    gradientFrom: '#EF3340',
    gradientTo: '#003478',
    homeFlag: '🇧🇪',
    awayFlag: '🇺🇸',
    score: '4 – 1',
  },
  {
    id: 'r16-mar-can',
    title: 'Morocco 3–0 Canada — R16 | Atlas Lions Roar in Dallas',
    thumbnail: '',
    channelName: 'FIFA World Cup',
    publishedAt: new Date('2026-07-04T19:00:00Z').toISOString(),
    ytSearchQuery: 'Morocco Canada 3-0 World Cup 2026 round of 16 highlights',
    matchLabel: 'R16 Result',
    gradientFrom: '#C1272D',
    gradientTo: '#006233',
    homeFlag: '🇲🇦',
    awayFlag: '🇨🇦',
    score: '3 – 0',
  },
  {
    id: 'r16-eng-mex',
    title: 'England 3–2 Mexico — R16 | Kane Seals Dramatic Win',
    thumbnail: '',
    channelName: 'Fox Sports Soccer',
    publishedAt: new Date('2026-07-05T23:00:00Z').toISOString(),
    ytSearchQuery: 'England Mexico 3-2 World Cup 2026 round of 16 Kane highlights',
    matchLabel: 'R16 Result',
    gradientFrom: '#CF142B',
    gradientTo: '#006847',
    homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    awayFlag: '🇲🇽',
    score: '3 – 2',
  },
  {
    id: 'r16-arg-egy',
    title: 'Argentina 3–2 Egypt — R16 | Messi Delivers Again',
    thumbnail: '',
    channelName: 'ESPN FC',
    publishedAt: new Date('2026-07-07T19:00:00Z').toISOString(),
    ytSearchQuery: 'Argentina Egypt 3-2 World Cup 2026 round of 16 Messi highlights',
    matchLabel: 'R16 Result',
    gradientFrom: '#74ACDF',
    gradientTo: '#CE1126',
    homeFlag: '🇦🇷',
    awayFlag: '🇪🇬',
    score: '3 – 2',
  },
];

const CHANNELS = [
  { label: 'GoalRush Global',  url: 'https://www.youtube.com/@GoalRushGlobal00', color: 'text-brand-gold' },
  { label: 'Fox Sports Soccer', url: 'https://www.youtube.com/@FOXSports',       color: 'text-blue-400' },
  { label: 'ESPN FC',           url: 'https://www.youtube.com/@ESPN',             color: 'text-red-400' },
  { label: 'FIFA World Cup',    url: 'https://www.youtube.com/@FIFAWorldCup',     color: 'text-yellow-400' },
];

function GradientThumbnail({ h }: { h: Highlight }) {
  const bg = h.gradientFrom && h.gradientTo
    ? { background: `linear-gradient(135deg, ${h.gradientFrom} 0%, ${h.gradientTo} 100%)` }
    : { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' };

  return (
    <div className="relative aspect-video overflow-hidden" style={bg}>
      {/* Team flags */}
      <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-30">
        <span className="text-6xl">{h.homeFlag}</span>
        <span className="text-6xl">{h.awayFlag}</span>
      </div>

      {/* Score overlay for finished matches */}
      {h.score && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-3xl text-white font-bold drop-shadow-lg">{h.score}</span>
        </div>
      )}

      {/* Hover play button */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
        {!h.score && (
          <div className="w-12 h-12 rounded-full bg-brand-red/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        )}
        {h.score && (
          <div className="w-12 h-12 rounded-full bg-brand-red/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mt-8">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        )}
      </div>

      {/* LIVE badge */}
      {h.isLive && (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          LIVE TODAY
        </div>
      )}

      {/* Channel badge */}
      <div className="absolute top-2 right-2 bg-black/70 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
        {h.channelName}
      </div>
    </div>
  );
}

function HighlightCard({ h, onPlay }: { h: Highlight; onPlay: (h: Highlight) => void }) {
  return (
    <button
      onClick={() => onPlay(h)}
      className="group gr-card overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red w-full"
    >
      {h.thumbnail ? (
        <div className="relative aspect-video bg-brand-card overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={h.thumbnail} alt={h.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-brand-red flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>
          {h.isLive && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE TODAY
            </div>
          )}
        </div>
      ) : (
        <GradientThumbnail h={h} />
      )}
      <div className="p-3">
        <p className="text-white text-xs font-semibold leading-snug line-clamp-2 group-hover:text-brand-red transition-colors">
          {h.title}
        </p>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-brand-muted text-[10px] truncate">{h.matchLabel ?? h.channelName}</p>
          <p className="text-brand-gray text-[10px] flex-shrink-0 ml-2">{formatAgo(h.publishedAt)}</p>
        </div>
      </div>
    </button>
  );
}

export default function VideoHighlightsSection() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading]       = useState(true);
  const [active, setActive]         = useState<Highlight | null>(null);

  useEffect(() => {
    fetch(`${BASE}/world-cup/highlights`)
      .then(r => r.json())
      .then(({ data }) => { if (Array.isArray(data) && data.length > 0) setHighlights(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [active, close]);

  const handlePlay = useCallback((h: Highlight) => {
    if (h.ytSearchQuery) {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(h.ytSearchQuery)}`, '_blank', 'noopener,noreferrer');
    } else {
      setActive(h);
    }
  }, []);

  // Use API data if available, else curated fallback
  const items = highlights.length > 0 ? highlights : WC_HIGHLIGHTS_FALLBACK;
  const isCurated = highlights.length === 0;

  return (
    <section>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <Youtube className="w-5 h-5 text-brand-red" />
          <h2 className="gr-section-title text-xl">WC 2026 Highlights</h2>
          {!loading && isCurated && (
            <span className="text-brand-muted text-[10px] border border-brand-border rounded px-1.5 py-0.5">
              Click to watch on YouTube
            </span>
          )}
        </div>

        {/* Official channel links */}
        <div className="flex items-center gap-3 flex-wrap">
          {CHANNELS.map(ch => (
            <a
              key={ch.label}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 text-[11px] font-semibold hover:opacity-80 transition-opacity ${ch.color}`}
            >
              {ch.label} <ExternalLink className="w-2.5 h-2.5" />
            </a>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="gr-card aspect-video animate-pulse bg-brand-card rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {/* Featured highlight (first item) */}
          <div className="mb-4">
            <button
              onClick={() => handlePlay(items[0])}
              className="group w-full gr-card overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
            >
              <div className="relative" style={{ paddingBottom: '42%' }}>
                {items[0].thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={items[0].thumbnail} alt={items[0].title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      background: items[0].gradientFrom && items[0].gradientTo
                        ? `linear-gradient(135deg, ${items[0].gradientFrom} 0%, ${items[0].gradientTo} 100%)`
                        : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    }}
                  >
                    <div className="flex items-center gap-6 opacity-20">
                      <span className="text-8xl">{items[0].homeFlag}</span>
                      <span className="text-8xl">{items[0].awayFlag}</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-all" />

                {/* Center play */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-brand-red/90 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </div>
                </div>

                {items[0].isLive && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    LIVE TODAY
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-1">
                    {items[0].channelName} · {items[0].matchLabel}
                  </div>
                  <h3 className="text-white font-bold text-lg sm:text-xl leading-snug group-hover:text-brand-gold transition-colors">
                    {items[0].title}
                  </h3>
                  {isCurated && (
                    <div className="flex items-center gap-1.5 mt-2 text-brand-gray text-xs">
                      <ExternalLink className="w-3 h-3" />
                      Watch highlights on YouTube
                    </div>
                  )}
                </div>
              </div>
            </button>
          </div>

          {/* Highlights grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {items.slice(1, 9).map(v => (
              <HighlightCard key={v.id} h={v} onPlay={handlePlay} />
            ))}
          </div>
        </>
      )}

      {/* YouTube embed lightbox (only for real API video IDs) */}
      {active && !active.ytSearchQuery && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-5xl" onClick={e => e.stopPropagation()}>
            <button
              onClick={close}
              className="absolute -top-10 right-0 flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-semibold transition-colors"
            >
              <X className="w-4 h-4" /> Close
            </button>
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0&modestbranding=1`}
                title={active.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
