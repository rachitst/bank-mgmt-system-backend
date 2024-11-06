const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');

// POST /employee - Create new employee
router.post('/', async (req, res) => {
  try {
    const { username, user_password } = req.body;
    const hashedPassword = await bcrypt.hash(user_password, 10);
    
    const [result] = await db.execute(
      'INSERT INTO EMP_LOGIN (username, user_password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    
    res.status(201).json({ message: 'Employee created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /employee - Get all employees
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT username FROM EMP_LOGIN');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /employee/:username - Delete employee
router.delete('/:username', async (req, res) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM EMP_LOGIN WHERE username = ?',
      [req.params.username]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
