const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST /transaction - Create new transaction
router.post('/', async (req, res) => {
  try {
    const { account_id, branch_id, amount, action } = req.body;
    
    // Start transaction
    await db.beginTransaction();
    
    // Insert transaction record
    const [result] = await db.execute(
      'INSERT INTO transaction (account_id, branch_id, amount, action) VALUES (?, ?, ?, ?)',
      [account_id, branch_id, amount, action]
    );
    
    // Update account balance
    const amountChange = action === 'deposit' ? amount : -amount;
    await db.execute(
      'UPDATE accounts SET current_balance = current_balance + ? WHERE account_id = ?',
      [amountChange, account_id]
    );
    
    // Commit transaction
    await db.commit();
    
    res.status(201).json({ message: 'Transaction completed successfully', id: result.insertId });
  } catch (error) {
    // Rollback in case of error
    await db.rollback();
    res.status(500).json({ error: error.message });
  }
});

// GET /transaction/:customer_id - Get transactions by customer ID
router.get('/:customer_id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT t.* 
       FROM transaction t
       JOIN accounts a ON t.account_id = a.account_id
       WHERE a.customer_id = ?`,
      [req.params.customer_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;