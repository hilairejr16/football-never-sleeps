'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/',              label: 'Home' },
  { href: '/world-cup',     label: '🏆 World Cup', highlight: true },
  { href: '/live-scores',   label: 'Live Scores' },
  { href: '/news',          label: 'News' },
  { href: '/fixtures',      label: 'Fixtures' },
  { href: '/transfers',     label: 'Transfers' },
  { href: '/predictions',   label: 'Predictions' },
  { href: '/teams',         label: 'Teams' },
  { href: '/statistics',    label: 'Stats' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-brand-black/95 backdrop-blur-md shadow-lg shadow-black/50 border-b border-brand-border'
          : 'bg-brand-dark border-b border-brand-border'
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-brand-black border-2 border-brand-gold flex flex-col items-center justify-center flex-shrink-0 group-hover:border-brand-gold-light transition-colors">
              <span className="font-display text-[11px] text-brand-gold leading-none tracking-tight">GRG</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-display text-xl tracking-widest text-white leading-none">
                GOALRUSH
              </div>
              <div className="text-[9px] tracking-[0.3em] text-brand-gold font-semibold leading-none">
                GLOBAL
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, highlight }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'gr-nav-link px-3',
                  pathname === href && 'active',
                  highlight && pathname !== href && 'text-yellow-400 hover:text-yellow-300'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {searchOpen ? (
              <div className="flex items-center gap-2 animate-fade-in">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search players, teams, news..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Escape') {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }
                    if (e.key === 'Enter' && searchQuery) {
                      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                  className="bg-brand-card border border-brand-border rounded-lg px-4 py-2 text-sm text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-red w-64"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="text-brand-gray hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="gr-btn-ghost p-2"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Notifications */}
            <button className="gr-btn-ghost p-2 relative" aria-label="Notifications">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full" />
            </button>

            {/* Breaking News CTA */}
            <Link
              href="/news"
              className="hidden md:flex items-center gap-2 gr-badge-red text-xs font-bold"
              aria-label="Breaking news"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red-light animate-live-dot" />
              Breaking
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden gr-btn-ghost p-2"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="xl:hidden bg-brand-dark border-t border-brand-border animate-slide-up">
          <nav className="max-w-screen-2xl mx-auto px-4 py-4 grid grid-cols-2 gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-brand-red text-white'
                    : 'text-brand-gray hover:text-white hover:bg-brand-card'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
