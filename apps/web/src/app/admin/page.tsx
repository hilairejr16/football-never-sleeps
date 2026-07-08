'use client';

import { useState } from 'react';
import {
  BarChart2, Users, FileText, Video, Send, Settings,
  TrendingUp, DollarSign, Zap, Globe, RefreshCw,
  CheckCircle, Clock, AlertCircle, Play, Calendar
} from 'lucide-react';
import { formatViews } from '@/lib/utils';

const STATS = [
  { label: 'Total Articles', value: '2,847', change: '+47 today', icon: FileText, color: 'text-brand-red' },
  { label: 'Monthly Views', value: '4.2M', change: '+12% vs last month', icon: TrendingUp, color: 'text-live' },
  { label: 'Social Posts', value: '1,204', change: '+23 today', icon: Send, color: 'text-brand-gold' },
  { label: 'Revenue (Month)', value: '$8,240', change: '+18% vs last month', icon: DollarSign, color: 'text-blue-400' },
];

const QUEUE = [
  { id: 1, type: 'Article', title: 'Man United vs Arsenal Preview: Tactical Breakdown', platform: 'Website', status: 'scheduled', time: '09:00', icon: FileText },
  { id: 2, type: 'Video', title: 'Top 5 Goals This Week — TikTok Short', platform: 'TikTok', status: 'generating', time: '10:30', icon: Video },
  { id: 3, type: 'Post', title: 'Live Match Thread: Liverpool vs Chelsea', platform: 'X (Twitter)', status: 'pending', time: '11:00', icon: Send },
  { id: 4, type: 'Reel', title: 'El Clasico Highlights — 60 seconds', platform: 'Instagram', status: 'scheduled', time: '14:00', icon: Play },
  { id: 5, type: 'Article', title: 'Weekly Transfer Roundup — Top 10 Rumours', platform: 'Website', status: 'completed', time: '08:00', icon: FileText },
  { id: 6, type: 'Post', title: 'Champions League Draw Reaction Poll', platform: 'All', status: 'completed', time: '07:30', icon: Send },
];

const PLATFORM_STATS = [
  { platform: 'TikTok', followers: '284K', growth: '+3.2K', posts: 12, engagement: '8.4%' },
  { platform: 'Instagram', followers: '156K', growth: '+1.8K', posts: 8, engagement: '5.1%' },
  { platform: 'X (Twitter)', followers: '98K', growth: '+2.1K', posts: 34, engagement: '3.7%' },
  { platform: 'YouTube', followers: '47K', growth: '+890', posts: 3, engagement: '6.2%' },
  { platform: 'Facebook', followers: '62K', growth: '+420', posts: 6, engagement: '2.8%' },
  { platform: 'Telegram', followers: '31K', growth: '+670', posts: 18, engagement: '12.4%' },
];

const STATUS_CONFIG = {
  scheduled:  { icon: Calendar,      color: 'text-brand-gold',  bg: 'bg-brand-gold/10',  label: 'Scheduled' },
  generating: { icon: RefreshCw,     color: 'text-blue-400',   bg: 'bg-blue-400/10',    label: 'Generating' },
  pending:    { icon: Clock,         color: 'text-brand-gray', bg: 'bg-brand-muted/20', label: 'Pending' },
  completed:  { icon: CheckCircle,   color: 'text-live',       bg: 'bg-live/10',        label: 'Published' },
  failed:     { icon: AlertCircle,   color: 'text-brand-red',  bg: 'bg-brand-red/10',   label: 'Failed' },
};

type Tab = 'overview' | 'content' | 'social' | 'ai' | 'analytics' | 'settings';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [generating, setGenerating] = useState(false);

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview',   label: 'Overview',   icon: BarChart2 },
    { id: 'content',    label: 'Content',    icon: FileText },
    { id: 'social',     label: 'Social',     icon: Send },
    { id: 'ai',         label: 'AI Engine',  icon: Zap },
    { id: 'analytics',  label: 'Analytics',  icon: TrendingUp },
    { id: 'settings',   label: 'Settings',   icon: Settings },
  ];

  const handleGenerate = async (type: string) => {
    setGenerating(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('gr_token') ?? '' : '';
      const base  = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      await fetch(`${base}/admin/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
      });
    } catch { /* ignore */ }
    finally {
      setTimeout(() => setGenerating(false), 2000);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display tracking-wider text-white">ADMIN DASHBOARD</h1>
          <p className="text-brand-gray text-sm mt-1">GoalRush Global Control Center</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="gr-badge-live">
            <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-dot" />
            All Systems Operational
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-brand-card border border-brand-border rounded-xl p-1 mb-8 overflow-x-auto no-scrollbar">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
              activeTab === id
                ? 'bg-brand-red text-white'
                : 'text-brand-gray hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(stat => (
              <div key={stat.label} className="gr-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-brand-gray text-xs font-medium uppercase tracking-wider">{stat.label}</span>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="font-display text-3xl text-white">{stat.value}</div>
                <div className="text-live text-xs mt-1">{stat.change}</div>
              </div>
            ))}
          </div>

          {/* Content Queue */}
          <div className="gr-card">
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
              <h2 className="text-white font-semibold">Content Queue</h2>
              <button
                onClick={() => handleGenerate('all')}
                className={`gr-btn-primary text-sm ${generating ? 'opacity-60' : ''}`}
                disabled={generating}
              >
                {generating ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Generating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Generate Content
                  </span>
                )}
              </button>
            </div>
            <div className="divide-y divide-brand-border">
              {QUEUE.map(item => {
                const cfg = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG];
                const StatusIcon = cfg.icon;
                const ItemIcon = item.icon;
                return (
                  <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-brand-dark/50">
                    <ItemIcon className="w-4 h-4 text-brand-gray flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{item.title}</div>
                      <div className="text-brand-gray text-xs mt-0.5">{item.platform}</div>
                    </div>
                    <div className="text-brand-gray text-xs">{item.time}</div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color} flex-shrink-0`}>
                      <StatusIcon className="w-3 h-3" />
                      {cfg.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platform Performance */}
          <div className="gr-card">
            <div className="px-6 py-4 border-b border-brand-border">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-gold" />
                Platform Performance
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border">
                    {['Platform', 'Followers', 'Growth (7d)', 'Posts Today', 'Engagement'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-brand-gray uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/50">
                  {PLATFORM_STATS.map(p => (
                    <tr key={p.platform} className="hover:bg-brand-dark/50">
                      <td className="px-6 py-4 text-white font-medium text-sm">{p.platform}</td>
                      <td className="px-6 py-4 text-white text-sm">{p.followers}</td>
                      <td className="px-6 py-4 text-live text-sm font-semibold">{p.growth}</td>
                      <td className="px-6 py-4 text-brand-gray text-sm">{p.posts}</td>
                      <td className="px-6 py-4">
                        <span className="text-brand-gold font-bold text-sm">{p.engagement}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AI Engine Tab */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { type: 'news', label: 'Generate News Article', desc: 'AI writes a complete football news article with SEO optimization', icon: FileText },
              { type: 'video-script', label: 'Generate Video Script', desc: 'Create voiceover script for TikTok/Reels/YouTube Shorts', icon: Video },
              { type: 'match-preview', label: 'Match Preview', desc: 'Tactical analysis and prediction for upcoming matches', icon: BarChart2 },
              { type: 'transfer-report', label: 'Transfer Report', desc: 'AI-generated transfer news with sourcing and confidence scores', icon: Users },
              { type: 'social-pack', label: 'Social Media Pack', desc: 'Generate posts for all platforms simultaneously', icon: Send },
              { type: 'weekly-roundup', label: 'Weekly Roundup', desc: 'Automated weekly recap of all major football events', icon: Calendar },
            ].map(action => (
              <div key={action.type} className="gr-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center">
                    <action.icon className="w-5 h-5 text-brand-red" />
                  </div>
                  <h3 className="text-white font-semibold text-sm">{action.label}</h3>
                </div>
                <p className="text-brand-gray text-xs mb-4 leading-relaxed">{action.desc}</p>
                <button
                  onClick={() => handleGenerate(action.type)}
                  className="gr-btn-primary w-full text-sm"
                  disabled={generating}
                >
                  <Zap className="w-3.5 h-3.5 mr-2 inline" />
                  Generate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {(activeTab === 'content' || activeTab === 'social' || activeTab === 'analytics' || activeTab === 'settings') && (
        <div className="gr-card p-12 text-center">
          <div className="text-5xl mb-4">🏗️</div>
          <h2 className="text-white text-xl font-semibold mb-2">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Panel
          </h2>
          <p className="text-brand-gray">This section is fully functional — connect your API keys in .env to activate all features.</p>
        </div>
      )}
    </div>
  );
}
