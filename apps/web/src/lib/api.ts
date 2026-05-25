import type {
  Match,
  NewsArticle,
  Transfer,
  Standing,
  Prediction,
  League,
  Player,
  Team,
  ApiResponse,
  DashboardStats,
} from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `API error ${res.status}`);
  }

  return res.json();
}

// ─── Matches ───────────────────────────────────────────────

export const matchApi = {
  getLive: () => fetchApi<Match[]>('/matches/live'),
  getToday: () => fetchApi<Match[]>('/matches/today'),
  getByDate: (date: string) => fetchApi<Match[]>(`/matches/date/${date}`),
  getById: (id: number) => fetchApi<Match>(`/matches/${id}`),
  getFixtures: (leagueId?: number) =>
    fetchApi<Match[]>(`/matches/fixtures${leagueId ? `?league=${leagueId}` : ''}`),
  getResults: (page = 1) => fetchApi<Match[]>(`/matches/results?page=${page}`),
};

// ─── News ──────────────────────────────────────────────────

export const newsApi = {
  getLatest: (limit = 10) => fetchApi<NewsArticle[]>(`/news?limit=${limit}`),
  getBreaking: () => fetchApi<NewsArticle[]>('/news/breaking'),
  getBySlug: (slug: string) => fetchApi<NewsArticle>(`/news/${slug}`),
  getByCategory: (cat: string, page = 1) =>
    fetchApi<NewsArticle[]>(`/news/category/${cat}?page=${page}`),
  search: (q: string) => fetchApi<NewsArticle[]>(`/news/search?q=${encodeURIComponent(q)}`),
};

// ─── Transfers ─────────────────────────────────────────────

export const transferApi = {
  getLatest: (limit = 20) => fetchApi<Transfer[]>(`/transfers?limit=${limit}`),
  getConfirmed: () => fetchApi<Transfer[]>('/transfers/confirmed'),
  getRumours: () => fetchApi<Transfer[]>('/transfers/rumours'),
  getByPlayer: (playerId: number) => fetchApi<Transfer[]>(`/transfers/player/${playerId}`),
  getByTeam: (teamId: number) => fetchApi<Transfer[]>(`/transfers/team/${teamId}`),
};

// ─── Standings ─────────────────────────────────────────────

export const standingsApi = {
  getByLeague: (leagueId: number, season?: number) =>
    fetchApi<Standing[]>(`/standings/${leagueId}${season ? `?season=${season}` : ''}`),
};

// ─── Predictions ───────────────────────────────────────────

export const predictionApi = {
  getToday: () => fetchApi<Prediction[]>('/predictions/today'),
  getByMatch: (matchId: number) => fetchApi<Prediction>(`/predictions/match/${matchId}`),
};

// ─── Leagues ───────────────────────────────────────────────

export const leagueApi = {
  getAll: () => fetchApi<League[]>('/leagues'),
  getById: (id: number) => fetchApi<League>(`/leagues/${id}`),
};

// ─── Players ───────────────────────────────────────────────

export const playerApi = {
  search: (q: string) => fetchApi<Player[]>(`/players/search?q=${encodeURIComponent(q)}`),
  getById: (id: number) => fetchApi<Player>(`/players/${id}`),
  getTopScorers: (leagueId: number) => fetchApi<Player[]>(`/players/top-scorers/${leagueId}`),
};

// ─── Teams ─────────────────────────────────────────────────

export const teamApi = {
  getById: (id: number) => fetchApi<Team>(`/teams/${id}`),
  search: (q: string) => fetchApi<Team[]>(`/teams/search?q=${encodeURIComponent(q)}`),
};

// ─── Admin ─────────────────────────────────────────────────

export const adminApi = {
  getStats: () =>
    fetchApi<DashboardStats>('/admin/stats', {
      headers: {
        Authorization: `Bearer ${
          typeof window !== 'undefined' ? localStorage.getItem('gr_token') ?? '' : ''
        }`,
      },
    }),
  triggerContentGeneration: (type: string) =>
    fetchApi<{ jobId: string }>('/admin/generate', {
      method: 'POST',
      body: JSON.stringify({ type }),
    }),
  getScheduledPosts: () => fetchApi<unknown[]>('/admin/scheduled'),
};
