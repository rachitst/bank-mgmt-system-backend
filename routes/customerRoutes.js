const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');

// POST /customer - Create new customer
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, house_no, city, zipcode, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.execute(
      'INSERT INTO customer (name, phone, email, house_no, city, zipcode, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, phone, email, house_no, city, zipcode, username, hashedPassword]
    );
    
    res.status(201).json({ message: 'Customer created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /customer - Get all customers
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM customer');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /customer/:username - Get customer by username
router.get('/:username', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM customer WHERE username = ?',
      [req.params.username]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /customer/:username - Update customer
router.put('/:username', async (req, res) => {
  try {
    const { name, phone, email, house_no, city, zipcode } = req.body;
    const [result] = await db.execute(
      'UPDATE customer SET name = ?, phone = ?, email = ?, house_no = ?, city = ?, zipcode = ? WHERE username = ?',
      [name, phone, email, house_no, city, zipcode, req.params.username]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /customer/:customer_id - Delete customer
router.delete('/:customer_id', async (req, res) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM customer WHERE customer_id = ?',
      [req.params.customer_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
