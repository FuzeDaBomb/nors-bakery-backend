const express = require("express");
const router = express.Router();
const pool = require("../db");

// Test Route: Get all transactions
router.get("/", async (req, res) => {
  try {
    const allTransactions = await pool.query("SELECT * FROM transactions");
    res.json(allTransactions.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;