const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for cloud databases like Supabase
  }
});

pool.on('connect', () => {
  console.log('Connected to Supabase PostgreSQL database');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};