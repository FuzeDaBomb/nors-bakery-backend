const express = require("express");
const cors = require("cors");
const pool = require("./db"); 
require("dotenv").config();

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json()); 

// 2. Login Route
app.post('/login', (req, res) => {
    console.log("Login attempt received!"); 
    const { username, password } = req.body;
    if (username === "admin" && password === "bakery2025") {
        return res.json({ success: true });
    }
    return res.status(401).json({ success: false });
});

// 3. Update Price Route (For ANY cake)
app.put('/update-price', async (req, res) => {
    const { name, price } = req.body;
    try {
        // Change this to 'norsbakery' to match your primary table
        const result = await pool.query(
            "UPDATE norsbakery SET price = $1 WHERE name = $2 RETURNING *",
            [parseFloat(price), name]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Cake name not found!" });
        }
        res.json({ success: true, message: `Successfully updated ${name}!` });
    } catch (err) {
        res.status(500).json({ success: false, message: "Database Error: " + err.message });
    }
});

// 4. External Routes
app.use("/auth", require("./routes/auth"));
app.use("/transactions", require("./routes/transactions"));

// 5. START SERVER (Always at the very bottom)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});