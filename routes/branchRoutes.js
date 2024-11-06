const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST /branch - Create new branch
router.post('/', async (req, res) => {
  try {
    const { name, house_no, city, zip_code } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO branch (name, house_no, city, zip_code) VALUES (?, ?, ?, ?)',
      [name, house_no, city, zip_code]
    );
    
    res.status(201).json({ message: 'Branch created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /branch - Get all branches
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM branch');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /branch/:branch_id - Delete branch
router.delete('/:branch_id', async (req, res) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM branch WHERE branch_id = ?',
      [req.params.branch_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;