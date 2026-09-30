const { Pool } = require('pg');
require('dotenv').config();

// Supabase Connection String format: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Supabase requires SSL
  }
});

module.exports = {
  query: async (text, params) => {
    // Translate MySQL '?' placeholders to PostgreSQL '$1, $2'
    let i = 1;
    const pgText = text.replace(/\?/g, () => `$${i++}`);
    const res = await pool.query(pgText, params);
    return [res.rows, res.fields];
  },
  pool
};
