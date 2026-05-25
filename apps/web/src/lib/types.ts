// ─── Core Domain Types ─────────────────────────────────────

export interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  country: string;
  founded?: number;
  venue?: string;
}

export interface Player {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  nationality: string;
  position: string;
  age: number;
  photo: string;
  teamId: number;
  team?: Team;
  number?: number;
  marketValue?: number;
  stats?: PlayerStats;
}

export interface PlayerStats {
  goals: number;
  assists: number;
  appearances: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  rating?: number;
}

export interface Match {
  id: number;
  status: MatchStatus;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  minute?: number;
  date: string;
  venue?: string;
  league: League;
  events?: MatchEvent[];
  stats?: MatchStats;
  lineups?: Lineups;
  halfTimeScore?: { home: number; away: number };
  referee?: string;
}

export type MatchStatus =
  | 'SCHEDULED'
  | 'LIVE'
  | 'HT'
  | 'FT'
  | 'AET'
  | 'PEN'
  | 'SUSP'
  | 'ABD'
  | 'CANC'
  | 'TBD';

export interface MatchEvent {
  id: number;
  minute: number;
  type: 'GOAL' | 'CARD' | 'SUBST' | 'VAR';
  detail: string;
  player: { id: number; name: string };
  assist?: { id: number; name: string };
  team: Team;
}

export interface MatchStats {
  ballPossession: [number, number];
  totalShots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  offsides: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
  passes: [number, number];
  passAccuracy: [number, number];
}

export interface Lineups {
  home: {
    formation: string;
    startXI: Player[];
    substitutes: Player[];
    coach: { name: string; photo: string };
  };
  away: {
    formation: string;
    startXI: Player[];
    substitutes: Player[];
    coach: { name: string; photo: string };
  };
}

export interface League {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  country: string;
  flag?: string;
  season: number;
  type: 'League' | 'Cup' | 'International';
}

export interface Standing {
  rank: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: string; // e.g. "WWDLW"
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  tags: string[];
  imageUrl: string;
  imageAlt: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  league?: string;
  teams?: string[];
  players?: string[];
  isBreaking: boolean;
  views: number;
  readTime: number;
  seoTitle?: string;
  seoDescription?: string;
}

export type NewsCategory =
  | 'breaking'
  | 'match-report'
  | 'transfer'
  | 'analysis'
  | 'opinion'
  | 'preview'
  | 'stats'
  | 'history'
  | 'women'
  | 'youth';

export interface Transfer {
  id: string;
  player: Player;
  fromTeam: Team;
  toTeam: Team;
  fee?: number;
  feeCurrency?: string;
  loanType?: 'permanent' | 'loan' | 'free' | 'loan-to-buy';
  status: 'rumour' | 'confirmed' | 'completed' | 'failed';
  confidence: number; // 0-100
  source?: string;
  date?: string;
  contractYears?: number;
}

export interface Prediction {
  id: string;
  match: Match;
  homeWinPct: number;
  drawPct: number;
  awayWinPct: number;
  predictedScore: { home: number; away: number };
  btts: boolean; // Both teams to score
  over25Goals: boolean;
  keyFactor: string;
  confidence: number;
  generatedAt: string;
}

export interface LiveScore {
  matchId: number;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: MatchStatus;
  lastEvent?: MatchEvent;
}

// ─── API Response Wrappers ──────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Social Media ───────────────────────────────────────────

export interface SocialPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'tiktok' | 'facebook' | 'youtube';
  content: string;
  mediaUrls?: string[];
  hashtags: string[];
  scheduledAt: string;
  publishedAt?: string;
  status: 'pending' | 'published' | 'failed';
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
    views?: number;
  };
}

// ─── Admin / Dashboard ──────────────────────────────────────

export interface DashboardStats {
  totalArticles: number;
  articlesToday: number;
  totalViews: number;
  viewsToday: number;
  socialPosts: number;
  socialPostsToday: number;
  liveMatches: number;
  scheduledContent: number;
  revenue: {
    today: number;
    thisMonth: number;
    currency: string;
  };
}
