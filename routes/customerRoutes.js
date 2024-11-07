const express = require("express");
const router = express.Router();
const db = require("../config/database");
const bcrypt = require("bcryptjs");

// POST /customer - Create new customer
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, house_no, city, zipcode, username, password } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO customer (name, phone, email, house_no, city, zipcode, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, phone, email, house_no, city, zipcode, username, hashedPassword]
    );

    res
      .status(201)
      .json({ message: "Customer created successfully", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /customer - Get all customers
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM customer");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /customer/:username - Get customer by username
router.get("/:username", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM customer WHERE username = ?",
      [req.params.username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /customer/:username - Update customer
router.put("/:username", async (req, res) => {
  try {
    const { name, phone, email, house_no, city, zipcode } = req.body;
    const [result] = await db.execute(
      "UPDATE customer SET name = ?, phone = ?, email = ?, house_no = ?, city = ?, zipcode = ? WHERE username = ?",
      [name, phone, email, house_no, city, zipcode, req.params.username]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /customer/:customer_id - Delete customer
router.delete("/:customer_id", async (req, res) => {
  try {
    const [result] = await db.execute(
      "DELETE FROM customer WHERE customer_id = ?",
      [req.params.customer_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await db.execute(
      "SELECT * FROM customer WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.json({
      message: "Login successful",
      customer: {
        username: rows[0].username,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});
router.get("/activity/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Retrieve the customer's activity log
    const [activityLog] = await db.execute(
      `
        SELECT
          c.name,
          a.action,
          a.amount,
          a.transaction_date
        FROM
          customer c
          JOIN accounts ac ON c.customer_id = ac.customer_id
          JOIN transaction a ON ac.account_id = a.account_id
        WHERE
          c.username = ?
        ORDER BY
          a.transaction_date DESC
        `,
      [username]
    );

    res.json(activityLog);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

//////

router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, houseNo, city, zipcode, username, password } =
      req.body;

    // Check if the username already exists
    const [existingUser] = await db.execute(
      "SELECT * FROM customer WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Insert the new customer into the database
    await db.execute(
      "INSERT INTO customer (name, phone, email, house_no, city, zipcode, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, phone, email, houseNo, city, zipcode, username, password] // Note: In production, hash the password
    );

    res.status(201).json({ message: "Customer registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

router.get("/balance/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const [balanceSummary] = await db.execute(
      `
        SELECT
          c.name,
          SUM(a.current_balance) AS total_balance,
          COUNT(a.account_id) AS total_accounts,
          AVG(a.current_balance) AS average_balance
        FROM
          customer c
          JOIN accounts a ON c.customer_id = a.customer_id
        WHERE
          c.username = ?
        GROUP BY
          c.name
        `,
      [username] // Pass username as parameter in an array
    );

    if (balanceSummary.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(balanceSummary[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

router.get("/withdrawals/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const [withdrawalHistory] = await db.execute(
      `
        SELECT
          a.account_id,
          t.transaction_id,
          t.amount,
          t.transaction_date
        FROM
          customer c
          JOIN accounts a ON c.customer_id = a.customer_id
          JOIN transaction t ON a.account_id = t.account_id
        WHERE
          c.username = ?
          AND t.action = 'withdrawal'
        ORDER BY
          t.transaction_date DESC
        `,
      [username] // Pass username as parameter in an array
    );

    if (withdrawalHistory.length === 0) {
      return res.status(404).json({ message: "No withdrawals found" });
    }

    res.json(withdrawalHistory);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

router.get("/withdrawal-logs/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const [withdrawalLogs] = await db.execute(
      `
        SELECT
          tl.log_id,
          tl.transaction_id,
          tl.account_id,
          tl.action,
          tl.amount,
          tl.log_timestamp
        FROM
          customer c
          JOIN accounts a ON c.customer_id = a.customer_id
          JOIN transaction_log tl ON a.account_id = tl.account_id
        WHERE
          c.username = ?
        ORDER BY
          tl.log_timestamp DESC
        `,
      [username]
    );

    if (withdrawalLogs.length === 0) {
      return res.status(404).json({ message: "No withdrawal logs found" });
    }

    res.json(withdrawalLogs);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

module.exports = router;
