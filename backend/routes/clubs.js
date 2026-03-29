const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// ── Get All Clubs ─────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [clubs] = await pool.query('SELECT * FROM clubs ORDER BY id ASC');
    res.json(clubs);
  } catch (err) {
    console.error('Get clubs error:', err);
    res.status(500).json({ error: 'Failed to fetch clubs.' });
  }
});

module.exports = router;
