/**
 * Complete social media posting pipeline
 * Orchestrates: fetch scores → generate AI content → post Twitter + Instagram
 *
 * Usage:
 *   const pipeline = require('./post-pipeline');
 *   await pipeline.postMorningBriefing();
 *   await pipeline.postGoldCupDailySummary();
 *   await pipeline.postGoalUpdate(match, 'Mbappé', 67);
 */
require('dotenv').config({ path: '../../.env' });

const { postTweet, postThread } = require('./twitter');
const { postImage }             = require('./instagram');
const {
  fetchWorldCupToday, fetchGoldCupToday,
  fetchGoldCupResults, fetchWorldCupResults,
  formatScore,
}                               = require('./scores-fetcher');
const {
  generateScoreUpdate,
  generateGoalAlert,
  generateHalfTimeUpdate,
  generateFullTimeResult,
  generateMorningBriefing,
  generateEveningRecap,
  buildTweet,
  buildIGCaption,
}                               = require('./content-generator');

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://goalrushglobal.vercel.app';

// ─── Image URL helpers ────────────────────────────────────

/**
 * Returns a URL pointing to the Vercel-hosted score card image.
 * The /api/og/scorecard endpoint renders an 1080×1080 PNG.
 */
function scorecardUrl(match) {
  const p = new URLSearchParams({
    home:      match.homeTeam.name,
    away:      match.awayTeam.name,
    homeScore: match.homeScore !== null ? String(match.homeScore) : '',
    awayScore: match.awayScore !== null ? String(match.awayScore) : '',
    league:    match.league.name,
    status:    match.status,
  });
  return `${SITE_URL}/api/og/scorecard?${p}`;
}

// ─── Core post helpers ────────────────────────────────────

async function postBothPlatforms(tweet, igCaption, imageUrl) {
  const results = await Promise.allSettled([
    postTweet(tweet),
    imageUrl ? postImage(imageUrl, igCaption) : Promise.resolve(null),
  ]);
  return {
    twitter:   results[0].status === 'fulfilled' ? results[0].value : null,
    instagram: results[1].status === 'fulfilled' ? results[1].value : null,
  };
}

// ─── Live score update ────────────────────────────────────

async function postLiveScoreUpdate(match) {
  console.log(`[Pipeline] Live score: ${formatScore(match)}`);
  const { tweet, igCaption } = await generateScoreUpdate(match);
  return postBothPlatforms(tweet, igCaption, scorecardUrl(match));
}

// ─── Goal alert ───────────────────────────────────────────

async function postGoalUpdate(match, scorer, minute) {
  console.log(`[Pipeline] Goal alert: ${scorer} (${minute}')`);
  const { tweet, igCaption } = await generateGoalAlert(match, scorer, minute);
  return postBothPlatforms(tweet, igCaption, scorecardUrl(match));
}

// ─── Half-time update ─────────────────────────────────────

async function postHalfTime(match) {
  console.log(`[Pipeline] Half time: ${match.homeTeam.name} vs ${match.awayTeam.name}`);
  const { tweet, igCaption } = await generateHalfTimeUpdate(match);
  return postBothPlatforms(tweet, igCaption, scorecardUrl(match));
}

// ─── Full-time result ─────────────────────────────────────

async function postFullTime(match) {
  console.log(`[Pipeline] Full time: ${formatScore(match)}`);
  const { tweet, igCaption } = await generateFullTimeResult(match);
  return postBothPlatforms(tweet, igCaption, scorecardUrl(match));
}

// ─── Daily morning briefing ───────────────────────────────

async function postMorningBriefing() {
  console.log('[Pipeline] Posting morning briefing...');

  const [wcMatches, gcMatches] = await Promise.all([
    fetchWorldCupToday(),
    fetchGoldCupToday(),
  ]);
  const all = [...wcMatches, ...gcMatches];

  const { tweet, igCaption } = await generateMorningBriefing(all);

  // For Instagram, use the first match's score card (pre-match style) or fall back to OG image
  const imageUrl = all.length > 0
    ? scorecardUrl({ ...all[0], homeScore: null, awayScore: null, status: 'SCHEDULED' })
    : `${SITE_URL}/api/og`;

  return postBothPlatforms(tweet, igCaption, imageUrl);
}

// ─── Gold Cup daily summary ───────────────────────────────

async function postGoldCupDailySummary() {
  const results = await fetchGoldCupResults();

  if (results.length === 0) {
    console.log('[Pipeline] No Gold Cup results to post today');
    return null;
  }

  console.log(`[Pipeline] Gold Cup summary: ${results.length} result(s)`);

  // Build a results thread for Twitter
  const scoreLines = results.map(m => formatScore(m)).join('\n');

  const threadTweets = [
    buildTweet(`🏆 CONCACAF GOLD CUP — Today's Results\n\n${scoreLines}`, '#GoldCup2025 #CONCACAFGoldCup #CONCACAF'),
    ...results.map(m => {
      const score = `${m.homeScore}–${m.awayScore}`;
      const winner = m.homeScore > m.awayScore ? m.homeTeam.name : m.awayScore > m.homeScore ? m.awayTeam.name : null;
      const winStr = winner ? `\n🥇 ${winner} advance!` : '\n🤝 Draw!';
      return buildTweet(`✅ FT: ${m.homeTeam.name} ${score} ${m.awayTeam.name}${winStr}`, '#GoldCup2025 #CONCACAF').slice(0, 280);
    }),
  ];

  await postThread(threadTweets);

  // Instagram: score card for the featured match + multi-result caption
  const featured = results[0];
  const igCaption = buildIGCaption(
    `🏆 GOLD CUP RESULTS\n\n${scoreLines}\n\n📊 Full match stats → goalrushglobal.com`,
    '#GoldCup2025 #CONCACAFGoldCup #CONCACAF'
  );
  await postImage(scorecardUrl(featured), igCaption);

  return results;
}

// ─── World Cup daily summary ──────────────────────────────

async function postWorldCupDailySummary() {
  const results = await fetchWorldCupResults();

  if (results.length === 0) {
    console.log('[Pipeline] No World Cup results to post today');
    return null;
  }

  console.log(`[Pipeline] WC summary: ${results.length} result(s)`);

  const scoreLines = results.map(m => formatScore(m)).join('\n');

  const threadTweets = [
    buildTweet(`🏆 WORLD CUP 2026 — Today's Results\n\n${scoreLines}`, '#WorldCup2026 #WorldCup #FIFA2026'),
    ...results.map(m => {
      const score = `${m.homeScore}–${m.awayScore}`;
      const winner = m.homeScore > m.awayScore ? m.homeTeam.name : m.awayScore > m.homeScore ? m.awayTeam.name : null;
      const winStr = winner ? `\n🥇 ${winner} advance to the next round!` : '\n🤝 The teams are level — extra time/penalties may follow.';
      return buildTweet(`✅ FT: ${m.homeTeam.name} ${score} ${m.awayTeam.name}${winStr}`, '#WorldCup2026 #FIFA2026').slice(0, 280);
    }),
  ];

  await postThread(threadTweets);

  // Instagram: featured match scorecard
  const featured = results[0];
  const igCaption = buildIGCaption(
    `🏆 WORLD CUP 2026 RESULTS\n\n${scoreLines}\n\n📊 Full stats → goalrushglobal.com`,
    '#WorldCup2026 #WorldCup #FIFA2026'
  );
  await postImage(scorecardUrl(featured), igCaption);

  return results;
}

// ─── Evening recap ────────────────────────────────────────

async function postEveningRecap() {
  console.log('[Pipeline] Posting evening recap...');

  const [wcResults, gcResults] = await Promise.all([
    fetchWorldCupResults(),
    fetchGoldCupResults(),
  ]);

  const all = [...wcResults, ...gcResults].filter(m =>
    ['FT', 'AET', 'PEN'].includes(m.status)
  );

  const { tweet, igCaption } = await generateEveningRecap(all);

  const imageUrl = all.length > 0
    ? scorecardUrl(all[0])
    : `${SITE_URL}/api/og`;

  return postBothPlatforms(tweet, igCaption, imageUrl);
}

// ─── Match preview (1h before kick-off) ──────────────────

async function postMatchPreview(match) {
  console.log(`[Pipeline] Match preview: ${match.homeTeam.name} vs ${match.awayTeam.name}`);

  const kickOff = new Date(match.date).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York',
  });

  const previewTweet = buildTweet(
    `⚽ COMING UP in 1 HOUR!\n\n${match.homeTeam.name} 🆚 ${match.awayTeam.name}\n\n⏰ ${kickOff} ET\n🏆 ${match.league.name}\n\nWho wins? Drop your prediction 👇`,
    /world cup/i.test(match.league.name) ? '#WorldCup2026 #FIFA2026' : '#GoldCup2025 #CONCACAF'
  );

  const igCaption = buildIGCaption(
    `⚽ KICK-OFF IN 1 HOUR!\n\n${match.homeTeam.name} vs ${match.awayTeam.name}\n\n⏰ ${kickOff} ET · 🏆 ${match.league.name}\n\n💬 Drop your prediction below 👇`,
    /world cup/i.test(match.league.name) ? '#WorldCup2026 #FIFA2026' : '#GoldCup2025 #CONCACAF'
  );

  const imageUrl = scorecardUrl({ ...match, homeScore: null, awayScore: null, status: 'SCHEDULED' });

  return postBothPlatforms(previewTweet, igCaption, imageUrl);
}

module.exports = {
  postLiveScoreUpdate,
  postGoalUpdate,
  postHalfTime,
  postFullTime,
  postMorningBriefing,
  postGoldCupDailySummary,
  postWorldCupDailySummary,
  postEveningRecap,
  postMatchPreview,
};
