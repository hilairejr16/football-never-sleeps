import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import TransferCard from '@/components/cards/TransferCard';
import type { Transfer } from '@/lib/types';

// Summer 2026 transfer window — clubs targeting World Cup standouts
const SUMMER_2026_TRANSFERS: Transfer[] = [
  {
    id: 't1',
    player: { id: 1, name: 'Lamine Yamal', firstName: 'Lamine', lastName: 'Yamal', nationality: 'Spain', position: 'Forward', age: 18, photo: '', teamId: 529 },
    fromTeam: { id: 529, name: 'Barcelona',   shortName: 'BAR', logo: '', country: 'Spain' },
    toTeam:   { id: 529, name: 'Barcelona',   shortName: 'BAR', logo: '', country: 'Spain' },
    status: 'confirmed', confidence: 100, source: 'Marca',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    contractYears: 6,
  },
  {
    id: 't2',
    player: { id: 2, name: 'Gavi', firstName: 'Pablo', lastName: 'Gavi', nationality: 'Spain', position: 'Midfielder', age: 22, photo: '', teamId: 529 },
    fromTeam: { id: 529, name: 'Barcelona',         shortName: 'BAR', logo: '', country: 'Spain' },
    toTeam:   { id: 50,  name: 'Manchester City',   shortName: 'MCI', logo: '', country: 'England' },
    fee: 90_000_000,
    status: 'rumour', confidence: 55, source: 'Sport / El Mundo Deportivo',
    date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 't3',
    player: { id: 3, name: 'Florian Wirtz', firstName: 'Florian', lastName: 'Wirtz', nationality: 'Germany', position: 'Midfielder', age: 23, photo: '', teamId: 157 },
    fromTeam: { id: 157, name: 'Bayern Munich',  shortName: 'BAY', logo: '', country: 'Germany' },
    toTeam:   { id: 541, name: 'Real Madrid',    shortName: 'RMA', logo: '', country: 'Spain' },
    fee: 130_000_000,
    status: 'rumour', confidence: 38, source: 'Kicker',
    date: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
  {
    id: 't4',
    player: { id: 4, name: 'Victor Osimhen', firstName: 'Victor', lastName: 'Osimhen', nationality: 'Nigeria', position: 'Forward', age: 27, photo: '', teamId: 492 },
    fromTeam: { id: 492, name: 'Napoli',            shortName: 'NAP', logo: '', country: 'Italy' },
    toTeam:   { id: 40,  name: 'Liverpool',          shortName: 'LIV', logo: '', country: 'England' },
    fee: 85_000_000,
    status: 'confirmed', confidence: 91, source: 'Fabrizio Romano',
    date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
];

export default function TransferNewsSection() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="gr-section-title">Transfer News</h2>
        <Link href="/transfers" className="text-brand-red text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">
          All Transfers <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Summer 2026 window banner */}
      <div className="gr-card p-4 mb-5 flex items-center gap-4 bg-gradient-to-r from-brand-card to-brand-dark border border-brand-gold/20">
        <Clock className="w-5 h-5 text-brand-gold flex-shrink-0" />
        <div className="flex-1">
          <div className="text-brand-gold text-xs font-bold uppercase tracking-wider">Summer 2026 Transfer Window</div>
          <div className="text-brand-gray text-xs mt-0.5">Opens July 21 · Clubs monitoring World Cup standouts</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-display text-2xl text-white">13</div>
          <div className="text-brand-gray text-[10px]">days</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['All', 'Confirmed', 'Rumours', 'Completed'].map((f, i) => (
          <button key={f} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            i === 0 ? 'bg-brand-red text-white' : 'bg-brand-card border border-brand-border text-brand-gray hover:text-white hover:border-brand-muted'
          }`}>{f}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SUMMER_2026_TRANSFERS.map(transfer => (
          <TransferCard key={transfer.id} transfer={transfer} />
        ))}
      </div>
    </div>
  );
}
