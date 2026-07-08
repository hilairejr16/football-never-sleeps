#!/usr/bin/env node
/**
 * World Cup 2026 — Daily Content Update
 * Fetches yesterday's results + today's fixtures, generates AI articles,
 * and saves them to the articles table.
 * Stops automatically after the final (July 19, 2026).
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });

const { setupDatabase, query, transaction } = require('../config/database');
const { generateNewsArticle, generateMatchPrediction } = require('../services/aiContent');
const slugify = require('slugify');

const WC_LEAGUE_ID  = 1;
const WC_FINAL_DATE = new Date('2026-07-19T23:59:59Z');

function tournamentStage(dateStr) {
  if (dateStr <= '2026-07-02') return 'Group Stage';
  if (dateStr <= '2026-07-08') return 'Round of 16';
  if (dateStr <= '2026-07-12') return 'Quarter-Finals';
  if (dateStr <= '2026-07-16') return 'Semi-Finals';
  if (dateStr <= '2026-07-18') return '3rd Place Play-off';
  if (dateStr === '2026-07-19') return 'The Final';
  return 'Completed';
}

async function fetchFixturesForDate(dateStr) {
  const axios = require('axios');
  try {
    const { data } = await axios.get('https://v3.football.api-sports.io/fixtures', {
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': process.env.FOOTBALL_API_KEY,
      },
      params: { date: dateStr, league: WC_LEAGUE_ID, season: 2026 },
      timeout: 15_000,
    });
    return data.response || [];
  } catch (err) {
    console.error(`[WC] Failed to fetch fixtures for ${dateStr}:`, err.message);
    return [];
  }
}

async function articleExists(slug) {
  const { rows } = await query('SELECT id FROM articles WHERE slug = $1', [slug]);
  return rows.length > 0;
}

async function saveArticle(article, isBreaking = false) {
  const slug = slugify(article.title, { lower: true, strict: true }).slice(0, 120);
  if (await articleExists(slug)) {
    console.log(`[WC] Skipping duplicate: ${slug}`);
    return null;
  }

  const { rows } = await query(
    `INSERT INTO articles
       (title, slug, excerpt, content, category, tags, author,
        seo_title, seo_description, read_time, published, is_breaking, published_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true,$11,NOW())
     RETURNING id, slug`,
    [
      article.title,
      slug,
      article.excerpt || article.title,
      article.content || '',
      'world-cup',
      JSON.stringify(article.tags || ['#WorldCup2026', '#FIFA', '#WorldCup']),
      'GoalRush AI',
      article.seoTitle || article.title,
      article.seoDescription || article.excerpt || '',
      article.readTime || 3,
      isBreaking,
    ],
  );
  console.log(`[WC] Saved: ${rows[0].slug}`);
  return rows[0];
}

async function logRun(status, detail) {
  try {
    await query(
      `INSERT INTO automation_logs (type, status, result, created_at)
       VALUES ('wc_daily_update', $1, $2, NOW())`,
      [status, JSON.stringify({ detail, date: new Date().toISOString() })],
    );
  } catch {}
}

// ─── Main ─────────────────────────────────────────────────

async function main() {
  const now = new Date();

  // Stop after the final
  if (now > WC_FINAL_DATE) {
    console.log('[WC] Tournament is over. No update needed.');
    await logRun('skipped', 'Tournament completed after July 19 2026');
    process.exit(0);
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log('  FIFA World Cup 2026 — Daily Content Update');
  console.log(`  Date: ${now.toISOString()}`);
  console.log('═══════════════════════════════════════════════════════\n');

  await setupDatabase();

  const todayStr     = now.toISOString().slice(0, 10);
  const yesterdayStr = new Date(now - 86_400_000).toISOString().slice(0, 10);
  const stage        = tournamentStage(todayStr);

  let articlesCreated = 0;

  // ── 1. Yesterday's match summaries ────────────────────────
  console.log(`\n[WC] Fetching results for ${yesterdayStr}...`);
  const yesterday = await fetchFixturesForDate(yesterdayStr);
  const finished  = yesterday.filter(f => ['FT', 'AET', 'PEN'].includes(f.fixture.status.short));

  for (const fixture of finished) {
    const home  = fixture.teams.home.name;
    const away  = fixture.teams.away.name;
    const score = `${fixture.goals.home}-${fixture.goals.away}`;
    const topic = `World Cup 2026 ${stage}: ${home} ${score} ${away} — Full Match Report`;

    console.log(`[WC] Generating article: ${topic}`);
    try {
      const article = await generateNewsArticle({
        topic,
        matchData: {
          home, away, score,
          stage,
          date: yesterdayStr,
          events: fixture.events?.slice(0, 15) || [],
        },
        tone: stage === 'The Final' ? 'epic and historic' : 'exciting',
        length: stage.includes('Final') || stage.includes('Semi') ? 'long' : 'medium',
      });

      if (article) {
        const isBreaking = ['The Final', 'Semi-Finals', 'Quarter-Finals'].includes(stage);
        await saveArticle(article, isBreaking);
        articlesCreated++;
      }
    } catch (err) {
      console.error(`[WC] Article generation failed for ${home} vs ${away}:`, err.message);
    }

    // Respect Anthropic rate limits
    await new Promise(r => setTimeout(r, 2000));
  }

  // ── 2. Today's match previews ──────────────────────────────
  console.log(`\n[WC] Fetching today's fixtures (${todayStr})...`);
  const todayFixtures = await fetchFixturesForDate(todayStr);
  const scheduled     = todayFixtures.filter(f => f.fixture.status.short === 'NS');

  for (const fixture of scheduled) {
    const home  = fixture.teams.home.name;
    const away  = fixture.teams.away.name;
    const time  = new Date(fixture.fixture.date).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';
    const topic = `World Cup 2026 ${stage} Preview: ${home} vs ${away} — Prediction & Tactical Analysis`;

    console.log(`[WC] Generating preview: ${topic}`);
    try {
      const article = await generateNewsArticle({
        topic,
        matchData: { home, away, stage, kickoff: time },
        tone: 'analytical and exciting',
        length: 'medium',
      });

      if (article) {
        await saveArticle(article, false);
        articlesCreated++;
      }
    } catch (err) {
      console.error(`[WC] Preview failed for ${home} vs ${away}:`, err.message);
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  // ── 3. Daily standings / tournament overview article ───────
  if (finished.length > 0 || scheduled.length > 0) {
    const daysLeft = Math.ceil((WC_FINAL_DATE - now) / (1000 * 60 * 60 * 24));
    const topic    = `World Cup 2026 ${stage} Update: Everything You Need to Know — Day ${daysLeft} Days to the Final`;

    console.log(`\n[WC] Generating tournament overview...`);
    try {
      const article = await generateNewsArticle({
        topic,
        matchData: {
          stage,
          daysToFinal: daysLeft,
          resultsCount: finished.length,
          upcomingCount: scheduled.length,
          hosts: ['USA', 'Canada', 'Mexico'],
        },
        tone: 'comprehensive and engaging',
        length: 'medium',
      });

      if (article) {
        await saveArticle(article, false);
        articlesCreated++;
      }
    } catch (err) {
      console.error('[WC] Overview article failed:', err.message);
    }
  }

  console.log(`\n[WC] Done. ${articlesCreated} article(s) created.`);
  await logRun('success', { articlesCreated, stage, yesterday: finished.length, today: scheduled.length });
  process.exit(0);
}

main().catch(async err => {
  console.error('[WC] Fatal error:', err);
  try {
    await setupDatabase();
    await logRun('error', err.message);
  } catch {}
  process.exit(1);
});
