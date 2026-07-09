import type { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, Globe, Users, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Advertise with GoalRush Global',
  description: 'Reach millions of passionate football fans with GoalRush Global advertising solutions.',
};

const STATS = [
  { label: 'Monthly Visitors',    value: '2M+',   icon: Globe },
  { label: 'Avg. Session Time',   value: '8 min', icon: TrendingUp },
  { label: 'Newsletter Readers',  value: '120K',  icon: Users },
  { label: 'Live Score Sessions', value: '500K',  icon: Zap },
];

const PACKAGES = [
  { name: 'Banner Display',    price: 'From $199/mo', desc: 'Homepage and article page banner placements with geo-targeting.', features: ['728×90 leaderboard', '300×250 sidebar', 'Mobile responsive', 'Analytics dashboard'] },
  { name: 'Sponsored Content', price: 'From $499/mo', desc: 'AI-assisted sponsored articles published natively within our news feed.', features: ['AI-written to brief', 'Native placement', 'Social promotion', 'Full analytics'] },
  { name: 'Newsletter Spot',   price: 'From $299/mo', desc: 'Dedicated placement in our daily football digest newsletter.', features: ['120K+ subscribers', 'Top-of-email placement', 'Click tracking', 'Audience segments'] },
];

export default function AdvertisePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-16">
      <h1 className="text-4xl font-display tracking-wider text-white mb-3">ADVERTISE</h1>
      <p className="text-brand-gray text-lg mb-12">
        Connect your brand with millions of passionate football fans worldwide.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {STATS.map(({ label, value, icon: Icon }) => (
          <div key={label} className="gr-card p-5 text-center">
            <Icon className="w-5 h-5 text-brand-gold mx-auto mb-2"/>
            <div className="font-display text-3xl text-white">{value}</div>
            <div className="text-brand-gray text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Packages */}
      <h2 className="gr-section-title mb-6">Advertising Packages</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {PACKAGES.map(p => (
          <div key={p.name} className="gr-card p-6">
            <h3 className="text-white font-bold mb-1">{p.name}</h3>
            <div className="text-brand-gold font-semibold text-sm mb-3">{p.price}</div>
            <p className="text-brand-gray text-sm mb-4 leading-relaxed">{p.desc}</p>
            <ul className="space-y-1.5">
              {p.features.map(f => (
                <li key={f} className="text-brand-gray text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0"/>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="gr-card p-8 text-center">
        <h2 className="text-white font-semibold text-xl mb-3">Ready to reach football fans?</h2>
        <p className="text-brand-gray text-sm mb-6">Contact our advertising team for a custom proposal.</p>
        <Link href="mailto:goalrushglobal83@gmail.com?subject=Advertising+Enquiry" className="gr-btn-primary px-8">Get in Touch</Link>
      </div>
    </div>
  );
}
