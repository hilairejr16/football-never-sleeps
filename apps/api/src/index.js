require('dotenv').config();

// Prevent any uncaught error from killing the process before healthcheck responds
process.on('uncaughtException', err => {
  console.error('[uncaughtException]', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const http = require('http');
const { Server: SocketServer } = require('socket.io');
const pino = require('pino');

const { setupDatabase } = require('./config/database');
const { setupRedis } = require('./config/redis');
const { globalRateLimit } = require('./middleware/rateLimit');
const { errorHandler } = require('./middleware/errorHandler');

// Routes
const matchRoutes = require('./routes/matches');
const newsRoutes = require('./routes/news');
const transferRoutes = require('./routes/transfers');
const standingsRoutes = require('./routes/standings');
const predictionRoutes = require('./routes/predictions');
const playerRoutes = require('./routes/players');
const teamRoutes = require('./routes/teams');
const leagueRoutes = require('./routes/leagues');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const worldCupRoutes = require('./routes/worldcup');
const ttsRoutes      = require('./routes/tts');
const contentRoutes  = require('./routes/content');

const { startLiveScoreWorker }    = require('./workers/liveScores');
const { startContentScheduler }   = require('./workers/contentScheduler');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const app = express();
const server = http.createServer(app);

// ─── WebSocket Setup ───────────────────────────────────────
const io = new SocketServer(server, {
  cors: {
    origin: process.env.APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Make io accessible to routes
app.set('io', io);

io.on('connection', socket => {
  logger.info({ socketId: socket.id }, 'Client connected');

  socket.on('subscribe:match', matchId => {
    socket.join(`match:${matchId}`);
  });

  socket.on('subscribe:live', () => {
    socket.join('live-scores');
  });

  socket.on('disconnect', () => {
    logger.info({ socketId: socket.id }, 'Client disconnected');
  });
});

// ─── Middleware ────────────────────────────────────────────
// Trust Railway / Vercel reverse proxy so rate limiting works on real client IPs
app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'", "'unsafe-inline'"],
      imgSrc:      ["'self'", 'data:', 'https:'],
      connectSrc:  ["'self'", process.env.APP_URL || 'http://localhost:3000'],
      fontSrc:     ["'self'", 'https://fonts.gstatic.com'],
      objectSrc:   ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan('combined', {
  stream: { write: msg => logger.info(msg.trim()) },
}));
app.use(globalRateLimit);

// ─── Health Check ──────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'GoalRush Global API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ────────────────────────────────────────────
app.use('/matches',     matchRoutes);
app.use('/news',        newsRoutes);
app.use('/transfers',   transferRoutes);
app.use('/standings',   standingsRoutes);
app.use('/predictions', predictionRoutes);
app.use('/players',     playerRoutes);
app.use('/teams',       teamRoutes);
app.use('/leagues',     leagueRoutes);
app.use('/auth',        authRoutes);
app.use('/admin',       adminRoutes);
app.use('/world-cup',   worldCupRoutes);
app.use('/tts',         ttsRoutes);
app.use('/content',     contentRoutes);

// ─── 404 handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// ─── Global error handler ──────────────────────────────────
app.use(errorHandler);

// ─── Bootstrap ─────────────────────────────────────────────
async function bootstrap() {
  const PORT = process.env.PORT || 4000;

  // Start HTTP server first so healthcheck passes immediately
  server.listen(PORT, () => {
    logger.info(`GoalRush API running on port ${PORT}`);
  });

  // Connect to database (non-fatal on failure so server stays up)
  try {
    await setupDatabase();
    logger.info('Database connected');
  } catch (err) {
    logger.error(err, 'Database connection failed — API running in degraded mode');
  }

  // Connect to Redis (non-fatal)
  try {
    await setupRedis();
    logger.info('Redis connected');
  } catch (err) {
    logger.error(err, 'Redis connection failed — caching disabled');
  }

  // Start background workers
  try {
    startLiveScoreWorker(io);
    logger.info('Live score worker started');
  } catch (err) {
    logger.error(err, 'Live score worker failed to start');
  }

  try {
    startContentScheduler();
    logger.info('Content pipeline scheduler started (breaking:5m, hourly, daily 8am, weekly Mon)');
  } catch (err) {
    logger.error(err, 'Content scheduler failed to start');
  }
}

bootstrap();

module.exports = { app, io };
