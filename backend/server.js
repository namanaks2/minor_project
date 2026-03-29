const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve Static Frontend Files ────────────────
app.use(express.static(path.join(__dirname, '..')));

// ── API Routes ─────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/custom-orders', require('./routes/custom-orders'));
app.use('/api/bulk-enquiries', require('./routes/bulk-enquiries'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/clubs', require('./routes/clubs'));

// ── Health Check ───────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 Handler for API routes ─────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// ── Global Error Handler ───────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start Server ───────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🚀 Campus Merch Backend running at http://localhost:${PORT}`);
  console.log(`  📦 API available at http://localhost:${PORT}/api`);
  console.log(`  🌐 Frontend served at http://localhost:${PORT}\n`);
});
