require('dotenv').config({ path: '../../.env' });
const axios = require('axios');

const AI_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';
const API_URL = process.env.API_URL || 'http://localhost:4000';

async function runWeeklyAutomation() {
  console.log('[Weekly] Starting weekly recap automation...');

  const results = { tasks: [], errors: [] };

  const weeklyTasks = [
    {
      name: 'Weekly roundup article',
      fn: () => axios.post(`${AI_URL}/generate/article`, {
        topic: 'Weekly Football Roundup: Best Goals, Biggest Wins, and Top Transfers This Week',
        tone: 'exciting',
        length: 'long',
      }),
    },
    {
      name: 'Top Goals of the Week video script',
      fn: () => axios.post(`${AI_URL}/generate/video-script`, {
        topic: 'Top 5 Goals of the Week — Ranked and Reacted',
        platform: 'YouTube',
        duration: 90,
        style: 'energetic',
      }),
    },
    {
      name: 'Transfer window weekly recap',
      fn: () => axios.post(`${AI_URL}/generate/article`, {
        topic: 'Transfer Window Weekly: Every Rumour, Confirmed Deal, and Insider Report',
        tone: 'exciting',
        length: 'medium',
      }),
    },
    {
      name: 'Team of the week article',
      fn: () => axios.post(`${AI_URL}/generate/article`, {
        topic: 'GoalRush Global Team of the Week — Best Performers Across All Leagues',
        tone: 'analytical',
        length: 'medium',
      }),
    },
    {
      name: 'Weekly social pack',
      fn: () => axios.post(`${AI_URL}/generate/social-pack`, {
        content: 'Weekly football wrap! Check out all this week\'s biggest moments 🏆⚽',
        platforms: ['twitter', 'instagram', 'tiktok', 'facebook', 'telegram'],
        post_type: 'news',
      }),
    },
    {
      name: 'Power Rankings article',
      fn: () => axios.post(`${AI_URL}/generate/article`, {
        topic: 'Weekly Power Rankings: The 10 Best Teams in World Football Right Now',
        tone: 'exciting',
        length: 'medium',
      }),
    },
  ];

  for (const task of weeklyTasks) {
    try {
      await task.fn();
      results.tasks.push(task.name);
      console.log(`[Weekly] ✓ ${task.name}`);
      // Small delay between tasks
      await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      results.errors.push(`${task.name}: ${err.message}`);
      console.error(`[Weekly] ✗ ${task.name}:`, err.message);
    }
  }

  console.log('[Weekly] Complete:', results);
  return results;
}

module.exports = { runWeeklyAutomation };
