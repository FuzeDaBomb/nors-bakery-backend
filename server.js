const express = require("express");
const cors = require("cors");
const pool = require("./db"); 
require("dotenv").config();

const app = express();


app.use(cors());
app.use(express.json()); 

app.post('/login', (req, res) => {
    console.log("Login attempt received!"); 
    const { username, password } = req.body;
    if (username === "admin" && password === "bakery2025") {
        return res.json({ success: true });
    }
    return res.status(401).json({ success: false });
});


app.put('/update-price', async (req, res) => {
    const { name, price } = req.body;
    try {

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


app.use("/auth", require("./routes/auth"));
app.use("/transactions", require("./routes/transactions"));


const PORT = process.env.PORT || 5000;
app.get('/products', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM norsbakery ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/register-profile', async (req, res) => {
    const { id, email, full_name } = req.body;
    try {
        await pool.query(
            'INSERT INTO users (id, email, full_name) VALUES ($1, $2, $3)',
            [id, email, full_name]
        );
        res.status(201).json({ message: "Profile created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.post('/api/place-order', async (req, res) => {
    const { userId, items, total, paymentMethod } = req.body;
    try {
        // 1. Save the order to your transactions table
        const result = await pool.query(
            'INSERT INTO transactions (user_id, total_price, status, payment_method) VALUES ($1, $2, $3, $4) RETURNING id',
            [userId, total, 'Completed', paymentMethod]
        );
        
        // 2. Clear the user's cart in the database
        await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);

        res.json({ success: true, orderId: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: "Order failed" });
    }
});