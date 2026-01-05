const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,      // Should be kvgongvthegnvavswzvm.supabase.co
  user: process.env.DB_USER,      // Should be postgres.kvgongvthegnvavswzvm
  password: process.env.DB_PASS,  // Your password
  database: process.env.DB_NAME,  // Should be postgres
  port: process.env.DB_PORT,      // Should be 6543
  ssl: { rejectUnauthorized: false } // Required for Supabase connections
});

// This will give us a clear message in the terminal
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Database Connection Error:', err.message);
  }
  console.log('✅ BACKEND SUCCESSFULLY CONNECTED TO SUPABASE! YIPEE!!');
  release();
});

module.exports = pool;