import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Target, TrendingUp } from 'lucide-react';
import { formatMatchDate, getPredictionOutcome, formatPercentage } from '@/lib/utils';
import type { Prediction } from '@/lib/types';

const MOCK_PREDICTIONS: Prediction[] = [
  {
    id: 'p1',
    match: {
      id: 201, status: 'SCHEDULED',
      homeTeam: { id: 33, name: 'Manchester United', shortName: 'MAN UTD', logo: '', country: 'England' },
      awayTeam: { id: 34, name: 'Liverpool', shortName: 'LIV', logo: '', country: 'England' },
      homeScore: null, awayScore: null,
      date: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
      league: { id: 39, name: 'Premier League', shortName: 'PL', logo: '', country: 'England', season: 2025, type: 'League' },
    },
    homeWinPct: 28,
    drawPct: 24,
    awayWinPct: 48,
    predictedScore: { home: 1, away: 2 },
    btts: true,
    over25Goals: true,
    keyFactor: "Liverpool's exceptional away record this season",
    confidence: 73,
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    match: {
      id: 202, status: 'SCHEDULED',
      homeTeam: { id: 541, name: 'Real Madrid', shortName: 'RMA', logo: '', country: 'Spain' },
      awayTeam: { id: 529, name: 'Barcelona', shortName: 'BAR', logo: '', country: 'Spain' },
      homeScore: null, awayScore: null,
      date: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
      league: { id: 140, name: 'La Liga', shortName: 'LL', logo: '', country: 'Spain', season: 2025, type: 'League' },
    },
    homeWinPct: 52,
    drawPct: 22,
    awayWinPct: 26,
    predictedScore: { home: 2, away: 1 },
    btts: true,
    over25Goals: true,
    keyFactor: "Real Madrid's unbeaten home record at Bernabéu this season",
    confidence: 68,
    generatedAt: new Date().toISOString(),
  },
];

interface PredictionCardProps {
  prediction: Prediction;
}

function PredictionCard({ prediction: pred }: PredictionCardProps) {
  const outcome = getPredictionOutcome(pred.homeWinPct, pred.drawPct, pred.awayWinPct);

  return (
    <div className="gr-card p-5">
      {/* Match header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-brand-gold text-xs font-semibold">
          {pred.match.league.shortName}
        </span>
        <span className="text-brand-gray text-xs">
          {formatMatchDate(pred.match.date)}
        </span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="w-12 h-12 bg-brand-dark rounded-full flex items-center justify-center">
            <span className="text-brand-gray text-xs font-bold">{pred.match.homeTeam.shortName}</span>
          </div>
          <span className="text-white text-sm font-semibold text-center">
            {pred.match.homeTeam.shortName}
          </span>
        </div>

        <div className="text-center px-4">
          <div className="font-display text-xl text-white">
            {pred.predictedScore.home} - {pred.predictedScore.away}
          </div>
          <div className="text-brand-gray text-xs mt-1">Predicted</div>
        </div>

        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="w-12 h-12 bg-brand-dark rounded-full flex items-center justify-center">
            <span className="text-brand-gray text-xs font-bold">{pred.match.awayTeam.shortName}</span>
          </div>
          <span className="text-white text-sm font-semibold text-center">
            {pred.match.awayTeam.shortName}
          </span>
        </div>
      </div>

      {/* Win probability bars */}
      <div className="space-y-2 mb-4">
        {[
          { label: pred.match.homeTeam.shortName, pct: pred.homeWinPct, winner: outcome === 'home' },
          { label: 'Draw', pct: pred.drawPct, winner: outcome === 'draw' },
          { label: pred.match.awayTeam.shortName, pct: pred.awayWinPct, winner: outcome === 'away' },
        ].map(({ label, pct, winner }) => (
          <div key={label} className="flex items-center gap-3">
            <span className={`text-xs w-16 flex-shrink-0 ${winner ? 'text-brand-gold font-bold' : 'text-brand-gray'}`}>
              {label}
            </span>
            <div className="flex-1 bg-brand-dark rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${winner ? 'bg-brand-gold' : 'bg-brand-muted'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className={`text-xs w-8 text-right ${winner ? 'text-brand-gold font-bold' : 'text-brand-gray'}`}>
              {formatPercentage(pct)}
            </span>
          </div>
        ))}
      </div>

      {/* Key stats */}
      <div className="flex items-center gap-3 text-xs">
        <span className={`px-2 py-1 rounded ${pred.btts ? 'bg-live/10 text-live' : 'bg-brand-dark text-brand-gray line-through'}`}>
          BTTS
        </span>
        <span className={`px-2 py-1 rounded ${pred.over25Goals ? 'bg-brand-gold/10 text-brand-gold' : 'bg-brand-dark text-brand-gray line-through'}`}>
          Over 2.5
        </span>
        <span className="text-brand-gray flex items-center gap-1 ml-auto">
          <Target className="w-3 h-3" />
          {pred.confidence}% confident
        </span>
      </div>

      {/* Key factor */}
      <p className="text-brand-gray text-xs mt-3 italic border-t border-brand-border pt-3">
        "{pred.keyFactor}"
      </p>
    </div>
  );
}

export default function PredictionsSection() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="gr-section-title">AI Predictions</h2>
        <Link
          href="/predictions"
          className="text-brand-red text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all"
        >
          All Predictions <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="gr-badge-gold text-xs mb-4 inline-flex items-center gap-1.5">
        <TrendingUp className="w-3.5 h-3.5" />
        Powered by GoalRush AI — updated hourly
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MOCK_PREDICTIONS.map(pred => (
          <PredictionCard key={pred.id} prediction={pred} />
        ))}
      </div>
    </div>
  );
}
