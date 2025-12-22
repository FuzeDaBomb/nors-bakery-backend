const express = require("express");
const cors = require("cors");
const pool = require("./db"); 
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json()); // Essential for reading login data

// LOGIN MUST GO HERE (Before any other routes)
app.post('/login', (req, res) => {
    console.log("Login attempt received!"); // This will show in Render logs
    const { username, password } = req.body;
    if (username === "admin" && password === "bakery2025") {
        return res.json({ success: true });
    }
    return res.status(401).json({ success: false });
});

app.use("/auth", require("./routes/auth"));
app.use("/transactions", require("./routes/transactions"));

const PORT = process.env.PORT || 5000;
// Route to update muffin price
app.put('/update-muffin', async (req, res) => {
    const { price } = req.body;
    try {
        // This updates the 'price' column for the 'Chocolate Muffin'
        const result = await pool.query(
            "UPDATE products SET price = $1 WHERE name = 'Chocolate Muffin' RETURNING *",
            [price]
        );
        res.json({ success: true, message: `Price updated to $${price}!` });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "Database error" });
    }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.put('/update-muffin', async (req, res) => {
    const { price } = req.body;
    
    // This updates the 'price' column for 'Chocolate Muffin' in your Supabase table
    const { data, error } = await pool.query(
        "UPDATE products SET price = $1 WHERE name = 'Chocolate Muffin'",
        [price]
    );

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, message: "Muffin price updated to $" + price });
});