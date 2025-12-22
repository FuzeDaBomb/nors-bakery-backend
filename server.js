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
    
    // 1. Convert price to a float (decimal number)
    const numericPrice = parseFloat(price);

    // 2. Check if it's a valid number
    if (isNaN(numericPrice)) {
        return res.status(400).json({ success: false, message: "Invalid price format" });
    }

    try {
        const result = await pool.query(
            "UPDATE products SET price = $1 WHERE name = $2 RETURNING *",
            [numericPrice, name] // Use the converted number here
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Item not found!" });
        }

        res.json({ success: true, message: `Successfully updated ${name} to RM${numericPrice}` });
    } catch (err) {
        console.error("Database Error:", err.message); // This will show specifically what failed in Render Logs
        res.status(500).json({ success: false, message: "Server error: " + err.message });
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