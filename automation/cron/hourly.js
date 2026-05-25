require('dotenv').config({ path: '../../.env' });
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:4000';
const AI_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

async function runHourlyAutomation() {
  const hour = new Date().getUTCHours();
  console.log(`[Hourly] Running at ${hour}:00 UTC`);

  const results = { tasks: [], errors: [] };

  // 1. Check for live matches and post score updates
  try {
    const { data } = await axios.get(`${API_URL}/matches/live`);
    const liveMatches = data.data || [];

    if (liveMatches.length > 0) {
      console.log(`[Hourly] ${liveMatches.length} live matches detected`);

      // Generate social posts for live action
      for (const match of liveMatches.slice(0, 3)) {
        const summary = `${match.homeTeam.name} ${match.homeScore}-${match.awayScore} ${match.awayTeam.name} (${match.minute}')`;

        await axios.post(`${AI_URL}/generate/social-pack`, {
          content: `LIVE UPDATE: ${summary}`,
          platforms: ['twitter', 'telegram'],
          post_type: 'news',
          match_data: match,
        }).catch(() => {});
      }

      results.tasks.push(`Live match updates: ${liveMatches.length} matches`);
    }
  } catch (err) {
    results.errors.push(`Live check: ${err.message}`);
  }

  // 2. During peak hours (12-22 UTC), generate extra content
  if (hour >= 12 && hour <= 22) {
    try {
      const trendingTopics = [
        'Premier League title race latest update',
        'Champions League goals and highlights',
        'Transfer rumour mill — latest whispers',
        'Hot take: Most controversial decision in football this week',
      ];

      const topic = trendingTopics[hour % trendingTopics.length];
      await axios.post(`${AI_URL}/generate/article`, {
        topic,
        tone: 'exciting',
        length: 'short',
      });

      results.tasks.push(`Hourly article: "${topic}"`);
    } catch (err) {
      results.errors.push(`Hourly article: ${err.message}`);
    }
  }

  // 3. X (Twitter) automated thread about ongoing matches
  if (hour >= 14 && hour <= 22) {
    try {
      const { data } = await axios.get(`${API_URL}/matches/today`);
      const todayMatches = (data.data || []).filter(m => m.status === 'LIVE' || m.status === 'HT');

      if (todayMatches.length > 0) {
        console.log(`[Hourly] Generating Twitter thread for ${todayMatches.length} active matches`);
      }
    } catch (err) {
      results.errors.push(`Twitter thread: ${err.message}`);
    }
  }

  return results;
}

module.exports = { runHourlyAutomation };
