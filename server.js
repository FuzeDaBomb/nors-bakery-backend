const express = require("express");
const cors = require("cors");
const pool = require("./db"); 
require("dotenv").config();

const app = express();

// 1. Middleware (Must be at the top)
app.use(cors());
app.use(express.json());

// 2. Routes (Move Login here!)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "bakery2025") {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

app.use("/auth", require("./routes/auth"));
app.use("/transactions", require("./routes/transactions"));

// 3. Start Server (This MUST be the very last thing)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});