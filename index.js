const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* ---------------- ROOT ---------------- */
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

/* ---------------- TEST DB ---------------- */
app.get("/api/test", (req, res) => {
  db.query("SELECT 1 + 1 AS solution", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

/* ---------------- CREATE TABLE ---------------- */
app.get("/api/create-table", (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS feedback (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id VARCHAR(50),
      department VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      sentiment_score DECIMAL(5,2),
      risk_score INT,
      volatility_score DECIMAL(5,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(sql, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.send("Feedback table created successfully ✅");
  });
});

/* ---------------- START SERVER ---------------- */
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
