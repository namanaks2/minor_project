const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campus_merch',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('  ✅ MySQL connected to database:', process.env.DB_NAME || 'campus_merch');
    conn.release();
  } catch (err) {
    console.error('  ❌ MySQL connection failed:', err.message);
    console.error('     Make sure MySQL is running and credentials in .env are correct.');
  }
})();

module.exports = pool;
