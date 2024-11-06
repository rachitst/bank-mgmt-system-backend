const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST /accounts - Create new account
router.post('/', async (req, res) => {
  try {
    const { customer_id, current_balance } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO accounts (customer_id, current_balance) VALUES (?, ?)',
      [customer_id, current_balance]
    );
    
    res.status(201).json({ message: 'Account created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /accounts - Get all accounts
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM accounts');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /accounts/:customer_id - Get accounts by customer ID
router.get('/:customer_id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM accounts WHERE customer_id = ?',
      [req.params.customer_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /accounts/:account_id - Delete account
router.delete('/:account_id', async (req, res) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM accounts WHERE account_id = ?',
      [req.params.account_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;