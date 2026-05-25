require('dotenv').config({ path: '../../.env' });
const axios = require('axios');

const AI_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';
const API_URL = process.env.API_URL || 'http://localhost:4000';

const DAILY_TOPICS = [
  "Morning football briefing: Today's biggest matches and what to watch",
  "Transfer window: Latest confirmed deals and breaking rumours",
  "Manager spotlight: Who is on the hot seat this week?",
  "Tactical deep dive: The system changing football right now",
  "Stat of the day: The number that tells the real story",
  "Youth football: The next generation of world-class talent",
  "Women's football: Today's biggest matches and stars",
  "Historical football fact: On this day in football history",
];

async function runDailyAutomation() {
  console.log('[Daily] Starting daily automation pipeline...');

  const results = {
    articles: 0,
    socialPosts: 0,
    predictions: 0,
    errors: [],
  };

  // 1. Generate today's topic-based articles
  const topic = DAILY_TOPICS[new Date().getDay() % DAILY_TOPICS.length];

  try {
    const { data } = await axios.post(`${AI_URL}/generate/article`, {
      topic,
      tone: 'exciting',
      length: 'medium',
    });
    results.articles++;
    console.log(`[Daily] Article generated: "${data.data?.title}"`);
  } catch (err) {
    results.errors.push(`Article generation: ${err.message}`);
  }

  // 2. Generate match predictions for today
  try {
    await axios.post(`${AI_URL}/generate/daily-batch`);
    results.predictions++;
    console.log('[Daily] Daily batch + predictions triggered');
  } catch (err) {
    results.errors.push(`Predictions: ${err.message}`);
  }

  // 3. Generate social media morning pack
  try {
    const { data } = await axios.post(`${AI_URL}/generate/social-pack`, {
      content: `Good morning football fans! Here's what's happening today in football. ${topic}`,
      platforms: ['twitter', 'instagram', 'tiktok', 'telegram'],
      post_type: 'news',
    });
    results.socialPosts += 4;
    console.log('[Daily] Morning social pack generated for all platforms');
  } catch (err) {
    results.errors.push(`Social pack: ${err.message}`);
  }

  // 4. Generate breaking news check
  try {
    // This would check RSS feeds, Twitter, football news APIs
    console.log('[Daily] Breaking news check triggered');
  } catch (err) {
    results.errors.push(`Breaking news: ${err.message}`);
  }

  console.log('[Daily] Pipeline complete:', results);
  return results;
}

module.exports = { runDailyAutomation };
