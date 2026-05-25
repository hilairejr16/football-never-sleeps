# ⚽ GoalRush Global — Football Never Sleeps.

> The world's most automated AI-powered football media empire.

**GoalRush Global** publishes breaking news, live scores, match analysis, transfer updates, match predictions, and social media content — 24/7, fully automated, across 9 platforms.

---

## Architecture Overview

```
goalrush-global/
├── apps/
│   ├── web/           # Next.js 14 Frontend (Dark mode, Black/Red/Gold)
│   ├── api/           # Node.js + Express Backend API + WebSocket
│   └── ai-engine/     # Python FastAPI — Claude + OpenAI + ElevenLabs
├── automation/        # Cron scheduler + Social media bots
├── packages/
│   └── database/      # PostgreSQL schema + migrations
└── infrastructure/    # Docker, Nginx, Kubernetes configs
```

---

## Quick Start

### 1. Prerequisites
- Node.js 20+
- Python 3.12+
- PostgreSQL 16+
- Redis 7+
- Docker + Docker Compose (for full stack)

### 2. Environment Setup

```bash
cp .env.example .env
# Fill in all API keys in .env
```

### 3. Start with Docker (Recommended)

```bash
docker compose up -d
```

This starts:
- `web`        → http://localhost:3000
- `api`        → http://localhost:4000
- `ai-engine`  → http://localhost:8000
- `postgres`   → localhost:5432
- `redis`      → localhost:6379
- `nginx`      → http://localhost:80

### 4. Local Development (Manual)

```bash
# Install dependencies
npm install

# Terminal 1 — Frontend
cd apps/web && npm run dev

# Terminal 2 — Backend API
cd apps/api && npm run dev

# Terminal 3 — AI Engine
cd apps/ai-engine
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 4 — Automation Scheduler
cd automation && node cron/scheduler.js
```

---

## API Keys Required

| Service | Purpose | Get At |
|---------|---------|--------|
| `ANTHROPIC_API_KEY` | News/articles (Claude claude-opus-4-7) | console.anthropic.com |
| `OPENAI_API_KEY` | Hashtags, fallback generation | platform.openai.com |
| `FOOTBALL_API_KEY` | Live scores, fixtures, stats | api-football.com |
| `ELEVENLABS_API_KEY` | AI voiceovers | elevenlabs.io |
| `TWITTER_*` | X/Twitter automation | developer.twitter.com |
| `INSTAGRAM_ACCESS_TOKEN` | Instagram/Reels posting | developers.facebook.com |
| `TIKTOK_*` | TikTok posting | developers.tiktok.com |
| `YOUTUBE_*` | YouTube Shorts | console.cloud.google.com |
| `TELEGRAM_BOT_TOKEN` | Telegram channel | @BotFather |

---

## Platform Coverage

| Platform | Automation | Frequency |
|----------|-----------|-----------|
| Website  | Articles, live scores, predictions | Hourly |
| X (Twitter) | Breaking news, goal alerts, threads | Real-time |
| Instagram | Reels, carousels, stories | 4x daily |
| TikTok | Short videos, goal reactions | 6x daily |
| YouTube | Shorts, match recaps | 2x daily |
| Facebook | Posts, reels | 3x daily |
| Telegram | Updates, live threads | Real-time |
| Discord | Bot updates | Real-time |

---

## Football Leagues Covered

Premier League · La Liga · Serie A · Bundesliga · Ligue 1 · Champions League · Europa League · FIFA World Cup · Copa América · MLS · Saudi Pro League · Brazil Série A · Argentina Liga · CONCACAF · African Football · Women's Football · Youth Football

---

## Automation Schedule

| Trigger | What Runs |
|---------|-----------|
| 06:00 UTC daily | Morning news briefing, article generation |
| 07:00 UTC daily | Match predictions for the day |
| Every hour | Score updates, trending content, breaking news check |
| Every 2 minutes | Live match monitoring (goal alerts, HT/FT notifications) |
| 09:00, 12:00, 18:00, 22:00 | Social media posting across all platforms |
| Monday 08:00 UTC | Weekly roundup, team of the week, power rankings |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, Socket.io (WebSocket), Bull (queues) |
| AI Engine | Python FastAPI, Claude claude-opus-4-7, GPT-4o, ElevenLabs |
| Database | PostgreSQL 16 + Redis 7 |
| Automation | Node-cron, Twitter API v2, Meta Graph API |
| Infrastructure | Docker, Nginx, Kubernetes (prod) |
| Deployment | Vercel (web), Railway/Fly.io (api), Vercel (ai-engine) |

---

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Home — breaking news, live scores, transfers, predictions |
| `/live-scores` | Real-time scores from all leagues (WebSocket) |
| `/news` | AI-generated articles, breaking news |
| `/transfers` | Confirmed deals + rumours with confidence scores |
| `/predictions` | AI match predictions with probability bars |
| `/fixtures` | Upcoming matches schedule |
| `/admin` | Control panel — content queue, AI generator, analytics |

---

## Monetization Ready

- Google AdSense integration (placement zones built into layout)
- Premium membership system (Stripe)
- Newsletter monetization (email capture on every page)
- Sponsorship banner slots
- Betting affiliate link system
- Merchandise store hooks

---

## Deployment to Production

```bash
# Build all images
docker compose -f docker-compose.prod.yml build

# Deploy
docker compose -f docker-compose.prod.yml up -d

# Database migration
npm run db:migrate
```

For Vercel deployment of the web app:
```bash
cd apps/web
npx vercel --prod
```

---

## Growth Strategy

**Year 1 Targets:**
- 100K followers across all platforms
- 500K monthly website visits
- $2K/month AdSense revenue

**Year 2 Targets:**
- 500K followers
- 2M monthly visits
- $10K/month revenue

**Content pillars:** Breaking news reacts, goal clips, tactical analysis, transfer gossip, meme culture, historical facts, polls, predictions.

---

> **"Football Never Sleeps."** — GoalRush Global
