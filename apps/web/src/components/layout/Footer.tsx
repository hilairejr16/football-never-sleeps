import Link from 'next/link';
import { Twitter, Instagram } from 'lucide-react';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.88a8.22 8.22 0 004.85 1.56V7a4.85 4.85 0 01-1.08-.31z"/>
    </svg>
  );
}

const LEAGUES: { name: string; href: string }[] = [
  { name: 'Premier League',      href: '/league/premier-league' },
  { name: 'La Liga',             href: '/league/la-liga' },
  { name: 'Serie A',             href: '/league/serie-a' },
  { name: 'Bundesliga',          href: '/league/bundesliga' },
  { name: 'Ligue 1',             href: '/league/ligue-1' },
  { name: 'Champions League',    href: '/league/champions-league' },
  { name: 'Europa League',       href: '/league/europa-league' },
  { name: 'World Cup 2026',      href: '/world-cup' },
  { name: 'Copa América',        href: '/league/copa-america' },
  { name: 'CONCACAF Gold Cup',   href: '/league/gold-cup' },
  { name: 'UEFA European Champ.', href: '/league/euro-championship' },
  { name: 'MLS',                 href: '/league/mls' },
  { name: 'Saudi Pro League',    href: '/league/saudi-pro-league' },
];

const QUICK_LINKS = [
  { href: '/live-scores',  label: 'Live Scores' },
  { href: '/fixtures',     label: 'Fixtures' },
  { href: '/results',      label: 'Results' },
  { href: '/transfers',    label: 'Transfer News' },
  { href: '/predictions',  label: 'Match Predictions' },
  { href: '/statistics',   label: 'Statistics' },
  { href: '/analysis',     label: 'Tactical Analysis' },
  { href: '/players',      label: 'Players' },
];

const COMPANY = [
  { href: '/about',         label: 'About Us' },
  { href: '/contact',       label: 'Contact' },
  { href: '/advertise',     label: 'Advertise' },
  { href: '/privacy',       label: 'Privacy Policy' },
  { href: '/terms',         label: 'Terms of Service' },
  { href: '/sitemap.xml',   label: 'Sitemap' },
];

const SOCIALS = [
  { icon: Twitter,    href: 'https://x.com/GoalRushGlobal',           label: 'X / Twitter' },
  { icon: Instagram,  href: 'https://instagram.com/GoalRushGlobal00', label: 'Instagram' },
  { icon: TikTokIcon, href: 'https://tiktok.com/@goalrushglobal00',   label: 'TikTok' },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-brand-border mt-20">
      {/* Newsletter Banner */}
      <div className="bg-red-gradient">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-display text-2xl tracking-wider">
                NEVER MISS A GOAL
              </h3>
              <p className="text-red-100 text-sm mt-1">
                Get breaking news and live updates delivered to your inbox.
              </p>
            </div>
            <form
              className="flex gap-2 w-full md:w-auto"
              onSubmit={e => {
                e.preventDefault();
                const input = (e.currentTarget as HTMLFormElement).elements.namedItem('email') as HTMLInputElement;
                if (input?.value) {
                  window.location.href = `mailto:goalrushglobal83@gmail.com?subject=Newsletter+Subscription&body=Please+add+${encodeURIComponent(input.value)}+to+the+GoalRush+Global+newsletter.`;
                }
              }}
            >
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-red-200 text-sm focus:outline-none focus:border-white flex-1 md:w-72"
              />
              <button
                type="submit"
                className="bg-white text-brand-red font-bold px-6 py-2.5 rounded-lg hover:bg-red-50 transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-black border-2 border-brand-gold flex flex-col items-center justify-center flex-shrink-0">
                <span className="font-display text-[12px] text-brand-gold leading-none tracking-tight">GRG</span>
              </div>
              <div>
                <div className="font-display text-xl tracking-widest text-white">GOALRUSH</div>
                <div className="text-[9px] tracking-[0.3em] text-brand-gold font-semibold">GLOBAL</div>
              </div>
            </Link>
            <p className="text-brand-gray text-sm leading-relaxed mb-5">
              Your ultimate source for football news, live scores, and analysis.
              Football Never Sleeps.
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 bg-brand-card border border-brand-border rounded-lg flex items-center justify-center text-brand-gray hover:text-white hover:border-brand-red transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-brand-gray hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Leagues */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Leagues
            </h4>
            <ul className="space-y-2.5">
              {LEAGUES.map(league => (
                <li key={league.href}>
                  <Link
                    href={league.href}
                    className="text-brand-gray hover:text-white text-sm transition-colors"
                  >
                    {league.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {COMPANY.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-brand-gray hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-gray text-xs">
            © {new Date().getFullYear()} GoalRush Global. All rights reserved.
          </p>
          <p className="text-brand-gray text-xs flex items-center gap-1">
            <span className="text-brand-gold font-semibold">"Football Never Sleeps."</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
