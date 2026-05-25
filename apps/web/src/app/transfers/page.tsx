import type { Metadata } from 'next';
import TransferCard from '@/components/cards/TransferCard';
import type { Transfer } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Transfer News & Rumours',
  description: 'Latest football transfer news, confirmed deals, and transfer rumours from every major league.',
};

export const revalidate = 120;

const STATUS_TABS = ['All', 'Confirmed', 'Rumours', 'Completed', 'Failed'];

const MOCK_TRANSFERS: Transfer[] = [
  { id: 't1', player: { id: 1, name: 'Kylian Mbappe', firstName: 'Kylian', lastName: 'Mbappe', nationality: 'France', position: 'Forward', age: 25, photo: '', teamId: 541 }, fromTeam: { id: 85, name: 'PSG', shortName: 'PSG', logo: '', country: 'France' }, toTeam: { id: 541, name: 'Real Madrid', shortName: 'RMA', logo: '', country: 'Spain' }, fee: 0, loanType: 'free', status: 'completed', confidence: 100, source: "L'Équipe", date: new Date(Date.now() - 86400000).toISOString() },
  { id: 't2', player: { id: 2, name: 'Victor Osimhen', firstName: 'Victor', lastName: 'Osimhen', nationality: 'Nigeria', position: 'Forward', age: 25, photo: '', teamId: 492 }, fromTeam: { id: 492, name: 'Napoli', shortName: 'NAP', logo: '', country: 'Italy' }, toTeam: { id: 33, name: 'Man United', shortName: 'MUN', logo: '', country: 'England' }, fee: 80_000_000, status: 'confirmed', confidence: 88, source: 'Fabrizio Romano', date: new Date(Date.now() - 21600000).toISOString() },
  { id: 't3', player: { id: 3, name: 'Pedri', firstName: 'Pedro', lastName: 'González', nationality: 'Spain', position: 'Midfielder', age: 21, photo: '', teamId: 529 }, fromTeam: { id: 529, name: 'Barcelona', shortName: 'BAR', logo: '', country: 'Spain' }, toTeam: { id: 50, name: 'Man City', shortName: 'MCI', logo: '', country: 'England' }, fee: 100_000_000, status: 'rumour', confidence: 42, source: 'Sport', date: new Date(Date.now() - 43200000).toISOString() },
  { id: 't4', player: { id: 4, name: 'Erling Haaland', firstName: 'Erling', lastName: 'Haaland', nationality: 'Norway', position: 'Forward', age: 24, photo: '', teamId: 50 }, fromTeam: { id: 50, name: 'Man City', shortName: 'MCI', logo: '', country: 'England' }, toTeam: { id: 541, name: 'Real Madrid', shortName: 'RMA', logo: '', country: 'Spain' }, fee: 200_000_000, status: 'rumour', confidence: 22, source: 'AS', date: new Date(Date.now() - 57600000).toISOString() },
  { id: 't5', player: { id: 5, name: 'Jamal Musiala', firstName: 'Jamal', lastName: 'Musiala', nationality: 'Germany', position: 'Midfielder', age: 21, photo: '', teamId: 157 }, fromTeam: { id: 157, name: 'Bayern Munich', shortName: 'BAY', logo: '', country: 'Germany' }, toTeam: { id: 157, name: 'Bayern Munich', shortName: 'BAY', logo: '', country: 'Germany' }, status: 'confirmed', confidence: 97, source: 'Bild', date: new Date(Date.now() - 7200000).toISOString(), contractYears: 5 },
  { id: 't6', player: { id: 6, name: 'Lamine Yamal', firstName: 'Lamine', lastName: 'Yamal', nationality: 'Spain', position: 'Forward', age: 16, photo: '', teamId: 529 }, fromTeam: { id: 529, name: 'Barcelona', shortName: 'BAR', logo: '', country: 'Spain' }, toTeam: { id: 529, name: 'Barcelona', shortName: 'BAR', logo: '', country: 'Spain' }, status: 'confirmed', confidence: 100, source: 'Marca', date: new Date(Date.now() - 10800000).toISOString() },
];

export default function TransfersPage() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-wider text-white mb-2">TRANSFER NEWS</h1>
        <p className="text-brand-gray">Confirmed deals, latest rumours, and breaking transfer news</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
        {STATUS_TABS.map((tab, i) => (
          <button
            key={tab}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
              i === 0
                ? 'bg-brand-red text-white'
                : 'bg-brand-card border border-brand-border text-brand-gray hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transfer Meter Banner */}
      <div className="gr-card p-5 mb-8 bg-gradient-to-r from-brand-card to-brand-dark">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Confirmed Deals', value: '47', color: 'text-live' },
            { label: 'Hot Rumours', value: '134', color: 'text-brand-red' },
            { label: 'Window Closes', value: '31 Jan', color: 'text-brand-gold' },
            { label: 'Total Spend', value: '€2.1B', color: 'text-white' },
          ].map(stat => (
            <div key={stat.label}>
              <div className={`font-display text-3xl ${stat.color}`}>{stat.value}</div>
              <div className="text-brand-gray text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transfers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {MOCK_TRANSFERS.map(t => (
          <TransferCard key={t.id} transfer={t} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-10">
        <button className="gr-btn-primary px-10">Load More Transfers</button>
      </div>
    </div>
  );
}
