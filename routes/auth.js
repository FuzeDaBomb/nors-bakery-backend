const express = require("express");
const router = express.Router();
const pool = require("../db");

// Test Route: Get all users (Just to check if DB connection works)
router.get("/users", async (req, res) => {
  try {
    const newUser = await pool.query("SELECT * FROM users");
    res.json(newUser.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;