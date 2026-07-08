'use strict';

const crypto = require('crypto');

// RSS_FEEDS — 15 premier football sources covering all global regions.
// Each article is fetched, normalized, and attributed to its source.
const RSS_FEEDS = [
  // ── English Premier Sources ────────────────────────────────
  { name: 'BBC Sport Football',    url: 'https://feeds.bbci.co.uk/sport/football/rss.xml',              region: 'UK',   trust: 10 },
  { name: 'Sky Sports Football',   url: 'https://www.skysports.com/rss/12040',                           region: 'UK',   trust: 10 },
  { name: 'The Guardian Football', url: 'https://www.theguardian.com/football/rss',                      region: 'UK',   trust: 10 },
  { name: 'ESPN Soccer',           url: 'https://www.espn.com/espn/rss/soccer/news',                     region: 'US',   trust: 9  },
  { name: 'Goal.com',              url: 'https://www.goal.com/feeds/en/news',                            region: 'INT',  trust: 9  },
  { name: '90min',                 url: 'https://www.90min.com/feed',                                    region: 'INT',  trust: 8  },
  { name: 'Football365',           url: 'https://www.football365.com/feed',                              region: 'UK',   trust: 8  },
  { name: 'Sport Bible',           url: 'https://www.sportbible.com/football/rss',                       region: 'UK',   trust: 7  },
  { name: 'Planet Football',       url: 'https://www.planetfootball.com/feed/',                          region: 'UK',   trust: 7  },
  // ── European Spanish Sources ───────────────────────────────
  { name: 'AS English',            url: 'https://en.as.com/rss/',                                       region: 'ES',   trust: 9  },
  { name: 'Marca English',         url: 'https://www.marca.com/en/rss/soccer.xml',                      region: 'ES',   trust: 8  },
  { name: 'Mundo Deportivo',       url: 'https://www.mundodeportivo.com/feed/soccer.rss',               region: 'ES',   trust: 7  },
  // ── Italian Source ─────────────────────────────────────────
  { name: 'Football Italia',       url: 'https://www.football-italia.net/rss.xml',                      region: 'IT',   trust: 8  },
  // ── Transfer & Data Specialists ────────────────────────────
  { name: 'Tribal Football',       url: 'https://www.tribalfootball.com/rss.xml',                       region: 'INT',  trust: 7  },
  { name: 'Sportsmole Football',   url: 'https://www.sportsmole.co.uk/football/feed.rss',               region: 'UK',   trust: 7  },
];

// Keywords that indicate a World Cup / international article
const WC_KEYWORDS   = ['world cup', 'wc2026', 'wc 2026', 'fifa', 'quarter-final', 'semi-final', 'final', 'international', 'national team'];
const TRANSFER_KW   = ['transfer', 'signing', 'deal', 'fee', 'bid', 'contract', 'move', 'join', 'loan', 'window', 'target'];
const BREAKING_KW   = ['breaking', 'official', 'confirmed', 'done deal', 'announced', 'sacked', 'appointed', 'resign'];
const ANALYSIS_KW   = ['analysis', 'tactics', 'review', 'opinion', 'verdict', 'ratings', 'column', 'how'];

// In-memory dedup store — URL hash → expiry timestamp (24h)
const seenUrls = new Map();
const SEEN_TTL = 24 * 60 * 60 * 1000;

function urlHash(url) {
  return crypto.createHash('sha1').update(url || '').digest('hex').slice(0, 16);
}

function isNew(url) {
  const h = urlHash(url);
  const exp = seenUrls.get(h);
  if (exp && Date.now() < exp) return false;
  seenUrls.set(h, Date.now() + SEEN_TTL);
  // Prune old entries every 1000 inserts
  if (seenUrls.size > 5000) {
    const now = Date.now();
    for (const [k, v] of seenUrls) if (v < now) seenUrls.delete(k);
  }
  return true;
}

function detectCategory(text) {
  const t = text.toLowerCase();
  if (BREAKING_KW.some(k => t.includes(k)))  return 'breaking';
  if (TRANSFER_KW.some(k => t.includes(k)))  return 'transfer';
  if (WC_KEYWORDS.some(k => t.includes(k)))  return 'world-cup';
  if (ANALYSIS_KW.some(k => t.includes(k)))  return 'analysis';
  return 'general';
}

function normalizeItem(item, source) {
  const title   = (item.title || '').trim().replace(/\s+/g, ' ');
  const url     = item.link || item.guid || '';
  const pubDate = item.pubDate || item.isoDate || new Date().toISOString();
  const excerpt = (item.contentSnippet || item.summary || item.content || '')
    .replace(/<[^>]+>/g, '')  // strip HTML
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500);

  const combined = `${title} ${excerpt}`;
  return {
    id:          urlHash(url),
    title,
    url,
    excerpt,
    source:      source.name,
    sourceRegion: source.region,
    sourceTrust: source.trust,
    category:    detectCategory(combined),
    publishedAt: new Date(pubDate).toISOString(),
    fetchedAt:   new Date().toISOString(),
    image:       item.enclosure?.url || item['media:content']?.['$']?.url || null,
    processed:   false,
    posted:      false,
  };
}

async function fetchFeed(source) {
  try {
    // Dynamic import so module load doesn't fail if rss-parser is missing
    const Parser = require('rss-parser');
    const parser = new Parser({
      timeout: 10_000,
      customFields: { item: [['media:content', 'media:content', { keepArray: false }]] },
      headers: {
        'User-Agent': 'GoalRush Global News Bot/1.0 (+https://goalrushglobal.com)',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    });

    const feed = await parser.parseURL(source.url);
    const items = (feed.items || []).slice(0, 20); // max 20 per feed per cycle

    return items
      .map(item => normalizeItem(item, source))
      .filter(a => {
        // Skip if older than 48 hours
        const age = Date.now() - new Date(a.publishedAt).getTime();
        return age < 48 * 60 * 60 * 1000;
      });
  } catch (err) {
    console.error(`[RSS] ${source.name} failed: ${err.message}`);
    return [];
  }
}

// Fetch all feeds in parallel, return only new articles sorted by trust + recency
async function fetchAllFeeds({ onlyNew = true } = {}) {
  const results = await Promise.allSettled(RSS_FEEDS.map(s => fetchFeed(s)));

  const all = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);

  // Deduplicate within batch by URL hash
  const seen = new Set();
  const unique = all.filter(a => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });

  const filtered = onlyNew ? unique.filter(a => isNew(a.url)) : unique;

  // Sort: breaking first, then by trust score * recency
  return filtered.sort((a, b) => {
    const aScore = (a.category === 'breaking' ? 1000 : 0) + a.sourceTrust * 10
                 - (Date.now() - new Date(a.publishedAt).getTime()) / 60_000;
    const bScore = (b.category === 'breaking' ? 1000 : 0) + b.sourceTrust * 10
                 - (Date.now() - new Date(b.publishedAt).getTime()) / 60_000;
    return bScore - aScore;
  });
}

// NewsAPI supplement — if NEWS_API_KEY is set, fetch football headlines too
async function fetchNewsAPI() {
  const key = process.env.NEWS_API_KEY;
  if (!key) return [];
  try {
    const url = `https://newsapi.org/v2/everything?q=soccer+football+world+cup+2026&sortBy=publishedAt&language=en&pageSize=20&apiKey=${key}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return [];
    const { articles = [] } = await res.json();
    return articles.map(a => ({
      id:          urlHash(a.url),
      title:       a.title || '',
      url:         a.url || '',
      excerpt:     (a.description || '').slice(0, 500),
      source:      a.source?.name || 'NewsAPI',
      sourceRegion: 'INT',
      sourceTrust: 8,
      category:    detectCategory(`${a.title} ${a.description}`),
      publishedAt: a.publishedAt || new Date().toISOString(),
      fetchedAt:   new Date().toISOString(),
      image:       a.urlToImage || null,
      processed:   false,
      posted:      false,
    })).filter(a => isNew(a.url));
  } catch (err) {
    console.error('[NewsAPI] failed:', err.message);
    return [];
  }
}

// Full aggregation — RSS feeds + NewsAPI
async function aggregateAll() {
  const [rss, newsApi] = await Promise.all([fetchAllFeeds(), fetchNewsAPI()]);
  const combined = [...rss, ...newsApi];
  // Final dedup
  const seen = new Set();
  return combined.filter(a => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });
}

// Mark URL as seen (called after DB save to prevent re-processing on restart)
function markSeen(url) { isNew(url); }

module.exports = { aggregateAll, fetchAllFeeds, fetchNewsAPI, detectCategory, markSeen, RSS_FEEDS };
