const Redis = require('ioredis');

let redis;

async function setupRedis() {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,
  });

  await redis.connect();
  return redis;
}

function getRedis() {
  if (!redis) throw new Error('Redis not initialized');
  return redis;
}

// ─── Cache Helpers ─────────────────────────────────────────

async function cacheGet(key) {
  try {
    const val = await getRedis().get(key);
    return val ? JSON.parse(val) : null;
  } catch { return null; }
}

async function cacheSet(key, value, ttlSeconds = 60) {
  try {
    await getRedis().setex(key, ttlSeconds, JSON.stringify(value));
  } catch { /* non-critical */ }
}

async function cacheDel(key) {
  try { await getRedis().del(key); }
  catch { /* non-critical */ }
}

async function cacheGetOrSet(key, fetcher, ttlSeconds = 60) {
  const cached = await cacheGet(key);
  if (cached !== null) return cached;

  const value = await fetcher();
  await cacheSet(key, value, ttlSeconds);
  return value;
}

module.exports = { setupRedis, getRedis, cacheGet, cacheSet, cacheDel, cacheGetOrSet };
