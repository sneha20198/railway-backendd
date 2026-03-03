const db = require("../db");
const Sentiment = require("sentiment");

const sentimentAnalyzer = new Sentiment();

exports.analyzeFeedback = (req, res) => {
  const { employee_id, department, message } = req.body;

  if (!department || !message) {
    return res.status(400).json({
      success: false,
      error: "Department and message required"
    });
  }

  // 🔥 Real NLP Sentiment Analysis
  const result = sentimentAnalyzer.analyze(message);

  // result.score can be negative or positive
  const rawScore = result.score;

  // Normalize sentiment between -1 and 1
  const sentiment_score = Math.max(-1, Math.min(1, rawScore / 10));

  // Risk increases when sentiment decreases
  const risk_score = Math.round((1 - sentiment_score) * 50);

  // Volatility increases when sentiment magnitude increases
  const volatility_score = Math.round(Math.abs(sentiment_score) * 100);

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
        return res.status(500).json({
          success: false,
          error: err.message
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
};

     
