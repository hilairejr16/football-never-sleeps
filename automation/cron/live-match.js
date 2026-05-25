require('dotenv').config({ path: '../../.env' });
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:4000';
const AI_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

// Track previous state to detect changes
const matchCache = new Map();

async function runLiveMatchAutomation() {
  let liveMatches;

  try {
    const { data } = await axios.get(`${API_URL}/matches/live`, { timeout: 10_000 });
    liveMatches = data.data || [];
  } catch {
    return; // Silently fail — will retry in 2 minutes
  }

  for (const match of liveMatches) {
    const prevState = matchCache.get(match.id);
    const currKey = `${match.homeScore}-${match.awayScore}-${match.status}-${match.minute}`;

    if (!prevState) {
      matchCache.set(match.id, currKey);
      continue;
    }

    if (prevState === currKey) continue; // No change

    // Detect changes
    const [prevHome, prevAway, prevStatus] = prevState.split('-');
    const goalScored = parseInt(match.homeScore) + parseInt(match.awayScore) >
                       parseInt(prevHome) + parseInt(prevAway);
    const statusChanged = match.status !== prevStatus;

    if (goalScored) {
      console.log(`[LiveMatch] GOAL detected! ${match.homeTeam.name} ${match.homeScore}-${match.awayScore} ${match.awayTeam.name}`);
      await handleGoalEvent(match);
    }

    if (statusChanged) {
      console.log(`[LiveMatch] Status changed: ${prevStatus} → ${match.status}`);
      await handleStatusChange(match, prevStatus);
    }

    matchCache.set(match.id, currKey);
  }

  // Clean up finished matches
  for (const [id] of matchCache) {
    if (!liveMatches.find(m => m.id === id)) {
      matchCache.delete(id);
    }
  }
}

async function handleGoalEvent(match) {
  const score = `${match.homeScore}-${match.awayScore}`;
  const content = `⚽ GOAL! ${match.homeTeam.name} ${score} ${match.awayTeam.name} (${match.minute}') — ${match.league.name}`;

  try {
    // Generate and publish real-time social posts
    await axios.post(`${AI_URL}/generate/social-pack`, {
      content,
      platforms: ['twitter', 'telegram', 'instagram'],
      post_type: 'goal',
      match_data: match,
    });

    // Generate a quick video script for the goal
    if (match.events?.length > 0) {
      const lastGoal = match.events.filter(e => e.type === 'GOAL').pop();
      if (lastGoal) {
        await axios.post(`${AI_URL}/generate/video-script`, {
          topic: `${lastGoal.player.name} scores for ${match.homeTeam.name}! ${score}`,
          platform: 'TikTok',
          duration: 30,
          style: 'explosive',
        });
      }
    }
  } catch (err) {
    console.error('[LiveMatch] Goal alert error:', err.message);
  }
}

async function handleStatusChange(match, previousStatus) {
  const score = `${match.homeScore}-${match.awayScore}`;

  if (match.status === 'HT') {
    const content = `🔔 HALF TIME: ${match.homeTeam.name} ${score} ${match.awayTeam.name} | ${match.league.name}`;
    await postUpdate(content, match, 'news');
  }

  if (match.status === 'FT') {
    const content = `🏁 FULL TIME: ${match.homeTeam.name} ${score} ${match.awayTeam.name} | ${match.league.name}`;
    await postUpdate(content, match, 'match-result');

    // Generate full match summary
    try {
      await axios.post(`${AI_URL}/generate/article`, {
        topic: `Match Report: ${match.homeTeam.name} ${score} ${match.awayTeam.name}`,
        match_data: match,
        tone: 'exciting',
        length: 'medium',
      });
    } catch (err) {
      console.error('[LiveMatch] Match report generation failed:', err.message);
    }
  }
}

async function postUpdate(content, match, type) {
  try {
    await axios.post(`${AI_URL}/generate/social-pack`, {
      content,
      platforms: ['twitter', 'telegram', 'instagram', 'facebook'],
      post_type: type,
      match_data: match,
    });
  } catch (err) {
    console.error('[LiveMatch] Social post error:', err.message);
  }
}

module.exports = { runLiveMatchAutomation };
