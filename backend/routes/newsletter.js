const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// ── Subscribe to Newsletter ───────────────────
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    // Check if already subscribed
    const [existing] = await pool.query(
      'SELECT id FROM newsletter_subscribers WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'This email is already subscribed.' });
    }

    await pool.query('INSERT INTO newsletter_subscribers (email) VALUES (?)', [email]);

    res.status(201).json({ message: "You're subscribed! Welcome to the campus crew." });
  } catch (err) {
    console.error('Newsletter error:', err);
    res.status(500).json({ error: 'Failed to subscribe.' });
  }
});

module.exports = router;
