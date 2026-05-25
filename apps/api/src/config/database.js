const { Pool } = require('pg');

let pool;

async function setupDatabase() {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  // Test connection
  const client = await pool.connect();
  await client.query('SELECT 1');
  client.release();

  return pool;
}

function getPool() {
  if (!pool) throw new Error('Database not initialized — call setupDatabase() first');
  return pool;
}

async function query(text, params) {
  const start = Date.now();
  const result = await getPool().query(text, params);
  const duration = Date.now() - start;

  if (duration > 1000) {
    console.warn({ query: text, duration }, 'Slow query detected');
  }

  return result;
}

async function transaction(callback) {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { setupDatabase, getPool, query, transaction };
