const express = require("express");
const cors = require("cors");
const pool = require("./db"); 
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/transactions", require("./routes/transactions"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Replace these with your desired admin credentials
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "bakery2025"; 

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        res.json({ success: true, message: "Login successful!" });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});