const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* =========================================
   ROOT CHECK
========================================= */
app.get("/", (req, res) => {
  res.send("Enterprise Risk Intelligence Backend Running 🚀");
});

/* =========================================
   DATABASE TEST
========================================= */
app.get("/api/test", (req, res) => {
  db.query("SELECT 1 + 1 AS solution", (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      result: results
    });
  });
});

/* =========================================
   CREATE FEEDBACK TABLE
========================================= */
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
      return res.status(500).json({ success: false, error: err.message });
    }

    res.json({
      success: true,
      message: "Feedback table ready ✅"
    });
  });
});

/* =========================================
   FEEDBACK ANALYSIS ENGINE
========================================= */
app.post("/api/feedback", (req, res) => {
  const { employee_id, department, message } = req.body;

  if (!department || !message) {
    return res.status(400).json({
      success: false,
      error: "Department and message are required"
    });
  }

  const text = message.toLowerCase();

  const positiveWords = [
    "good", "great", "happy", "excellent",
    "satisfied", "improved", "smooth"
  ];

  const negativeWords = [
    "bad", "poor", "angry", "frustrated",
    "stress", "delay", "issue", "problem",
    "overload", "burnout"
  ];

  let score = 0;

  positiveWords.forEach(word => {
    if (text.includes(word)) score += 1;
  });

  negativeWords.forEach(word => {
    if (text.includes(word)) score -= 1;
  });

  let sentiment_score = 0;
  if (score !== 0) {
    sentiment_score = score / 5;
  }

  sentiment_score = Math.max(-1, Math.min(1, sentiment_score));

  let risk_score = Math.round((1 - sentiment_score) * 50);
  let volatility_score = Math.abs(sentiment_score) * 100;

  const sql = `
    INSERT INTO feedback
    (employee_id, department, message, sentiment_score, risk_score, volatility_score)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      employee_id || null,
      department,
      message,
      sentiment_score,
      risk_score,
      volatility_score
    ],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          error: "Database insertion failed"
        });
      }

      res.json({
        success: true,
        analysis: {
          sentiment_score,
          risk_score,
          volatility_score
        }
      });
    }
  );
});

/* =========================================
   DASHBOARD OVERVIEW
========================================= */
app.get("/api/dashboard/overview", (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) AS total_feedback,
      ROUND(AVG(risk_score), 2) AS avg_risk,
      ROUND(AVG(sentiment_score), 2) AS avg_sentiment
    FROM feedback
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: results[0]
    });
  });
});

/* =========================================
   DEPARTMENT RISK RANKING
========================================= */
app.get("/api/dashboard/department-risk", (req, res) => {
  const sql = `
    SELECT 
      department,
      COUNT(*) AS total_feedback,
      ROUND(AVG(risk_score), 2) AS avg_risk
    FROM feedback
    GROUP BY department
    ORDER BY avg_risk DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      departments: results
    });
  });
});

/* =========================================
   ESCALATION DETECTION ENGINE
========================================= */
app.get("/api/dashboard/escalations", (req, res) => {
  const sql = `
    SELECT 
      department,
      COUNT(*) AS total_entries,
      SUM(CASE WHEN risk_score >= 70 THEN 1 ELSE 0 END) AS high_risk_count,
      ROUND(AVG(risk_score), 2) AS avg_risk
    FROM feedback
    WHERE created_at >= NOW() - INTERVAL 2 DAY
    GROUP BY department
    HAVING avg_risk > 75 OR high_risk_count >= 3
    ORDER BY avg_risk DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      escalations: results
    });
  });
});

/* =========================================
   START SERVER
========================================= */
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
  

  
    
     
    
