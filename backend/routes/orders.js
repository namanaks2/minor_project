const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const auth = require('../middleware/auth');

// All order routes require authentication
router.use(auth);

// ── Checkout (Create Order from Cart) ─────────
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Get cart items
    const [cartItems] = await connection.query(
      `SELECT ci.quantity, p.id AS product_id, p.price
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
      [req.user.id, totalAmount]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    const orderItemsValues = cartItems.map(item => [
      orderId, item.product_id, item.quantity, item.price
    ]);

    await connection.query(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?',
      [orderItemsValues]
    );

    // Clear cart
    await connection.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    await connection.commit();

    res.status(201).json({
      message: 'Order placed successfully!',
      order: {
        id: orderId,
        total_amount: totalAmount,
        status: 'pending',
        items_count: cartItems.length
      }
    });
  } catch (err) {
    await connection.rollback();
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to place order.' });
  } finally {
    connection.release();
  }
});

// ── Get Order History ─────────────────────────
router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.id, o.total_amount, o.status, o.created_at,
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'product_id', oi.product_id,
                  'name', p.name,
                  'quantity', oi.quantity,
                  'price', oi.price,
                  'image_url', p.image_url
                )
              ) AS items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

module.exports = router;
