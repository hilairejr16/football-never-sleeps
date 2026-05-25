require('dotenv').config({ path: '../../.env' });
const cron = require('node-cron');
const pino = require('pino');
const { runDailyAutomation } = require('./daily');
const { runHourlyAutomation } = require('./hourly');
const { runLiveMatchAutomation } = require('./live-match');
const { runWeeklyAutomation } = require('./weekly');

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
// 9 AM — Morning football news post
cron.schedule('0 9 * * *', () => schedulePost('morning-news'), { timezone: 'UTC' });
// 12 PM — Midday update
cron.schedule('0 12 * * *', () => schedulePost('midday-update'), { timezone: 'UTC' });
// 6 PM — Evening highlights / transfer news
cron.schedule('0 18 * * *', () => schedulePost('evening-highlights'), { timezone: 'UTC' });
// 10 PM — Late night reaction / stats
cron.schedule('0 22 * * *', () => schedulePost('night-stats'), { timezone: 'UTC' });

async function schedulePost(type) {
  const axios = require('axios');
  try {
    await axios.post(`${process.env.API_URL}/admin/generate`, { type });
  } catch (err) {
    logger.error({ err, type }, '[Cron] Scheduled post failed');
  }
}

logger.info(`
╔═══════════════════════════════════════╗
║   GoalRush Global Automation Active   ║
║   Football Never Sleeps.              ║
╚═══════════════════════════════════════╝

Scheduled jobs:
  📅 Daily     — 06:00 UTC (morning briefing + article generation)
  ⏰ Hourly    — :00 UTC (score updates, breaking news check)
  ⚽ Live      — Every 2 min (goal alerts, match monitoring)
  📊 Weekly    — Mon 08:00 UTC (weekly roundup)
  🔮 Predict   — 07:00 UTC (daily match predictions)
  📱 Social    — 09:00, 12:00, 18:00, 22:00 UTC
`);
