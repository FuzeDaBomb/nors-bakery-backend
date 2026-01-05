const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,    
  user: process.env.DB_USER,      
  password: process.env.DB_PASS,  
  database: process.env.DB_NAME,  
  port: process.env.DB_PORT,     
  ssl: { rejectUnauthorized: false } 
});


pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Database Connection Error:', err.message);
  }
  console.log('✅ BACKEND SUCCESSFULLY CONNECTED TO SUPABASE! YIPEE!!');
  release();
});

module.exports = pool;