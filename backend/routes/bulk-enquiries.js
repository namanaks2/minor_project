const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// ── Submit Bulk Enquiry ───────────────────────
router.post('/', async (req, res) => {
  try {
    const { club_name, contact_email, items_needed, quantity, occasion, additional_details } = req.body;

    if (!club_name || !contact_email || !items_needed) {
      return res.status(400).json({ error: 'Club name, contact email, and items needed are required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO bulk_enquiries (club_name, contact_email, items_needed, quantity, occasion, additional_details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [club_name, contact_email, items_needed, quantity || null, occasion || null, additional_details || null]
    );

    res.status(201).json({
      message: 'Bulk enquiry submitted successfully! We will get back to you soon.',
      enquiry_id: result.insertId
    });
  } catch (err) {
    console.error('Bulk enquiry error:', err);
    res.status(500).json({ error: 'Failed to submit bulk enquiry.' });
  }
});

module.exports = router;
