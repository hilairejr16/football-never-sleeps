'use strict';

// ─── /content — News aggregation & social publishing admin API ────────────────
// Protected by JWT admin auth. Used to monitor, trigger, and manage the pipeline.

const express     = require('express');
const { requireAdmin } = require('../middleware/auth');
const { aggregateAll, RSS_FEEDS } = require('../services/rssAggregator');
const { processArticle, processBatch, generateDigest } = require('../services/newsProcessor');
const { publishArticle, publishDigest, getPlatformStatus, getQueue, getLog } = require('../services/socialPublisher');
const { runVideoPipeline, checkAndAutoPost, getJob, getAllJobs } = require('../services/contentPipeline');
const {
  runBreakingCheck, runHourlyDigest, runDailyRoundup, runWeeklyHighlights,
  getStats, getArticles,
} = require('../workers/contentScheduler');

const router = express.Router();

// All /content endpoints require admin JWT
router.use(requireAdmin);

// ─── GET /content/status ─────────────────────────────────
// Pipeline health, scheduler stats, platform credentials status
router.get('/status', (req, res) => {
  res.json({
    status:    'ok',
    scheduler: getStats(),
    platforms: getPlatformStatus(),
    sources:   RSS_FEEDS.map(f => ({ name: f.name, region: f.region, trust: f.trust, url: f.url })),
  });
});

// ─── GET /content/articles ───────────────────────────────
// Recent articles from the in-memory store
router.get('/articles', (req, res) => {
  const limit    = Math.min(parseInt(req.query.limit) || 50, 200);
  const category = req.query.category;
  let articles   = getArticles(limit * 2);
  if (category) articles = articles.filter(a => a.category === category);
  res.json({ status: 'ok', data: articles.slice(0, limit), total: articles.length });
});

// ─── GET /content/queue ──────────────────────────────────
// Social media post queue and recent post log
router.get('/queue', (req, res) => {
  res.json({ status: 'ok', queue: getQueue(), recentLog: getLog() });
});

// ─── POST /content/trigger ───────────────────────────────
// Manually trigger a pipeline run
router.post('/trigger', async (req, res) => {
  const { type = 'breaking' } = req.body;
  const triggers = {
    breaking: runBreakingCheck,
    hourly:   runHourlyDigest,
    daily:    runDailyRoundup,
    weekly:   runWeeklyHighlights,
  };

  const fn = triggers[type];
  if (!fn) return res.status(400).json({ status: 'error', message: `Unknown type: ${type}. Use breaking|hourly|daily|weekly` });

  // Run async in background, return immediately
  fn().catch(err => console.error('[content/trigger]', err));
  res.json({ status: 'ok', message: `${type} pipeline triggered`, triggeredAt: new Date().toISOString() });
});

// ─── POST /content/fetch ─────────────────────────────────
// Fetch latest articles from all RSS sources (preview, no processing)
router.post('/fetch', async (req, res) => {
  try {
    const articles = await aggregateAll();
    res.json({
      status:   'ok',
      fetched:  articles.length,
      articles: articles.slice(0, 30),
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── POST /content/process ───────────────────────────────
// AI-process a single raw article (for testing the pipeline)
router.post('/process', async (req, res) => {
  const { article } = req.body;
  if (!article?.title || !article?.url) {
    return res.status(400).json({ status: 'error', message: 'article.title and article.url required' });
  }
  try {
    const processed = await processArticle(article);
    res.json({ status: 'ok', data: processed });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── POST /content/publish ───────────────────────────────
// Manually publish a (processed) article to social platforms
router.post('/publish', async (req, res) => {
  const { article, platforms: targetPlatforms } = req.body;
  if (!article?.title) {
    return res.status(400).json({ status: 'error', message: 'article.title required' });
  }
  try {
    const results = await publishArticle(article, { platforms: targetPlatforms });
    res.json({ status: 'ok', results });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── POST /content/digest ────────────────────────────────
// Generate and publish a digest from the current article store
router.post('/digest', async (req, res) => {
  const { type = 'hourly' } = req.body;
  if (!['hourly', 'daily', 'weekly'].includes(type)) {
    return res.status(400).json({ status: 'error', message: 'type must be hourly|daily|weekly' });
  }
  try {
    const articles = getArticles(50).filter(a => a.processed);
    const digest   = await generateDigest(articles, type);
    if (!digest) return res.status(200).json({ status: 'ok', message: 'No content for digest' });

    const published = await publishDigest(digest, articles, type);
    res.json({ status: 'ok', digest, published });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── GET /content/sources ────────────────────────────────
// List all RSS sources with metadata
router.get('/sources', (req, res) => {
  res.json({
    status:  'ok',
    total:   RSS_FEEDS.length,
    sources: RSS_FEEDS,
  });
});

// ════════════════════════════════════════════════════════════
// VIDEO PIPELINE — Faceless content generation
// ════════════════════════════════════════════════════════════

// ─── POST /content/video/generate ───────────────────────
// Trigger video generation for a match (manual or test)
// Body: { match: { id, homeTeam: {name}, awayTeam: {name}, homeScore, awayScore, league: {name, round}, stats: {possession, homeShots, awayShots, homeOnTarget, awayOnTarget} } }
router.post('/video/generate', async (req, res) => {
  const { match } = req.body;
  if (!match?.homeTeam || !match?.awayTeam) {
    return res.status(400).json({ status: 'error', message: 'match.homeTeam and match.awayTeam are required' });
  }

  // Fire-and-forget — returns jobId immediately
  const { createJob } = require('../services/contentPipeline');
  const jobId = createJob(match);

  runVideoPipeline(match, jobId).catch(err =>
    console.error(`[/content/video/generate] job ${jobId}:`, err.message)
  );

  res.json({
    status:  'ok',
    jobId,
    message: 'Video pipeline started — poll /content/video/status/:jobId for progress',
    platforms: {
      youtube: !!process.env.YOUTUBE_CLIENT_ID,
      twitter: !!process.env.TWITTER_API_KEY,
      tiktok:  !!process.env.TIKTOK_ACCESS_TOKEN,
      tts:     !!process.env.ELEVENLABS_API_KEY,
    },
  });
});

// ─── GET /content/video/status/:jobId ───────────────────
router.get('/video/status/:jobId', (req, res) => {
  const job = getJob(req.params.jobId);
  if (!job) return res.status(404).json({ status: 'error', message: 'Job not found' });
  res.json({ status: 'ok', job });
});

// ─── GET /content/video/jobs ────────────────────────────
router.get('/video/jobs', (req, res) => {
  res.json({ status: 'ok', jobs: getAllJobs().slice(0, 20) });
});

// ─── POST /content/video/auto-check ─────────────────────
// Manually trigger the match detection scan
router.post('/video/auto-check', async (req, res) => {
  const count = await checkAndAutoPost();
  res.json({ status: 'ok', completedMatchesFound: count });
});

module.exports = router;
