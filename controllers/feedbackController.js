const db = require("../db");

exports.analyzeFeedback = (req, res) => {
  const { employee_id, department, message } = req.body;

  if (!department || !message) {
    return res.status(400).json({
      success: false,
      error: "Department and message required"
    });
  }

  // Simple AI-like logic
  const sentiment_score = message.includes("stress") ? -0.6 : 0.6;
  const risk_score = Math.round((1 - sentiment_score) * 50);
  const volatility_score = Math.abs(sentiment_score) * 100;

  const sql = `
    INSERT INTO feedback
    (employee_id, department, message, sentiment_score, risk_score, volatility_score)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [employee_id || null, department, message, sentiment_score, risk_score, volatility_score],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
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
};//feedback
