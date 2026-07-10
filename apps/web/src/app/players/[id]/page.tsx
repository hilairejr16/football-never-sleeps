import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Target, Zap, Star, TrendingUp } from 'lucide-react';
import ListenButton from '@/components/ui/ListenButton';

interface Player {
  slug:        string;
  name:        string;
  team:        string;
  flag:        string;
  nationality: string;
  pos:         string;
  posLabel:    string;
  age:         number;
  goals:       number;
  assists:     number;
  shots:       number;
  rating:      number;
  apps:        number;
  bio:         string;
  newsSlug:    string;
  strengths:   string[];
}

const PLAYERS: Player[] = [
  {
    slug: 'lamine-yamal', name: 'Lamine Yamal', team: 'Spain', flag: '🇪🇸',
    nationality: 'Spanish', pos: 'FW', posLabel: 'Right Winger', age: 18,
    goals: 4, assists: 6, shots: 16, rating: 9.3, apps: 5,
    bio: 'The 18-year-old FC Barcelona sensation has been the defining player of World Cup 2026. Blessed with electric pace, an unguardable close touch, and the composure of a veteran, Yamal has dismantled every defence he has faced. His six assists make him the tournament\'s creative fulcrum — and he\'s only getting started.',
    newsSlug: 'lamine-yamal-wc-2026-masterclass',
    strengths: ['Dribbling', '1v1 ability', 'Final third creativity', 'Set-piece delivery'],
  },
  {
    slug: 'erling-haaland', name: 'Erling Haaland', team: 'Norway', flag: '🇳🇴',
    nationality: 'Norwegian', pos: 'FW', posLabel: 'Centre Forward', age: 25,
    goals: 8, assists: 0, shots: 19, rating: 9.2, apps: 5,
    bio: 'Eight goals in five matches. Erling Haaland has been an unstoppable force at World Cup 2026, single-handedly carrying Norway to their first ever quarter-final. His hat-trick against Brazil in the Round of 16 — including a 95th-minute winner — is already the tournament\'s defining moment.',
    newsSlug: 'norway-england-qf-preview',
    strengths: ['Finishing', 'Aerial dominance', 'Off-the-ball movement', 'Power'],
  },
  {
    slug: 'kylian-mbappe', name: 'Kylian Mbappé', team: 'France', flag: '🇫🇷',
    nationality: 'French', pos: 'FW', posLabel: 'Centre Forward', age: 27,
    goals: 6, assists: 2, shots: 22, rating: 9.0, apps: 5,
    bio: 'France\'s captain has led by example at World Cup 2026, scoring six goals and providing the moments of individual brilliance that a tournament of this scale demands. Six years after his breakout in Russia, Mbappé is now the complete player — faster, more decisive, and a more effective leader than ever.',
    newsSlug: 'mbappe-golden-boot-race',
    strengths: ['Pace', 'Clinical finishing', 'Leadership', 'Big-game temperament'],
  },
  {
    slug: 'vinicius-jr', name: 'Vinícius Jr', team: 'Brazil', flag: '🇧🇷',
    nationality: 'Brazilian', pos: 'FW', posLabel: 'Left Winger', age: 25,
    goals: 5, assists: 4, shots: 18, rating: 9.1, apps: 5,
    bio: 'Even in defeat — Brazil\'s shock exit at the hands of Norway — Vinícius Jr was the Seleção\'s brightest light. Five goals and four assists in the tournament underline his status as one of the world\'s two or three best players. He leaves the tournament with his head high and his stock sky-high.',
    newsSlug: 'mbappe-golden-boot-race',
    strengths: ['Dribbling', 'Pace', 'Creativity', 'Work-rate'],
  },
  {
    slug: 'lionel-messi', name: 'Lionel Messi', team: 'Argentina', flag: '🇦🇷',
    nationality: 'Argentine', pos: 'FW', posLabel: 'Attacking Midfielder', age: 38,
    goals: 4, assists: 6, shots: 11, rating: 8.8, apps: 5,
    bio: 'At 38 years old, Lionel Messi continues to bend football to his will. Six assists — joint-top in the tournament — from a player who barely runs yet still controls every game he touches. His vision, his weight of pass, his reading of the game: these are gifts that don\'t diminish with age.',
    newsSlug: 'messi-farewell-world-cup',
    strengths: ['Vision', 'Passing', 'Dead-ball delivery', 'Game intelligence'],
  },
  {
    slug: 'kevin-de-bruyne', name: 'Kevin De Bruyne', team: 'Belgium', flag: '🇧🇪',
    nationality: 'Belgian', pos: 'MF', posLabel: 'Central Midfielder', age: 34,
    goals: 1, assists: 7, shots: 8, rating: 8.7, apps: 5,
    bio: 'Seven assists. At 34. Kevin De Bruyne has silenced every "is he past it?" narrative with a masterclass of a tournament. His vision, range of passing, and ability to find teammates in impossible situations have been the engine of Belgium\'s brilliant run to the quarter-finals.',
    newsSlug: 'spain-belgium-qf-preview',
    strengths: ['Long passing', 'Vision', 'Set-pieces', 'Work rate'],
  },
  {
    slug: 'jude-bellingham', name: 'Jude Bellingham', team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    nationality: 'English', pos: 'MF', posLabel: 'Central Midfielder', age: 22,
    goals: 3, assists: 4, rating: 8.6, shots: 14, apps: 5,
    bio: 'England\'s heartbeat at World Cup 2026, Jude Bellingham has elevated his game to another level. Three goals and four assists from midfield, combined with relentless defensive effort, make him one of the best players in the world right now. At 22, his ceiling is yet to be found.',
    newsSlug: 'norway-england-qf-preview',
    strengths: ['Box-to-box energy', 'Goals from midfield', 'Pressing', 'Leadership'],
  },
  {
    slug: 'julian-alvarez', name: 'Julián Álvarez', team: 'Argentina', flag: '🇦🇷',
    nationality: 'Argentine', pos: 'FW', posLabel: 'Second Striker', age: 25,
    goals: 5, assists: 1, shots: 14, rating: 8.4, apps: 5,
    bio: 'Julián Álvarez is quickly becoming a World Cup specialist. After starring in Qatar 2022, he has delivered again in 2026 — five goals, relentless pressing, and the willingness to do the hard work that creates space for Messi. A complete forward at the top of his powers.',
    newsSlug: 'argentina-switzerland-qf-preview',
    strengths: ['Movement', 'Clinical finishing', 'Pressing', 'Work rate'],
  },
  {
    slug: 'pedri', name: 'Pedri', team: 'Spain', flag: '🇪🇸',
    nationality: 'Spanish', pos: 'MF', posLabel: 'Central Midfielder', age: 23,
    goals: 2, assists: 4, shots: 9, rating: 8.3, apps: 5,
    bio: 'Spain\'s engine room, Pedri has orchestrated the tightest, most dominant team at World Cup 2026. Rarely losing the ball, constantly finding angles, and providing the defensive cover that allows Yamal to run free — his role is understated, but essential to everything Spain do.',
    newsSlug: 'spain-possession-stats',
    strengths: ['Ball retention', 'Positional play', 'Vision', 'Composure under pressure'],
  },
  {
    slug: 'harry-kane', name: 'Harry Kane', team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    nationality: 'English', pos: 'FW', posLabel: 'Centre Forward', age: 33,
    goals: 5, assists: 0, shots: 13, rating: 8.1, apps: 5,
    bio: 'Harry Kane finally has the major tournament goal tally his club record always deserved. Five goals at World Cup 2026, including the winner against Mexico in the Round of 16, have put him among England\'s greatest tournament performers. This may be his last World Cup — and he\'s making it count.',
    newsSlug: 'norway-england-qf-preview',
    strengths: ['Hold-up play', 'Finishing', 'Aerial ability', 'Link-up play'],
  },
  {
    slug: 'christian-pulisic', name: 'Christian Pulisic', team: 'USA', flag: '🇺🇸',
    nationality: 'American', pos: 'FW', posLabel: 'Attacking Midfielder', age: 28,
    goals: 4, assists: 2, shots: 11, rating: 8.2, apps: 5,
    bio: 'Captain America delivered on the biggest stage. Hosting their first World Cup, the USA reached the Round of 16 on the back of Pulisic\'s four goals and two assists. He was the glue that held a talented but inexperienced squad together — a leader in the truest sense.',
    newsSlug: 'usa-surprise-package',
    strengths: ['Dribbling', 'Goals in big moments', 'Leadership', 'Pressing'],
  },
  {
    slug: 'cristiano-ronaldo', name: 'Cristiano Ronaldo', team: 'Portugal', flag: '🇵🇹',
    nationality: 'Portuguese', pos: 'FW', posLabel: 'Centre Forward', age: 41,
    goals: 4, assists: 0, shots: 17, rating: 7.8, apps: 5,
    bio: 'At 41, Cristiano Ronaldo continues to defy the laws of time. Four World Cup goals in 2026 bring his all-time tournament tally to an extraordinary level. Portugal\'s exit in the Round of 16 to Spain may have ended his final World Cup chapter — but the legend only grows.',
    newsSlug: 'ronaldo-last-dance-portugal',
    strengths: ['Goalscoring instinct', 'Heading', 'Set-pieces', 'Mentality'],
  },
];

const SLUG_MAP = Object.fromEntries(PLAYERS.map(p => [p.slug, p]));

const POS_COLOR: Record<string, string> = {
  FW: 'text-brand-red bg-brand-red/10',
  MF: 'text-brand-gold bg-brand-gold/10',
  DF: 'text-blue-400 bg-blue-400/10',
  GK: 'text-purple-400 bg-purple-400/10',
};

export async function generateStaticParams() {
  return PLAYERS.map(p => ({ id: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = SLUG_MAP[id];
  if (!p) return { title: 'Player Not Found' };
  return {
    title: `${p.name} — World Cup 2026 Stats | GoalRush Global`,
    description: `${p.name} (${p.team}): ${p.goals} goals, ${p.assists} assists, ${p.rating} rating at FIFA World Cup 2026. ${p.bio.slice(0, 120)}...`,
    alternates: { canonical: `/players/${p.slug}` },
  };
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = SLUG_MAP[id];
  if (!p) notFound();

  const bio = `${p.name}, ${p.posLabel} for ${p.team} at World Cup 2026. ${p.bio}`;

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8">
      {/* Breadcrumb */}
      <Link href="/players" className="flex items-center gap-2 text-brand-gray hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All Players
      </Link>

      {/* Hero card */}
      <div className="gr-card p-6 mb-8 border border-brand-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Flag + name */}
          <div className="flex items-center gap-5">
            <span className="text-7xl">{p.flag}</span>
            <div>
              <div className="text-white font-display text-3xl tracking-wider mb-1">{p.name.toUpperCase()}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${POS_COLOR[p.pos]}`}>{p.posLabel}</span>
                <span className="text-brand-gray text-sm">{p.team}</span>
                <span className="text-brand-muted text-sm">·</span>
                <span className="text-brand-gray text-sm">Age {p.age}</span>
                <span className="text-brand-muted text-sm">·</span>
                <span className="text-brand-gray text-sm">{p.nationality}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="sm:ml-auto text-center">
            <div className={`font-display text-5xl ${p.rating >= 9 ? 'text-yellow-400' : p.rating >= 8.5 ? 'text-emerald-400' : 'text-white'}`}>
              {p.rating}
            </div>
            <div className="text-brand-gray text-xs mt-1">Tournament Rating</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          {/* Stats bar */}
          <div className="gr-card">
            <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-gold"/>
              <h2 className="text-white font-semibold">World Cup 2026 Stats</h2>
              <span className="text-brand-gray text-xs ml-auto">{p.apps} appearances</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-brand-border/40">
              {[
                { label: 'Goals',   value: p.goals,   color: 'text-white' },
                { label: 'Assists', value: p.assists,  color: 'text-brand-gold' },
                { label: 'Shots',   value: p.shots,   color: 'text-brand-gray' },
                { label: 'Rating',  value: p.rating,  color: p.rating >= 9 ? 'text-yellow-400' : 'text-emerald-400' },
              ].map(s => (
                <div key={s.label} className="p-5 text-center">
                  <div className={`font-display text-3xl ${s.color}`}>{s.value}</div>
                  <div className="text-brand-gray text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="gr-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-gold" /> Tournament Profile
              </h2>
              <ListenButton text={bio} title={p.name} />
            </div>
            <p className="text-brand-gray leading-relaxed">{p.bio}</p>
          </div>

          {/* Strengths */}
          <div className="gr-card p-5">
            <h2 className="text-white font-semibold flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-brand-gold" /> Key Strengths
            </h2>
            <div className="flex flex-wrap gap-2">
              {p.strengths.map(s => (
                <span key={s} className="px-3 py-1.5 bg-brand-dark border border-brand-border rounded-full text-brand-gray text-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Read full analysis */}
          <div className="gr-card p-5 border border-brand-gold/20">
            <div className="text-brand-gold text-xs font-bold uppercase tracking-wider mb-3">Deep Dive</div>
            <h3 className="text-white font-semibold leading-snug mb-3">
              Full tactical analysis of {p.name}&apos;s World Cup campaign
            </h3>
            <Link href={`/news/${p.newsSlug}`} className="gr-btn-gold w-full text-center block py-2.5 text-sm">
              Read Analysis →
            </Link>
          </div>

          {/* Other top players */}
          <div className="gr-card">
            <div className="px-4 py-3 border-b border-brand-border">
              <h3 className="text-white font-semibold text-sm">Other Top Performers</h3>
            </div>
            <div className="divide-y divide-brand-border/40">
              {PLAYERS.filter(x => x.slug !== p.slug).slice(0, 5).map(x => (
                <Link
                  key={x.slug}
                  href={`/players/${x.slug}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-brand-dark/50 transition-colors group"
                >
                  <span className="text-xl">{x.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold truncate group-hover:text-brand-gold transition-colors">{x.name}</div>
                    <div className="text-brand-gray text-xs">{x.team} · {x.posLabel}</div>
                  </div>
                  <span className={`text-xs font-bold ${x.rating >= 9 ? 'text-yellow-400' : 'text-brand-gray'}`}>{x.rating}</span>
                </Link>
              ))}
            </div>
            <div className="p-3 border-t border-brand-border">
              <Link href="/players" className="text-brand-gray hover:text-white text-xs font-semibold transition-colors">
                All Players →
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div className="gr-card p-4">
            <div className="text-brand-gray text-xs font-semibold uppercase tracking-wider mb-3">Explore</div>
            <div className="space-y-2">
              {[
                { href: '/statistics', label: '📊 Tournament Statistics' },
                { href: '/live-scores', label: '⚡ Live Scores' },
                { href: '/predictions', label: '🔮 Match Predictions' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="flex items-center justify-between text-sm text-brand-gray hover:text-white py-1.5 transition-colors">
                  {l.label}<span className="text-brand-muted">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
