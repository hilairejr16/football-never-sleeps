'use client';

import { useState, useEffect } from 'react';
import { Target, TrendingUp, Trophy, RefreshCw, Zap } from 'lucide-react';
import type { Prediction } from '@/lib/types';
import { getPredictionOutcome, formatPercentage } from '@/lib/utils';

const BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

const WC_QF_PREDICTIONS: Prediction[] = [
  {
    id: 'qf1', match: { id: 3001, status: 'SCHEDULED',
      homeTeam: { id: 10, name: 'France',  shortName: 'FRA', logo: '', country: 'France' },
      awayTeam: { id: 11, name: 'Morocco', shortName: 'MAR', logo: '', country: 'Morocco' },
      homeScore: null, awayScore: null, date: new Date('2026-07-09T20:00:00Z').toISOString(),
      league: { id: 1, name: 'FIFA World Cup', shortName: 'WC', logo: '', country: 'World', season: 2026, type: 'Cup' } },
    homeWinPct: 55, drawPct: 23, awayWinPct: 22,
    predictedScore: { home: 2, away: 0 }, btts: false, over25Goals: false,
    keyFactor: "Mbappé vs Morocco's ironclad defence — can the Atlas Lions shut him down like they did Ronaldo in 2022?",
    confidence: 68, generatedAt: new Date().toISOString(),
  },
  {
    id: 'qf2', match: { id: 3002, status: 'SCHEDULED',
      homeTeam: { id: 12, name: 'Spain',   shortName: 'ESP', logo: '', country: 'Spain' },
      awayTeam: { id: 13, name: 'Belgium', shortName: 'BEL', logo: '', country: 'Belgium' },
      homeScore: null, awayScore: null, date: new Date('2026-07-10T19:00:00Z').toISOString(),
      league: { id: 1, name: 'FIFA World Cup', shortName: 'WC', logo: '', country: 'World', season: 2026, type: 'Cup' } },
    homeWinPct: 48, drawPct: 25, awayWinPct: 27,
    predictedScore: { home: 2, away: 1 }, btts: true, over25Goals: true,
    keyFactor: "Yamal vs De Bruyne — the two creators who will decide whether this is a masterclass or a war of attrition",
    confidence: 65, generatedAt: new Date().toISOString(),
  },
  {
    id: 'qf3', match: { id: 3003, status: 'SCHEDULED',
      homeTeam: { id: 14, name: 'Norway',  shortName: 'NOR', logo: '', country: 'Norway' },
      awayTeam: { id: 15, name: 'England', shortName: 'ENG', logo: '', country: 'England' },
      homeScore: null, awayScore: null, date: new Date('2026-07-11T21:00:00Z').toISOString(),
      league: { id: 1, name: 'FIFA World Cup', shortName: 'WC', logo: '', country: 'World', season: 2026, type: 'Cup' } },
    homeWinPct: 52, drawPct: 26, awayWinPct: 37,
    predictedScore: { home: 1, away: 2 }, btts: true, over25Goals: true,
    keyFactor: "Haaland just eliminated Brazil — England's defence has never faced anything like this. Set pieces could be decisive",
    confidence: 61, generatedAt: new Date().toISOString(),
  },
  {
    id: 'qf4', match: { id: 3004, status: 'SCHEDULED',
      homeTeam: { id: 16, name: 'Argentina',   shortName: 'ARG', logo: '', country: 'Argentina' },
      awayTeam: { id: 17, name: 'Switzerland', shortName: 'SUI', logo: '', country: 'Switzerland' },
      homeScore: null, awayScore: null, date: new Date('2026-07-12T01:00:00Z').toISOString(),
      league: { id: 1, name: 'FIFA World Cup', shortName: 'WC', logo: '', country: 'World', season: 2026, type: 'Cup' } },
    homeWinPct: 58, drawPct: 22, awayWinPct: 20,
    predictedScore: { home: 2, away: 0 }, btts: false, over25Goals: false,
    keyFactor: "Messi against a team with nothing to lose — Switzerland survived penalties against Colombia and believe in miracles",
    confidence: 72, generatedAt: new Date().toISOString(),
  },
];

function PredCard({ p }: { p: Prediction }) {
  const out = getPredictionOutcome(p.homeWinPct, p.drawPct, p.awayWinPct);
  return (
    <div className="gr-card p-6 border border-yellow-500/10">
      <div className="flex items-center justify-between mb-4">
        <span className="text-yellow-400 text-xs font-bold flex items-center gap-1"><Trophy className="w-3 h-3"/>World Cup QF</span>
        <span className="text-brand-gray text-xs">{new Date(p.match.date).toLocaleDateString('en',{weekday:'short',month:'short',day:'numeric'})} · {new Date(p.match.date).toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'})} UTC</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-center flex-1"><div className="text-white font-bold">{p.match.homeTeam.name}</div></div>
        <div className="px-6 text-center">
          <div className="font-display text-2xl text-white">{p.predictedScore.home} – {p.predictedScore.away}</div>
          <div className="text-brand-gray text-xs mt-1">AI Predicted</div>
        </div>
        <div className="text-center flex-1"><div className="text-white font-bold">{p.match.awayTeam.name}</div></div>
      </div>
      {[{label:p.match.homeTeam.shortName,pct:p.homeWinPct,w:out==='home'},{label:'Draw',pct:p.drawPct,w:out==='draw'},{label:p.match.awayTeam.shortName,pct:p.awayWinPct,w:out==='away'}].map(({label,pct,w})=>(
        <div key={label} className="flex items-center gap-3 mb-2">
          <span className={`text-xs w-12 flex-shrink-0 ${w?'text-yellow-400 font-bold':'text-brand-gray'}`}>{label}</span>
          <div className="flex-1 bg-brand-dark rounded-full h-2"><div className={`h-full rounded-full ${w?'bg-yellow-500':'bg-brand-muted'}`} style={{width:`${pct}%`}}/></div>
          <span className={`text-xs w-8 text-right ${w?'text-yellow-400 font-bold':'text-brand-gray'}`}>{formatPercentage(pct)}</span>
        </div>
      ))}
      <div className="flex items-center gap-2 mt-4 text-xs">
        <span className={`px-2 py-1 rounded ${p.btts?'bg-live/10 text-live':'bg-brand-dark text-brand-gray line-through'}`}>BTTS</span>
        <span className={`px-2 py-1 rounded ${p.over25Goals?'bg-brand-gold/10 text-brand-gold':'bg-brand-dark text-brand-gray line-through'}`}>O/2.5</span>
        <span className="text-brand-gray ml-auto flex items-center gap-1"><Target className="w-3 h-3"/>{p.confidence}% confidence</span>
      </div>
      <p className="text-brand-gray text-xs italic mt-4 border-t border-brand-border pt-3">"{p.keyFactor}"</p>
    </div>
  );
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>(WC_QF_PREDICTIONS);
  const [loading, setLoading]         = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/predictions/today`);
      if (res.ok) { const { data } = await res.json(); if (data?.length) setPredictions(data); }
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display tracking-wider text-white flex items-center gap-3 mb-2">
            <Zap className="w-7 h-7 text-brand-gold"/>AI PREDICTIONS
          </h1>
          <p className="text-brand-gray text-sm">World Cup 2026 Quarter-Final predictions · Powered by Claude AI</p>
        </div>
        <button onClick={refresh} className={`gr-btn-ghost flex items-center gap-2 ${loading?'opacity-60':''}`} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading?'animate-spin':''}`}/>Refresh
        </button>
      </div>

      {/* Accuracy strip */}
      <div className="gr-card p-5 mb-8 bg-gradient-to-r from-brand-card to-brand-dark">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-brand-gold"/>
            <div><div className="text-white font-semibold text-sm">GoalRush AI</div><div className="text-brand-gray text-xs">World Cup 2026 · Tournament Predictions</div></div>
          </div>
          {[{l:'WC Predictions',v:'47'},{l:'Accuracy Rate',v:'71%'},{l:'Correct Scores',v:'12'},{l:'Value Bets',v:'89%'}].map(s=>(
            <div key={s.l} className="text-center">
              <div className="font-display text-2xl text-brand-gold">{s.v}</div>
              <div className="text-brand-gray text-xs">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's predictions */}
      <h2 className="gr-section-title mb-6">Quarter-Final Predictions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {predictions.map(p => <PredCard key={p.id} p={p}/>)}
      </div>

      {/* AI disclaimer */}
      <div className="gr-card p-5 bg-brand-dark/50 text-center">
        <p className="text-brand-gray text-sm">
          Predictions generated by Claude AI based on team statistics, form, and tactical analysis.<br/>
          <span className="text-brand-muted text-xs">For entertainment only. Please gamble responsibly.</span>
        </p>
      </div>
    </div>
  );
}
