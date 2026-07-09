require('dotenv').config({ path: '../../.env' });
const cron = require('node-cron');
const pino = require('pino');
const { runDailyAutomation } = require('./daily');
const { runHourlyAutomation } = require('./hourly');
const { runLiveMatchAutomation } = require('./live-match');
const { runWeeklyAutomation } = require('./weekly');
const pipeline = require('../social/post-pipeline');

const logger = pino({ level: 'info' });

logger.info('GoalRush Global Automation Scheduler starting...');

// ─── DAILY TASKS — 6:00 AM UTC ────────────────────────────
cron.schedule('0 6 * * *', async () => {
  logger.info('[Cron] Running daily automation');
  try {
    await runDailyAutomation();
    logger.info('[Cron] Daily automation complete');
  } catch (err) {
    logger.error({ err }, '[Cron] Daily automation failed');
  }
}, { timezone: 'UTC' });

// ─── HOURLY TASKS ─────────────────────────────────────────
cron.schedule('0 * * * *', async () => {
  logger.info('[Cron] Running hourly automation');
  try {
    await runHourlyAutomation();
    logger.info('[Cron] Hourly automation complete');
  } catch (err) {
    logger.error({ err }, '[Cron] Hourly automation failed');
  }
}, { timezone: 'UTC' });

// ─── LIVE MATCH MONITORING — every 2 minutes ──────────────
cron.schedule('*/2 * * * *', async () => {
  try {
    await runLiveMatchAutomation();
  } catch (err) {
    logger.error({ err }, '[Cron] Live match check failed');
  }
}, { timezone: 'UTC' });

// ─── WEEKLY RECAP — Monday 8:00 AM UTC ────────────────────
cron.schedule('0 8 * * 1', async () => {
  logger.info('[Cron] Running weekly recap automation');
  try {
    await runWeeklyAutomation();
    logger.info('[Cron] Weekly automation complete');
  } catch (err) {
    logger.error({ err }, '[Cron] Weekly automation failed');
  }
}, { timezone: 'UTC' });

// ─── MORNING PREDICTIONS — 7:00 AM UTC ───────────────────
cron.schedule('0 7 * * *', async () => {
  logger.info('[Cron] Generating today\'s match predictions');
  try {
    const axios = require('axios');
    await axios.post(`${process.env.AI_ENGINE_URL}/generate/daily-batch`);
    logger.info('[Cron] Predictions generated');
  } catch (err) {
    logger.error({ err }, '[Cron] Prediction generation failed');
  }
}, { timezone: 'UTC' });

// ─── SOCIAL MEDIA POSTING SCHEDULE ───────────────────────

// 07:00 UTC — Morning briefing (today's WC + Gold Cup fixtures)
cron.schedule('0 7 * * *', async () => {
  logger.info('[Social] Posting morning briefing');
  try {
    await pipeline.postMorningBriefing();
    logger.info('[Social] Morning briefing posted');
  } catch (err) {
    logger.error({ err }, '[Social] Morning briefing failed');
  }
}, { timezone: 'UTC' });

// 09:00 UTC — WC daily summary (last night's results)
cron.schedule('0 9 * * *', async () => {
  logger.info('[Social] Posting World Cup daily summary');
  try {
    await pipeline.postWorldCupDailySummary();
  } catch (err) {
    logger.error({ err }, '[Social] WC summary failed');
  }
}, { timezone: 'UTC' });

// 12:00 UTC — Gold Cup daily summary
cron.schedule('0 12 * * *', async () => {
  logger.info('[Social] Posting Gold Cup daily summary');
  try {
    await pipeline.postGoldCupDailySummary();
  } catch (err) {
    logger.error({ err }, '[Social] GC summary failed');
  }
}, { timezone: 'UTC' });

// 22:00 UTC — Evening recap (all day's FT results)
cron.schedule('0 22 * * *', async () => {
  logger.info('[Social] Posting evening recap');
  try {
    await pipeline.postEveningRecap();
    logger.info('[Social] Evening recap posted');
  } catch (err) {
    logger.error({ err }, '[Social] Evening recap failed');
  }
}, { timezone: 'UTC' });

logger.info(`
╔═══════════════════════════════════════╗
║   GoalRush Global Automation Active   ║
║   Football Never Sleeps.              ║
╚═══════════════════════════════════════╝

Scheduled jobs:
  📅 Daily     — 06:00 UTC (article generation + AI engine)
  ⏰ Hourly    — :00 UTC (score updates, breaking news)
  ⚽ Live      — Every 2 min (goal alerts, match monitoring)
  📊 Weekly    — Mon 08:00 UTC (weekly roundup)
  🔮 Predict   — 07:00 UTC (match predictions + morning briefing social)
  📱 Social    — 07:00 morning briefing, 09:00 WC recap, 12:00 GC recap, 22:00 evening
`);
