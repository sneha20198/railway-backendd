
  const db = require("../db");
const Sentiment = require("sentiment");

const sentimentAnalyzer = new Sentiment();

exports.analyzeFeedback = async (req, res) => {
  try {
    const { employee_id, department, message } = req.body;

    if (!department || !message) {
      return res.status(400).json({
        success: false,
        error: "Department and message required"
      });
    }

    // 🔥 Real NLP Sentiment Analysis
    const result = sentimentAnalyzer.analyze(message);
    const rawScore = result.score;

    // Normalize sentiment between -1 and 1
    const sentiment_score = Math.max(-1, Math.min(1, rawScore / 10));

    // Risk increases when sentiment decreases
    const risk_score = Math.round((1 - sentiment_score) * 50);

    // Volatility increases with intensity
    const volatility_score = Math.round(Math.abs(sentiment_score) * 100);

    // 🚨 Critical detection
    const is_critical = sentiment_score < -0.5 || risk_score > 70;

    // ✅ PostgreSQL query (IMPORTANT CHANGE)
    const query = `
      INSERT INTO feedback
      (employee_id, department, message, sentiment_score, risk_score, volatility_score, is_critical)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      employee_id || null,
      department,
      message,
      sentiment_score,
      risk_score,
      volatility_score,
      is_critical
    ];

    const resultDB = await db.query(query, values);

    res.json({
      success: true,
      data: resultDB.rows[0]
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
