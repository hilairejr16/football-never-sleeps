import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import TransferCard from '@/components/cards/TransferCard';
import type { Transfer } from '@/lib/types';

const MOCK_TRANSFERS: Transfer[] = [
  {
    id: 't1',
    player: { id: 1, name: 'Kylian Mbappe', firstName: 'Kylian', lastName: 'Mbappe', nationality: 'France', position: 'Forward', age: 25, photo: '/players/mbappe.jpg', teamId: 541 },
    fromTeam: { id: 85, name: 'PSG', shortName: 'PSG', logo: '/teams/psg.png', country: 'France' },
    toTeam: { id: 541, name: 'Real Madrid', shortName: 'RMA', logo: '/teams/real.png', country: 'Spain' },
    fee: 0,
    loanType: 'free',
    status: 'completed',
    confidence: 100,
    source: 'L\'Équipe',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 't2',
    player: { id: 2, name: 'Victor Osimhen', firstName: 'Victor', lastName: 'Osimhen', nationality: 'Nigeria', position: 'Forward', age: 25, photo: '/players/osimhen.jpg', teamId: 492 },
    fromTeam: { id: 492, name: 'Napoli', shortName: 'NAP', logo: '/teams/napoli.png', country: 'Italy' },
    toTeam: { id: 33, name: 'Manchester United', shortName: 'MAN UTD', logo: '/teams/manu.png', country: 'England' },
    fee: 80_000_000,
    status: 'confirmed',
    confidence: 88,
    source: 'Fabrizio Romano',
    date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 't3',
    player: { id: 3, name: 'Pedri', firstName: 'Pedro', lastName: 'González López', nationality: 'Spain', position: 'Midfielder', age: 21, photo: '/players/pedri.jpg', teamId: 529 },
    fromTeam: { id: 529, name: 'Barcelona', shortName: 'BAR', logo: '/teams/barca.png', country: 'Spain' },
    toTeam: { id: 50, name: 'Manchester City', shortName: 'MCI', logo: '/teams/city.png', country: 'England' },
    fee: 100_000_000,
    status: 'rumour',
    confidence: 42,
    source: 'Sport',
    date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 't4',
    player: { id: 4, name: 'Lamine Yamal', firstName: 'Lamine', lastName: 'Yamal', nationality: 'Spain', position: 'Forward', age: 16, photo: '/players/yamal.jpg', teamId: 529 },
    fromTeam: { id: 529, name: 'Barcelona', shortName: 'BAR', logo: '/teams/barca.png', country: 'Spain' },
    toTeam: { id: 529, name: 'Barcelona', shortName: 'BAR', logo: '/teams/barca.png', country: 'Spain' },
    status: 'confirmed',
    confidence: 95,
    source: 'Marca',
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    contractYears: 5,
  },
];

export default function TransferNewsSection() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="gr-section-title">Transfer News</h2>
        <Link
          href="/transfers"
          className="text-brand-red text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all"
        >
          All Transfers <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Confidence filters */}
      <div className="flex gap-2 mb-6">
        {['All', 'Confirmed', 'Rumours', 'Completed'].map((f, i) => (
          <button
            key={f}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              i === 0
                ? 'bg-brand-red text-white'
                : 'bg-brand-card border border-brand-border text-brand-gray hover:text-white hover:border-brand-muted'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MOCK_TRANSFERS.map(transfer => (
          <TransferCard key={transfer.id} transfer={transfer} />
        ))}
      </div>
    </div>
  );
}
