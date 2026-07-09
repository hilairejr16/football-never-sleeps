require('dotenv').config({ path: '../../.env' });
const axios = require('axios');
const pipeline = require('../social/post-pipeline');

const API_URL = process.env.API_URL || 'http://localhost:4000';

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
  try {
    // Detect which side scored using total goal count change
    await pipeline.postGoalUpdate(match, 'Goal!', match.minute || '?');
  } catch (err) {
    console.error('[LiveMatch] Goal alert error:', err.message);
  }
}

async function handleStatusChange(match, previousStatus) {
  try {
    if (match.status === 'HT') {
      await pipeline.postHalfTime(match);
    }
    if (['FT', 'AET', 'PEN'].includes(match.status)) {
      await pipeline.postFullTime(match);
    }
  } catch (err) {
    console.error('[LiveMatch] Status change post error:', err.message);
  }
}

module.exports = { runLiveMatchAutomation };
