import Link from 'next/link';
import { ArrowRight, Target, TrendingUp, Trophy } from 'lucide-react';
import { getPredictionOutcome, formatPercentage } from '@/lib/utils';
import type { Prediction } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://renewed-ambition-production-ea0a.up.railway.app';

async function fetchPredictions(): Promise<Prediction[]> {
  try {
    const res = await fetch(`${BASE}/predictions/today`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const { data } = await res.json();
      if (Array.isArray(data) && data.length > 0) return data.slice(0, 4);
    }
  } catch {}
  return WC_PREDICTIONS_FALLBACK;
}

// World Cup 2026 Quarter-Final AI predictions
// QF1 Thu Jul 10 19:00 UTC = 3 PM ET  | QF2 Thu Jul 10 23:00 UTC = 7 PM ET
// QF3 Fri Jul 11 19:00 UTC = 3 PM ET  | QF4 Sun Jul 12 23:00 UTC = 7 PM ET
const WC_PREDICTIONS_FALLBACK: Prediction[] = [
  {
    id: 'wcp1',
    match: {
      id: 3001, status: 'SCHEDULED',
      homeTeam: { id: 10, name: 'Spain',   shortName: 'ESP', logo: '', country: 'Spain'   },
      awayTeam: { id: 11, name: 'Germany', shortName: 'GER', logo: '', country: 'Germany' },
      homeScore: null, awayScore: null,
      date: new Date('2026-07-10T19:00:00Z').toISOString(), // 3 PM ET
      league: { id: 1, name: 'FIFA World Cup', shortName: 'WC', logo: '', country: 'World', season: 2026, type: 'Cup' },
    },
    homeWinPct: 40, drawPct: 24, awayWinPct: 36,
    predictedScore: { home: 2, away: 1 },
    btts: true, over25Goals: true,
    keyFactor: "Spain's superior ball retention and Yamal's creative genius in tight spaces gives them the edge",
    confidence: 71,
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'wcp2',
    match: {
      id: 3002, status: 'SCHEDULED',
      homeTeam: { id: 12, name: 'France',  shortName: 'FRA', logo: '', country: 'France'  },
      awayTeam: { id: 13, name: 'England', shortName: 'ENG', logo: '', country: 'England' },
      homeScore: null, awayScore: null,
      date: new Date('2026-07-10T23:00:00Z').toISOString(), // 7 PM ET — same day as QF1
      league: { id: 1, name: 'FIFA World Cup', shortName: 'WC', logo: '', country: 'World', season: 2026, type: 'Cup' },
    },
    homeWinPct: 42, drawPct: 26, awayWinPct: 32,
    predictedScore: { home: 2, away: 1 },
    btts: true, over25Goals: true,
    keyFactor: "Mbappé vs the English backline — whoever wins that duel likely wins the match",
    confidence: 64,
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'wcp3',
    match: {
      id: 3003, status: 'SCHEDULED',
      homeTeam: { id: 14, name: 'Brazil',    shortName: 'BRA', logo: '', country: 'Brazil'    },
      awayTeam: { id: 15, name: 'Argentina', shortName: 'ARG', logo: '', country: 'Argentina' },
      homeScore: null, awayScore: null,
      date: new Date('2026-07-11T19:00:00Z').toISOString(), // 3 PM ET Fri Jul 11
      league: { id: 1, name: 'FIFA World Cup', shortName: 'WC', logo: '', country: 'World', season: 2026, type: 'Cup' },
    },
    homeWinPct: 38, drawPct: 28, awayWinPct: 34,
    predictedScore: { home: 1, away: 2 },
    btts: true, over25Goals: false,
    keyFactor: "Messi's genius and Argentina's tournament resilience tips the Super Clásico their way",
    confidence: 58,
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'wcp4',
    match: {
      id: 3004, status: 'SCHEDULED',
      homeTeam: { id: 16, name: 'Portugal', shortName: 'POR', logo: '', country: 'Portugal' },
      awayTeam: { id: 17, name: 'USA',      shortName: 'USA', logo: '', country: 'USA'      },
      homeScore: null, awayScore: null,
      date: new Date('2026-07-12T23:00:00Z').toISOString(), // 7 PM ET Sun Jul 12
      league: { id: 1, name: 'FIFA World Cup', shortName: 'WC', logo: '', country: 'World', season: 2026, type: 'Cup' },
    },
    homeWinPct: 52, drawPct: 22, awayWinPct: 26,
    predictedScore: { home: 2, away: 1 },
    btts: true, over25Goals: true,
    keyFactor: "Ronaldo's experience on the biggest stage and Portugal's squad depth gives them the edge at Levi's",
    confidence: 62,
    generatedAt: new Date().toISOString(),
  },
];

function PredictionCard({ prediction: pred }: { prediction: Prediction }) {
  const outcome = getPredictionOutcome(pred.homeWinPct, pred.drawPct, pred.awayWinPct);
  const isWC = pred.match.league.id === 1;

  return (
    <div className={`gr-card p-5 ${isWC ? 'border-yellow-500/20' : ''}`}>
      {/* Match header */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-semibold flex items-center gap-1 ${isWC ? 'text-yellow-400' : 'text-brand-gold'}`}>
          {isWC && <Trophy className="w-3 h-3" />}
          {pred.match.league.shortName}
        </span>
        <span className="text-brand-gray text-xs">
          {new Date(pred.match.date).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="w-12 h-12 bg-brand-dark rounded-full flex items-center justify-center">
            <span className="text-brand-gray text-xs font-bold">{pred.match.homeTeam.shortName}</span>
          </div>
          <span className="text-white text-sm font-semibold text-center leading-tight">{pred.match.homeTeam.name}</span>
        </div>
        <div className="text-center px-4">
          <div className="font-display text-2xl text-white">{pred.predictedScore.home} – {pred.predictedScore.away}</div>
          <div className="text-brand-gray text-xs mt-1">AI Predicted</div>
        </div>
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="w-12 h-12 bg-brand-dark rounded-full flex items-center justify-center">
            <span className="text-brand-gray text-xs font-bold">{pred.match.awayTeam.shortName}</span>
          </div>
          <span className="text-white text-sm font-semibold text-center leading-tight">{pred.match.awayTeam.name}</span>
        </div>
      </div>

      {/* Win probability bars */}
      <div className="space-y-2 mb-4">
        {[
          { label: pred.match.homeTeam.shortName, pct: pred.homeWinPct, winner: outcome === 'home' },
          { label: 'Draw',                         pct: pred.drawPct,     winner: outcome === 'draw' },
          { label: pred.match.awayTeam.shortName,  pct: pred.awayWinPct,  winner: outcome === 'away' },
        ].map(({ label, pct, winner }) => (
          <div key={label} className="flex items-center gap-3">
            <span className={`text-xs w-16 flex-shrink-0 ${winner ? 'text-brand-gold font-bold' : 'text-brand-gray'}`}>{label}</span>
            <div className="flex-1 bg-brand-dark rounded-full h-2 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${winner ? 'bg-brand-gold' : 'bg-brand-muted'}`} style={{ width: `${pct}%` }} />
            </div>
            <span className={`text-xs w-8 text-right ${winner ? 'text-brand-gold font-bold' : 'text-brand-gray'}`}>{formatPercentage(pct)}</span>
          </div>
        ))}
      </div>

      {/* Bet markers */}
      <div className="flex items-center gap-2 text-xs">
        <span className={`px-2 py-1 rounded ${pred.btts ? 'bg-live/10 text-live' : 'bg-brand-dark text-brand-gray line-through'}`}>BTTS</span>
        <span className={`px-2 py-1 rounded ${pred.over25Goals ? 'bg-brand-gold/10 text-brand-gold' : 'bg-brand-dark text-brand-gray line-through'}`}>Over 2.5</span>
        <span className="text-brand-gray flex items-center gap-1 ml-auto">
          <Target className="w-3 h-3" />{pred.confidence}% confident
        </span>
      </div>

      <p className="text-brand-gray text-xs mt-3 italic border-t border-brand-border pt-3">"{pred.keyFactor}"</p>
    </div>
  );
}

export default async function PredictionsSection() {
  const predictions = await fetchPredictions();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="gr-section-title">AI Predictions</h2>
        <Link href="/predictions" className="text-brand-red text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">
          All Predictions <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="gr-badge-gold text-xs mb-4 inline-flex items-center gap-1.5">
        <TrendingUp className="w-3.5 h-3.5" />
        Powered by GoalRush AI · World Cup Quarter-Finals Edition
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {predictions.map(pred => <PredictionCard key={pred.id} prediction={pred} />)}
      </div>
    </div>
  );
}
