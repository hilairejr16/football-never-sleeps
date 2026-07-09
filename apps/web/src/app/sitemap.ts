import type { MetadataRoute } from 'next';

const BASE = process.env.APP_URL ?? 'https://www.goalrushglobal.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const articleSlugs = [
    { slug: 'england-france-qf-preview',   date: '2026-07-09T10:00:00Z' },
    { slug: 'yamal-masterclass-analysis',  date: '2026-07-09T08:30:00Z' },
    { slug: 'messi-farewell-world-cup',    date: '2026-07-09T07:00:00Z' },
    { slug: 'brazil-argentina-qf-preview', date: '2026-07-09T06:00:00Z' },
    { slug: 'mbappe-golden-boot-race',     date: '2026-07-09T05:00:00Z' },
    { slug: 'usa-surprise-package',        date: '2026-07-09T04:00:00Z' },
    { slug: 'transfer-window-post-wc',     date: '2026-07-09T03:00:00Z' },
    { slug: 'ronaldo-last-dance-portugal', date: '2026-07-09T02:00:00Z' },
    { slug: 'germany-dark-horses',         date: '2026-07-09T01:00:00Z' },
    { slug: 'metlife-stadium-final-venue', date: '2026-07-09T00:00:00Z' },
    { slug: 'spain-possession-stats',      date: '2026-07-08T23:00:00Z' },
    { slug: '48-team-format-verdict',      date: '2026-07-08T22:00:00Z' },
  ];

  const articlePages: MetadataRoute.Sitemap = articleSlugs.map(({ slug, date }) => ({
    url: `${BASE}/news/${slug}`,
    lastModified: date,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                              lastModified: now, changeFrequency: 'hourly',  priority: 1.0 },
    { url: `${BASE}/world-cup`,               lastModified: now, changeFrequency: 'hourly',  priority: 0.95 },
    { url: `${BASE}/live-scores`,             lastModified: now, changeFrequency: 'always',  priority: 0.9 },
    { url: `${BASE}/news`,                    lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${BASE}/transfers`,               lastModified: now, changeFrequency: 'hourly',  priority: 0.85 },
    { url: `${BASE}/predictions`,             lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/fixtures`,                lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/results`,                 lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/statistics`,              lastModified: now, changeFrequency: 'daily',   priority: 0.75 },
    { url: `${BASE}/teams`,                   lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/league/premier-league`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/league/la-liga`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/league/serie-a`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.65 },
    { url: `${BASE}/league/bundesliga`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.65 },
    { url: `${BASE}/league/ligue-1`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.65 },
    { url: `${BASE}/league/champions-league`, lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/league/europa-league`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE}/league/mls`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE}/league/saudi-pro-league`, lastModified: now, changeFrequency: 'weekly',  priority: 0.55 },
    { url: `${BASE}/about`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/advertise`,               lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/cookies`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE}/editorial-policy`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE}/accessibility`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
  ];

  return [...staticPages, ...articlePages];
}
