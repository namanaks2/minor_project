const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const auth = require('../middleware/auth');

// All cart routes require authentication
router.use(auth);

// ── Get Cart Items ────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [items] = await pool.query(
      `SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.price, p.category, p.badge, p.image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?
       ORDER BY ci.created_at DESC`,
      [req.user.id]
    );
    res.json(items);
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ error: 'Failed to fetch cart.' });
  }
});

// ── Add Item to Cart ──────────────────────────
router.post('/', async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    const qty = quantity || 1;

    // Upsert: if item already in cart, increase quantity
    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
      [req.user.id, product_id, qty, qty]
    );

    res.status(201).json({ message: 'Item added to cart.' });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Failed to add item to cart.' });
  }
});

// ── Update Cart Item Quantity ─────────────────
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1.' });
    }

    const [result] = await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }

    res.json({ message: 'Cart updated.' });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ error: 'Failed to update cart.' });
  }
});

// ── Remove Item from Cart ─────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }

    res.json({ message: 'Item removed from cart.' });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ error: 'Failed to remove item from cart.' });
  }
});

module.exports = router;
