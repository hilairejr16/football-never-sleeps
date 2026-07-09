'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Youtube, X } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

interface Highlight {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  publishedAt: string;
}

function formatAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function VideoHighlightsSection() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE}/world-cup/highlights`)
      .then(r => r.json())
      .then(({ data }) => { if (Array.isArray(data)) setHighlights(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const close = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeId, close]);

  if (!loading && highlights.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Youtube className="w-5 h-5 text-brand-red" />
          <h2 className="gr-section-title text-xl">WC 2026 Highlights</h2>
        </div>
        <a
          href="https://www.youtube.com/@FIFAWorldCup"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-red text-xs font-semibold hover:text-brand-red-hover transition-colors"
        >
          FIFA Channel →
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="gr-card aspect-video animate-pulse bg-brand-card rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {highlights.slice(0, 9).map(v => (
            <button
              key={v.id}
              onClick={() => setActiveId(v.id)}
              className="group gr-card overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
            >
              <div className="relative aspect-video bg-brand-card overflow-hidden">
                {v.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-brand-red flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-white text-xs font-semibold leading-snug line-clamp-2 group-hover:text-brand-red transition-colors">
                  {v.title}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-brand-gray text-[10px] truncate">{v.channelName}</p>
                  <p className="text-brand-gray text-[10px] flex-shrink-0 ml-2">{formatAgo(v.publishedAt)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {activeId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={close}
              className="absolute -top-10 right-0 flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-semibold transition-colors"
              aria-label="Close video"
            >
              <X className="w-4 h-4" /> Close
            </button>
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeId}?autoplay=1&rel=0&modestbranding=1`}
                title="World Cup Highlight"
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
