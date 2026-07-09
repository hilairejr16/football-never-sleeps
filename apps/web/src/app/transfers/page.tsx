import type { Metadata } from 'next';
import { Clock, TrendingUp } from 'lucide-react';
import TransferCard from '@/components/cards/TransferCard';
import type { Transfer } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Transfer News & Rumours — Summer 2026',
  description: 'Summer 2026 transfer window: confirmed deals, World Cup-driven rumours, and breaking transfer news.',
  alternates: { canonical: '/transfers' },
};

export const revalidate = 120;

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://renewed-ambition-production-ea0a.up.railway.app';

const STATUS_TABS = ['All', 'Confirmed', 'Rumours', 'Completed'];

const SUMMER_2026_TRANSFERS: Transfer[] = [
  {
    id: 't1',
    player: { id: 1, name: 'Victor Osimhen', firstName: 'Victor', lastName: 'Osimhen', nationality: 'Nigeria', position: 'Forward', age: 27, photo: '', teamId: 492 },
    fromTeam: { id: 492, name: 'Napoli',    shortName: 'NAP', logo: '', country: 'Italy' },
    toTeam:   { id: 40,  name: 'Liverpool', shortName: 'LIV', logo: '', country: 'England' },
    fee: 85_000_000, status: 'confirmed', confidence: 91, source: 'Fabrizio Romano',
    date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 't2',
    player: { id: 2, name: 'Lamine Yamal', firstName: 'Lamine', lastName: 'Yamal', nationality: 'Spain', position: 'Forward', age: 18, photo: '', teamId: 529 },
    fromTeam: { id: 529, name: 'Barcelona', shortName: 'BAR', logo: '', country: 'Spain' },
    toTeam:   { id: 529, name: 'Barcelona', shortName: 'BAR', logo: '', country: 'Spain' },
    status: 'confirmed', confidence: 100, source: 'Marca',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), contractYears: 6,
  },
  {
    id: 't3',
    player: { id: 3, name: 'Florian Wirtz', firstName: 'Florian', lastName: 'Wirtz', nationality: 'Germany', position: 'Midfielder', age: 23, photo: '', teamId: 157 },
    fromTeam: { id: 157, name: 'Bayern Munich', shortName: 'BAY', logo: '', country: 'Germany' },
    toTeam:   { id: 541, name: 'Real Madrid',   shortName: 'RMA', logo: '', country: 'Spain' },
    fee: 130_000_000, status: 'rumour', confidence: 62, source: 'Kicker / Marca',
    date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 't4',
    player: { id: 4, name: 'Gavi', firstName: 'Pablo', lastName: 'Gavi', nationality: 'Spain', position: 'Midfielder', age: 22, photo: '', teamId: 529 },
    fromTeam: { id: 529, name: 'Barcelona',       shortName: 'BAR', logo: '', country: 'Spain' },
    toTeam:   { id: 50,  name: 'Manchester City', shortName: 'MCI', logo: '', country: 'England' },
    fee: 90_000_000, status: 'rumour', confidence: 48, source: 'Sport / El Mundo',
    date: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  },
  {
    id: 't5',
    player: { id: 5, name: 'Gio Reyna', firstName: 'Giovanni', lastName: 'Reyna', nationality: 'USA', position: 'Midfielder', age: 23, photo: '', teamId: 165 },
    fromTeam: { id: 165, name: 'Dortmund',       shortName: 'BVB', logo: '', country: 'Germany' },
    toTeam:   { id: 33,  name: 'Man United',     shortName: 'MUN', logo: '', country: 'England' },
    fee: 55_000_000, status: 'rumour', confidence: 55, source: 'Sky Sports',
    date: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
  {
    id: 't6',
    player: { id: 6, name: 'Jamal Musiala', firstName: 'Jamal', lastName: 'Musiala', nationality: 'Germany', position: 'Midfielder', age: 22, photo: '', teamId: 157 },
    fromTeam: { id: 157, name: 'Bayern Munich', shortName: 'BAY', logo: '', country: 'Germany' },
    toTeam:   { id: 157, name: 'Bayern Munich', shortName: 'BAY', logo: '', country: 'Germany' },
    status: 'confirmed', confidence: 100, source: 'Bild',
    date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), contractYears: 5,
  },
];

const TRANSFER_STATS = [
  { label: 'Confirmed Deals', value: '23', color: 'text-live' },
  { label: 'Hot Rumours', value: '87', color: 'text-brand-red' },
  { label: 'Window Opens', value: 'Jul 21', color: 'text-brand-gold' },
  { label: 'Projected Spend', value: '€4.2B', color: 'text-white' },
];

const WC_WATCH_LIST = [
  { name: 'Lamine Yamal',    team: 'Spain',   flag: '🇪🇸', interest: 'Real Madrid, Chelsea', locked: true  },
  { name: 'Vinícius Jr',     team: 'Brazil',  flag: '🇧🇷', interest: 'Contract renewal talks', locked: true  },
  { name: 'Kylian Mbappé',   team: 'France',  flag: '🇫🇷', interest: 'Real Madrid (contracted)', locked: true  },
  { name: 'Gio Reyna',       team: 'USA',     flag: '🇺🇸', interest: 'Man Utd, Arsenal, Juventus', locked: false },
  { name: 'Florian Wirtz',   team: 'Germany', flag: '🇩🇪', interest: 'Real Madrid (€130M bid)', locked: false },
  { name: 'Pulisic',         team: 'USA',     flag: '🇺🇸', interest: 'Chelsea contract renewal', locked: true  },
];

export default async function TransfersPage() {
  try {
    const res = await fetch(`${BASE}/transfers?limit=20`, { next: { revalidate: 120 } });
    if (res.ok) {
      const { data } = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // If API returns data, use it — currently falls through to fallback
      }
    }
  } catch {}

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-wider text-white mb-2">TRANSFER NEWS</h1>
        <p className="text-brand-gray">Summer 2026 window · World Cup-driven deals and post-tournament rumours</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        {STATUS_TABS.map((tab, i) => (
          <button key={tab} className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
            i === 0 ? 'bg-brand-red text-white' : 'bg-brand-card border border-brand-border text-brand-gray hover:text-white'
          }`}>{tab}</button>
        ))}
      </div>

      {/* Window banner */}
      <div className="gr-card p-4 mb-6 flex items-center gap-4 border border-brand-gold/20 bg-gradient-to-r from-brand-card to-brand-dark">
        <Clock className="w-5 h-5 text-brand-gold flex-shrink-0"/>
        <div className="flex-1">
          <div className="text-brand-gold text-xs font-bold uppercase tracking-wider">Summer 2026 Transfer Window</div>
          <div className="text-brand-gray text-xs mt-0.5">Opens July 21 · World Cup stars attracting record bids</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-display text-2xl text-white">13</div>
          <div className="text-brand-gray text-[10px]">days to open</div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="gr-card p-5 mb-8 bg-gradient-to-r from-brand-card to-brand-dark">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {TRANSFER_STATS.map(s => (
            <div key={s.label}>
              <div className={`font-display text-3xl ${s.color}`}>{s.value}</div>
              <div className="text-brand-gray text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transfers Grid */}
      <h2 className="gr-section-title mb-5">Latest Deals & Rumours</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
        {SUMMER_2026_TRANSFERS.map(t => <TransferCard key={t.id} transfer={t}/>)}
      </div>

      {/* WC Watch List */}
      <div className="gr-card">
        <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-gold"/>
          <h2 className="text-white font-semibold">World Cup Watch List</h2>
          <span className="text-brand-gray text-xs ml-auto">Stars clubs are monitoring</span>
        </div>
        <div className="divide-y divide-brand-border/40">
          {WC_WATCH_LIST.map(p => (
            <div key={p.name} className="flex items-center gap-4 px-5 py-4">
              <span className="text-2xl">{p.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm">{p.name}</div>
                <div className="text-brand-gray text-xs">{p.team}</div>
              </div>
              <div className="text-brand-gray text-xs text-right hidden sm:block max-w-[200px] truncate">{p.interest}</div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                p.locked ? 'bg-brand-dark text-brand-muted' : 'bg-brand-red/10 text-brand-red'
              }`}>{p.locked ? 'Tied' : 'Available'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <button className="gr-btn-primary px-10">Load More Transfers</button>
      </div>
    </div>
  );
}
