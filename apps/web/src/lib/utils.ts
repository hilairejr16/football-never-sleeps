import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import type { MatchStatus, Match } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date Helpers ──────────────────────────────────────────

export function formatMatchDate(dateStr: string): string {
  return format(parseISO(dateStr), 'EEE d MMM, HH:mm');
}

export function formatTimeAgo(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}

export function formatDate(dateStr: string, fmt = 'd MMM yyyy'): string {
  return format(parseISO(dateStr), fmt);
}

// ─── Match Helpers ─────────────────────────────────────────

export function getMatchStatusLabel(status: MatchStatus): string {
  const labels: Record<MatchStatus, string> = {
    SCHEDULED: 'Upcoming',
    LIVE: 'Live',
    HT: 'Half Time',
    FT: 'Full Time',
    AET: 'After Extra Time',
    PEN: 'Penalties',
    SUSP: 'Suspended',
    ABD: 'Abandoned',
    CANC: 'Cancelled',
    TBD: 'TBD',
  };
  return labels[status] ?? status;
}

export function isMatchLive(status: MatchStatus): boolean {
  return status === 'LIVE' || status === 'HT';
}

export function getScoreDisplay(match: Match): string {
  if (match.homeScore === null || match.awayScore === null) return 'vs';
  return `${match.homeScore} - ${match.awayScore}`;
}

// ─── Number Helpers ────────────────────────────────────────

export function formatFee(fee: number, currency = 'EUR'): string {
  if (fee === 0) return 'Free';
  if (fee >= 1_000_000) return `€${(fee / 1_000_000).toFixed(0)}M`;
  if (fee >= 1_000) return `€${(fee / 1_000).toFixed(0)}K`;
  return `€${fee}`;
}

export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(0)}K`;
  return String(views);
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

// ─── String Helpers ────────────────────────────────────────

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '…' : str;
}

// ─── Transfer Confidence ───────────────────────────────────

export function getConfidenceLabel(confidence: number): {
  label: string;
  color: string;
} {
  if (confidence >= 90) return { label: 'Confirmed', color: 'text-live' };
  if (confidence >= 70) return { label: 'Very Likely', color: 'text-brand-gold' };
  if (confidence >= 50) return { label: 'Possible', color: 'text-brand-white' };
  return { label: 'Rumour', color: 'text-brand-gray' };
}

// ─── Prediction Helpers ────────────────────────────────────

export function getPredictionOutcome(
  homeWin: number,
  draw: number,
  awayWin: number
): 'home' | 'draw' | 'away' {
  const max = Math.max(homeWin, draw, awayWin);
  if (max === homeWin) return 'home';
  if (max === draw) return 'draw';
  return 'away';
}

// ─── Form String Parser ────────────────────────────────────

export function parseFormColor(result: string): string {
  if (result === 'W') return 'bg-live';
  if (result === 'D') return 'bg-brand-gold';
  if (result === 'L') return 'bg-brand-red';
  return 'bg-brand-muted';
}

// ─── API URL builder ───────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}
