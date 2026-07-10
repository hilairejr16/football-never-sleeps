'use strict';

const cron = require('node-cron');
const { aggregateAll }          = require('../services/rssAggregator');
const { processBatch, generateDigest } = require('../services/newsProcessor');
const { publishArticle, publishDigest } = require('../services/socialPublisher');
const { checkAndAutoPost }       = require('../services/contentPipeline');

// In-memory article store (DB-backed once schema is migrated)
const articleStore = [];
const MAX_STORE    = 500;

// Stats tracking
const stats = {
  lastBreakingCheck: null,
  lastHourlyRun:     null,
  lastDailyRun:      null,
  lastWeeklyRun:     null,
  totalArticlesFetched: 0,
  totalArticlesProcessed: 0,
  totalPostsPublished: 0,
  errors: [],
  lastError: null,
};

function addArticles(articles) {
  for (const a of articles) {
    if (!articleStore.find(x => x.id === a.id)) {
      articleStore.unshift(a);
    }
  }
  if (articleStore.length > MAX_STORE) articleStore.splice(MAX_STORE);
}

function logError(context, err) {
  const entry = { context, message: err.message, time: new Date().toISOString() };
  stats.errors.unshift(entry);
  stats.lastError = entry;
  if (stats.errors.length > 50) stats.errors.pop();
  console.error(`[Scheduler:${context}]`, err.message);
}

// ─── BREAKING NEWS — Every 5 minutes ──────────────────────
// Fetches all feeds, processes genuinely new articles through AI,
// posts breaking news instantly to all active platforms.
async function runBreakingCheck() {
  stats.lastBreakingCheck = new Date().toISOString();
  try {
    const raw = await aggregateAll();
    if (!raw.length) return;

    stats.totalArticlesFetched += raw.length;
    console.log(`[Breaking] ${raw.length} new articles found`);

    // Separate breaking from regular
    const breaking = raw.filter(a => a.category === 'breaking').slice(0, 3);
    const regular  = raw.filter(a => a.category !== 'breaking').slice(0, 5);

    // Process breaking news first (instant publish)
    if (breaking.length) {
      const processed = await processBatch(breaking, { maxItems: 3, delayMs: 300 });
      stats.totalArticlesProcessed += processed.length;

      for (const article of processed) {
        addArticles([article]);
        try {
          await publishArticle(article);
          stats.totalPostsPublished++;
        } catch (err) {
          logError('breaking:publish', err);
        }
      }
    }

    // Process regular new articles — save but don't immediately post (batched in hourly)
    if (regular.length) {
      const processed = await processBatch(regular, { maxItems: 5, delayMs: 500 });
      stats.totalArticlesProcessed += processed.length;
      addArticles(processed);
    }
  } catch (err) {
    logError('breakingCheck', err);
  }
}

// ─── HOURLY DIGEST — Top of every hour ────────────────────
// Aggregates the past hour's articles into a digest post and publishes.
async function runHourlyDigest() {
  stats.lastHourlyRun = new Date().toISOString();
  try {
    const hourAgo   = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const hourItems = articleStore.filter(a => a.processedAt >= hourAgo && a.processed);

    if (hourItems.length < 2) {
      console.log('[Hourly] Not enough articles for a digest');
      return;
    }

    console.log(`[Hourly] Generating digest from ${hourItems.length} articles`);
    const digest  = await generateDigest(hourItems, 'hourly');
    if (digest) {
      await publishDigest(digest, hourItems, 'hourly');
      stats.totalPostsPublished++;
    }
  } catch (err) {
    logError('hourlyDigest', err);
  }
}

// ─── DAILY ROUNDUP — 8 AM UTC every day ───────────────────
async function runDailyRoundup() {
  stats.lastDailyRun = new Date().toISOString();
  try {
    const dayAgo   = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const dayItems = articleStore.filter(a => a.processedAt >= dayAgo && a.processed);

    if (!dayItems.length) {
      console.log('[Daily] No articles for daily roundup');
      return;
    }

    // Pick top article by category diversity
    const categories  = ['breaking', 'transfer', 'world-cup', 'analysis', 'general'];
    const topArticles = categories.flatMap(cat => {
      const items = dayItems.filter(a => a.category === cat).slice(0, 2);
      return items;
    }).slice(0, 10);

    console.log(`[Daily] Generating roundup from ${topArticles.length} articles`);
    const digest = await generateDigest(topArticles, 'daily');
    if (digest) {
      await publishDigest(digest, topArticles, 'daily');
      stats.totalPostsPublished++;
    }
  } catch (err) {
    logError('dailyRoundup', err);
  }
}

// ─── WEEKLY HIGHLIGHTS — Monday 10 AM UTC ─────────────────
async function runWeeklyHighlights() {
  stats.lastWeeklyRun = new Date().toISOString();
  try {
    const weekAgo   = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const weekItems = articleStore.filter(a => a.processedAt >= weekAgo && a.processed);

    if (!weekItems.length) {
      console.log('[Weekly] No articles for weekly highlights');
      return;
    }

    // Top 10 most significant articles of the week
    const sorted = weekItems
      .sort((a, b) => (b.sourceTrust || 0) - (a.sourceTrust || 0))
      .slice(0, 10);

    console.log(`[Weekly] Generating weekly from ${sorted.length} articles`);
    const digest = await generateDigest(sorted, 'weekly');
    if (digest) {
      await publishDigest(digest, sorted, 'weekly');
      stats.totalPostsPublished++;
    }
  } catch (err) {
    logError('weeklyHighlights', err);
  }
}

// ─── Start All Schedulers ──────────────────────────────────
let schedulerStarted = false;
const jobs = [];

function startContentScheduler() {
  if (schedulerStarted) return;
  schedulerStarted = true;

  // Immediate first run (staggered to not block startup)
  setTimeout(runBreakingCheck, 15_000);

  // Breaking news: every 5 minutes
  jobs.push(cron.schedule('*/5 * * * *', runBreakingCheck, { name: 'breaking-check' }));

  // Hourly digest: :00 of every hour
  jobs.push(cron.schedule('0 * * * *', runHourlyDigest, { name: 'hourly-digest' }));

  // Daily roundup: 8 AM UTC
  jobs.push(cron.schedule('0 8 * * *', runDailyRoundup, { name: 'daily-roundup' }));

  // Weekly: Monday 10 AM UTC
  jobs.push(cron.schedule('0 10 * * 1', runWeeklyHighlights, { name: 'weekly-highlights' }));

  // Video pipeline: auto-detect completed matches every 3 min
  jobs.push(cron.schedule('*/3 * * * *', () => {
    checkAndAutoPost().catch(e => console.error('[Scheduler] video-auto-check:', e.message));
  }, { name: 'video-auto-post' }));

  console.log('[Scheduler] Content pipeline started:');
  console.log('  • Breaking news check:  every 5 min');
  console.log('  • Hourly digest:        :00 every hour');
  console.log('  • Daily roundup:        08:00 UTC daily');
  console.log('  • Weekly highlights:    Mon 10:00 UTC');
  console.log('  • Video auto-post:      every 3 min (match detection)');
}

function stopContentScheduler() {
  jobs.forEach(j => j.destroy());
  jobs.length = 0;
  schedulerStarted = false;
  console.log('[Scheduler] Content pipeline stopped');
}

function getStats()     { return { ...stats, articleStoreSize: articleStore.length }; }
function getArticles(limit = 50) { return articleStore.slice(0, limit); }

// Manual triggers (for admin API)
module.exports = {
  startContentScheduler,
  stopContentScheduler,
  runBreakingCheck,
  runHourlyDigest,
  runDailyRoundup,
  runWeeklyHighlights,
  getStats,
  getArticles,
};
