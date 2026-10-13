const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Ensure data folder exists for local persistence fallback
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const storeFilePath = path.join(dataDir, 'store.json');

// Initial schema structure for local fallback
const defaultStore = {
  users: [],
  projects: [],
  metrics: [],
  payloads: [],
  frame_metrics: [],
  activity_logs: []
};

function readLocalStore() {
  try {
    if (fs.existsSync(storeFilePath)) {
      const content = fs.readFileSync(storeFilePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('[Database Fallback] Failed reading local store:', err.message);
  }
  return { ...defaultStore };
}

function writeLocalStore(data) {
  try {
    fs.writeFileSync(storeFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[Database Fallback] Failed writing local store:', err.message);
  }
}

// Clean connection string (handle bracketed passwords or unencoded @)
function cleanConnectionString(rawUrl) {
  if (!rawUrl) return null;
  let str = rawUrl.trim();
  // Strip outer quotes if any
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    str = str.slice(1, -1);
  }
  // Check if password has brackets like postgres:[password]@host
  const regex = /^(postgresql:\/\/[^:]+:)(\[[^\]]+\])(@.+)$/;
  const match = str.match(regex);
  if (match) {
    let pw = match[2].slice(1, -1); // remove brackets
    str = match[1] + encodeURIComponent(pw) + match[3];
  }
  return str;
}

let isPgConnected = false;
let connectionError = null;
let pool = null;

const cleanedUrl = cleanConnectionString(process.env.DATABASE_URL);
if (cleanedUrl) {
  try {
    pool = new Pool({
      connectionString: cleanedUrl,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 4000
    });
  } catch (err) {
    connectionError = err.message;
  }
}

// Execute local queries when PostgreSQL is unavailable
function executeLocalQuery(text, params = []) {
  const store = readLocalStore();
  const trimmed = text.trim();

  // 1. SELECT
  if (/^SELECT/i.test(trimmed)) {
    // Detect table
    const tableMatch = trimmed.match(/FROM\s+([a-zA-Z0-9_]+)/i);
    if (!tableMatch) return [[], []];
    const table = tableMatch[1].toLowerCase();
    let rows = store[table] ? [...store[table]] : [];

    // Simple WHERE parsing
    const whereMatch = trimmed.match(/WHERE\s+(.+?)(ORDER BY|LIMIT|$)/i);
    if (whereMatch) {
      const whereClause = whereMatch[1].trim();

      // Handle user_id = ? AND id = ? or id = ? AND user_id = ?
      if (/user_id\s*=\s*\?\s*AND\s*id\s*=\s*\?/i.test(whereClause)) {
        rows = rows.filter(r => r.user_id === params[0] && r.id === params[1]);
      } else if (/id\s*=\s*\?\s*AND\s*user_id\s*=\s*\?/i.test(whereClause)) {
        rows = rows.filter(r => r.id === params[0] && r.user_id === params[1]);
      } else if (/email\s*=\s*\?\s*OR\s*username\s*=\s*\?/i.test(whereClause)) {
        rows = rows.filter(r => r.email === params[0] || r.username === params[1]);
      } else if (/user_id\s*=\s*\?/i.test(whereClause)) {
        rows = rows.filter(r => r.user_id === params[0]);
      } else if (/project_id\s*=\s*\?/i.test(whereClause)) {
        rows = rows.filter(r => r.project_id === params[0]);
      } else if (/email\s*=\s*\?/i.test(whereClause)) {
        rows = rows.filter(r => r.email === params[0]);
      } else if (/id\s*=\s*\?/i.test(whereClause)) {
        rows = rows.filter(r => r.id === params[0]);
      } else if (/username\s*=\s*\?/i.test(whereClause)) {
        rows = rows.filter(r => r.username === params[0]);
      }
    }

    // ORDER BY
    if (/ORDER BY\s+created_at\s+DESC/i.test(trimmed)) {
      rows.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (/ORDER BY\s+timestamp\s+DESC/i.test(trimmed)) {
      rows.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
    } else if (/ORDER BY\s+frame_number\s+ASC/i.test(trimmed)) {
      rows.sort((a, b) => Number(a.frame_number) - Number(b.frame_number));
    }

    // LIMIT
    const limitMatch = trimmed.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limitVal = parseInt(limitMatch[1], 10);
      rows = rows.slice(0, limitVal);
    }

    return [rows, []];
  }

  // 2. INSERT
  if (/^INSERT INTO/i.test(trimmed)) {
    const tableMatch = trimmed.match(/INSERT INTO\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)/i);
    if (!tableMatch) return [[], []];
    const table = tableMatch[1].toLowerCase();
    const cols = tableMatch[2].split(',').map(c => c.trim().toLowerCase());

    const record = {};
    cols.forEach((col, idx) => {
      record[col] = params[idx] !== undefined ? params[idx] : null;
    });

    // Default timestamps if missing
    if (cols.includes('created_at') && !record.created_at) {
      record.created_at = new Date().toISOString();
    } else if (!cols.includes('created_at') && ['users', 'projects'].includes(table)) {
      record.created_at = new Date().toISOString();
    }

    if (cols.includes('timestamp') && !record.timestamp) {
      record.timestamp = new Date().toISOString();
    } else if (!cols.includes('timestamp') && table === 'activity_logs') {
      record.timestamp = new Date().toISOString();
    }

    if (!store[table]) store[table] = [];
    store[table].push(record);
    writeLocalStore(store);
    return [[record], []];
  }

  // 3. UPDATE
  if (/^UPDATE/i.test(trimmed)) {
    const tableMatch = trimmed.match(/UPDATE\s+([a-zA-Z0-9_]+)\s+SET\s+(.+?)\s+WHERE\s+(.+)$/i);
    if (!tableMatch) return [[], []];
    const table = tableMatch[1].toLowerCase();
    const setClause = tableMatch[2];
    const whereClause = tableMatch[3];

    if (!store[table]) return [[], []];

    // Find record by id = ?
    let targetId = params[params.length - 1];
    const target = store[table].find(r => r.id === targetId);
    if (target) {
      const assignments = setClause.split(',').map(s => s.trim());
      assignments.forEach((assign, idx) => {
        const col = assign.split('=')[0].trim().toLowerCase();
        target[col] = params[idx];
      });
      writeLocalStore(store);
    }
    return [[target], []];
  }

  // 4. DELETE
  if (/^DELETE FROM/i.test(trimmed)) {
    const tableMatch = trimmed.match(/DELETE FROM\s+([a-zA-Z0-9_]+)\s+WHERE\s+(.+)$/i);
    if (!tableMatch) return [[], []];
    const table = tableMatch[1].toLowerCase();
    const whereClause = tableMatch[2];

    if (!store[table]) return [[], []];

    if (/id\s*=\s*\?\s*AND\s*user_id\s*=\s*\?/i.test(whereClause)) {
      const id = params[0];
      const userId = params[1];
      store[table] = store[table].filter(r => !(r.id === id && r.user_id === userId));

      // Cascade delete if projects
      if (table === 'projects') {
        if (store.metrics) store.metrics = store.metrics.filter(m => m.project_id !== id);
        if (store.payloads) store.payloads = store.payloads.filter(p => p.project_id !== id);
        if (store.frame_metrics) store.frame_metrics = store.frame_metrics.filter(f => f.project_id !== id);
      }
    } else if (/id\s*=\s*\?/i.test(whereClause)) {
      const id = params[0];
      store[table] = store[table].filter(r => r.id !== id);
      if (table === 'projects') {
        if (store.metrics) store.metrics = store.metrics.filter(m => m.project_id !== id);
        if (store.payloads) store.payloads = store.payloads.filter(p => p.project_id !== id);
        if (store.frame_metrics) store.frame_metrics = store.frame_metrics.filter(f => f.project_id !== id);
      }
    } else if (/user_id\s*=\s*\?/i.test(whereClause)) {
      const userId = params[0];
      store[table] = store[table].filter(r => r.user_id !== userId);
    }

    writeLocalStore(store);
    return [[], []];
  }

  return [[], []];
}

// Initialize tables on PostgreSQL if connected
async function initDb() {
  if (!pool) {
    isPgConnected = false;
    console.log('[Database] PostgreSQL URL not configured. Using resilient local store.');
    return;
  }

  try {
    const client = await pool.connect();
    isPgConnected = true;
    console.log('[Database] Connected to PostgreSQL successfully.');

    // Create tables if they do not exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        file_size VARCHAR(50) NOT NULL,
        resolution VARCHAR(50) NOT NULL,
        fps DECIMAL(5,2) NOT NULL,
        duration VARCHAR(50) NOT NULL,
        total_frames INT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'ready' CHECK (status IN ('embedded', 'extracted', 'processing', 'ready')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        thumbnail_color VARCHAR(50) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS metrics (
        id VARCHAR(36) PRIMARY KEY,
        project_id VARCHAR(36) NOT NULL UNIQUE,
        psnr DECIMAL(10,4) NOT NULL,
        ssim DECIMAL(5,4) NOT NULL,
        mse DECIMAL(10,4) NOT NULL,
        payload_capacity_bpp DECIMAL(10,4) NOT NULL,
        payload_size_bytes INT NOT NULL,
        integrity_valid BOOLEAN NOT NULL,
        sha256_original VARCHAR(64) NOT NULL,
        sha256_extracted VARCHAR(64) NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS payloads (
        id VARCHAR(36) PRIMARY KEY,
        project_id VARCHAR(36) NOT NULL UNIQUE,
        type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'file')),
        name VARCHAR(255) DEFAULT NULL,
        size_bytes INT NOT NULL,
        content TEXT NOT NULL,
        secret_key VARCHAR(255) NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS frame_metrics (
        id VARCHAR(36) PRIMARY KEY,
        project_id VARCHAR(36) NOT NULL,
        frame_number INT NOT NULL,
        timestamp VARCHAR(20) NOT NULL,
        motion_delta DECIMAL(10,4) NOT NULL,
        is_dynamic_region BOOLEAN NOT NULL,
        psnr DECIMAL(10,4) NOT NULL,
        ssim DECIMAL(5,4) NOT NULL,
        mse DECIMAL(10,4) NOT NULL,
        embedded_bits INT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS activity_logs (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        type VARCHAR(50) NOT NULL CHECK (type IN ('embed', 'extract', 'verify', 'export')),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) NOT NULL CHECK (status IN ('completed', 'in_progress', 'failed')),
        badge_text VARCHAR(50) NOT NULL,
        metric_summary VARCHAR(255) DEFAULT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    client.release();
    console.log('[Database] Tables initialized successfully in PostgreSQL.');
  } catch (err) {
    isPgConnected = false;
    connectionError = err.message;
    console.warn(`[Database] PostgreSQL connection failed (${err.message}). Using resilient local store.`);
  }
}

module.exports = {
  initDb,
  query: async (text, params = []) => {
    if (isPgConnected && pool) {
      try {
        let i = 1;
        const pgText = text.replace(/\?/g, () => `$${i++}`);
        const res = await pool.query(pgText, params);
        return [res.rows, res.fields];
      } catch (err) {
        // If Postgres fails at runtime, fallback to local store
        console.warn(`[Database] Query error on PostgreSQL (${err.message}), falling back to local store.`);
        return executeLocalQuery(text, params);
      }
    }
    return executeLocalQuery(text, params);
  },
  getStatus: () => {
    const store = readLocalStore();
    return {
      provider: isPgConnected ? 'postgresql' : 'local_store',
      isPgConnected,
      connectionError,
      tableCounts: {
        users: isPgConnected ? 'pg' : (store.users || []).length,
        projects: isPgConnected ? 'pg' : (store.projects || []).length,
        metrics: isPgConnected ? 'pg' : (store.metrics || []).length,
        payloads: isPgConnected ? 'pg' : (store.payloads || []).length,
        frame_metrics: isPgConnected ? 'pg' : (store.frame_metrics || []).length,
        activity_logs: isPgConnected ? 'pg' : (store.activity_logs || []).length
      }
    };
  },
  pool
};
