#!/usr/bin/env node
// ─── YouTube OAuth2 Setup Script ──────────────────────────────────────────────
// Run once to get YOUTUBE_REFRESH_TOKEN for Railway env.
//
// Usage:
//   YOUTUBE_CLIENT_ID=xxx YOUTUBE_CLIENT_SECRET=xxx node src/scripts/youtubeAuth.js
//
// Then open the URL shown, authorize, paste the code back, and copy the refresh token.

'use strict';

const http     = require('http');
const { URL }  = require('url');

const CLIENT_ID     = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REDIRECT_URI  = 'http://localhost:8765/oauth2callback';

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
].join(' ');

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\n❌  Set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET before running.\n');
  console.log('Steps:');
  console.log('1. Go to console.cloud.google.com');
  console.log('2. Create project → Enable YouTube Data API v3');
  console.log('3. Credentials → Create OAuth 2.0 Client ID → Desktop app');
  console.log('4. Add http://localhost:8765/oauth2callback as redirect URI');
  console.log('5. Run: YOUTUBE_CLIENT_ID=... YOUTUBE_CLIENT_SECRET=... node src/scripts/youtubeAuth.js\n');
  process.exit(1);
}

const authUrl =
  `https://accounts.google.com/o/oauth2/v2/auth` +
  `?client_id=${encodeURIComponent(CLIENT_ID)}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&access_type=offline` +
  `&prompt=consent`;

console.log('\n🎬  GoalRush Global — YouTube OAuth Setup');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('1. Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Authorize with your YouTube channel account (@GoalRushGlobal00)');
console.log('3. You\'ll be redirected back automatically...\n');

// Spin up a local server to capture the callback
const server = http.createServer(async (req, res) => {
  const parsed = new URL(req.url, 'http://localhost:8765');
  if (parsed.pathname !== '/oauth2callback') { res.end(); return; }

  const code = parsed.searchParams.get('code');
  const err  = parsed.searchParams.get('error');

  if (err) {
    res.writeHead(200); res.end(`<h1>Authorization failed: ${err}</h1>`);
    server.close();
    return;
  }

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri:  REDIRECT_URI,
      grant_type:    'authorization_code',
    }),
  });

  const tokens = await tokenRes.json();

  if (!tokens.refresh_token) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<h1>❌ No refresh_token returned</h1><pre>${JSON.stringify(tokens, null, 2)}</pre>`);
    server.close();
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html><body style="font-family:monospace;padding:30px;background:#111;color:#0f0">
      <h2 style="color:#4ade80">✅ YouTube OAuth Success!</h2>
      <p>Copy this into Railway Variables:</p>
      <pre style="background:#222;padding:16px;border-radius:8px;font-size:14px">
YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}</pre>
      <p style="color:#9ca3af">You can now close this tab.</p>
    </body></html>
  `);

  console.log('\n✅  Authorization successful!\n');
  console.log('━━  Add this to Railway Variables:  ━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  server.close();
});

server.listen(8765, () => {
  console.log('Waiting for authorization callback on http://localhost:8765 ...\n');
});
