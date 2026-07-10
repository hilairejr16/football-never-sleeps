'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// Lazy-load to avoid crash at startup if packages are missing
let _sharp = null;
let _ffmpeg = null;

function getSharp() {
  if (!_sharp) _sharp = require('sharp');
  return _sharp;
}

function getFfmpeg() {
  if (!_ffmpeg) {
    _ffmpeg = require('fluent-ffmpeg');
    try {
      const fp = require('ffmpeg-static');
      _ffmpeg.setFfmpegPath(fp);
    } catch {}
  }
  return _ffmpeg;
}

// ── Design constants ───────────────────────────────────────────────────────────
const W = 1080, H = 1920;
const RED   = '#E31E24';
const DARK  = '#080A10';
const CARD  = '#1A1D2E';
const GRAY  = '#6B7280';
const LGRAY = '#9CA3AF';
const GOLD  = '#F59E0B';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function t(x, y, text, { size = 40, color = '#FFFFFF', anchor = 'middle', weight = 'normal' } = {}) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-family="DejaVu Sans,Liberation Sans,sans-serif" font-size="${size}" font-weight="${weight}">${esc(text)}</text>`;
}

// ── Frame SVGs ─────────────────────────────────────────────────────────────────

function svgScoreCard({ homeTeam, awayTeam, homeScore, awayScore, league, round }) {
  const winner = homeScore > awayScore ? 'home' : awayScore > homeScore ? 'away' : 'draw';
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0D0F1A"/>
      <stop offset="100%" stop-color="${DARK}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="8" fill="${RED}"/>
  <rect y="${H-8}" width="${W}" height="8" fill="${RED}"/>

  ${t(W/2, 110, 'GOALRUSH GLOBAL', { size: 44, color: RED, weight: 'bold' })}
  ${t(W/2, 160, 'LIVE MATCH REPORT', { size: 26, color: LGRAY })}

  <!-- Score card -->
  <rect x="50" y="280" width="${W-100}" height="600" rx="28" fill="${CARD}"/>
  <rect x="50" y="280" width="${W-100}" height="10" rx="5" fill="${RED}"/>

  ${t(W/2, 360, esc(league || 'FIFA World Cup 2026').toUpperCase(), { size: 26, color: LGRAY })}
  ${t(W/2, 405, `${esc(round || 'MATCH')} · FULL TIME`, { size: 22, color: GRAY })}

  <line x1="100" y1="430" x2="${W-100}" y2="430" stroke="${RED}" stroke-width="1" opacity="0.3"/>

  <!-- Teams -->
  ${t(200, 560, esc(homeTeam || 'Home').substring(0, 14).toUpperCase(), { size: 52, weight: 'bold' })}
  ${t(200, 615, esc(homeTeam || 'Home'), { size: 30, color: LGRAY })}
  ${t(W-200, 560, esc(awayTeam || 'Away').substring(0, 14).toUpperCase(), { size: 52, weight: 'bold' })}
  ${t(W-200, 615, esc(awayTeam || 'Away'), { size: 30, color: LGRAY })}

  <!-- Score -->
  ${t(W/2, 620, `${homeScore ?? 0}  –  ${awayScore ?? 0}`, { size: 140, color: RED, weight: 'bold' })}

  <!-- Winner badge -->
  ${winner === 'home' ? `<rect x="80" y="650" width="240" height="50" rx="25" fill="${GOLD}" opacity="0.15"/>
  ${t(200, 683, '🏆 WINNER', { size: 28, color: GOLD })}` : ''}
  ${winner === 'away' ? `<rect x="${W-320}" y="650" width="240" height="50" rx="25" fill="${GOLD}" opacity="0.15"/>
  ${t(W-200, 683, 'WINNER 🏆', { size: 28, color: GOLD })}` : ''}
  ${winner === 'draw' ? t(W/2, 680, 'DRAW', { size: 32, color: GRAY }) : ''}

  <line x1="100" y1="740" x2="${W-100}" y2="740" stroke="${RED}" stroke-width="1" opacity="0.2"/>
  ${t(W/2, 820, 'FT', { size: 64, weight: 'bold' })}

  <!-- Branding -->
  ${t(W/2, H-220, '@GoalRushGlobal', { size: 42, color: RED, weight: 'bold' })}
  ${t(W/2, H-165, 'goalrushglobal.com', { size: 30, color: LGRAY })}
  ${t(W/2, H-110, '#WorldCup2026  #Football  #GoalRush', { size: 24, color: GRAY })}
  ${t(W/2, H-60, '#Shorts', { size: 22, color: GRAY })}
</svg>`;
}

function svgStats({ homeTeam, awayTeam, possession = {}, homeShots = 0, awayShots = 0, homeOnTarget = 0, awayOnTarget = 0 }) {
  const hp = possession.home ?? 50;
  const ap = possession.away ?? 50;
  const BAR_W = 800, BAR_X = 140;
  const homePossW = Math.round(BAR_W * hp / 100);

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${DARK}"/>
  <rect width="${W}" height="8" fill="${RED}"/>
  <rect y="${H-8}" width="${W}" height="8" fill="${RED}"/>

  ${t(W/2, 110, 'GOALRUSH GLOBAL', { size: 44, color: RED, weight: 'bold' })}
  ${t(W/2, 162, 'MATCH STATISTICS', { size: 30, color: LGRAY })}
  <line x1="80" y1="190" x2="${W-80}" y2="190" stroke="${RED}" stroke-width="2" opacity="0.4"/>

  <!-- Header row -->
  ${t(250, 280, esc(homeTeam || 'Home'), { size: 46, weight: 'bold' })}
  <line x1="${W/2-2}" y1="240" x2="${W/2+2}" y2="960" stroke="${LGRAY}" stroke-width="1" opacity="0.15"/>
  ${t(W-250, 280, esc(awayTeam || 'Away'), { size: 46, weight: 'bold' })}

  <!-- POSSESSION -->
  ${t(W/2, 360, 'POSSESSION', { size: 26, color: GRAY })}
  ${t(250, 430, `${hp}%`, { size: 68, color: RED, weight: 'bold' })}
  ${t(W-250, 430, `${ap}%`, { size: 68, color: '#FFFFFF', weight: 'bold' })}
  <rect x="${BAR_X}" y="455" width="${BAR_W}" height="18" rx="9" fill="${CARD}"/>
  <rect x="${BAR_X}" y="455" width="${homePossW}" height="18" rx="9" fill="${RED}"/>
  <line x1="80" y1="490" x2="${W-80}" y2="490" stroke="${LGRAY}" stroke-width="1" opacity="0.1"/>

  <!-- SHOTS -->
  ${t(W/2, 570, 'TOTAL SHOTS', { size: 26, color: GRAY })}
  ${t(250, 640, String(homeShots), { size: 68, color: RED, weight: 'bold' })}
  ${t(W-250, 640, String(awayShots), { size: 68, color: '#FFFFFF', weight: 'bold' })}
  <line x1="80" y1="675" x2="${W-80}" y2="675" stroke="${LGRAY}" stroke-width="1" opacity="0.1"/>

  <!-- ON TARGET -->
  ${t(W/2, 760, 'SHOTS ON TARGET', { size: 26, color: GRAY })}
  ${t(250, 830, String(homeOnTarget), { size: 68, color: RED, weight: 'bold' })}
  ${t(W-250, 830, String(awayOnTarget), { size: 68, color: '#FFFFFF', weight: 'bold' })}

  ${t(W/2, H-200, '@GoalRushGlobal', { size: 42, color: RED, weight: 'bold' })}
  ${t(W/2, H-145, 'goalrushglobal.com', { size: 30, color: LGRAY })}
  ${t(W/2, H-90, '#WorldCup2026  #Football  #Shorts', { size: 24, color: GRAY })}
</svg>`;
}

function svgCommentary({ lines = [], pageNum = 1, totalPages = 1 }) {
  const textNodes = lines.map((line, i) =>
    `<text x="80" y="${320 + i * 95}" font-family="DejaVu Sans,Liberation Sans,sans-serif" font-size="40" fill="#FFFFFF">${esc(line)}</text>`
  ).join('\n');

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${DARK}"/>
  <rect width="${W}" height="8" fill="${RED}"/>
  <rect y="${H-8}" width="${W}" height="8" fill="${RED}"/>

  ${t(W/2, 110, 'GOALRUSH GLOBAL', { size: 44, color: RED, weight: 'bold' })}
  ${t(W/2, 162, 'MATCH ANALYSIS', { size: 30, color: LGRAY })}
  <line x1="60" y1="195" x2="${W-60}" y2="195" stroke="${RED}" stroke-width="2" opacity="0.5"/>

  <rect x="60" y="220" width="${W-120}" height="${H-450}" rx="16" fill="${CARD}" opacity="0.4"/>
  ${textNodes}

  ${totalPages > 1 ? t(W/2, H-280, `${pageNum} / ${totalPages}`, { size: 24, color: GRAY }) : ''}
  ${t(W/2, H-200, '@GoalRushGlobal', { size: 42, color: RED, weight: 'bold' })}
  ${t(W/2, H-145, 'goalrushglobal.com', { size: 30, color: LGRAY })}
  ${t(W/2, H-90, '#WorldCup2026  #Football  #Shorts', { size: 24, color: GRAY })}
</svg>`;
}

function svgOutro() {
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${DARK}"/>
  <rect width="${W}" height="8" fill="${RED}"/>
  <rect y="${H-8}" width="${W}" height="8" fill="${RED}"/>

  <rect x="140" y="500" width="${W-280}" height="900" rx="32" fill="${CARD}"/>
  <rect x="140" y="500" width="${W-280}" height="10" rx="5" fill="${RED}"/>

  ${t(W/2, 700, '⚽', { size: 180 })}
  ${t(W/2, 940, 'GOALRUSH', { size: 88, weight: 'bold' })}
  ${t(W/2, 1020, 'GLOBAL', { size: 88, color: RED, weight: 'bold' })}
  ${t(W/2, 1090, 'Football Never Sleeps', { size: 32, color: LGRAY })}

  <line x1="200" y1="1130" x2="${W-200}" y2="1130" stroke="${RED}" stroke-width="2" opacity="0.5"/>

  ${t(W/2, 1210, '👍 LIKE  ·  🔔 SUBSCRIBE', { size: 42, weight: 'bold' })}
  ${t(W/2, 1290, 'Daily WC 2026 Coverage', { size: 34, color: LGRAY })}
  ${t(W/2, H-220, '@GoalRushGlobal', { size: 48, color: RED, weight: 'bold' })}
  ${t(W/2, H-160, 'goalrushglobal.com', { size: 32, color: LGRAY })}
  ${t(W/2, H-100, '#WorldCup2026  #GoalRush  #Shorts', { size: 26, color: GRAY })}
</svg>`;
}

// ── Utilities ──────────────────────────────────────────────────────────────────

function wrapText(text, maxChars = 36) {
  const words = text.replace(/\n+/g, ' ').split(' ').filter(Boolean);
  const lines = [];
  let cur = '';
  for (const word of words) {
    const candidate = cur ? `${cur} ${word}` : word;
    if (candidate.length <= maxChars) {
      cur = candidate;
    } else {
      if (cur) lines.push(cur);
      cur = word.length > maxChars ? word.substring(0, maxChars) : word;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

async function svgToPng(svg, outputPath) {
  await getSharp()(Buffer.from(svg)).resize(W, H, { fit: 'fill' }).png().toFile(outputPath);
}

async function buildVideo({ frames, durations, audioPath, outputPath }) {
  return new Promise((resolve, reject) => {
    const ff = getFfmpeg();
    let cmd = ff();

    frames.forEach((f, i) => {
      cmd = cmd.input(f).inputOptions(['-loop 1', `-t ${durations[i]}`]);
    });
    cmd = cmd.input(audioPath);

    const n = frames.length;
    const scaleF = frames.map((_, i) =>
      `[${i}:v]scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=24[v${i}]`
    );
    const concatIn = frames.map((_, i) => `[v${i}]`).join('');

    cmd
      .complexFilter([...scaleF, `${concatIn}concat=n=${n}:v=1:a=0[vout]`])
      .outputOptions([
        '-map [vout]',
        `-map ${n}:a`,
        '-c:v libx264', '-preset fast', '-crf 24',
        '-pix_fmt yuv420p',
        '-c:a aac', '-b:a 128k',
        '-shortest', '-r 24',
        '-movflags +faststart',
      ])
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}

// ── Main export ────────────────────────────────────────────────────────────────

async function generateMatchVideo({ match, commentary, audioPath, outDir }) {
  const id = crypto.randomUUID().slice(0, 8);
  const dir = outDir || path.join(os.tmpdir(), 'goalrush-videos', id);
  await fs.promises.mkdir(dir, { recursive: true });

  const home = match.homeTeam?.name || 'Home';
  const away = match.awayTeam?.name || 'Away';
  const hs   = match.homeScore ?? 0;
  const as_  = match.awayScore ?? 0;

  // Build frames
  const frameScore = path.join(dir, 'f0_score.png');
  await svgToPng(svgScoreCard({
    homeTeam: home, awayTeam: away, homeScore: hs, awayScore: as_,
    league: match.league?.name, round: match.league?.round?.replace(/_/g, ' '),
  }), frameScore);

  const frameStats = path.join(dir, 'f1_stats.png');
  await svgToPng(svgStats({
    homeTeam: home, awayTeam: away,
    possession: match.stats?.possession,
    homeShots: match.stats?.homeShots,
    awayShots: match.stats?.awayShots,
    homeOnTarget: match.stats?.homeOnTarget,
    awayOnTarget: match.stats?.awayOnTarget,
  }), frameStats);

  // Commentary pages (max 3 pages × 7 lines each)
  const allLines = wrapText(commentary || `${home} ${hs}-${as_} ${away}. Full time in the ${match.league?.round || 'match'}.`);
  const LINES_PER_PAGE = 7;
  const pageCount = Math.min(3, Math.ceil(allLines.length / LINES_PER_PAGE));
  const commentaryFrames = [];
  for (let p = 0; p < pageCount; p++) {
    const fp = path.join(dir, `f2_report${p}.png`);
    await svgToPng(svgCommentary({
      lines: allLines.slice(p * LINES_PER_PAGE, (p + 1) * LINES_PER_PAGE),
      pageNum: p + 1, totalPages: pageCount,
    }), fp);
    commentaryFrames.push(fp);
  }

  const frameOutro = path.join(dir, 'f3_outro.png');
  await svgToPng(svgOutro(), frameOutro);

  const perCommentaryPage = Math.max(8, Math.round(36 / pageCount));
  const frames    = [frameScore, frameStats, ...commentaryFrames, frameOutro];
  const durations = [7, 8, ...commentaryFrames.map(() => perCommentaryPage), 6];

  const videoPath = path.join(dir, 'final.mp4');
  await buildVideo({ frames, durations, audioPath, outputPath: videoPath });
  return { videoPath, tmpDir: dir };
}

async function cleanupDir(dir) {
  try { await fs.promises.rm(dir, { recursive: true, force: true }); } catch {}
}

module.exports = { generateMatchVideo, cleanupDir };
