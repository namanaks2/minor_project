const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const auth = require('../middleware/auth');

// ── Submit Custom Order ───────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { merch_type, customer_name, department, batch_year, merch_color, text_color, quantity } = req.body;

    if (!merch_type || !customer_name || !department || !batch_year) {
      return res.status(400).json({ error: 'Merch type, name, department, and batch year are required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO custom_orders (user_id, merch_type, customer_name, department, batch_year, merch_color, text_color, quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        merch_type,
        customer_name,
        department,
        batch_year,
        merch_color || '#1a2a5e',
        text_color || '#ffffff',
        quantity || 1
      ]
    );

    res.status(201).json({
      message: 'Custom order submitted successfully!',
      order_id: result.insertId
    });
  } catch (err) {
    console.error('Custom order error:', err);
    res.status(500).json({ error: 'Failed to submit custom order.' });
  }
});

module.exports = router;
